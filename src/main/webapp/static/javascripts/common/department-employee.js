
/*var paramCommon = { 
		"page":1,
		"pageSize":10
		};*/

$("#searchCommon").click(function(){
	paramCommon.name=$("#search_name_common").val();
	queryDataListCommon();
});

var refreshDeptDataCommon = function(id)
{
	$("#search_name_common").val("");
	$("#departmentId").val(id);
	paramCommon.departmentId = id;
	if(id != 0)
	{
    	var dept = getDeptCommon(id);	
    	$("#dept_name").text(dept.name);
    	$("#dept_priority").text(dept.priority);
    	$("#dept_code").text(dept.code);
    	$("#dept_status").text(dept.disabled?"禁用":"启用");
		//$("#dept_disabled").empty().append(bindDeptDisbled(dept.disabled, id));
	}
	queryDataListCommon();
}

//角色树
$('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
$('.deptTreeCommon li.parent_li > span').on('click', function (e) {
	$('.bg-default').removeClass('bg-default');
	$(this).addClass('bg-default');
	paramCommon.code = $(this).next().attr("data-code");
	paramCommon.page = 1;
	paramCommon.name = "";
	paramCommon.id = $(this).next().attr("data-id");
	refreshDeptDataCommon($(this).next().attr("data-id"));
});

paramCommon.code="";
paramCommon.isSubdept=true;
$('.deptTreeCommon li.parent_li > i').on('click', function (e) {
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
});


$("#treeTitleCommon").unbind().click(function(){
	$('.bg-default').removeClass('bg-default');
	$(this).addClass('bg-default');
	paramCommon.id=0;
	paramCommon.name="";
	paramCommon.code="";
	$("#dept_name").text("所有部门");
	$("#dept_priority").text(0);
	$("#dept_code").text(0);
	$("#dept_status").text("启用");
	//$("#dept_disabled").empty();
	queryDataListCommon();
});
//查询员工表单
function queryDataListCommon()
{
	ajaxDataCommon("/employee/emp_list.htm", paramCommon, showDataListCommon);
}
//ajax方法封装
function ajaxDataCommon(actionUrl, paramters, fun) {
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
  
var empTrCommon = $("#dataListBodyCommon tr").clone(true);
$("#dataListBodyCommon").empty();
//查询的员工数据装入TABLE
function showDataListCommon(data)
{
	setPaginateResultCommon(data);
	$("#dataListBodyCommon").empty();	
	var list = data.recordList;
	var managers = "";
	if(list == null || list.length == 0)
	{	tr = "<tr><td clospan='9' text-algin='center'>此部门暂无员工！！</td></tr>"
		$("#dataListBodyCommon").append(tr);
	}
	
	// 查看已经设置权限的用户
	var existedList = getExistedUserId();
	
	
	$(list).each(function(k,v){
		if(v.manager)
		{
			managers += v.name + "&nbsp;&nbsp;";
		}
		var tr = empTrCommon.clone(true);
		var checkObj = $(tr).find("td:eq(0)").find("input");
		// 已存在
		if (existedList.indexOf(v.id+"") != -1){
			$(checkObj).prop("checked", true);
			$(checkObj).prop("disabled", true);
		}
		$(checkObj).attr("data-userid",v.id);
		$(tr).find("td:eq(1)").text(v.userName);
    	$(tr).find("td:eq(2)").text(v.name);
		$(tr).find("td:eq(3)").text(getDeptCommon($("#departmentId").val()).name);
		
    	$("#dataListBodyCommon").append(tr);
	});
	$("#dept_manager").html(paramCommon.id==0? "" : managers);
}
var validate = $("#common_form").validate({
    ignore: '.ignore',
    focusInvalid: false,
//    rules: {
//        'username': {
//            required: true,
//            
//			rangelength:[3,20]
//        }
//    },
//	messages:{
//		'name': {
//            required: "必填",
//			maxlength:"长度最多是10的字符串"
//        }
//		
//	},
    submitHandler: function () {
		var obj = getEmpDataCommon();
		var commonType = $("#commonType").val();
		var url = "";
		if (commonType == 'group') {
			url = "/group-employee/add.htm";
		} else if (commonType == 'role') {
			url = "/role-employee/add.htm";
		}
		
		ajaxDataCommon(url , obj , 
				function(){
					$("#create_user_cancel_modal").click();
					//queryDataListCommon()
					$(currentObj).click();
				}
		);
    }
});

//获得部门信息
function getDeptCommon(id)
{
	var dept = "";
	$(deptOptionsCommon).each(function(k,v){
		if(id == v.id)
		{
			dept = v;
		}
	});
	return dept;
}

//获得表单对象
function getEmpDataCommon()
{
	var result = {};
	//var list = [];
	var list = "";
	$('input:checkbox[name="subCheckCommonbox"]:checked').each(function(i){
		list+=$(this).attr("data-userid")+",";
	});
	
	result.list = list;
	result.commonId = $("#hiddenId").val();
	
	return result;
}

$("#checkAllCommon").click(function () {
    var isChecked = $(this).prop("checked");
    $(".subCheckCommonbox").prop("checked", isChecked);
})
