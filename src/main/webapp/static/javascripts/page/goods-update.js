    Array.prototype.indexOf = function(val) {  
        for (var i = 0; i < this.length; i++) {  
            if (this[i] == val) return i;  
        }  
        return -1;  
    };  

    Array.prototype.remove = function(val) {  
        var index = this.indexOf(val);  
        while(index>-1){  
            this.splice(index, 1);  
            index = this.indexOf(val);  
        }  
    }; 
   String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase) { 
	  if(!RegExp.prototype.isPrototypeOf(reallyDo)) { 
	   return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi": "g")), replaceWith); 
	 } else { 
	 return this.replace(reallyDo, replaceWith); 
	 }
   }

$(function(){
	$("#updateItemForm").delegate("input[type=file]","change",uploadItemPic);
	$("#updateItemForm").delegate(".imgArea","click",choosePic);
	$("#updateItemForm").delegate(".glyphicon-remove","click",removePic);
	$("#categoryId").on("change",changeCategoryName);
	$("#brandId").on("change",changeBrandName);
	$("#tagId").on("change",changeTagName);
	$("#supplierCompanyId").on("change",changeSupplierName);
	$(".updateItemBtn").on("click",updateGoods);
	$("#mpriceTemp").on("blur",calculatePrice);
	$("body").delegate(".skuCustomCode","blur",getRandomCode);
	$(".sizeArea").delegate(".checkMpriceTemp","blur",calculateCheckMPrice);
	$(".sizeArea").delegate(".checkNum","blur",checkInputNum);
	$(".sizeArea").delegate(".canDefault[type='radio']","click",changeCanDefault)
	//$(".canMutiParam").on("change",changeParam);
	$("#tagId").on("click",function(){
		$("#treeContent").toggle();
	})
	$("body").delegate(".sizeArea input[type=checkbox]","click",changeParamValue);
	initHtml();
	initFormValidation();
	
	
	$(".sizeArea").delegate(".deleteParamIcon","click",deleteMutiParam);
	loadTagTree();
});
function loadTagTree(){
	
	$.jstree.defaults.checkbox.three_state=true;
	$.jstree.defaults.checkbox.tie_selection=false;
	var data = JSON.parse(tags);
	console.log(data)
	$('#categoryTree').jstree({
		'core' : {
			'data' : data,
			'check_callback':true,
			'multiple': true
		},
		"plugins" : ["checkbox","changed"]
	});
	$("#categoryTree").on("check_node.jstree", function (e, data) {
		changeTagContent();
		});
	$("#categoryTree").on("uncheck_node.jstree", function (e, data) {
		changeTagContent();
		});
	$("#categoryTree").on("ready.jstree",function(){
		for(var i=0;i<data.length;i++){
			var obj = data[i];
			if(obj.state.selected==true){
				$('#categoryTree').jstree(true).check_node(obj.id);
			}
		}
	})
	
	
}
function changeTagContent(){
	var categoryArray = $('#categoryTree').jstree().get_checked(true);
	var labelEl="";
	for(var i=0;i<categoryArray.length;i++){
		var obj=categoryArray[i];
		if(obj.children.length>0||obj.id.length==5){
			continue;
		}
		if(labelEl==''){
			labelEl+=obj.text;
		}else{
			labelEl+="、"+obj.text;
		}
	}
	$("#tagId").val(labelEl);
	
}
function deleteMutiParam(e){
	var target = $(e.currentTarget).parents("tr");
	var paramId= target.find(".paramId").val();
	if(!paramId){
		return;
	}
	var jsonData={
	 paramId:paramId		
	};
	$.ajax({
		type : 'POST',
		url : "/goods/deleteMutiParam",
		data : jsonData,
		success : function(result) {
		  if(result=="ok"){
			  $.msg("删除成功");
			  setTimeout(function(){window.location.reload();},1000);
		  }else{
			 $.err(result); 
		  }
		 
		}
	});
}
function changeCanDefault(){
	$(".sizeArea .canDefault").each(function(){
		$(this).parents("tr").find(".canDefaultValue").val("0");
		$(this).prop("checked",false);
	});
	$(this).parents("tr").find(".canDefaultValue").val("1");
	$(this).prop("checked",true);
}
function checkInputNum(e){
	var target = $(e.currentTarget);
	var v = $(this).val();
	var regexp=new RegExp(/^[1-9]*[1-9][0-9]*$/);
	if(!v){return;}
	if(!regexp.test(v)){
		$.err("库存格式错误");
		target.parent().addClass("has-error");
		return;	
	}else{
		target.parent().removeClass("has-error");
	}
}
function calculatePostFee(){
	
	var mprice = $("#mpriceTemp").val();
	var deliveryWay=$("input[name='deliveryWay']:checked").val();
	var logisticsId = $("#logisticsId option:selected").val();
	if(!logisticsId){
		$.err("请选择运费模板");
		return;
	}
	if($(".canMutiParam:checked").val()==1){//多规格
		if($(".sizeArea .canDefault:checked").length==0){
			$.err("请选择默认规格");
			return;
		}
		var trTarget = $(".sizeArea .canDefault:checked").parents("tr");
		mprice=trTarget.find(".checkMpriceTemp").val();
		
	}
	if(!mprice){
		$.err("德国价不能为空");
		return;
	}
	var jsonData={
			mprice:mprice,
			deliveryWay:deliveryWay,
			logisticsId:logisticsId
		};
		$.ajax({
			type : 'POST',
			url : "/goods/calculatePostFee",
			data : jsonData,
			success : function(result) {
				$("#logisticsPrice").val(parseInt(Number(result)*100));
				$("#logisticsPriceTemp").val(result);
				$('#updateItemForm').data('bootstrapValidator').updateStatus("logisticsPrice","VALID",null);
			}
		});
		
}


