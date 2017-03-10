$(function(){
	
	 if(functionIds){
		 var functionArray = functionIds.split(",");
		 for(var i=0;i<functionArray.length;i++){
             $(".functionId option[value='"+functionArray[i]+"']").attr("selected","true");			 
		 }
		 
		 
	 }
	 $(".superAdmin").on("change",function(){
			var v =$(this).val();
		    if(v==0){
		    	$(".openMenuList").addClass("hidden");
		    }else{
		    	$(".openMenuList").removeClass("hidden");
		    }
		});
	 $('.functionId').SumoSelect({
		   csvDispCount: 5,
	       captionFormat: '已经选择{0}个菜单'
		 });
	 
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
	       	realName:{
	               validators:{
	               	notEmpty : {
	                       message : '名字不能为空'
	                   }
	               }
	           },
	           name:{
	               validators:{
	               	notEmpty : {
	                       message : '账号不能为空'
	                   }
	               }
	           }
	       }
	   });
	    $("#updateBtn").on("click",updateAdmin)
});
function updateAdmin(){
	var jsonData=$("#updateForm").serialize();
	var functionId = $(".functionId").val().toString();
	jsonData+="&functionId="+functionId;

	var bootstrapValidator = $("#updateForm").data('bootstrapValidator');
	bootstrapValidator.validate();
	
	if(!bootstrapValidator.isValid()){
		return false;
	}
	
	var jsonData=$("#updateForm").serialize();
	var functionId = $(".functionId").val().toString();
	jsonData+="&functionId="+functionId;
	
	$.ajax({
		url:'/admin/supplierMember/update',
		type:'POST',
		data:jsonData,
		success:function(result){
			if(result=="ok"){
                $.msg("更新成功");
                setTimeout(function(){window.location.reload();},1000);
			}else{
			   $.err(result);
            }
		}
	})
	
}
