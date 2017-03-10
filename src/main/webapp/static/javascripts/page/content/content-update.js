$(document).ready(function() {
    $('#updateForm').bootstrapValidator({
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
        	title:{
                validators:{
                	notEmpty : {
                        message : '标题不能为空'
                    }
                }
            },
            url:{
                validators:{
                	notEmpty : {
                        message : '链接不能为空'
                    }
                }
            },
            content: {
            	validators: {
	            	notEmpty: {
	            		message: '内容不能为空'
	            	}
            	}
            }
           
        }
    });
    $("#update").on("click",updateContent);
	$(document).delegate("input[type=file]","change",uploadItemPic);
	$(document).delegate(".glyphicon-remove","click",removePic);
	  $("#content").summernote({
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
			  $("#content").html(contents);
	         }
		   }	 
	      });
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
	        		$("#pic").removeClass("has-error");
	        		$(".noPicError").hide();
	        	}else{
	        		$.err("图片上传失败");
	        	}
	        	targetFile.val("");
	          }
	  });
	  
  }




function formCheck(){
	var flag=true;
	var bootstrapValidator = $("#updateForm").data('bootstrapValidator');
	bootstrapValidator.validate();
	
	flag=bootstrapValidator.isValid();
	
	if($(".displayArea #picUrl").length>0){
		var picUrl=$(".displayArea #picUrl").val();
		if(picUrl==""){
			$("#pic").addClass("has-error");
			$(".noPicError").show();
			flag=false;
		}
	}else{
		$("#pic").addClass("has-error");
		$(".noPicError").show();
		flag=false;
	}
	
	var content=$('#content').code();
	if(content==""||content=="<p><br></p>"||content=="<p></p>"){
		$(".contentDiv").addClass("has-error");
		$(".contentDiv").find(".help-block").show();
		flag=false;
	}else{
		$(".contentDiv").removeClass("has-error");
		$(".contentDiv").find(".help-block").hide();
	}
	
	
	return flag;
}


function updateContent(){
    
	var check=formCheck();
	if(!check){
		return false;
	}
	var categoryId=$("#categoryId").val();
	var jsonData=$("#updateForm").serialize();
	console.log(jsonData);
	$.ajax({
		url:'/category/content/update',
		type:'POST',
		data:jsonData,
		success:function(result){
				if(result=="ok"){
					$.msg("保存成功");
				}else{
				   $.err(result);
				}
		}
	})
}