function checkInputValue(){
	  var isActive=true;
	  $('#updateItemForm').data('bootstrapValidator').validate();
	  isActive=$("#updateItemForm").data('bootstrapValidator').isValid();
	  var imgNum=$(".displayArea .imgArea").length;
	  if(imgNum==0){
		  $(".noPicError").show();
		  $(".noPicError").parents(".form-group").addClass("has-error");
		  isActive=false;
	  }else{
		  $(".noPicError").hide();
		  $(".noPicError").parents(".form-group").removeClass("has-error");
		 var activeNum=$(".displayArea .imgArea.selected").length;
		 if(activeNum==0){
			  $(".noDefaultPicError").show();
			  $(".noDefaultPicError").parents(".form-group").addClass("has-error");
			 isActive=false;
		 }else{
			  $(".noDefaultPicError").hide();
			  $(".noDefaultPicError").parents(".form-group").removeClass("has-error");
		 }
		  
	  }
	  if($(".canMutiParam:checked").val()==1){
		  var checkNum = $(".radio-inline .canDefault:checked").length;
		  
			 
	    if(checkNum>0){
		  $(".radio-inline .canDefault:checked").parents("tr").find("input[type=text]").each(function(){
			 var v = $(this).val();
			 if(v==""){
				 isActive=false;
				 $(this).parents("td").addClass("has-error");
			 }else{
				 $(this).parents("td").removeClass("has-error");
			 }
			  
		  });
	   }else{
		  $.err("请选择默认规格");
		  isActive=false;
	   }
	 }	
	  return isActive;
} 
function initHtml(){
	if(selectedParam){
     var selectedParamJson=JSON.parse(selectedParam);
	for(var key in selectedParamJson){
		var values=selectedParamJson[key];
	    for(var i=0;i<values.length;i++){
		 $("input[data='"+key+values[i]+"']").attr("checked",true);
	    }
	}
	changeParamValue();
   }
	
	
	 $("input[name='deliveryWay']").on("change",function(){
		 var v=$(this).val();
		 if(v==1){
			 calculatePrice()
			 $(".row.bscRow").removeClass("hidden");
		 }else{
			 $("#logisticsPrice").val(0);
			 $(".row.bscRow").addClass("hidden");
		 }
	 }) ;
	 
	   $('.tagId').SumoSelect({
		   csvDispCount: 5,
	       captionFormat: '已经选择{0}个标签',
	       isSingle:true
		 });
		   $('#gitemDesc').summernote({
	        height: 200,
			lang:'de-DE',
		    toolbar: [
	            ['style', ['style']],
	            ['font', ['bold', 'underline', 'clear']],
	            ['fontname', ['fontname']],
	            ['color', ['color']],
	            ['para', ['ul', 'ol', 'paragraph']],
	            ['table', ['table']],
	            ['view', ['fullscreen', 'codeview', 'help']]
	         ],
			  callbacks: {
				  onChange: function(contents, $editable) {
			 $("#gitemDesc").html(contents);
	         }
			}
	      });
		  $("#citemDesc").summernote({
	        height: 200,
			lang:'zh-CN',
			 toolbar: [
	        ['style', ['style']],
	        ['font', ['bold', 'underline', 'clear']],
	        ['fontname', ['fontname']],
	        ['color', ['color']],
	        ['para', ['ul', 'ol', 'paragraph']],
	        ['table', ['table']],
	        ['view', ['fullscreen', 'codeview', 'help']]
	      ],
		   callbacks: {
			   onChange: function(contents, $editable) {
			  $("#citemDesc").html(contents);
	         }
		   }	 
	      });
	
}


