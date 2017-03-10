$(function(){
	loadTree();
	
	
});

$('#addModal').on('hidden.bs.modal', function (e) {
//	 window.location.reload();
})

$('#modifyModal').on('hidden.bs.modal', function (e) {
//	 window.location.reload();
})

function loadTree(){
$.jstree.defaults.contextmenu.items={
}
$('#supplierCompanyTree').jstree({
	'core' : {
		'data' : treeData,
		'check_callback':true
	},
	"plugins" : ["contextmenu"]
}
).
bind('select_node.jstree', function(e, data) {     
	 var id=data.node.id;
	 var realName=null;
	 var status=null;
	  var jsonData={
		  supplierCompanyId:id,
		  pageNum:1,
		  numPerPage:10,
		  realName:realName,
		  status:status
	  }
	$("#content").pagination({
		url : "/admin/list/suppliesadmin",
		paramJson : jsonData
	});
});

	  /**
	   * 添加供应商管理员
	   */
$(document).delegate("#addAdmin","click",function(){
	addAdmin();
})	  

function addAdmin(){
	 $('#addModal').modal('show');
}	  	  
	
	
  $("#supplierCompanyTree").on("show_contextmenu.jstree",function(e,data){
	var parentId=data.node.data.parentId;
	if($(".vakata-contextmenu-disabled").length==3){
	  $(".vakata-context").hide();
	}
	if(parentId!=0){
	 $(".vakata-contextmenu-disabled").hide();
	}
	  return true;
	});
}




//bootstrap check
$(document).ready(function() {
    $('.form').bootstrapValidator({
         message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        live: 'enabled',
        message: 'This value is not valid',
        submitButtons: 'button[type="submit"]',
        submitHandler: null,
        fields:{
	        name:{
	            validators:{
	            	notEmpty : {
	                    message : '字段不能为空'
	                }
	            }
	        },
	        realName:{
	            validators:{
	            	notEmpty : {
	                    message : '字段不能为空'
	                }
	            }
	        },
	        password: {
                validators: {
                    notEmpty: {
                        message: '*密码不能为空'
                    }
                }
            },
            _password: {
                validators: {
                    notEmpty: {
                        message: '*确认密码不能为空'
                    },
                    identical: {
                        field: 'password',
                        message: '两次输入密码不一致'
                    }
                }
            }
        }
    });
});


function createCheck(){
	//获取验证表单的对象
	var bootstrapValidator = $("#addForm").data('bootstrapValidator');
	//手动触发表单验证
	bootstrapValidator.validate();
	//如果表单中的所有组件验证都通过则返回true
	return bootstrapValidator.isValid();
}
function modifyCheck(){
	//获取验证表单的对象
	var bootstrapValidator = $("#updateForm").data('bootstrapValidator');
	//手动触发表单验证
	bootstrapValidator.validate();
	//如果表单中的所有组件验证都通过则返回true
	return bootstrapValidator.isValid();
}

