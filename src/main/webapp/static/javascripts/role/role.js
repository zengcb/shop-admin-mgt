
var currentObj;

$("#search").click(function(){
	param.name=$("#search_name").val();
	queryDataList();
});

function getIds(data, id, arr)
{
	$(deptOptions).each(function(key,obj){
		if(id == obj.parentId)
		{
			arr[arr.length]=obj.id;
			arr = getIds(deptOptions,obj.id,arr);
		}
	});
	return arr;
}

//获得表单对象
function getEmpData()
{
	return {
	id:$("#id").val(),
	name:$("#name").val(),
	sex:$("input[name=sex]:checked").val(),
	phone:$("#phone").val(),
	fax:$("#fax").val(),
	mobile:$("#mobile").val(),
	email:$("#email").val(),
	qq:$("#qq").val(),
	skype:$("#skype").val(),
	im:$("#im").val(),
	status:$("#status").val(),
	address:$("#address").val(),
	postcode:$("#postcode").val(),
	photoURL:$("#photoURL").val(),
	roleId:$("#roleId").val(),
	userName:$("#username").val(),
	password:$("#password").val(),
	manager:$("#manager").prop("checked"),
	superAdmin:$("#superAdmin").prop("checked")
	};		
}
//清空表单对象
function cleanEmpTable()
{
	$("#id").val("");
	$("#name").val("");
	$("input[name=sex]").each(function(){
		if($(this).val() == 1)
		{
			$(this).prop("checked","checked");
		}
	});
	$("#phone").val("");
	$("#fax").val("");
	$("#mobile").val("");
	$("#email").val("");
	$("#qq").val("");
	$("#skype").val("");
	$("#im").val("");
	$("#address").val("");
	$("#postcode").val("");
	$("#photoURL").val("");
	$("#status").val(0);
	//$("#roleId").val("");
	$("#username").val("");
	$("#password").val("");
	$("#manager").prop("checked","");
	$("#superAdmin").prop("checked","");
}
//添加只读
function addReadonly()
{
	$("#name").attr("readonly","readonly"); 
	$("#username").attr("readonly","readonly"); 
}
//去除警告弹框
$("#warningDismiss").click(function(){
	$("#modals-alerts-warning").hide("fade");
});
//显示警告弹框
function waringAlert(message)
{
	$("#modals-alerts-warning").show("fade");
	$("#modals-alerts-warning").find("#message").text(message);		
}
//移动角色提交
$("#moveBtn").click(function(){
		var dept = getDept(param.id);
		ajaxData("/role/role_move.htm" , {
			roleId:dept.id,
			parentId:$("#deptSelect").val(),
			oldParentId:dept.parentId,
		} , function(){window.location.href="/employee/list.htm"});
});

//获得角色信息
function getDept(id)
{
	var dept = "";
	$(deptOptions).each(function(k,v){
		if(id == v.id)
		{
			dept = v;
		}
	});
	return dept;
}
//移除角色弹层显示
$("#moveSubDepartmentBtn").click(function () {
	if(param.id == null || param.id == "" || param.id == 0)
	{
		waringAlert("请选择角色");
	}
	else
	{
        $("#move-sub-role").modal("show");
		$("#deptName").val(getDept(param.id).name);
		$("#deptSelect").empty();
		$("#deptSelect").append(new Option("根节点",0));
		
		//var ids = getdeptSubsId(param.id)
		var ids = getIds(deptOptions,param.id,[param.id]);
		var optionsData = new Array();
		
		$(deptOptions).each(function(k,v){
			var flag = true;
			$(ids).each(function(idk,idv){
    			if(idv == v.id)
    			{
					flag = false;
    			}
			});
			if(flag)
			{
				optionsData[optionsData.length] = v;
			}
		});
		
		setTreeData(optionsData,0)				
		
	}
});


function setTree(data, id)
{
	$(data).each(function(k,v){
		if(v.parentId == id)
		{
			$("#roleId").append(new Option(getTreeStr(v.code) + v.name,v.id));	
			setTree(data, v.id);
		}
	});
}

setTree(deptOptions, 0);



function setTreeData(data, id)
{
	$(data).each(function(k,v){
		if(v.parentId == id)
		{
			$("#deptSelect").append(new Option(getTreeStr(v.code) + v.name,v.id));	
			setTreeData(data, v.id);
		}
	});
}

function getTreeStr(code)
{
	var str = "";
	for(var i = 0; i <code.length/2; i ++)
	{
		str += " |===";
	}
	return str;
}


