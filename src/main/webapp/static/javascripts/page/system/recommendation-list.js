$(function(){
 $(".toAddPage").on("click",toAddPage);
 $(".deleteBtn").on("click",deleteItem);
 $(".updateBtn").on("click",toUpdatePage);
 $(".upItemBtn").on("click",upItem);
 $(".downItemBtn").on("click",downItem);
});
function upItem(e){
	var itemId =$(e.currentTarget).parent().attr("data");
	if(!itemId) return;
	var jsonData={
			itemId:itemId	
		};
		$.ajax({
			type : 'POST',
			url : "/recommendation/upItem",
			data : jsonData,
			success : function(result) {
				if(result.status=="ok"){
					$.msg("移动成功");
					setTimeout(function(){window.location.reload();},2000);
				}else{
				   $.err(result.status);
				}
			}
		});	
}

function downItem(e){
	var itemId =$(e.currentTarget).parent().attr("data");
	if(!itemId) return;
	var jsonData={
			itemId:itemId	
		};
		$.ajax({
			type : 'POST',
			url : "/recommendation/downItem",
			data : jsonData,
			success : function(result) {
				if(result.status=="ok"){
					$.msg("移动成功");
					setTimeout(function(){window.location.reload();},2000);
				}else{
				   $.err(result.status);
				}
			}
		});	
}

function toUpdatePage(e){
	var itemId =$(e.currentTarget).parent().attr("data");
	if(!itemId) return;
	window.location.href="/recommendation/update?itemId="+itemId;
}
function deleteItem(e){
	var itemId =$(e.currentTarget).parent().attr("data");
	if(!itemId) return;
	var jsonData={
		itemId:itemId	
	};
	$.ajax({
		type : 'POST',
		url : "/recommendation/delete",
		data : jsonData,
		success : function(result) {
			if(result.status=="ok"){
				$.msg("删除成功");
				setTimeout(function(){window.location.reload();},2000);
			}else{
			   $.err(result.status);
			}
		}
	});	
}
function toAddPage(e){
	var categoryCode=$("#myTab li.active").attr("data");
	var type=$(e.currentTarget).parents("#myTabContent").siblings("#myTab").find("li.active").attr("data");
	if(!type||!categoryCode)return;
	
	window.location.href="/recommendation/add?type="+type+"&categoryCode="+categoryCode;
}