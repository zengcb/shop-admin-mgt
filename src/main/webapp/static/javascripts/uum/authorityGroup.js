var currentObj;
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

$("#updateAuthorityGroupBtn").click(function(){
	if(groupId == "")
	{
		waringAlert("请选择修改的权限组！");
	}
	else
	{
		$("#authorityGroup").modal("show");
		$("#authorityGroupModalLabel").text("修改权限组");

	}
});

$("#menuBtn").click(function(){
	if(groupId == "")
	{
		waringAlert("请选择修改的权限组！");
	}
	else
	{
		$("#menu").modal("show");
    	ajaxData("/authority_group/menu.htm",{"groupId": groupId}, setMenuDetailTreeData);
	}

});

$("#createAuthorityGroupBtn").click(function(){
	groupId = "";
    $("#authorityGroup").modal("show");
    $("#authorityGroupModalLabel").text("新增权限组");
    $("#authorityGroup").find("#name").val("");

});

$("#setMenuGroupBtn").click(function(){
	if(groupId == "")
	{
		waringAlert("请选择修改的权限组！");
	}
	else
	{
		$("#modal-sizes-2").modal("show");
		$("#commonType").val("group");
		$("#hiddenId").val(groupId);
	}
});

//树
$('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
$('.authority_group span').on('click', function (e) {
	$('.bg-default').removeClass('bg-default');
	$(this).addClass('bg-default');
	groupId = $(this).next().attr("data-id");
	$("#authorityGroup").find("#name").val($(this).next().attr("data-name"));
	$("#deleteAuthorityGroupBtn").show();
	ajaxData("/authority_group/menu.htm",{"groupId": groupId}, showData);
	queryUserDataList();
	currentObj = this;
});

$('.deptTreeMenu li.parent_li > i').on('click', function (e) {
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
  queryUserDataList();
});



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
  

function showData(obj)
{
	$("#dataList").empty();
	$(obj).each(function(index,id){
		$(menus).each(function(k,v){
			if(id == v.id)
			{
				$("#dataList").append("<tr><td>"+ v.name +"</td><td>"+ v.url +"</td></tr>");
    			}
    		});
    	});
    }
  //个人权限展示
function setMenuDetailTreeData(data)
{
	$(".tree-checkbox").prop("checked",false)
	$(data).each(function(key, v){
		$(".tree-checkbox").each(function(index,item){
			if($(item).val() == v)
			{	
				 $(item).prop("checked",true);
			}
		});
	});
}

$(".tree-checkbox").click(function(){
	var checkboxes = $(this).parent().parent().find(".tree-checkbox");
	var check = $(this).prop("checked");
	$(checkboxes).each(function(index, item){
		$(item).prop("checked",check);
	});
});

$("#deleteAuthorityGroupBtn").click(function(){
	$.get("/authority_group/delete.htm",{"id": groupId}, function(){
		window.location.href="/authority_group/list.htm";
	});
});

function getCheckedValues()
{
	var ids = "";
	index = 0;
	$(".checkbox-item").each(function(){
		if($(this).prop("checked") && $(this).val() != '')
		{
			ids += $(this).val()+",";
		}
	});
	
	return ids;
}
$("#saveGroupMenu").click(function(){
	ajaxData("/authority_group/menu_add.htm",{"groupId": groupId, "menuIds": getCheckedValues()}, function(){
		window.location.href="/authority_group/list.htm";
	});

});

$("#saveAuthorityGroupBtn").click(function(){
	
	var url = "";
	
	if(groupId == "")
	{
		url = "/authority_group/add.htm";
	}
	else
	{
		url = "/authority_group/modify.htm";
	}
	
	ajaxData(url,{"id": groupId, "name": $("#name").val()}, function(){
		window.location.href="/authority_group/list.htm";
	});

});

var groupId = "";

$("#treeTitle").unbind().click(function(){
	$("#deleteAuthorityGroupBtn").hide();
	$('.bg-default').removeClass('bg-default');
	$(this).addClass('bg-default');
    	groupId = 0;
    	queryUserDataList();
	});
    
  //查询员工表单
function queryUserDataList()
{
	ajaxData("/group-employee/emp_list.htm", {"groupId":groupId}, showUserDataList);
}

var empTrTemp = $("#dataListBody tr");
$(empTrTemp).find("td:last").find(".delete-group").click(function(){
	deleteTR(this);
});
var empTr = $(empTrTemp).clone(true);
$("#dataListBody").empty();
//查询的员工数据装入TABLE
function showUserDataList(data)
{
	setPaginateResult(data);
	$("#dataListBody").empty();	
	var list = data.recordList;
	var managers = "";
	if(list == null || list.length == 0)
	{	tr = "<tr><td clospan='9' text-algin='center'>此权限组暂无员工！！</td></tr>"
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
		$(checkboxObj).attr("data-groupid",groupId);
		$(tr).find("td:eq(1)").text(v.userName);
    	$(tr).find("td:eq(2)").text(v.name);
		$(tr).find("td:eq(3)").text(v.phone);
		$(tr).find("td:eq(4)").text(v.email);
		$(tr).find("td:eq(5)").text(getGroupInfo(groupId).name);
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
    
  //获得角色信息
function getGroupInfo(id)
{
	var group = "";
	$(groups).each(function(k,v){
		if(id == v.id)
		{
			group = v;
		}
	});
	return group;
}

$("#checkAll").click(function () {
    var isChecked = $(this).prop("checked");
    $(".subCheckbox").prop("checked", isChecked);
})

function deleteTR(obj)
{
	var employeeId = $(obj).parent().parent().children().eq(0).find(":checkbox").attr("data-userid");
	var groupId = $(obj).parent().parent().children().eq(0).find(":checkbox").attr("data-groupid");
	ajaxData("/group-employee/group-employee_remove.htm",{"groupId": groupId, "employeeId": employeeId}, function(){
		//window.location.href="/authority_group/list.htm";
		// 删除成功
		$(obj).parent().parent().remove();
	});
}

//批量删除
$("#batchDeleteBtn").click(function(){
    var ids = "";
    $(".subCheckbox").each(function (i, ck) {
        if ($(ck).prop("checked") === true) {
        	ids += $(ck).attr("data-userid")+",";
        }
    })
    if (ids.length > 0) {
    	ajaxData("/group-employee/group-employee_remove_batch.htm",{"employees": ids, "groupId": groupId}, function(){
    		//window.location.href="/authority_group/list.htm";
    		// 删除成功
    		//$(obj).parent().parent().remove();
    		$(currentObj).click();
    	});
    } else {
        alert("您必须至少选选择一个用户进行删除。")
    }
})

// 获得已有存在的userid
// TODO: 查询该角权限下的所有用户，再考虑。（目前从页面上直接取）
function getExistedUserId(){
	var list = new Array();
	
	$("#dataListBody tr").each(function(){
		var userId = $(this).find(".subCheckbox").attr("data-userid");
		list.push(userId);
	});
	
	return list;
}
