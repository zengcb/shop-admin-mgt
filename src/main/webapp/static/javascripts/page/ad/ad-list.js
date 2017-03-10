$(document).delegate(".del","click",function(){
	var id=$(this).attr("value");
	var jsonData={
		id:id
	}
	$.ajax({
		url:'/ad/list/del',
		type:'POST',
		data:jsonData,
		success:function(result){
			if(result.status=="ok"){
				$.msg("删除成功");
				window.location.reload();
			}else{
			   $.err(result.status);
			}
		}
	})
})
