$(function(){
 $("#parameterTree").delegate("#addGroupBtn","click",addGroup);
 $("#parameterTree").delegate(".addItemIcon","click",addItem);	
 $("#parameterTree").delegate(".removeItemIcon","click",removeItem);
 $("#showGoodsModal").on("click",showGoodsModal);
 $("#submitCategoryBtn").on("click",addCategory);
 $("#submitParameterBtn").on("click",submitParameter);
 loadCategoryTree();
});


function submitParameter(){
	var resultObj=new Object();
	var ids=$("#ids").val();
	var contentArray=loadConent();
	if(!ids){
		$.err("请选择商品类目");
		return;
	}
	if(contentArray.length==0){
		$.err("请填写分组信息");
		return;
	}
	resultObj['categoryId']=$("#ids").val();
	resultObj['categoryName']=$("#cagogryContent").html();
	resultObj['paramData']=JSON.stringify(contentArray);
	console.log(resultObj);
	$.ajax({
		type : 'POST',
		url : "/parameter/add",
		data : resultObj,
		success : function(result) {
		  if(result=='ok'){
		    $.msg("保存成功");
		  }else{
			$.err(result);
		  }
		}
	});
	
}
function loadConent(){
	
	var contentArray= new Array();
	$(".rootNode .groupText").each(function(e){
		var target=$(this);
		var v=target.val();
		if(v){
			var node=new Object();
			var itemArray=new Array();
			node['group']=v;
			node['params']=itemArray;
			contentArray.push(node);
			target.siblings("ul").find(".itemText").each(function(e){
				var value=$(this).val();
				if($(this).val()){
					itemArray.push(value);
				}
				
			});
		}
	});
	
	return contentArray;
}
function addCategory(){
	var categoryArray = $('#categoryTree').jstree().get_checked(true);
	if(categoryArray.length==0){
		return;
	}else{
		var ids="";
		var labelEl="";
		var codes="";
		for(var i=0;i<categoryArray.length;i++){
			var obj=categoryArray[i];
			if(obj.id=='0'){
				continue;
			}
			var id=obj.data.id;
			var code=obj.id;
			if(ids==''){
				ids+=id;
			}else{
				ids+=","+id
			}
			if(labelEl==''){
				labelEl+=obj.text;
			}else{
				labelEl+="、"+obj.text;
			}
			if(codes==''){
				codes+=code;
			}else{
				codes+=","+code;
			}
		}
	  $("#cagogryContent").html(labelEl);
	  $("#ids").val(ids);
	  $("#codes").val(codes);
	  $("#department").modal("hide");
	}
	
}
function loadCategoryTree(){
	$.jstree.defaults.checkbox.three_state=false;
	$('#categoryTree').jstree({
							'core' : {
								'data' : treeData,
								'check_callback':true,
								'multiple': false
							},
							"plugins" : ["checkbox"]
	});
	
	
}
function showGoodsModal(){
	$('#categoryTree').jstree().uncheck_all ();
	var codes=$("#codes").val();
	var codeArray=codes.split(",");
	for(var i=0;i<codeArray.length;i++){
		$('#categoryTree').jstree(true).select_node(codeArray[i]);
	}
	$("#department").modal("show");
}
function addGroup(){
	var groupEL=$(".groupBak").html();
	$(".rootNode").append(groupEL);
	
}

function addItem(e){
	var itemEL=$(".itemBak").html();
	$(e.currentTarget).siblings("ul").append(itemEL);
}

function removeItem(e){
	var target=$(e.currentTarget).parent();
	console.log(target.html());
	target.remove();
	
}