function updateGoods(){
	var isActive=checkInputValue();
	if(!isActive) return;
	
	if($(".canMutiParam:checked").val()==1){//多规格
		var trTarget = $(".sizeArea .canDefault:checked").parents("tr");
		if(trTarget.length>0){
		$(".singleParam #mprice").val(trTarget.find(".checkMprice").val());
		$(".singleParam #buyPrice").val(trTarget.find(".checkBuyPrice").val());
		$(".singleParam #num").val(trTarget.find(".checkNum").val());
		$("#logisticsPrice").val(trTarget.find(".checkBuyPrice").attr("logisticsPrice"));
		$("#logisticsPriceTemp").val(trTarget.find(".checkBuyPrice").attr("logisticsPriceTemp"));
		$(".singleParam .skuCode").val(trTarget.find(".skuCode").val());
		$(".singleParam .skuCustomCode").val(trTarget.find(".skuCustomCode").val());
		$(".singleParam .skuRandomCode").html(trTarget.find(".skuRandomCode").html());	
	  }
	}
	
	changePicIndex();
	var jsonData=$("#updateItemForm").serialize();
	var paramData=loadGoodsParameter();
	if(!$.isEmptyObject(globalParam)){
		jsonData+="&paramData="+JSON.stringify(globalParam);
	}else{
		jsonData+="&paramData=";
	}
	var selectedArray = selectTagIds.split(",");
	var categoryArray = $('#categoryTree').jstree().get_checked(true);
	if(categoryArray.length==0){
		$.err("请选择商品标签");
		return;
	}else{
		var index=0;
		for(var i=0;i<categoryArray.length;i++){
			var obj=categoryArray[i];
			if(obj.children.length>0||obj.id.length==5){
				continue;
			}
			var id=obj.data.id;
			var text=obj.text;
			var key=obj.data.key;
			var type=obj.data.type;
			var parentCode=obj.parent;
			jsonData+="&itemTagList["+index+"].tagId="+id+"&itemTagList["+index+"].tagName="+text
			+"&itemTagList["+index+"].parentCode="+parentCode+"&itemTagList["+index+"].type="+type;;
			if(key){
				jsonData+="&itemTagList["+index+"].id="+key;
				selectedArray.remove(key);
			}
			index++;
		}
	 }
	
	if(selectedArray.length>0){//删除的标签分类
		jsonData+="&removeTagIds="+selectedArray.toString()
	}
	console.log(jsonData);
	
	$.ajax({
		type : 'POST',
		url : "/goods/update",
		data : jsonData,
		success : function(result) {
			if(result.status=="ok"){
				$.msg("保存成功");
				//window.location.reload();
				setTimeout(function(){window.location.href="/goods/list";},1000);
			}else{
			   $.err(result.status);
			}
		}
	});
	
}


function changeBrandName(e){
	var text=$("#brandId").find("option:selected").text();
	$("#brandName").val(text);
}
function changeTagName(e){
	var text=$("#tagId").find("option:selected").text();
	$("#tagName").val(text);
}
function changeCategoryName(e){
	var target = $(e.currentTarget);
	var v = target.val();
	var text=$("#categoryId").find("option:selected").text();
	var code=$("#categoryId").find("option:selected").attr("data");
	if(v==""){
		$(".sizeArea").html("");
	}else{
		$("#categoryName").val(text);
		$("#categoryCode").val(code);
		var jsonData={
			categoryId:v	
		};
		$.ajax({
			type : 'POST',
			url : "/parameter/select",
			data : jsonData,
			success : function(result) {
			  $(".sizeArea").html(result);
			}
		});
	}
	var categoryCode = $("#categoryId").find("option:selected").attr("parentCode");
	reloadBrand(categoryCode);
	reloadTag(categoryCode);
}
function reloadTag(categoryCode){
	var jsonData={
			categoryCode:categoryCode	
		};
		$.ajax({
			type : 'POST',
			url : "/tags/loadTagByCategory",
			data : jsonData,
			success : function(result) {
				console.log(result);
				$(".tagId").html(result);
				var obj= $('.tagId')[0].sumo;
				if(obj){
					obj.reload();
				}else{
					$('.tagId').SumoSelect({
						   csvDispCount: 5,
					       captionFormat: '已经选择{0}个标签',
					       isSingle:true
						 });
				}
				 
			}
		});
}
function reloadBrand(categoryName){
	var jsonData={
			categoryName:categoryName	
		};
		$.ajax({
			type : 'POST',
			url : "/brands/loadBrandByCategory",
			data : jsonData,
			success : function(result) {
				$("#brandId").html(result);
			}
		});
}

function removePic(e){
	e.stopPropagation();
	var target = $(e.currentTarget).parents(".imgArea");
	if(target.find(".imageId").length>0){
		var imageId=target.find(".imageId").val();
		var jsonData={
			imageId:imageId	
		};
		$.ajax({
			type : 'POST',
			url : "/image/delete",
			data : jsonData,
			success : function(result) {
				if(result.status=="ok"){
					$.msg("删除成功");
					target.remove();
				}else{
				   $.err(result.status);
				}
			}
		});
	}else{
		target.remove();
		
	}

	
	
}
function changeSupplierName(e){
	var text=$("#supplierCompanyId").find("option:selected").text();
	$("#supplierCompanyName").val(text);
}
function choosePic(e){
	var target = $(e.currentTarget);
	$(".imgArea").each(function(){
		$(this).removeClass("selected");
		$(this).find(".canDefault").val(0);
	});
	target.addClass("selected");
	target.find(".canDefault").val(1);
	$(".noPicError").hide();
	$(".noDefaultPicError").hide();
}
function  uploadItemPic(e){
	var targetFile = $(e.currentTarget);
	  $.ajaxFileUpload({  
	        url:'/goods/pic/upload',  
	        secureuri:false,  
	        fileElementId:"originalUpload",//file标签的id  
	        dataType: 'json',//返回数据的类型  
	        data:null,//一同上传的数据  
	        success: function (result) {
	        	console.log(result);
	        	if(result.status=="ok"){
	        		var fileId=result.fileId;
	        		var fileName=result.fileName;
	        		var target = $("#imgBak .imgArea").clone();
	        		target.find(".name").val(fileName);
	        		target.find(".imagePath").val(fileId);
	        		target.find("img").attr("src",imgUrl+"/"+fileId);
	        		$(".displayArea").append(target);
	        		$(".noPicError").hide();
	        		$(".noDefaultPicError").hide();
	        	}else{
	        		$.err("图片上传失败");
	        	}
	        	targetFile.val("");
	          }
	  });
	  
  }

