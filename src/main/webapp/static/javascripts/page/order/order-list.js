$(function(){
	loadItem();
	initHtml();
	$("#serachBtn").on("click",loadItem);
	$('a[data-toggle="tab"]').on('shown.bs.tab', function(e){
		loadItem();	
	});
	$("#myTabContent").delegate(".deliveryBtn","click",deliveryGoods);
	$("#myTabContent").delegate(".addBatchNoteBtn","click",addBatchNote);
	$("#myTabContent").delegate("#allCheckBox","click",changeAllCheckBox);
	$("#myTabContent").delegate(".orderCheckBox","click",changeCheckBox);
	$("#myTabContent").delegate(".addNoteBtn","click",addNote);
	$("#myTabContent").delegate(".addDeclareBtn","click",addDeclare);
	$("#resetBtn").on("click",reset);
	
	
	
});
function addDeclare(e){
	
	var orderId = $(e.currentTarget).attr("data");
	if(!orderId){
		return;
	}
	var jsonData={
	 orderId:orderId	
	};
	$.ajax({
		type : 'POST',
		url : "/declare/add",
		data : jsonData,
		success : function(result) {
			if(result=="ok"){
				$.msg("支付单申报成功");
				setTimeout(function(){window.location.reload();},2000);
			}else if(result=="failed"){
				$.err("支付单申报失败");
			}else{
			   $.err(result.status);
			}
		}
	});
	
	
	
}
function reset(){
	$("#beginCreateTime").val("");
	$("#endCreateTime").val("");
	$("#beginPaymentTime").val("");
	$("#endPaymentTime").val("");
	$("#itemCode").val("");
	$("#receiverName").val("");
	$("#receiverMobile").val("");
	$("#logisticsCode").val("");
	
	
}
function addNoteRequest(jsonData){
    		$.ajax({
    			type : 'POST',
    			url : "/order/addNote",
    			data : jsonData,
    			success : function(result) {
    				if(result=="ok"){
    					bootbox.hideAll();
    					$.msg("新增成功");
    					setTimeout(function(){window.location.reload();},2000);
    				}else{
    				   $.err(result.status);
    				}
    			}
    		});
	
}
function addNote(){
	var id = $(this).attr("data");
	if(!id)return;
	 bootbox.dialog({
	      title: '新增备注',
			message:'<input class="bootbox-input bootbox-input-text form-control noteInputVal"  type="text">',
	      buttons: {
			 success:{
			  label:'确定',
			  className: 'btn-primary',
			  callback: function() {
			     var v=$(".noteInputVal").val();
			     if(v==""){
			    	$.err("请填写备注内容");
			    	return false;
			     }else{
			    	 var jsonData={
			    	    		note:v,
			    	    		ids:id
			    	   };
			    	 addNoteRequest(jsonData);
			     }
			     return false;
	          }
			 },
			 close:{
			  label:'取消',
			  className: 'btn-default',
			  callback: function() {
	           return;
	          }
			 },
			}
	      
	    });
}
function changeCheckBox(){
	var checkNum=$(this).parents(".tab-pane").find(".orderCheckBox:checked").length;
	var totalNum=$(this).parents(".tab-pane").find(".orderCheckBox").length;
	$(this).parents(".tab-pane").find("#allCheckBox").prop("checked",checkNum==totalNum);
	
}
function changeAllCheckBox(){
	if($(this).is(':checked')){
		$(this).parents(".tab-pane").find(".orderCheckBox").prop("checked",true);
	    }else{
	    $(this).parents(".tab-pane").find(".orderCheckBox").prop("checked",false);
	  }
	
}

function addBatchNote(){
	var ids="";
	$(this).parents(".tab-pane").find(".orderCheckBox:checked").each(function(){
		var v=$(this).val();
		if(ids==""){
			ids+=v;
		}else{
			ids+=","+v
		}
	});
	if(ids==""){
		$.err("请选择你要备注订单");
		return;
	}
	 bootbox.dialog({
	      title: '批量备注',
			message:'<input class="bootbox-input bootbox-input-text form-control noteInputVal"  type="text">',
	      buttons: {
			 success:{
			  label:'确定',
			  className: 'btn-primary',
			  callback: function() {
			     var v=$(".noteInputVal").val();
			     if(v==""){
			    	$.err("请填写备注内容");
			    	return false;
			     }else{
			    	 var jsonData={
			    	    		note:v,
			    	    		ids:ids
			    	   };
			    	 addNoteRequest(jsonData);
			     }
			     return false;
	          }
			 },
			 close:{
			  label:'取消',
			  className: 'btn-default',
			  callback: function() {
	           return;
	          }
			 },
			}
	      
	    });
	
	
}
function showAddModel(id){
    bootbox.dialog({
      title: '新增备注',
		message:'<input class="bootbox-input bootbox-input-text form-control"  type="text">',
      buttons: {
		 success:{
		  label:'确定',
		  className: 'btn-primary',
		  callback: function() {
		     return false;
          }
		 },
		 close:{
		  label:'取消',
		  className: 'btn-default',
		  callback: function() {
           return;
          }
		 },
		}
      
    });
};
function deliveryGoods(e){
	var orderId = $(e.currentTarget).attr("data");
	if(!orderId){
		return;
	}
	window.location.href="/delivery/add?orderId="+orderId;

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
	 
	 $("#beginPaymentTime").datetimepicker({
			language:"zh-CN",
	        todayBtn:  1,
			autoclose: 1,
			format:"yyyy-mm-dd hh:00",
			todayHighlight: 1,
			viewSelect:"day",
			startView: 2,
			minView: 1,
			forceParse: 0
		});
	  
	 $("#endPaymentTime").datetimepicker({
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

function loadItem(){
	 var beginCreateTime =$("#beginCreateTime").val();
	 var endCreateTime =$("#endCreateTime").val();
	 var beginPaymentTime =$("#beginPaymentTime").val();
	 var endPaymentTime =$("#endPaymentTime").val();
	 var status=$("#myTab li.active").attr("data");
	 var code = $("#itemCode").val();
	 var receiverName=$("#receiverName").val();
	 var receiverMobile=$("#receiverMobile").val();
	 var logisticsCode=$("#logisticsCode").val();
	 var jsonData={
			 beginCreateTime:beginCreateTime,
			 endCreateTime:endCreateTime,
			 beginPaymentTime:beginPaymentTime,
			 endPaymentTime:endPaymentTime,
			 status:status,
			 code:code,
			 receiverName:receiverName,
			 receiverMobile:receiverMobile,
			 logisticsCode:logisticsCode,
			 pageSize:5,
			 pageNum:1	
		};
	   console.log(jsonData);
		$("#table"+status).pagination({
			url:"/order/list",
			paramJson:jsonData
		})
}