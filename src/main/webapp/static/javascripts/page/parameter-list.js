$(function(){
	loadPageTable();
	$("#myTable").delegate(".deleteBtn","click",deleteData);
	$("#myTable").delegate(".updateBtn","click",updateData);
	$("#toAddPage").on("click",toAddPage);
});
function toAddPage(){
	window.location.href="/parameter/add";
	
}
function deleteData(e){
	var id =$(e.currentTarget).parents("tr").attr("data");
	if(!id) return;
	var jsonData={
	  itemParamId:id		
	};
	$.ajax({
		type : 'POST',
		url : "/parameter/delete",
		data : jsonData,
		success : function(result) {
		  if(result=='ok'){
		    $.msg("删除成功");
		    setTimeout(function(){window.location.reload();},1000);
		  }else{
			$.err(result);
		  }
		}
	});
}

function updateData(e){
	var id =$(e.currentTarget).parents("tr").attr("data");
	if(!id) return;
	window.location.href="/parameter/update?itemParamId="+id;
}

function loadPageTable(){
	var jsonData={
	  pageSize:1,
	  pageNum:10
	};
	
	$("#myTable").pagination({
		url:"/parameter/list",
		paramJson:jsonData
	});
	
}