function changePicIndex(){
	  $(".displayArea .imgArea").each(function(i){
			var target =$(this);
			target.find("input[type='hidden']").each(function(e){
				var hiddenName=$(this).attr("name").replaceAll(/[+\d+]/,i);
				$(this).attr("name",hiddenName)
			});
		});
}

function loadGoodsParameter(){
	var resultObj=new Object();
	$(".radioArea input[type='radio']:checked").each(function(e){
		var value =$(this).val();
		var name=$(this).attr("group");
		resultObj[name]=value;
	});
	return resultObj;
}

function initFormValidation(){
	
	$('#updateItemForm').bootstrapValidator({
        message: '字段不能为空',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: null,
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
        	categoryId: {
                validators: {
                    notEmpty: {
                    message: '商品分类不能为空'
                     }
                 }
                },
                tagIds: {
                validators: {
                    notEmpty: {
                        message: '商品标签不能为空'
                    }
                }
            },
            supplierCompanyId: {
		          validators: {
		              notEmpty: {
		                  message: '供应商不能为空'
		              }
		          }
		       },
            brandId: {
                validators: {
                    notEmpty: {
                        message: '商品品牌不能为空'
                    }
                }
            },
            name: {
                validators: {
                    notEmpty: {
                        message: '商品名称不能为空'
                    },
                    stringLength: {
                        min: 1,
                        max: 255,
                        message:'商品名称不能超过255个字符'
                    },
				 }
                },
             hsCode: {
                validators: {
                    notEmpty: {
                        message: 'HS码不能为空'
                    }
                }
          },
          mpriceTemp: {
	              validators: {
	                  notEmpty: {
	                      message: '德国价不能为空'
	                  },
	                  regexp : {
							regexp : "^\\d+(\\.\\d+)?$",
							message : '德国价格式错误'
						},
	              }
             },
         	num: {
 			   trigger: 'blur',
 				validators:{
 				 callback:{
     				 callback:function(value,validator){
 					   var flag=true;
     				   var v=$.trim(value);
     				   if(v==''){
     				     return {valid: false, message: '库存不能为空'};
     				   }
 					   if(v==0||v=="0"){
 						  return {valid: false, message: '库存不能为0'};
 					   }
 					   var regexp=/^[1-9]*[1-9][0-9]*$/;
 					   if(!regexp.test(v)){
 						  return {valid: false, message: '库存格式不对'};
 					   }
 					   return flag;
     				 } 
 				 }
 				}
             },
             num1: {
            	message : "库存类型",
	            validators: {
	                notEmpty: {
	                    message: '库存不能为空'
	                },
	                regexp : {
						regexp : "^(([1-9]{1}\\d*)|([1-9]{1}))?$",
						message : '库存格式错误'
					},
	            }
	       },
	       "skuCode": {
		          validators: {
		              notEmpty: {
		                  message: 'SKU码不能为空'
		              }
		          }
		       },
	       "itemDesc.gitemDesc": {
	          validators: {
	              notEmpty: {
	                  message: '德文介绍不能为空'
	              }
	          }
	       },
	       "itemDesc.citemDesc": {
		          validators: {
		              notEmpty: {
		                  message: '中文介绍不能为空'
		              }
		          }
		       },
	       "area": {
		          validators: {
		              notEmpty: {
		                  message: '商品产地不能为空'
		              }
		          }
		       },
		  "logisticsPriceTemp": {
	          validators: {
	              notEmpty: {
	                  message: '物流费不能为空'
	              },
	              regexp : {
						regexp : "^\\d+(\\.\\d+)?$",
						message : '物流费格式错误'
					}
	          }
	       },
	       importRate: {
  			   trigger: 'blur',
  				validators:{
  				 callback:{
      				 callback:function(value,validator){
      				   var v=$.trim(value);
      				   if(v==''){
      				     return {valid: false, message: '进口税率不能为空'};
      				   }
  					 if(Number(v)>100){
  						  return {valid: false, message: '进口税率不能为超过100%'};
  					   }
  					   var regexp=new RegExp("^\\d+(\\.\\d+)?$");
  					   if(!regexp.test(v)){
  						  return {valid: false, message: '进口税率格式不对'};
  					   }
  					   calculatePrice();
  					   return true;
      				 } 
  				 }
  				}
              },
		       "consumptionRate": {
		    	   trigger: 'blur',
	 				validators:{
	 				 callback:{
	     				 callback:function(value,validator){
	     				   var v=$.trim(value);
	     				   if(v==''){
	     				     return {valid: false, message: '消费税率不能为空'};
	     				   }
	 					 if(Number(v)>100){
	 						  return {valid: false, message: '消费税率不能为超过100%'};
	 					   }
	 					   var regexp=new RegExp("^\\d+(\\.\\d+)?$");
	 					   if(!regexp.test(v)){
	 						  return {valid: false, message: '消费税率格式不对'};
	 					   }
	 					  calculatePrice();
	 					   return true;
	     				 } 
	 				 }
	 				}
			       },
		       "vatRate": {
		    	   trigger: 'blur',
					validators:{
					 callback:{
	    				 callback:function(value,validator){
	    				   var v=$.trim(value);
	    				   if(v==''){
	    				     return {valid: false, message: '增值税率不能为空'};
	    				   }
						 if(Number(v)>100){
							  return {valid: false, message: '增值税率不能为超过100%'};
						   }
						   var regexp=new RegExp("^\\d+(\\.\\d+)?$");
						   if(!regexp.test(v)){
							  return {valid: false, message: '增值税率格式不对'};
						   }
						   calculatePrice();
						   return true;
	    				 } 
					 }
					}
			       },
		    "buyPriceTemp": {
			          validators: {
			              notEmpty: {
			                  message: '商品购买价不能为空'
			              },
			              regexp : {
								regexp : "^\\d+(\\.\\d+)?$",
								message : '购买价格式错误'
							},
			          }
			       },
			       "grossWeight": {
				          validators: {
				              notEmpty: {
				                  message: '商品毛重不能为空'
				              },
				              regexp : {
									regexp : "^\\d+(\\.\\d+)?$",
									message : '商品毛重格式错误'
								},
				          }
				       },
			       "gVolume": {
				          validators: {
				              notEmpty: {
				                  message: '商品体积不能为空'
				              },
				              regexp : {
									regexp : "^\\d+(\\.\\d+)?$",
									message : '商品体积格式错误'
								},
				          }
				       },
	      
		}
    });
}
var globalParam=null;
function getParamResult(){
	var result = new Object();
	var data=[];
	result.data=data;
	var groupNum = $(".sizeArea .paramGroup").length;
	globalParam=new Object();
	$(".sizeArea .paramGroup").each(function(event){
		var groupValue =$(this).attr("data");
		var paramValue=[];
		$(this).find("input[type=checkbox]:checked").each(function(e){
			var v=$(this).val();
			paramValue.push(v);
		});
		if(paramValue.length>0){
			var groupObj=new Object();
			groupObj.name=groupValue;
			groupObj.value=paramValue;
			data.push(groupObj);
			globalParam[groupValue]=paramValue;
		}
		
	});
	if(data.length==groupNum){
		result.status=true;
	}else{
		result.status=false;
	}
	return result;
}
function changeParamValue(e){
	var result = getParamResult();
	console.log(result);
	var data=result.data;
	var status=result.status;
	var dataLength=data.length;
	if(status==true){
		if(dataLength==1){
			drawLevel1(data);
		}else if(dataLength==2){
			drawLevel2(data);
		}else if(dataLength==3){
			drawLevel3(data);
		}else if(dataLength==4){
			drawLevel4(data);
		}
		
	}else{
		$(".sizeArea table").html("");
	}
	
}
function drawLevel1(data){
	var firstGroup =data[0];
	var firstName=firstGroup.name;
	var firstData=firstGroup.value;
	var firstLength=firstData.length;
	var tableEL="<thead><tr><td class='group-title'>"+firstName+"</td><td class='group-title'>是否默认</td><td>德国价(€)</td><td>购买价(¥)</td><td>库存</td><td>SKU编码</td></tr>";
	for(var i=0;i<firstLength;i++){
		var trEL="<tr>";
		var paramObj = {
		};
		paramObj[firstName]=firstData[i];
		trEL+="<td>"+firstData[i]+"</td>";
		var existELDiv=$("#paramBak .rule[data='"+JSON.stringify(paramObj)+"']");
		if(existELDiv.length>0){
			var targetEL=existELDiv.html();
			var result=targetEL.replaceAll("[\[0\]]",i+"]");
			trEL+=result;
		}else{
			trEL+="<td><input type='hidden' class='form-control ruleName'  name='itemMutiParamList["+i+"].ruleName' value='"+JSON.stringify(paramObj)+"'>"+
				"<input type='hidden' name='itemMutiParamList["+i+"].canDefault'  value='0' class='canDefaultValue'><label class='radio-inline'><input type='radio' class='canDefault px' name='paramRadio' ><span class='lbl'>是</span></label></td>";
		    trEL+="<td><input type='text' class='form-control checkMpriceTemp'> <input type='hidden' class='form-control checkMprice' name='itemMutiParamList["+i+"].mPrice'></td>";
		    trEL+="<td><input type='text'  class='form-control checkBuyPriceTemp' readonly><input type='hidden' class='checkBuyPrice'   name='itemMutiParamList["+i+"].buyPrice'></td>";
		    trEL+="<td><input type='text' class='form-control checkNum'  name='itemMutiParamList["+i+"].num'></td>";
		    trEL+="<td><div class='input-group'><input type='hidden' class='form-control skuCode'  name='itemMutiParamList["+i+"].skuCode'>" +
				"<input type='text' class='form-control skuCustomCode' ><span class='input-group-addon skuRandomCode'></span></div></td>";
			trEL+="</tr>";
		}
		tableEL+=trEL;
	}
	$(".sizeArea table").html(tableEL);
}

