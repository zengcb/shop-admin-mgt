$(
	function(){
		loadMemerPage();
	}	
)
function loadMemerPage(){
	var jsonData={
		pageNum:1,  
		numPerPage:10	
	}
	
	$("#record").pagination({
		url:"/admin/hsCodelist",
		paramJson:jsonData
	})
}


$(document).delegate(".block","click",function(e){
	var id=$(this).attr("id");
	var dom=$(this);
	var blockStatus=$(this).text();
	var jsonData={
			hsCodeId:id,
	}
	if(blockStatus=="停用"){
		$.ajax({
			type:'post',
			url:"/admin/hsCodelist/close",
			data:jsonData,
		    success:function(data){
		    	if(data=="处理成功"){
		    		$.msg(data);
		    		window.location.reload();
		    	}else{
		    		$.err(data);
		    	}
			}
				
		})
	}
	else{
		$.ajax({
			type:'post',
			url:"/admin/hsCodelist/open",
			data:jsonData,
		    success:function(data){
		    	if(data=="处理成功"){
		    		$.msg(data);
		    		window.location.reload();
		    	}else{
		    		$.err(data);
		    	}
			}
				
		})
	}
}
)

$("#openAll").click(function(){
	var size=$('input:checked').size();
	var statusList="";
	for(var i=0;i<size;i++){
		statusList+=$('input:checked')[i].value+",";
	}
	
	var jsonData={
		statusList:statusList	
	}
	
	$.ajax({
		type:'post',
		url:"/admin/hsCodelist/openlist",
		data:jsonData,
	    success:function(data){
	    	if(data=="处理成功"){
	    		$.msg(data);
	    		window.location.reload();
	    	}else{
	    		$.err(data);
	    	}
		}
			
	})
})

$("#closeAll").click(function(){
	var size=$('input:checked').size();
	var statusList="";
	for(var i=0;i<size;i++){
		statusList+=$('input:checked')[i].value+",";
	}
	
	var jsonData={
		statusList:statusList	
	}
	
	$.ajax({
		type:'post',
		url:"/admin/hsCodelist/closelist",
		data:jsonData,
	    success:function(data){
	    	if(data=="处理成功"){
	    		window.location.reload();
	    		$.msg(data);
	    	}else{
	    		$.err(data);	    		
	    	}
		}
			
	})
})

