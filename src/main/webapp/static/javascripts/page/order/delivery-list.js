$(function(){
	
	loadPageData();
	$('a[data-toggle="tab"]').on('shown.bs.tab', function(e){
		loadPageData();	
	});
	$("#myTabContent").delegate("#allCheckBox","click",changeAllCheckBox);
	$("#myTabContent").delegate(".orderCheckBox","click",changeCheckBox);
	$("#myTabContent").delegate(".sendGoodsBtn","click",updateGoods);
	$("#myTabContent").delegate(".sendBatchGoodsBtn","click",updateBatchGoods)
});
function updateBatchGoods(){
	var checkedNum=$("#myTabContent .active .orderCheckBox:checked").length;
	if(checkedNum==0){
		$.err("请选择你要操作的订单");
		return;
	};
	var orderId="";
	$("#myTabContent .active .orderCheckBox:checked").each(function(){
		var id=$(this).val();
		if(orderId==""){
			orderId+=id;
		}else{
			orderId+=","+id;
		}
	});
	if(orderId){
		window.location.href="/delivery/add?orderId="+orderId;
	}
	
}
function updateGoods(e){
	var orderId = $(e.currentTarget).parents(".form-group").attr("data");
	var v = $(this).val();
	if(!orderId) return;
	if(v=='发货'){
		window.location.href="/delivery/add?orderId="+orderId;
	}else if(v=="更新"){
		window.location.href="/delivery/update?orderId="+orderId;
	}
	
	
}

function changeAllCheckBox(){
	if($(this).is(':checked')){
		$(this).parents(".tab-pane").find(".orderCheckBox").prop("checked",true);
	    }else{
	    $(this).parents(".tab-pane").find(".orderCheckBox").prop("checked",false);
	  }
	
}
function changeCheckBox(){
	var checkNum=$(this).parents(".tab-pane").find(".orderCheckBox:checked").length;
	var totalNum=$(this).parents(".tab-pane").find(".orderCheckBox").length;
	$(this).parents(".tab-pane").find("#allCheckBox").prop("checked",checkNum==totalNum);
	
}
function loadPageData(){
	 var status=$("#myTab li.active").attr("data");
	 var jsonData={
			 pageSize:5,
			 pageNum:1,
			 status:status
		};
	   console.log(jsonData);
		$("#table"+status).pagination({
			url:"/delivery/list",
			paramJson:jsonData
		})
}