function drawLevel2(data){
	var firstGroup =data[0];
	var firstName=firstGroup.name;
	var firstData=firstGroup.value;
	var firstLength=firstData.length;
	var secondGroup=data[1];
	var secondName=secondGroup.name;
	var secondData=secondGroup.value;
	var secondLength=secondData.length;
	
	var itemIndex=0;
	var tableEL="<thead><tr><td class='group-title'>"+firstName+"</td><td class='group-title'>"+secondName+"</td><td class='group-title'>默认</td><td>德国价(€)</td><td>购买价(¥)</td><td>库存</td><td>SKU编码</td></tr>";
	for(var i=0;i<firstLength;i++){
		
		for(var j=0;j<secondLength;j++){
			var trEL="<tr>";
			if(j==0){
				trEL+="<td rowspan='"+secondLength+"'>"+firstData[i]+"</td>";
			}
			var paramObj = {
			
			};
			paramObj[firstName]=firstData[i];
			paramObj[secondName]=secondData[j];
	
			trEL+="<td>"+secondData[j]+"</td>"
			var existELDiv=$("#paramBak .rule[data='"+JSON.stringify(paramObj)+"']");
			if(existELDiv.length>0){
				var targetEL=existELDiv.html();
				
				var result=targetEL.replaceAll("[\[0\]]",itemIndex+"]");
				console.log(result);
				trEL+=result;
			}else{
				
				trEL+="<td><input type='hidden' class='form-control ruleName'  name='itemMutiParamList["+itemIndex+"].ruleName' value='"+JSON.stringify(paramObj)+"'>"+
	 			 "<input type='hidden' name='itemMutiParamList["+itemIndex+"].canDefault'  value='0' class='canDefaultValue'><label class='radio-inline'><input type='radio' class='canDefault px' name='paramRadio' ><span class='lbl'>是</span></label></td>";
				trEL+="<td><input type='text' class='form-control checkMpriceTemp'> <input type='hidden' class='form-control checkMprice' name='itemMutiParamList["+itemIndex+"].mPrice'></td>";
				trEL+="<td><input type='text'  class='form-control checkBuyPriceTemp' readonly><input type='hidden' class='checkBuyPrice'   name='itemMutiParamList["+itemIndex+"].buyPrice'></td>";
				trEL+="<td><input type='text' class='form-control checkNum'  name='itemMutiParamList["+itemIndex+"].num'></td>";
				trEL+="<td><div class='input-group'><input type='hidden' class='form-control skuCode'  name='itemMutiParamList["+itemIndex+"].skuCode'>" +
						"<input type='text' class='form-control skuCustomCode' ><span class='input-group-addon skuRandomCode'></span></div></td>";
				trEL+="</tr>";
			}
			tableEL+=trEL;
			
			itemIndex++;
		}
		
	}
	$(".sizeArea table").html(tableEL);
}

