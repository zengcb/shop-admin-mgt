$(function(){
	loadTable();
	$("#toAddPageBtn").on("click",toAddPage);
	$('a[data-toggle="tab"]').on('shown.bs.tab', function(e){
		var  tabIndex=$(e.currentTarget).parent().attr("data");
		if(tabIndex==0){
			$("#updateBtachStatusBtn").html("批量下架");
		}else{
			$("#updateBtachStatusBtn").html("批量上架");
		}
		loadTable();
		
	});
	$("#myTabContent").delegate(".offlineBtn","click",changeStatus);
	$("#myTabContent").delegate(".onlineBtn","click",changeStatus);
	$("#myTabContent").delegate(".updateBtn","click",toUpdatePage);
	$("#myTabContent").delegate(".deleteBtn","click",deleteGoods);
	$("#myTabContent").delegate(".checkAll","click",checkAllBox);
	$("#exportBatchBtn").on("click",exportData);
	$("#updateBtachStatusBtn").on("click",updateBatchItemStatus);
	$("#deleteBtachBtn").on("click",deleteBatchItem);
	$("#serachBtn").on("click",loadTable);
	$("#clearBtn").on("click",clearSelect);
});
function deleteGoods(e){
	var id=$(e.currentTarget).parents("tr").attr("data");
	if(!id) return;
	var jsonData={
		itemId:id	
	};
	
	  bootbox.confirm({
          message:   '确定要删除该商品?',
          className: 'bootbox-sm',
          buttons: {
        	  confirm: {  
                  label: '确定',  
                  className: 'btn-primary'  
              },  
              cancel: {  
                  label: '取消',  
                  className: 'btn-default'  
              }  
          },
          callback: function(result) {
               if(result){
            	   $.ajax({
            			type : 'POST',
            			url : "/goods/delete",
            			data : jsonData,
            			success : function(result) {
            				if(result=="ok"){
            					$.msg("删除成功");
            					setTimeout(function(){window.location.reload();},1000);
            				}else{
            				   $.err(result);
            				}
            			}
            		});
               }
            },

        
        });
	
	
}
function clearSelect(){
     $("#itemName").val("");
	 $("#itemId").val("");
	 $("#brandId").val("");
	 $("#categoryId").val("");
	 $("#supplierCompanyId").val("");

	
	
}
function exportData(){
	var itemName = $("#itemName").val();
	var itemId=$("#itemId").val();
	var brandId =$("#brandId").val();
	var categoryId=$("#categoryId").val();
	var status=$("#myTab li.active").attr("data");
	window.location.href="/goods/exportData?itemId="+itemId+"&itemName="+itemName+"&brandId="
	+brandId+"&categoryId="+categoryId+"&status="+status+"&pageNum=1&pageSize=10000000";
	
	
}
function checkAllBox(e){
	var target=$(e.currentTarget).parents("table");
	var status=$(e.currentTarget).prop("checked");
	target.find(".itemCheckbox").each(function(e){
		$(this).prop("checked",status);
	})
	
}
function updateBatchItemStatus(){
	var checkedNum=$("#myTabContent .active .itemCheckbox:checked").length;
	if(checkedNum==0){
		$.err("请选择你要更新的商品");
		return;
	};
	var itemId="";
	$("#myTabContent .active .itemCheckbox:checked").each(function(){
		var id=$(this).parents("tr").attr("data");
		if(itemId==""){
			itemId+=id;
		}else{
			itemId+=","+id;
		}
	});
	var status=$("#myTab li.active").attr("data");
	if(status=="0"){
		status=1;
	}else{
		status=0;
	}
    if(itemId){
    	var jsonData={
    		itemIds:itemId,
    		status:status
    	};
    	$.ajax({
    		type : 'POST',
    		url : "/goods/changeBatchStatus",
    		data : jsonData,
    		success : function(result) {
    			if(result.status=="ok"){
    				$.msg("更新成功");
    				setTimeout(function(){window.location.reload();},1000);
    			}else{
    			   $.err(result.status);
    			}
    		}
    	});
    	
    }
}
function deleteBatchItem(){
	var checkedNum=$("#myTabContent .active .itemCheckbox:checked").length;
	if(checkedNum==0){
		$.err("请选择你要删除的商品");
		return;
	};
	var itemId="";
	$("#myTabContent .active .itemCheckbox:checked").each(function(){
		var id=$(this).parents("tr").attr("data");
		if(itemId==""){
			itemId+=id;
		}else{
			itemId+=","+id;
		}
	});
	if(itemId){
		var jsonData={
	    		itemIds:itemId,
	    		status:status
	    	};
		$.ajax({
    		type : 'POST',
    		url : "/goods/deleteBatchItem",
    		data : jsonData,
    		success : function(result) {
    			if(result.status=="ok"){
    				$.msg("删除成功");
    				setTimeout(function(){window.location.reload();},1000);
    			}else{
    			   $.err(result.status);
    			}
    		}
    	});
		
	}
	
}
function changeStatus(e){
	var status = $(e.currentTarget).attr("data");
	var id=$(e.currentTarget).parents("tr").attr("data");
	var jsonData={
		status:status,
		itemId:id
	};
	console.log(jsonData);
	$.ajax({
		type : 'POST',
		url : "/goods/changeStatus",
		data : jsonData,
		success : function(result) {
			if(result.status=="ok"){
				$.msg("操作成功");
				setTimeout(function(){window.location.reload();},1000);
			}else{
			   $.err(result.status);
			}
		}
	});
	
}
function toAddPage(){
	window.location.href="/goods/add";
}
function toUpdatePage(e){
	var id=$(e.currentTarget).parents("tr").attr("data");
	window.location.href="/goods/update?itemId="+id;
}
function loadTable(){
	var itemName = $("#itemName").val();
	var itemId=$("#itemId").val();
	var brandId =$("#brandId").val();
	var categoryId=$("#categoryId").val();
	var supplierCompanyId=$("#supplierCompanyId").val();
	var status=$("#myTab li.active").attr("data");
	var jsonData={
			itemName:itemName,
			itemId:itemId,
			brandId:brandId,
			categoryId:categoryId,
			supplierCompanyId:supplierCompanyId,
			status:status,
			pageSize:10,
			pageNum:1
	};
	console.log(jsonData);
	$("#table"+status).pagination({
		url:"/goods/list",
		paramJson:jsonData
	})
	
	
}