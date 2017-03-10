$(function(){
	loadTree();
	
	
});

$('#addModal').on('hidden.bs.modal', function (e) {
	 window.location.reload();
})

$('#modifyModal').on('hidden.bs.modal', function (e) {
	 window.location.reload();
})

function loadTree(){

	  $.jstree.defaults.contextmenu.items={
			  "create":{
			   "label":"创建供应商",
			   "_disabled":function(data){
				   var id=$.jstree.reference(data.reference).get_node(data.reference).id;
				   if(id=="0"){
					   return false;
				   }
				   return true;
			   },
			    "action":function(data){
			     $('#addModal').modal('show');
				}
			  },
			  
			  "rename":{
	    		  "label":"修改供应商信息",
	    		  "_disabled":function(data){
					   var id=$.jstree.reference(data.reference).get_node(data.reference).id;
					   if(id=="0"){
						   return true;
					   }
					   return false;
				   },
	    		  "action":function(data){
	    			  var id=$.jstree.reference(data.reference).get_node(data.reference).id;
	    			  
	    			  var jsonData={id:id}
	    			  $.ajax({
	    				  url:'/admin/suppliescompany/id',
	    				  type:'POST',
	    				  data:jsonData,
	    				  success:function(data){
	    					  if(data.status=='success'){
	    						  $("#modifyModel input[name='name']").val(data.name);
	    						  $("#modifyModel input[name='linker']").val(data.link);
	    						  $("#modifyModel input[name='linkerPhone']").val(data.linkerPhone);
	    						  $("#modifyId").val(id);
	    					  }
	    				  }
	    			  })
	    			  
	    			  $("#modifyModel").modal('show');
	    			  
	    		  }
			  
			  },
			  "remove":{
			   "label":"删除供应商",
			   "_disabled":function(data){
				   var id=$.jstree.reference(data.reference).get_node(data.reference).id;
				   var childSize=$.jstree.reference(data.reference).get_node(data.reference).children.length;
				   if(id=="0"||childSize>0){
					   return true;
				   }
				   return false;
			   },
			     "action": function (data) {
			    	 var id=$.jstree.reference(data.reference).get_node(data.reference).id;
			    	 var jsonData={id:id}
			    	 $.ajax({
			    		 type:'POST',
			    		 data:jsonData,
			    		 url:'/admin/suppliescompany/del',
			    		 success:function(data){
			    			 if(data=="处理成功"){
			    				 $.msg(data);
			    				 window.location.reload();
			    			 }else{
			    				 $.err(data);
			    			 }
			    		 }
			    	 })
				}
			  }
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
	 //.get_node(data.reference).id;
	  
	  var jsonData={id:id}
	  $.ajax({
		  url:'/admin/suppliescompany/id',
		  type:'POST',
		  data:jsonData,
		  success:function(data){
			  if(data.status=='success'){
				  $(".panel").show();
				  $("#companyDetailDiv").show();
				  $("#gys").text(data.name);
				  $("#lxr").text(data.link);
				  $("#lxdh").text(data.linkerPhone);
				  if(data.status==0){
					  $("#companystatus").text("启用");
				  }else{
					  $("#companystatus").text("停用");
				  }
				  if(data.supstatus==0){
					  $("#status a").remove()
					  $("#status").append(" <a value='0'>停用</a>");

				  }else{
					  $("#status a").remove()
					  $("#status").append(" <a  value='1'>启用</a>");
				  }
				  $("#supId").val(data.id);
			  }
		  }
	  })
});

	
$(document).delegate('.block','click',function(e){
	var id=$("#supId").val();
	var status=$(this).text();
	var dom=$(this);
	var jsonData={
			id:id
		}
	if(status=='启用'){
		$.ajax({
			type:'POST',
			url:'/admin/suppliescompany/openStatus',
			data:jsonData,
			success:function(data){
				if(data=='处理成功'){
					$.msg(data);
					dom.text("停用");
					dom.parent().parent().find("#companystatus").text("启用");
				}else{
					$.err(data);
				}
			}
		})
	}else if(status=='停用'){
		$.ajax({
			type:'POST',
			url:'/admin/suppliescompany/closeStatus',
			data:jsonData,
			success:function(data){
				if(data=='处理成功'){
					$.msg(data);
					dom.text("启用");
					dom.parent().parent().find("#companystatus").text("停用");
				}else{
					$.err(data);
				}
			}
		})
	}
});
	
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

$("#addSupplyCompany").click(function(){
	var checkFlag=check();
	if(!checkFlag){
		return false;
	}
	var name=$("#addModal [name='name']").val();
	var linker=$("#addModal [name='linker']").val();
	var linkerPhone=$("#addModal [name='linkerPhone']").val();
	//如果检查不通过return
	var jsonData={
		name:name,
		linker:linker,
		linkerPhone:linkerPhone
	}
	$.ajax({
		type:'POST',
		url:'/admin/suppliescompany/add',
		data:jsonData,
		success:function(data){
			if(data=='处理成功'){
				$.msg("添加成功");
				$('#addModal').modal('hide');
			}else{
				$.err(data);
			}
		}
	})
})

$("#modifySupplyCompany").click(function(){
	var checkFlag=check();
	if(!checkFlag){
		return false;
	}
	var name=$("#modifyModel  [name='name']").val();
	var linker=$("#modifyModel  [name='linker']").val();
	var linkerPhone=$("#modifyModel  [name='linkerPhone']").val();
	var id=$("#modifyId").val();
	//如果检查不通过return
	var jsonData={
		id:id,
		name:name,
		linker:linker,
		linkerPhone:linkerPhone
	}
	$.ajax({
		type:'POST',
		url:'/admin/suppliescompany/modify',
		data:jsonData,
		success:function(data){
			if(data=='处理成功'){
				$.msg(data);
				$('#modifyModal').modal('hide');
			}else{
				$.err(data);
			}
			
			window.location.reload();
		}
	})
})

//bootstrap check
$(document).ready(function() {
    $('#form').bootstrapValidator({
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
	        linker:{
	            validators:{
	            	notEmpty : {
	                    message : '字段不能为空'
	                }
	            }
	        },
	        linkerPhone:{
	            validators:{
	            	notEmpty : {
	                    message : '字段不能为空'
	                }
	            }
	        },
        }
    });
});


function check(){
	//获取验证表单的对象
	var bootstrapValidator = $("#form").data('bootstrapValidator');
	//手动触发表单验证
	bootstrapValidator.validate();
	//如果表单中的所有组件验证都通过则返回true
	return bootstrapValidator.isValid();
}