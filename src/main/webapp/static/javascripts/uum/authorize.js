
$('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
$('.deptTree li.parent_li > span').on('click', function (e) {
	$('.bg-default').removeClass('bg-default');
	$(this).addClass('bg-default');
	param.code = $(this).next().attr("data-code");
	param.page = 1;
	param.name = "";
	queryDataList();
});

$("#powerDetailTree").find("span").on('click', function (e) {
	var checkbox = $(this).children().first();
	if(checkbox.prop("checked"))
	{
		checkbox.prop("checked",false);
	}
	else
	{
		checkbox.prop("checked",true);
	}
});

$('.deptTree li.parent_li > i').on('click', function (e) {
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

function ajaxData(actionUrl, paramters, fun) {
  	$.ajax({
  		type : "post",
  		dataType : "json",
  		url : actionUrl,
  		timeout : 10000,
  		data : paramters,
  		success : function(msg) {
  			var data = eval('('+msg+')');
				//console.log(data);
				fun(data);
  		}
  	});
  };

//
function queryDataList() {
	ajaxData("/admin/list-employee.htm", param, showDataList);
}

function keypress(e)
  {
	var currKey=0,e=e||event;
  	if(e.keyCode==13)
  	{
  		searchData();
  	}
  }
document.onkeypress=keypress;
 function searchData()
{
	value = $("#search_name").val();
	if(value != null && value != '')
	{
		param = {page:1,name:$("#search_name").val().trim(),pageSize:10};
	}
	else
	{
		param = {page:1,pageSize:10};
	}
	ajaxData("/admin/list-employee.htm", param, showDataList);
}
$("#search").click(searchData);



		//显示数据列表
function showDataList(dataList) {
	$("#dataListBody").empty();
	setPaginateResult(dataList, param.page);
	if (dataList.recordList != null)
	{
  	$.each(dataList.recordList, function(i, data) {
  		$("#dataListBody").append(initTr(data));
  	});
	}
}

function $child(tr, index)
{
	return $(tr).children().eq(index);
}


var tempTr = $("#dataListBody tr").clone(true);
$("#dataListBody").empty();

queryDataList();

//列表初始化一行
function initTr(data)
{
	var tr = tempTr.clone(true);
	$child(tr,0).html(data.id);
	$child(tr,1).html(data.username);
	$child(tr,2).html(data.name);
	$child(tr,3).html(data.sex==1?"男 ":"女");
	$child(tr,4).html(data.phone);
	$child(tr,5).html(data.mobile);
	$child(tr,6).html(data.manager ? '是':'否');
	$child(tr,7).html(data.superAdmin ? '是':'否');
	var flag = data.adminId != null && data.adminId != 0;
	$child($child(tr,8), flag ? 1 :0).remove();
	$child(tr,9).html(flag ? '<a class="btn btn-xs btn-primary"  href="#powerDtail" data-toggle="modal"><i class="fa fa-sign-in "></i> 详细</a>' : 
	'<a class="btn btn-xs btn-info" href="#powerDtail" data-toggle="modal"><i class="fa fa-sign-in "></i> 授权</a>')
	$child($child(tr,9), 0).click(function(){
	    ajaxData("/admin/detail-admin-function.htm", {"adminId" : data.adminId}, setPowerDetailTreeData); 
		btnBindUpdate(data);
	});
	return tr;
}


function getCheckedValues()
{
	var functions = new Array()
	index = 0;
	$("[name='checkbox']").each(function(){
		if($(this).prop("checked"))
		{
			functions[index] = parseInt($(this).val());
			++index;
		}
	});
	
	return functions;
}

//绑定事件
function btnBindUpdate(data)
{
	$("#username").val(data.username);
	$("#name").val(data.name);
	
	$("#btnCommit").unbind().click(function(){
		data.functions = JSON.stringify(getCheckedValues())
		saveJson("/admin/create-admin-function.htm", data); 
	});
}
function saveJson(url, data)
{
	 $.ajax({
          url: url,
          type: "post",
          data: data,
			dataType: "json",
          success: function () {
              queryDataList();
          }
      });
}

//个人权限展示
function setPowerDetailTreeData(data)
{
	$("[name='checkbox']").removeAttr("checked");
	$(data).each(function(key, values){
		$("[name='checkbox']").each(function(){
			if($(this).val() == values.functionId)
			{
				 $(this).prop("checked",'true');
			}
		});
	});
}

$("[name='checkbox']").click(function(){
	if($(this).prop("checked"))
	{
		$(this).prop("checked",'');
	}
	else
	{
		$(this).prop("checked",'true');
	}
})