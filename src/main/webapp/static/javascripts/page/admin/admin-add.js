$(document).ready(function() {
	
	 $('.functionId').SumoSelect({
		   csvDispCount: 5,
	       captionFormat: '已经选择{0}个菜单'
		 });
	 
    $('#changePasswordForm').bootstrapValidator({
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
    	  oldPassword:{
               validators:{
               	notEmpty : {
                       message : '旧密码不能为空'
                   }
               }
           },
           newPassword:{
               validators:{
               	notEmpty : {
                       message : '新密码不能为空'
                   }
               }
           },
           reNewPassword: {
           	validators: {
	            	notEmpty: {
	            		message: '确认密码不能为空'
	            	},
	            	identical: {
	            		field: 'newPassword',
	            		message: '两次输入密码不一致'
           		}
           	}
           }
       }
   });
	
	
	
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
        	realName:{
                validators:{
                	notEmpty : {
                        message : '管理员名字不能为空'
                    }
                }
            },
            name:{
                validators:{
                	notEmpty : {
                        message : '管理员账号不能为空'
                    }
                }
            },
            password: {
            	validators: {
	            	notEmpty: {
	            		message: '密码不能为空'
	            	}
            	}
            },
            rePassword: {
            	validators: {
	            	notEmpty: {
	            		message: '确认密码不能为空'
	            	},
	            	identical: {
	            		field: 'password',
	            		message: '两次输入密码不一致'
            		}
            	}
            }
        }
    });
});



$("#add").on("click",addAdmin)
function addAdmin(){
	var bootstrapValidator = $("#biaodan").data('bootstrapValidator');
	bootstrapValidator.validate();
	
	if(!bootstrapValidator.isValid()){
		return false;
	}
	
	var name=$("#name").val();
	var password=$("#password").val();
	var realName=$("#realName").val();
	var status=$(".adminStatus:checked").val();
	var functionId = null;
	if($(".functionId").val()){
	  functionId=$(".functionId").val().toString();
	}
	
	var jsonData={
		name:name,
		password:password,
		realName:realName,
		status:status,
		superAdmin:1,
		functionId:functionId
	}
	console.log(jsonData);
	$.ajax({
		url:'/admin/add',
		type:'POST',
		data:jsonData,
		success:function(result){
			if(result=="ok"){
                $.msg("保存成功");
                setTimeout(function(){window.location.href="/admin";},1000);
			}else{
			   $.err(result);
            }
		}
	})
}