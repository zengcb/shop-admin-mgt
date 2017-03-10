$(function(){
	
  $(".updateDeliveryBtn").on("click",updateDelivery);
});


function updateDelivery(){
	var flag=checkInputVal();
	if(flag==false){
		$.err("字段不能为空");
		return;
	}; 
	var jsonData=$("#updateForm").serialize();
	console.log(jsonData);
	$.ajax({
		type : 'POST',
		url : "/delivery/update",
		data : jsonData,
		success : function(result) {
			if(result=="ok"){
			   $.msg("更新成功");
		    }else{
		      $.err(result);
		    }			
		}
	});
}
function checkInputVal(){
	var flag=true;
	$("input[type='text'].required").each(function(){
		var v=$(this).val();
		if(v==""){
			$(this).addClass("error");
			flag=false;
		}else{
			$(this).removeClass("error");
		}
		
	})
	return flag;
	
}
	
