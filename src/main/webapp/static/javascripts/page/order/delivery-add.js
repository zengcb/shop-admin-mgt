$(function(){
	
  $(".addDeliveryBtn").on("click",submitDelivery);
  $(".cloneDeliveryBtn").on("click",cloneDelivery);
});

function cloneDelivery(e){
	var target = $(e.currentTarget).parents(".form-horizontal").find(".clone-group");
	var newTarget = target.clone().removeClass("clone-group");
	newTarget.find("input[type='text']").val('');
	target.after(newTarget);
}

function submitDelivery(){
	changeIndex();
	var jsonData=$("#addForm").serialize();
	$.ajax({
		type : 'POST',
		url : "/delivery/add",
		data : jsonData,
		success : function(result) {
		    var status=result.msg;
		    var num=result.num;
			if(status=="ok"){
			   if(num==0){
				   $.err("未填写任何配送信息");
			   }else{
				   $.msg("保存"+num+"条配送信息成功");
				   setTimeout(function(){window.location.href="/delivery/list";},2000);
			   }
		    }else{
		      $.err(result.msg);
		    }			
		}
	});
	
}

function changeIndex(){
	  $("#addForm .delivery-detail").each(function(i){
		 var target =$(this);
		 target.find("input[type='text']").each(function(j){
			 var name = $(this).attr("name").replace(/[+\d+]/,i);
			 $(this).attr("name",name);
		  });
		  target.find("input[type='hidden']").each(function(k){
			  var name = $(this).attr("name").replace(/[+\d+]/,i);
			  $(this).attr("name",name);
		  });
		  target.find("select").each(function(k){
			  var name = $(this).attr("name").replace(/[+\d+]/,i);
			  $(this).attr("name",name);
		  });
		});
	
}