//修改角色弹层显示
$("#updateDepartmentBtn").click(function () {
	if(param.id == null || param.id == "" || param.id == 0)
	{
		waringAlert("请选择角色");
	}
	else
	{	
        roleShow("修改角色")
		var dept = getDept(param.id);
		$("#role_modify_id").val(param.id);
		$("#role_modify_name").val(dept.name);
		$("#role_modify_remark").val(dept.remark);
	}
});
//创建角色弹层显示
$("#createSubRoleBtn").click(function () {
	roleShow("新增角色")
	$("#role_modify_id").val("");
	$("#role_modify_name").val("");
	$("#role_modify_remark").val("");
});
//角色表单添加验证
function roleShow(message)
{	
	$("#role_div").modal("show");
	$("#deptModalLabel").text(message);
	$("#role").find(".check").removeClass("ignore");

}
//角色表单去除验证
function roleHide()
{
	$("#role").find(".check").addClass("ignore");
}


//设置用户弹层显示
$("#setUserBtn").click(function () {
	if(param.id == null || param.id == ""|| param.id == 0)
	{
		waringAlert("请选择角色");
	}
	else
	{	
		//$('#password').rules('add',{required: true});
		//$('#password').attr('placeholder','');
        $("#modal-sizes-2").modal("show");
		cleanEmpTable();
		$("#name").removeAttr("readonly");
		$("#username").removeAttr("readonly");
		$("#userModalLabel").text("选择用户");
		$("#roleId").val(param.id);
		
		$("#hiddenId").val(param.id);
		$("#commonType").val("role");
	}
});

var refreshDeptData = function(id)
{
	$("#search_name").val("");
	$("#roleId").val(id);
	param.roleId=id;
	if(id != 0)
	{
    	var dept = getDept(id);	
    	$("#role_name").text(dept.name);
    	$("#role_remark").text(dept.remark);
		$("#role_remove").empty().append(bindDeptDisbled(dept.disabled, id));
	}
	queryDataList();
}

