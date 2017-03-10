$(document).ready(function() {
    $('#biaodan').bootstrapValidator({
         message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        live: 'enabled',
        message: 'This value is not valid',
        submitButtons: 'button[type="submit"]',
        submitHandler: null,
        fields:{
        	sort:{
                validators:{
                	notEmpty : {
                        message : '排序不能为空'
                    }
                }
            },
            name:{
                validators:{
                	notEmpty : {
                        message : '名称不能为空'
                    }
                }
            },
            link: {
            	validators: {
	            	notEmpty: {
	            		message: '链接不能为空'
	            	}
            	}
            }
           
        }
    });
});
$(function(){
	$(document).delegate("input[type=file]","change",uploadItemPic);
	$(document).delegate(".glyphicon-remove","click",removePic);
	});
function removePic(e){
	var target = $(e.currentTarget).parents(".imgArea");
	target.remove();
}

function  uploadItemPic(e){
	var targetFile = $(e.currentTarget);
	  $.ajaxFileUpload({  
	        url:'/addetail/pic/upload',  
	        secureuri:false,  
	        fileElementId:"originalUpload",//file标签的id  
	        dataType: 'json',//返回数据的类型  
	        data:null,//一同上传的数据  
	        success: function (result) {
	        	console.log(result);
	        	if(result.status=="ok"){
	        		var fileId=result.fileId;
	        		var fileName=result.fileName;
	        		var imgUrl=result.imgUrl;
	        		var target = $("#imgBak .imgArea").clone();
	        		target.find("#picName").val(fileName);
	        		target.find("#picUrl").val(fileId);
	        		target.find("img").attr("src",imgUrl+"/"+fileId);
	        		$(".displayArea .imgArea").remove();
	        		$(".displayArea").append(target);
	        		$("#biaodan").removeClass("has-error");
	        		$(".noPicError").hide();
	        	}else{
	        		$.err("图片上传失败");
	        	}
	        	targetFile.val("");
	          }
	  });
	  
  }
$("#add").on("click",function(){addAdmin();});

/*$("#add").on("click",function(){addAdmin();})
function addAdmin(){
	var adId=$("#adId").val();
	var bootstrapValidator = $("#biaodan").data('bootstrapValidator');
	bootstrapValidator.validate();
	
	if(!bootstrapValidator.isValid()){
		return false;
	}
	//var jsonData=$("#biaodan").serialize();
	var name=$("#name").val();
	var sort=$("#sort").val();
	var link=$("#link").val();
	var picName=$("#picName").val();
	var picUrl=$("#picUrl").val();
	console.log(picName==""||picUrl=="");
	if(picName==""||picUrl==""){
		alert(1);
	}
	var adId=$("#adId").val();
	var jsonData={
			adId:adId,
			name:name,
			sort:sort,
			link:link,
			picName:picName,
			picUrl:picUrl
	}
	console.log(jsonData);
	$.ajax({
		url:'/addetail/list/add',
		type:'POST',
		data:jsonData,
		success:function(result){
				if(result.status=="ok"){
					$.msg("处理成功");
					setTimeout(function(){window.location.href="/addetail?adId="+adId;},1000);
				}else{
				   $.err(result.status);
				}
		}
	})
}*/


function formCheck(){
	var bootstrapValidator = $("#biaodan").data('bootstrapValidator');
	bootstrapValidator.validate();
	
	var picName=$("#picName").val();
	var picUrl=$("#picUrl").val();
	if(picName==""||picUrl==""){
		$("#biaodan").addClass("has-error");
		$(".noPicError").show();
	}
	
	if(!bootstrapValidator.isValid()||picName==""||picUrl==""){
		return false;
	}
	return true;
}


function addAdmin(){
	//var jsonData=$("#biaodan").serialize();
	var check=formCheck();
	if(!check){
		return false;
	}
	var name=$("#name").val();
	var sort=$("#sort").val();
	var link=$("#link").val();
	var picName=$("#picName").val();
	var picUrl=$("#picUrl").val();
	var adId=$("#adId").val();
	
	var jsonData={
			adId:adId,
			name:name,
			sort:sort,
			link:link,
			picName:picName,
			picUrl:picUrl
	}
	console.log(jsonData);
	$.ajax({
		url:'/addetail/list/add',
		type:'POST',
		data:jsonData,
		success:function(result){
				if(result.status=="ok"){
					$.msg("处理成功");
					setTimeout(function(){window.location.href="/addetail?adId="+adId;},1000);
				}else{
				   $.err(result.status);
				}
		}
	})
}

