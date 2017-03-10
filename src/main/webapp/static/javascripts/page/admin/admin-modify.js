$(document).ready(function() {
	 $('.functionId').SumoSelect({
		   csvDispCount: 5,
	       captionFormat: '已经选择{0}个菜单'
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
        	name:{
                validators:{
                	notEmpty : {
                        message : '登陆账号不能为空'
                    }
                }
            },
            realName:{
                validators:{
                	notEmpty : {
                        message : '管理员名字不能为空'
                    }
                }
            }
        }
    });
});



$("#edit").on("click",function(){editAdmin();})
function editAdmin(){
	var bootstrapValidator = $("#biaodan").data('bootstrapValidator');
	bootstrapValidator.validate();
	
	if(!bootstrapValidator.isValid()){
		return false;
	}
	var functionId=$(".functionId").val();
	if(functionId){
		$("#adminFunctionId").val(functionId.toString());
	}else{
		$("#adminFunctionId").val("");
	}
	var jsonData=$("#biaodan").serialize();
	
	
	$.ajax({
		url:'/admin/list/modify',
		type:'POST',
		data:jsonData,
		success:function(result){
			if(result.status=="ok"){
                $.msg("修改成功");
                setTimeout(function(){window.location.href="/admin";},1000);
			}else{
			   $.err(result.status);
            }
		}
	})
}