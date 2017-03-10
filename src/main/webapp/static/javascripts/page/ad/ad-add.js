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
            code: {
            	validators: {
	            	notEmpty: {
	            		message: '编码不能为空'
	            	}
            	}
            },
            type: {
            	validators: {
	            	notEmpty: {
	            		message: '类型能为空'
	            	}
            	}
            }
           
        }
    });
});



$("#add").on("click",function(){addAdmin();})
function addAdmin(){
	var bootstrapValidator = $("#biaodan").data('bootstrapValidator');
	bootstrapValidator.validate();
	
	if(!bootstrapValidator.isValid()){
		return false;
	}
	
	var name=$("#name").val();
	var code=$("#code").val();
	var sort=$("#sort").val();
	var type=$("#type").val();
	var jsonData={
		sort:sort,
		name:name,
		code:code,
		type:type
	}
	$.ajax({
		url:'/ad/list/add',
		type:'POST',
		data:jsonData,
		success:function(data){
			if(data="处理成功"){
				$.msg(data);
				window.location.href="/ad"
			}else{
				$.err(data);
			}
		}
	})
}



