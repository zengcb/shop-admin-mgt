$(
	function(){
		loadMemerPage();
	}	
)
function loadMemerPage(){
	var jsonData={
	}
	
	$("#record").pagination({
		url:"/admin/list",
		paramJson:jsonData
	})
}
$(document).delegate(".showChangeModal","click",function(e){
	 var v = $(e.currentTarget).parents("tr").find("td:eq(1)").html();
	 var id=$(e.currentTarget).attr("data");
	 $("#changePasswordForm .name").val(v);
	 $("#changePasswordForm #adminId").val(id);
	 $("#change-password-modal").modal("show");
});
$(document).delegate(".delete","click",function(e){
	var target =$(e.currentTarget);
	var id=target.attr("data");
	if(!id){
		return;
	}
	var jsonData={
		id:id,
		superAdmin:1,
	};
	$.ajax({
		type:'post',
		url:"/admin/delete",
		data:jsonData,
	    success:function(result){
	    	if(result=="ok"){
	    		$.msg("删除成功");
                target.parents("tr").remove();
			}else{
			   $.err(result);
            }
		}
			
	})
	
	
})

$(document).delegate(".block","click",function(e){
	var $dom=$(e.target); 
	var id=$dom.attr("id");
	
	var blockStatus=$(this).text();
	if(blockStatus=="停用")
		status=1;
	else
		status=0;
	var jsonData={
			id:id,
			status:1
	}
	$.ajax({
		type:'post',
		url:"/admin/list/update",
		data:jsonData,
	    success:function(result){
	    	if(result.status=="ok"){
	    		$.msg("操作成功");
                if(blockStatus=="启用"){
	    			$dom.text("停用");
	    			$dom.parent().prev().text("启用");
	    		}
	    		else{
	    			$dom.text("启用");
	    			$dom.parent().prev().text("停用");
	    		}
			}else{
			   $.err(result.status);
            }
		}
			
	})
}
)

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
                   },
				stringLength: {    
                    min: 6,
                    max: 20,
                    message: '密码长度为6-20'
                }
               }
			   
           },
           newPassword:{
               validators:{
               	notEmpty : {
                       message : '新密码不能为空'
                   },
				stringLength: {    
                    min: 6,
                    max: 20,
                    message: '密码长度为6-20'
                }
               }
			   
           },
           reNewPassword: {
           	validators: {
	            	notEmpty: {
	            		message: '确认密码不能为空'
	            	},
					stringLength: {    
                    min: 6,
                    max: 20,
                    message: '密码长度为6-20'
                   },
	            	identical: {
	            		field: 'newPassword',
	            		message: '两次输入密码不一致'
           		}
           	}
           }
       }
   });


$("#submitChangeForm").on("click",function(){
	   var flag=$("#changePasswordForm").data('bootstrapValidator').validate().isValid();
	   if(flag){
		 var newPassword = $("#newPassword").val();
		 var adminId=$("#adminId").val();
	     var jsonData={
	      adminId:adminId,
		  newPassword:newPassword
		 };
	      $.ajax({
			url:'/admin/changePwd',
			type:'POST',
			data:jsonData,
			success:function(result){
				if(result=="ok"){
	                $.msg("修改密码成功");
					 $("#change-password-modal").modal("hide");
	                setTimeout(function(){window.location.reload();},1000);
				}else if(result=="errorPassword"){
				  $.err("旧密码错误");
				}else{
				   $.err(result.status);
	            }
			}
		})
	   
	   }
	  });