$("#addSupplyCompany").click(function(){
	createCheck();
	var name=$("#addModal [name='name']").val();
	var realName=$("#addModal [name='realName']").val();
	var password=$("#addModal [name='password']").val();
	var supplierCompanyId=$("#supplierCompanyId").val();
	var jsonData={
		supplierCompanyId:supplierCompanyId,	
		name:name,
		realName:realName,
		password:password
	}
	
	$.ajax({
		url:'/admin/suppliesAdmin/add',
		type:'POST',
		data:jsonData,
		success:function(data){
				if(data.status=="ok"){
					$.msg("操作成功");
					 var id=supplierCompanyId;
					 var realName=null;
					 var status=null;
					  var jsonData={
						  supplierCompanyId:id,
						  pageNum:1,
						  numPerPage:10,
						  realName:realName,
						  status:status
					  }
					$("#content").pagination({
						url : "/admin/list/suppliesadmin",
						paramJson : jsonData
					});
				}else{
					  $.err(result.status);
				}
				$('#addModal').modal('hide')
		}
	})
})
$("#modifySupplyCompany").click(function(){
	createCheck();
	var dom=$(this).parent().parent();
	var name=dom.find("[name='name']").val()
	var realName=dom.find("[name='realName']").val()
	var id=$("#id").val();
	var jsonData={
		name:name,
		realName:realName,
		id:id
	}
	$.ajax({
		url:'/admin/suppliesAdmin/modify',
		type:'POST',
		data:jsonData,
		success:function(result){
				if(result.status=="ok"){
					$.msg("操作成功");
					var supplierCompanyId=$("#supplierCompanyId").val();
					 var realName=null;
					 var status=null;
					  var jsonData={
						  supplierCompanyId:supplierCompanyId,
						  pageNum:1,
						  numPerPage:10,
						  realName:realName,
						  status:status
					  }
					$("#content").pagination({
						url : "/admin/list/suppliesadmin",
						paramJson : jsonData
					});
				}else{
					  $.err(result.status);
				}
				$('#modifyModal').modal('hide')
		}
	})
})

$(document).delegate(".modifyAdmin","click",
		function(e){
			$("#updateForm")[0].reset();
			dom=$(this).parent().parent();
			var name=dom.find(".name").text();
			var realName=dom.find(".realName").text();
			var supplierCompanyId=$("#supplierCompanyId").val();
			$("#modifyModal [name='name']").val(name);
			$("#modifyModal [name='realName']").val(realName);
			var id=$(this).attr("value");
			$("#id").attr("value",id);
			$("#modifyModal").modal('show');
		}
)

$(document).delegate(".delAdmin","click",
		function(){
			var id=$(this).attr("value");
			var jsonData={
					supplierId:id
				}
				$.ajax({
					url:'/admin/suppliesAdmin/del',
					type:'POST',
					data:jsonData,
					success:function(result){
							if(result.status=="ok"){
								$.msg("操作成功");
								var supplierCompanyId=$("#supplierCompanyId").val();
								 var realName=null;
								 var status=null;
								  var jsonData={
									  supplierCompanyId:supplierCompanyId,
									  pageNum:1,
									  numPerPage:10,
									  realName:realName,
									  status:status
								  }
								$("#content").pagination({
									url : "/admin/list/suppliesadmin",
									paramJson : jsonData
								});
							}else{
								   $.err(result.status);
							}
							$('#modifyModal').modal('hide')
					}
				})
		}
)

$(document).delegate(".block","click",
	function(){
		var status=$(this).text();
		var id=$(this).attr("supId");
		var jsonData={
				supplierId:id	
		}
		if(status=='停用'){
			$.ajax({
				type:'POST',
				url:'/admin/suppliesAdmin/closeAdmin',
				data:jsonData,
				success:function(result){
					if(result.status=="ok"){
						$.msg("操作成功");
						var supplierCompanyId=$("#supplierCompanyId").val();
						 var realName=null;
						 var status=null;
						  var jsonData={
							  supplierCompanyId:supplierCompanyId,
							  pageNum:1,
							  numPerPage:10,
							  realName:realName,
							  status:status
						  }
						$("#content").pagination({
							url : "/admin/list/suppliesadmin",
							paramJson : jsonData
						});
					}else{
						$.err(result.status);
					}
				}
			})
		}else if(status=='启用'){
			$.ajax({
				type:'POST',
				url:'/admin/suppliesAdmin/openAdmin',
				data:jsonData,
				success:function(result){
					if(result.status=="ok"){
						var supplierCompanyId=$("#supplierCompanyId").val();
						 var realName=null;
						 var status=null;
						  var jsonData={
							  supplierCompanyId:supplierCompanyId,
							  pageNum:1,
							  numPerPage:10,
							  realName:realName,
							  status:status
						  }
						$("#content").pagination({
							url : "/admin/list/suppliesadmin",
							paramJson : jsonData
						});
					}else{
						   $.err(result.status);
					}
				}
			})
		}
	}
)