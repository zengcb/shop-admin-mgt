$(function(){
	$(".showOrderModal").on("click",showOrderModal);
	$(".addOrderBtn").on("click",loadOrderDetail);
	$(".submitFormBtn").on("click",submitForm);
	$("#supplierId").on("change",loadOrder);
	$("body").delegate(".checkOrder","click",calculateOrder);
});

function calculateOrder(){
	var checkNum = $(".checkOrder:checked").length;
	if(checkNum>0){
		var totalPrice=0;
		var totalWeight=0;
		var totalVolume=0;
		$(".checkOrder:checked").each(function(e){
			var target = $(this).parent();
			totalPrice+=Number(target.attr("price"));
			totalWeight+=Number(target.attr("weight"));
			totalVolume+=Number(target.attr("volume"));
		});
		$(".totalFee").html((totalPrice/100).toFixed(2));
		$(".totalRate").html((totalWeight/(totalVolume*166.7)).toFixed(2));
	}
	
}

function loadOrder(e){
	var target = $(e.currentTarget);
	var supplierId = target.val();
	if(!supplierId){
		return;
	}
	var jsonData={
			supplierId:supplierId,
			pageSize:10,
			pageNum:1
	};
	$(".loading").html("数据加载中......");
	$(".order-content").pagination({
		url:"/purchase/loadOrder",
		paramJson:jsonData
	})
}
function submitForm(){
	changeIndex();
	var jsonData=$("#purchaseFrom").serialize();
	$.ajax({
		type : 'POST',
		url : "/purchase/add",
		data : jsonData,
		success : function(result) {
		      if(result=="ok"){
		    	  $.msg("采购成功");
		    	  setTimeout(function(){window.location.href="/purchase/list";},2000);
		      }else{
		    	  $.err(result);
		      }
			}
	});
	
}
function changeIndex(){
	  $(".orderDetail .purchaseValue").each(function(i){
			var target =$(this);
			target.find("input[type='hidden']").each(function(e){
				var hiddenName=$(this).attr("name").replace(/[+\d+]/,i);
				$(this).attr("name",hiddenName)
			});
		});
}
function loadOrderDetail(){
	var checkNum=$(".order-content .checkOrder:checked").length;
	if(checkNum==0){
        $.err("请选择订单");
		return;
	}
	var orderId="";
	$(".order-content .checkOrder:checked").each(function(){
		if(orderId==""){
			orderId+=$(this).parents("tr").attr("data");
		}else{
			orderId+=","+$(this).parents("tr").attr("data");
		}
	});
	if(orderId){
		var jsonData={
		  orderIds:orderId
	    };
		$.ajax({
			type : 'POST',
			url : "/purchase/loadPurchaseDetail",
			data : jsonData,
			success : function(result) {
			       $(".emptyTr").remove();
			       $(".orderDetail").html(result);
			       $("#selectOrderModal").modal('hide');
				}
		});
	}
	
}
function showOrderModal(){

	$("#selectOrderModal").modal({
		backdrop:"static"
		
	});
	
}