function drawLevel3(data){
	var firstGroup =data[0];
	var firstName=firstGroup.name;
	var firstData=firstGroup.value;
	var firstLength=firstData.length;
	
	var secondGroup=data[1];
	var secondName=secondGroup.name;
	var secondData=secondGroup.value;
	var secondLength=secondData.length;
	
	var thirdGroup=data[2];
	var thirdName=thirdGroup.name;
	var thirdData=thirdGroup.value;
	var thirdLength=thirdData.length;
	
	var itemIndex=0;
	var firstItemNum=thirdLength*secondLength;
	
	var tableEL="<thead><tr><td class='group-title'>"+firstName+"</td><td class='group-title'>"+secondName+"</td><td class='group-title'>"+thirdName+"</td><td class='group-title'>是否默认</td><td>德国价(€)</td><td>购买价(¥)</td><td>库存</td><td>SKU编码</td></tr>";
	for(var i=0;i<firstLength;i++){
		
		for(var j=0;j<secondLength;j++){
			
			for(var k=0;k<thirdLength;k++){
				
				var trEL="<tr>";
				if(k==0&&j==0){
					trEL+="<td rowspan='"+firstItemNum+"'>"+firstData[i]+"</td>";
				}
				if(k==0){
					trEL+="<td rowspan='"+thirdLength+"'>"+secondData[j]+"</td>";
				}
				trEL+="<td>"+thirdData[k]+"</td>";
				var paramObj = {
						
				};
				paramObj[firstName]=firstData[i];
				paramObj[secondName]=secondData[j];
				paramObj[thirdName]=thirdData[k];
				var existELDiv=$("#paramBak .rule[data='"+JSON.stringify(paramObj)+"']");
				if(existELDiv.length>0){
					var targetEL=existELDiv.html();
					var result=targetEL.replaceAll("[\[0\]]",itemIndex+"]");
					console.log(result);
					trEL+=result;
				}else{
					trEL+="<td><input type='hidden' class='form-control ruleName'  name='itemMutiParamList["+itemIndex+"].ruleName' value='"+JSON.stringify(paramObj)+"'>"+
		 			"<input type='hidden' name='itemMutiParamList["+itemIndex+"].canDefault'  value='0' class='canDefaultValue'><label class='radio-inline'><input type='radio' class='canDefault px' name='paramRadio' ><span class='lbl'>是</span></label></td>";
				    trEL+="<td><input type='text' class='form-control checkMpriceTemp'> <input type='hidden' class='form-control checkMprice' name='itemMutiParamList["+itemIndex+"].mPrice'></td>";
			    	trEL+="<td><input type='text' class='form-control checkBuyPriceTemp' readonly><input type='hidden' class='checkBuyPrice'   name='itemMutiParamList["+itemIndex+"].buyPrice'></td>";
				    trEL+="<td><input type='text' class='form-control checkNum'  name='itemMutiParamList["+itemIndex+"].num'></td>";
				    trEL+="<td><div class='input-group'><input type='hidden' class='form-control skuCode'  name='itemMutiParamList["+itemIndex+"].skuCode'>" +
						"<input type='text' class='form-control skuCustomCode' ><span class='input-group-addon skuRandomCode'></span></div></td>";
				    trEL+="</tr>";
				}
			    tableEL+=trEL;
				itemIndex++;
				
			}
			
		}
		
	}
	$(".sizeArea table").html(tableEL);
}
function drawLevel4(data){
	var firstGroup =data[0];
	var firstName=firstGroup.name;
	var firstData=firstGroup.value;
	var firstLength=firstData.length;
	
	var secondGroup=data[1];
	var secondName=secondGroup.name;
	var secondData=secondGroup.value;
	var secondLength=secondData.length;
	
	var thirdGroup=data[2];
	var thirdName=thirdGroup.name;
	var thirdData=thirdGroup.value;
	var thirdLength=thirdData.length;
	
	var fourthGroup=data[3];
	var fourthName=fourthGroup.name;
	var fourthData=fourthGroup.value;
	var fourthLength=fourthData.length;
	
	var itemIndex=0;
	var firstItemNum=thirdLength*secondLength*fourthLength;
	var secondItemNum=thirdLength*fourthLength;
	
	var tableEL="<thead><tr><td class='group-title'>"+firstName+"</td><td class='group-title'>"+secondName+"</td><td class='group-title'>"+
	thirdName+"</td><td class='group-title'>"+fourthName+"</td><td class='group-title'>是否默认</td><td>德国价(€)</td><td>购买价(¥)</td><td>库存</td><td>SKU编码</td></tr>";
	
	for(var i=0;i<firstLength;i++){
		
		for(var j=0;j<secondLength;j++){
			
			for(var k=0;k<thirdLength;k++){
				
				for(var m=0;m<fourthLength;m++){
					var trEL="<tr>";
					if(k==0&&j==0&&m==0){
						trEL+="<td rowspan='"+firstItemNum+"'>"+firstData[i]+"</td>";
					}
					if(k==0&&m==0){
						trEL+="<td rowspan='"+secondItemNum+"'>"+secondData[j]+"</td>";
					}
					
					if(m==0){
						trEL+="<td rowspan='"+fourthLength+"'>"+thirdData[k]+"</td>";
					}
					
					trEL+="<td>"+fourthData[m]+"</td>";
					
					var paramObj = {
							
					};
					paramObj[firstName]=firstData[i];
					paramObj[secondName]=secondData[j];
					paramObj[thirdName]=thirdData[k];
					paramObj[fourthName]=fourthData[m];
					
				
					var existELDiv=$("#paramBak .rule[data='"+JSON.stringify(paramObj)+"']");
					if(existELDiv.length>0){
						var targetEL=existELDiv.html();
						var result=targetEL.replaceAll("[\[0\]]",itemIndex+"]");
						console.log(result);
						trEL+=result;
					}else {
					trEL+="<td><input type='hidden' class='form-control ruleName'  name='itemMutiParamList["+itemIndex+"].ruleName' value='"+JSON.stringify(paramObj)+"'>"+
		 			"<input type='hidden' name='itemMutiParamList["+itemIndex+"].canDefault'  value='0' class='canDefaultValue'><label class='radio-inline'><input type='radio' class='canDefault px' name='paramRadio' ><span class='lbl'>是</span></label></td>";
				    trEL+="<td><input type='text' class='form-control checkMpriceTemp'> <input type='hidden' class='form-control checkMprice' name='itemMutiParamList["+itemIndex+"].mPrice'></td>";
			    	trEL+="<td><input type='text'  class='form-control checkBuyPriceTemp' readonly><input type='hidden' class='checkBuyPrice'   name='itemMutiParamList["+itemIndex+"].buyPrice'></td>";
				    trEL+="<td><input type='text' class='form-control checkNum'  name='itemMutiParamList["+itemIndex+"].num'></td>";
				    trEL+="<td><div class='input-group'><input type='hidden' class='form-control skuCode'  name='itemMutiParamList["+itemIndex+"].skuCode'>" +
						"<input type='text' class='form-control skuCustomCode' ><span class='input-group-addon skuRandomCode'></span></div></td>";
				    trEL+="</tr>";
				} 
					tableEL+=trEL;
					itemIndex++;
					
			}
		  }	
		}
		
	}
	$(".sizeArea table").html(tableEL);
}

