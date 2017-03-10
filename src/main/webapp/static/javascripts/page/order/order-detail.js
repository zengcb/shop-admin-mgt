$(function(){
	
});

function initHtml(){
	 $("#beginCreateTime").datetimepicker({
			language:"zh-CN",
	        todayBtn:  1,
			autoclose: 1,
			format:"yyyy-mm-dd hh:ii",
			todayHighlight: 1,
			startView: 2,
			minView: 0,
			forceParse: 0
		});
	 
	 $("#endCreateTime").datetimepicker({
			language:"zh-CN",
	        todayBtn:  1,
			autoclose: 1,
			format:"yyyy-mm-dd hh:ii",
			todayHighlight: 1,
			startView: 2,
			minView: 0,
			forceParse: 0
		});
	 
	 $("#beginPaymentTime").datetimepicker({
			language:"zh-CN",
	        todayBtn:  1,
			autoclose: 1,
			format:"yyyy-mm-dd hh:ii",
			todayHighlight: 1,
			startView: 2,
			minView: 0,
			forceParse: 0
		});
	  
	 $("#endPaymentTime").datetimepicker({
			language:"zh-CN",
	        todayBtn:  1,
			autoclose: 1,
			format:"yyyy-mm-dd hh:ii",
			todayHighlight: 1,
			startView: 2,
			minView: 0,
			forceParse: 0
		});
	 
}

function loadItem(){
	 var beginCreateTime =$("#beginCreateTime").val();
	 var endCreateTime =$("#endCreateTime").val();
	 var beginPaymentTime =$("#beginPaymentTime").val();
	 var endPaymentTime =$("#endPaymentTime").val();
	 var status=$("#myTab li.active").attr("data");
	 var code = $("#itemCode").val();
	 var jsonData={
			 beginCreateTime:beginCreateTime,
			 endCreateTime:endCreateTime,
			 beginPaymentTime:beginPaymentTime,
			 endPaymentTime:endPaymentTime,
			 status:status,
			 code:code,
			 pageSize:5,
			 pageNum:1	
		};
	   console.log(jsonData);
		$("#table"+status).pagination({
			url:"/order/list",
			paramJson:jsonData
		})
}