param.code="";
param.isSubdept=true;
//角色树
$('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
$('.roleTree li.parent_li > span').on('click', function (e) {
	$('.bg-default').removeClass('bg-default');
	$(this).addClass('bg-default');
	param.code = $(this).next().attr("data-code");
	param.page = 1;
	param.name = "";
	param.id = $(this).next().attr("data-id");
	refreshDeptData($(this).next().attr("data-id"));
	currentObj = this;
});

function bindDeptDisbled(disabled, deptId)
{
	var label = null;
	var url = "/role";
	label = $("<label>").addClass("btn btn-sm btn-danger").text("删除角色");
	url += "/role_remove.htm";
	$(label).click(function(){
		ajaxData(url, {id:deptId}, function(data){
					if(data){
						alert("删除角色成功!");
					} else {
						alert("该角色下包含子角色，删除角色失败!");
					}
					window.location.href="/role/list.htm"
				});
	});
	return label;
}


/*$('.roleTree li.parent_li > i').on('click', function (e) {
	if ($(this).hasClass("fa-folder"))
	{
		$(this).removeClass('fa-folder').addClass('fa-folder-open');
	}
	else if($(this).hasClass("fa-folder-open"))
	{
		$(this).addClass('fa-folder').removeClass('fa-folder-open');
	}
  var children = $(this).parent('li.parent_li').find(' > ul > li');
  if (children.is(":visible")) {
      children.hide('fast');
      $(this).attr('title', 'Expand this branch');
  } else {
      children.show('fast');
      $(this).attr('title', 'Collapse this branch');
  }
});*/

$("#treeTitle").unbind().click(function(){
	$('.bg-default').removeClass('bg-default');
	$(this).addClass('bg-default');
	param.id=0;
	param.name="";
	param.code="";
	$("#role_name").text("所有角色");
	$("#dept_priority").text(0);
	$("#role_remove").empty();
	queryDataList();
});
//查询员工表单
function queryDataList()
{
	ajaxData("/role-employee/emp_list.htm", param, showDataList);
}
//ajax方法封装
function ajaxData(actionUrl, paramters, fun) {
  	$.ajax({
  		type : "post",
  		dataType : "json",
  		url : actionUrl,
  		timeout : 10000,
  		data : paramters,
  		success : function(msg) {
			if(msg instanceof Object)
			{
				fun(data);
			}
			else
			{
      			var data = eval('('+msg+')');
				fun(data)
			}
  		}
  	});
  };
 
var empTrTemp = $("#dataListBody tr");
$(empTrTemp).find("td:last").find(".delete-role").click(function(){
	deleteTR(this);
});
var empTr = $(empTrTemp).clone(true);
$("#dataListBody").empty();
//查询的员工数据装入TABLE
function showDataList(data)
{
	setPaginateResult(data);
	$("#dataListBody").empty();	
	var list = data.recordList;
	var managers = "";
	if(list == null || list.length == 0)
	{	tr = "<tr><td clospan='9' text-algin='center'>此角色暂无员工！！</td></tr>"
		$("#dataListBody").append(tr);
		$("#batchDeleteBtn").hide();
	} else {
		$("#batchDeleteBtn").show();
	}
	$(list).each(function(k,v){
		if(v.manager)
		{
			managers += v.name + "&nbsp;&nbsp;";
		}
		var tr = empTr.clone(true);
		var checkboxObj = $(tr).find("td:eq(0)").find(":checkbox");
		$(checkboxObj).attr("data-userid",v.id);
		$(checkboxObj).attr("data-roleid",$("#roleId").val());
		$(tr).find("td:eq(1)").text(v.userName);
    	$(tr).find("td:eq(2)").text(v.name);
		$(tr).find("td:eq(3)").text(v.phone);
		$(tr).find("td:eq(4)").text(v.email);
		$(tr).find("td:eq(5)").text(getDept($("#roleId").val()).name);
		$(tr).find("td:eq(6)").text(v.superAdmin?"是":"否");
		var status = v.status;
		var desc = "";
		if (status == 0){
			desc = "正常";
		} else if (status == 1){
			desc = "停用";
		} else if (status == 9){
			desc = "离职";
		}
		$(tr).find("td:eq(7)").text(desc);
		$(tr).find("td:eq(8)").find("input").attr("data-id",v.id);
		
    	$("#dataListBody").append(tr);
	});
	$("#dept_manager").html(param.id==0? "" : managers);
}
var validate = $("#emp_form").validate({
    ignore: '.ignore',
    focusInvalid: false,
    rules: {
        'username': {
            required: true,
			rangelength:[3,20]
        },
        'name': {
            required: true,
			maxlength:[10]
        },
		'password':{
			required: true,
			rangelength:[6,20]
		}
    },
	messages:{
		'name': {
            required: "必填",
			maxlength:"长度最多是10的字符串"
        },
        'username': {
            required: "必填",
			rangelength:"长度必须介于 3 和 20 之间"
        },
		'password':{
			required: "必填",
			rangelength:"长度必须介于 6 和 20 之间"
		}
		
	},
    submitHandler: function () {
		var obj = getEmpData();
		var url = "/employee/add.htm";
		if(obj.id != null && obj.id != "")
		{
			url = "/employee/modify.htm"
		}
		ajaxData(url , obj , function(){$("#create_user_cancel_modal").click();queryDataList()});
    }
});

var validate1 = $("#role_form").validate({
    ignore: '.ignore',
    focusInvalid: false,
    rules: {
        'name': {
            required: true,
			maxlength:[50]
        }
    },
	messages:{
		'name': {
            required: "必填",
			maxlength:"长度最多是50的字符串"
        }
		
	},
    submitHandler: function () {
		var role_id = $("#role_modify_id").val();
		var role_remark = $("#role_modify_remark").val();
		var url = "/role/add.htm";
		if(role_id != null && role_id != "")
		{
			url = "/role/modify.htm"
		}
		ajaxData(url , 
		{id:role_id,name:$("#role_modify_name").val(),remark:$("#role_modify_remark").val()},
		function(){window.location.href="/role/list.htm"});
    }
});

$("#checkAll").click(function () {
    var isChecked = $(this).prop("checked");
    $(".subCheckbox").prop("checked", isChecked);
})

// 点击【删除】按钮删除一条
function deleteTR(obj)
{
	var employeeId = $(obj).parent().parent().children().eq(0).find(":checkbox").attr("data-userid");
	var roleId = $(obj).parent().parent().children().eq(0).find(":checkbox").attr("data-roleid");
	ajaxData("/role-employee/role-employee_remove.htm",{"roleId": roleId, "employeeId": employeeId}, function(){
		//window.location.href="/role/list.htm";
		// 删除成功
		$(obj).parent().parent().remove();
	});
}

// 批量删除
$("#batchDeleteBtn").click(function(){
    var ids = "";
    $(".subCheckbox").each(function (i, ck) {
        if ($(ck).prop("checked") === true) {
            ids += $(ck).attr("data-userid")+",";
        }
    })
    if (ids.length > 0) {
    	var roleId = $("#roleId").val();
    	ajaxData("/role-employee/role-employee_remove_batch.htm",{"employees": ids, "roleId": roleId}, function(){
    		//window.location.href="/role/list.htm";
    		// 删除成功
    		//$(obj).parent().parent().remove();
    		$(currentObj).click();
    	});
    } else {
        alert("您必须至少选选择一个用户进行删除。")
    }
})

// 获得已有存在的userid
// TODO: 查询该角色下的所有用户，再考虑。（目前从页面上直接取）
function getExistedUserId(){
	var list = new Array();
	
	$("#dataListBody tr").each(function(){
		var userId = $(this).find(".subCheckbox").attr("data-userid");
		list.push(userId);
	});
	
	return list;
}