function getRandomCode(e){
	var target=$(e.currentTarget);
	var skuCustomCode=target.val();
	var skuRandomCode=target.siblings(".skuRandomCode").html();
	if(skuRandomCode){
		target.siblings(".skuCode").val(skuCustomCode+skuRandomCode);
		return;
	}
	if(skuCustomCode){
		target.parents("tr").addClass("hasValue");
		var jsonData={
			skuCode:skuCustomCode
		};
		$.ajax({
			type : 'POST',
			url : "/goods/getSkuRandomCode",
			data : jsonData,
			success : function(result) {
				target.siblings(".skuCode").val(skuCustomCode+result);
				target.siblings(".skuRandomCode").html(result);
				}
		});
	}
	
	
}
function calculateCheckMPrice(e){
	
	var target = $(e.currentTarget);
	var parent=$(e.currentTarget).parents("tr");
	
	//var deliveryWay=$("input[name='deliveryWay']:checked").val();
	
	var importRate=$("#importRate").val();
	var consumptionRate=$("#consumptionRate").val();
	var vatRate=$("#vatRate").val();
	var totalRate=Number(importRate)+Number(consumptionRate)+Number(vatRate);

	
	var v = parent.find(".checkMpriceTemp").val();
	var r= new RegExp("\\d+(\\.\\d+)?$");
	if(!v){
		target.parents("tr").find(".checkMpriceTemp").parent().addClass("has-error");
		$.err("德国价格式错误");
		return;	
	}
	if(!v||!r.test(v)){
		parent.find(".checkMpriceTemp").parent().addClass("has-error");
		$.err("德国价格式错误");
		return;	
	}else{
		parent.find(".checkMpriceTemp").parent().removeClass("has-error");
	}
	parent.find(".checkMpriceTemp").siblings(".checkMprice").val(parseInt(Number(v)*100));

	if(parent.find(".canDefaultValue").val()==1){
		$(".singleParam  #mprice").val(parseInt(Number(v)*100));
		$(".singleParam  #mpriceTemp").val(v);
	}
	
	
	
	var jsonData={
			mprice:v,
		    totalRate:totalRate
		};
		$.ajax({
			type : 'POST',
			url : "/goods/calculatePrice",
			data : jsonData,
			success : function(result) {
				target.parents("tr").find(".checkBuyPriceTemp").val(result.buyPrice);
				target.parents("tr").find(".checkBuyPrice").val(parseInt(Number(result.buyPrice)*100));
				target.parents("tr").find(".checkBuyPrice").attr("logisticsPriceTemp",result.logisticsPrice);
				target.parents("tr").find(".checkBuyPrice").attr("logisticsPrice",parseInt(Number(result.logisticsPrice)*100));
				$("#logisticsPriceTemp").val(result.logisticsPrice);
				$("#logisticsPrice").val(parseInt(Number(result.logisticsPrice)*100));
			}
		});
	
	
}


