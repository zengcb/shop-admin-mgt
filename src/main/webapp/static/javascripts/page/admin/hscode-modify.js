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
            name:{
                validators:{
                	notEmpty : {
                        message : 'HS码内容不能为空'
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
	var hsCodeId=$("#edit").attr("hscodeId");
	var name=$("#name").val();
	var jsonData={
		id:hsCodeId,
		name:name
	}
	$.ajax({
		url:'/admin/hsCodelist/modify',
		type:'POST',
		data:jsonData,
		success:function(result){
			if(result.status=="ok"){
				$.msg("编辑成功");
				setTimeout(function(){window.location.href="/hsCode"},1000);
			}else{
			   $.err(result.status);
			}
		}
	})
}