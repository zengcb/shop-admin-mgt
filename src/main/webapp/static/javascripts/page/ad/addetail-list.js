$(document).delegate(".del","click",function(){
	var id=$(this).attr("value");
	var jsonData={
		id:id
	}
	$.ajax({
		url:'/addetail/list/del',
		type:'POST',
		data:jsonData,
		success:function(result){
			if(result.status=="ok"){
				$.msg("处理成功");
				window.location.reload();
			}else{
			   $.err(result.status);
			}
		}
	})
})
