$(function(){
	initHtml();
	loadPurchase();
	$("#serachBtn").on("click",loadPurchase);
	$("#addPurchaseBtn").on("click",goToAddPage);
	$("#myTabContent").delegate(".showCostomsModal","click",showCostomsModal);
	$("#myTabContent").delegate(".showBillModal","click",showBillModal);
	$(".addCustomsBtn").on("click",addCustoms);
	$(".addBillBtn").on("click",addBill);
	$("#supplierCompanyId").on("change",changeSupplierName);
});
function addBill(){
	var supplierId=$("#supplierCompanyId").val();
	if(!supplierId){
		$.err("请选择部门");
	    return;
	}
	var jsonData=$("#billForm").serialize();
	var purchaseId= $("#billForm .purchaseOrderId").attr("data");
	$.ajax({
		type : 'POST',
		url : "/paymentBill/add",
		data : jsonData,
		success : function(result) {
		      if(result=="ok"){
		    	  $.msg("结算成功");
		    	  $("#billModal").modal("hide");
		    	  setTimeout(function(){window.location.reload();},1000);
		    	  //$("td[data="+purchaseId+"]").find(".showBillModal").remove();
		      }else{
		    	  $.err(result);
		      }
			}
	});
	
}
function changeSupplierName(e){
	var text=$("#supplierCompanyId").find("option:selected").text();
	$("#supplierCompanyName").val(text);
}
function addCustoms(){
	var code = $("#costomsModal #code").val();
	if(!code){
		$.err("请填写海关批次号");
		return;
	}
	var jsonData = $("#costomsForm").serialize();
	var purchaseId= $("#costomsForm .purchaseOrderId").val();
	$.ajax({
		type : 'POST',
		url : "/customs/add",
		data : jsonData,
		success : function(result) {
		      if(result=="ok"){
		    	  $.msg("关联海关批次号成功");
		    	  $("#costomsModal").modal("hide");
		    	  setTimeout(function(){window.location.reload();},1000);
		    	  //$("td[data="+purchaseId+"]").find(".showCostomsModal").remove();
		      }else{
		    	  $.err(result);
		      }
			}
	});
}
function showCostomsModal(e){
	var target=$(e.currentTarget).parents("td");
	var purchaseId=target.attr("data");
	var purchaseCode=target.attr("code");
	if(!purchaseId) return;
	$("#costomsModal .purchaseOrderId").val(purchaseId);
	$("#costomsModal .purchaseCode").val(purchaseCode);
	$("#costomsModal").modal({
		backdrop:"static"
	});
}
function showBillModal(e){
	var target=$(e.currentTarget).parents("td");
	var purchaseId=target.attr("data");
	var purchaseCode=target.attr("code");
	var num=target.attr("rowspan");
	var money=target.attr("money");
	if(!purchaseId) return;
	$("#billForm .purchaseOrderId").val(purchaseId);
	$("#billForm .purchaseCode").val(purchaseCode);
	$("#billForm .purchaseOrderId").val(purchaseId);
	$("#billForm .purchaseCode").val(purchaseCode);
	$("#billForm #priceStr").val(money);
	$("#billForm #num").val(num);
	$("#billModal").modal({
		backdrop:"static"
	});
}
function goToAddPage(){
	window.location.href="/purchase/add";
}
function loadPurchase(){
	var purchaseCode = $("#purchaseCode").val();
	var orderCode=$("#orderCode").val();
	var beginCreateTime= $("#beginCreateTime").val();
	var endPaymentTime= $("#endCreateTime").val();
	var jsonData={
		purchaseCode:purchaseCode,
		orderCode:orderCode,
		beginCreateTime:beginCreateTime,
		endPaymentTime:endPaymentTime,
		pageNum:1,
		pageSize:10
	};
	$("#myTabContent").pagination({
		url:"/purchase/list",
		paramJson:jsonData
	})
	
	console.log(jsonData);
}
function initHtml(){
	 $("#beginCreateTime").datetimepicker({
			language:"zh-CN",
	        todayBtn:  1,
			autoclose: 1,
			format:"yyyy-mm-dd hh:00",
			todayHighlight: 1,
			startView: 2,
			minView: 1,
			forceParse: 0
		});
	 
	 $("#endCreateTime").datetimepicker({
			language:"zh-CN",
	        todayBtn:  1,
			autoclose: 1,
			format:"yyyy-mm-dd hh:00",
			todayHighlight: 1,
			startView: 2,
			minView: 1,
			forceParse: 0
		});
	 
}
	 