function loadSimplePrice(){
	var v = $("#mpriceTemp").val();
	var r= new RegExp("\\d+(\\.\\d+)?$");
	if(!v){
		$.err("德国价不能为空");
		return;	
	}
	if(!v||!r.test(v)){
		$.err("德国价格式错误");
		return;	
	}
	$("#mprice").val(parseInt(Number(v)*100));
	
	
	var importRate=$("#importRate").val();
	var consumptionRate=$("#consumptionRate").val();
	var vatRate=$("#vatRate").val();
	var totalRate=Number(importRate)+Number(consumptionRate)+Number(vatRate);
 
	 
	if(!mprice){
		$.err("请填写德国价");
		target.val("获取价格");
		return;	
	} 
	var jsonData={
		mprice:v,
		totalRate:totalRate
	};
	$.ajax({
		type : 'POST',
		url : "/goods/calculatePrice",
		data : jsonData,
		success : function(result) {
			
			$("#buyPrice").val(parseInt(Number(result.buyPrice)*100));
			$("#buyPriceTemp").val(result.buyPrice);
			$("#logisticsPrice").val(parseInt(Number(result.logisticsPrice)*100));
			$("#logisticsPriceTemp").val(result.logisticsPrice);
			$('#updateItemForm').data('bootstrapValidator').updateStatus("logisticsPriceTemp","VALID",null);
			$('#updateItemForm').data('bootstrapValidator').updateStatus("buyPriceTemp","VALID",null);
		}
	});
	
	
}

function loadMutiPrice(target,v,totalRate){
	var jsonData={
			mprice:v,
			totalRate:totalRate
		};
		$.ajax({
			type : 'POST',
			url : "/goods/calculatePrice",
			data : jsonData,
			success : function(result) {
				target.find(".checkBuyPriceTemp").val(result.buyPrice);
				target.find(".checkBuyPrice").val(parseInt(Number(result.buyPrice)*100));
				$('#updateItemForm').data('bootstrapValidator').updateStatus("logisticsPriceTemp","VALID",null);
				$('#updateItemForm').data('bootstrapValidator').updateStatus("buyPriceTemp","VALID",null);
			}
		});
	
}
function calculatePrice(){
	
if($(".canMutiParam:checked").val()==0){//单规规格
	loadSimplePrice();
 }else{//多规格
		$(".sizeArea .sonnenjahrTable tr").each(function(e){
			var target = $(this);
			var mprice = target.find(".checkMpriceTemp").val();
			if(mprice){
				var importRate=$("#importRate").val();
				var consumptionRate=$("#consumptionRate").val();
				var vatRate=$("#vatRate").val();
				var totalRate=Number(importRate)+Number(consumptionRate)+Number(vatRate);
				loadMutiPrice(target,mprice,totalRate);
			}
		});
	 
 }	
}