$(function(){
  $("#itemId").on("change",loadItemDetail);
  $(".updateItemBtn").on("click",submitUpdateItem);
  initFormValidation();
  $('#itemId').select2({
	  language: "zh-CN"
  });
});
function submitUpdateItem(){
	  var isActive=true;
	  $('#updateItemForm').data('bootstrapValidator').validate();
	  var isActive=$("#updateItemForm").data('bootstrapValidator').isValid();
	  if(isActive){
		  var jsonData=$("#updateItemForm").serialize();
			$.ajax({
				type : 'POST',
				url : "/recommendation/update",
				data : jsonData,
				success : function(result) {
					if(result.status=="ok"){
						$.msg("保存成功");
						setTimeout(function(){window.location.href="/recommendation/list"},2000);
					}else{
					   $.err(result.status);
					}
				}
			});	
		  
	  }
	
	
}
function loadItemDetail(e){
	var itemId = $(e.currentTarget).val();
	if(!itemId){
		return;
	};
	$("#itemName").val($("#itemId").find("option:selected").text());
	var jsonData={
	  itemId:itemId	
	};
	$.ajax({
		type : 'POST',
		url : "/recommendation/loadItemDetail",
		data : jsonData,
		success : function(result) {
			console.log(result);
			if(result.status=="ok"){
				var data=result.data;
				$("#gPrice").val((Number(data.mprice)/100).toFixed(2));
				$("#buyPrice").val((Number(data.buyPrice)/100).toFixed(2));
				$("#gPriceVal").val(data.mprice);
				$("#buyPriceVal").val(data.buyPrice);
				$("#itemPic").val(data.imagePath);
				var imgArray = data.itemImageList;
				for(var i=0;i<imgArray.length;i++){
					var imgObj=imgArray[i];
					if(imgObj.canDefault==1){
						$("#itemPic").val(imgObj.imagePath);
						$("#itemPicSrc").attr("src",imgUrl+"/"+imgObj.imagePath);
						
					}
				}
			}else{
			   $.err(result.status);
			}
		}
	});	
	
}


function initFormValidation(){
	
	$('#updateItemForm').bootstrapValidator({
        message: '字段不能为空',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: null,
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
        	itemId: {
                validators: {
                    notEmpty: {
                        message: '商品名称不能为空'
                    }
				 }
                },
                buyPrice: {
                    validators: {
                        notEmpty: {
                            message: '购买价不能为空'
                        }
    				 }
                    },
                gPrice: {
                    validators: {
                        notEmpty: {
                            message: '德国价不能为空'
                        }
    				 }
                    },
              sortFlag: {
            	message : "序号不能为空",
	            validators: {
	                notEmpty: {
	                    message: '序号不能为空'
	                },
	                regexp : {
						regexp : "^(([1-9]{1}\\d*)|([1-9]{1}))?$",
						message : '序号格式错误'
					},
	            }
	       }
		}
    });
	
	
	
}