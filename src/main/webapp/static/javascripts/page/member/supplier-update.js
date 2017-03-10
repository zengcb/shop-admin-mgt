$(function(){
	
	loadPageData();
	$("#memberTable").delegate(".changePwdBtn","click",showChangeModel);
	$("#submitPwdBtn").on("click",submitForm);
	initValidation();
	$(document).delegate("#addAdmin","click",function(){
		showAddModal();
	})	  
   $("#addSupplyCompany").on("click",addAdmin);
	$(document).delegate(".delAdmin","click",deleteAdmin);
	
		
});


function deleteAdmin(e){
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
					    setTimeout(function(){ window.location.reload();},1000);
					}else{
						   $.err(result.status);
					}
			}
		})
	
}

function createCheck(){
	//获取验证表单的对象
	var bootstrapValidator = $("#addForm").data('bootstrapValidator');
	//手动触发表单验证
	bootstrapValidator.validate();
	//如果表单中的所有组件验证都通过则返回true
	return bootstrapValidator.isValid();
}
function addAdmin(){
	var flag=createCheck();
	if(!flag) return;
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
					$('#addModal').modal('hide');
					setTimeout(function(){ window.location.reload();},1000);
				}else{
					  $.err(result.status);
				}
				
		}
	})
}
	
	
function showAddModal(){
	 $('#addModal').modal('show');
}
function submitForm(){
	var bootstrapValidator = $("#changePwdForm").data('bootstrapValidator');
	bootstrapValidator.validate();
	if(!bootstrapValidator.isValid()){
		return false;
	}
	var supplierId=$("#supplierId").val();
	var oldPwd=$("#oldPwd").val();
	if(!supplierId){
		return;
	}
	var newPwd=$("#newPwd1").val();
	var jsonData={
			supplierId:supplierId,
			oldPwd:oldPwd,
			newPwd:newPwd
	};
	$.ajax({
		type:'post',
		url:'/supplier/password/change',
		data:jsonData,
		success:function(result){
			if(result=="ok"){
				$.msg("密码修改成功");
				$("#passwordModal").modal("hide");
			}else if(result=="errorPwd"){
				$.err("原始密码错误");
			}else if(result=="noSupplier"){
				$.err("该用户不存在");
			}else{
				$.err(result);
			}
		}
	})
}
function showChangeModel(e){
	var id=$(e.currentTarget).parents("tr").attr("data");
	var supplierName=$(e.currentTarget).parents("tr").find("td:eq(0)").html();
	$("#passwordModal #supplierName").html(supplierName);
	$("#passwordModal #supplierId").val(id);
	clearModal();
    $("#passwordModal").modal({
    	backdrop:"static"
    });	
    $("#passwordModal").on('show.bs.modal',function(){
    	$("#changePwdForm").data('bootstrapValidator').resetForm();
    })
}
function loadPageData(){
	var supplierCompanyId=$("#supplierCompanyId").val();
	if(!supplierCompanyId){return;}
	var jsonData={
			pageNum:1,
			pageSize:5,
			supplierCompanyId:supplierCompanyId,
	}
	
	$("#memberTable").pagination({
		url:"/supplier/loadSupplierMember",
		paramJson:jsonData
	})
}
function clearModal(){
	$("#passwordModal .required").each(function(){
		$(this).val("");
	});
	$("#changePwdForm").data('bootstrapValidator').resetForm();
}
function checkRequiredVal(){
	var flag=true;
	$("#passwordModal .required").each(function(){
		var v = $(this).val();
		if(v==""){
			$(this).addClass("error");
			flag=false;
		}else{
			$(this).removeClass("error");
		}
		
	});
	return flag;
	
}

function initValidation(){
	
    $('#changePwdForm').bootstrapValidator({
        message: 'This value is not valid',
       feedbackIcons: {
           valid: 'glyphicon glyphicon-ok',
           invalid: 'glyphicon glyphicon-remove',
           validating: 'glyphicon glyphicon-refresh'
       },
       live: 'enabled',
       message: 'This value is not valid',
       submitHandler: null,
       fields:{
    	  oldPwd:{
               validators:{
               	notEmpty : {
                       message : '原始密码不能为空'
                   }
               }
           },
           newPwd1:{
               validators:{
               	notEmpty : {
                       message : '新密码不能为空'
                   }
               }
           },
           newPwd2: {
           	validators: {
	            	notEmpty: {
	            		message: '确认密码不能为空'
	            	},
	            	identical: {
	            		field: 'newPwd1',
	            		message: '两次输入密码不一致'
           		}
           	}
           }
       }
   });
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
}