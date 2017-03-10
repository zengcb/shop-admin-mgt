$(function(){
 $("#parameterTree").delegate(".addGroupIcon","click",addGroup);
 $("#parameterTree").delegate(".addItemIcon","click",addItem);	
 $("#parameterTree").delegate(".removeItemIcon","click",removeItem);
 $("#updateParameterBtn").on("click",updateParameter);
});


function updateParameter(){
	var resultObj=new Object();
	var paramId=$("#paramId").val();
	var contentArray=loadConent();
	if(!paramId){
		$.err("请选择商品类目");
		return;
	}
	if(contentArray.length==0){
		$.err("请填写分组信息");
		return;
	}
	resultObj['id']=paramId;
	resultObj['paramData']=JSON.stringify(contentArray);
	$.ajax({
		type : 'POST',
		url : "/parameter/update",
		data : resultObj,
		success : function(result) {
		  if(result=='ok'){
		    $.msg("更新成功");
		    setTimeout(function(){window.location.href="/parameter/list"},1000);
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
			target.siblings("ul").find(".itemText").each(function(e){
				var value=$(this).val();
				if($(this).val()){
					itemArray.push(value);
				}
				
			});
			if(itemArray.length>0){
				node['group']=v;
				node['params']=itemArray;
				contentArray.push(node);
			}
		}
	});
	
	return contentArray;
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
	target.remove();
	
}

