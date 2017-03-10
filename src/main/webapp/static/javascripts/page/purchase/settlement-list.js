$(function(){
	initHtml();
	loadSettlement();
	$("#myTabContent").delegate(".showBillModal","click",showBillModal);
	$("#serachBtn").on("click",loadSettlement);
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
function loadSettlement(){
	var purchaseCode = $("#purchaseCode").val();
	var orderCode=$("#orderCode").val();
	var customsCode=$("#customsCode").val();
	var beginCreateTime= $("#beginCreateTime").val();
	var endPaymentTime= $("#endCreateTime").val();
	var jsonData={
		purchaseCode:purchaseCode,
		orderCode:orderCode,
		customsCode:customsCode,
		beginCreateTime:beginCreateTime,
		endPaymentTime:endPaymentTime,
		pageNum:1,
		pageSize:10
	};
	$("#myTabContent").pagination({
		url:"/settlement/list",
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
	 