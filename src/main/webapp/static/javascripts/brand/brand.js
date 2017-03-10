
// 初始化数据
queryDataList();

$("#search").click(function(){
	param.name=$("#search_name").val();
	queryDataList();
});

//创建品牌弹层显示
$("#createBrandBtn").click(function () {
	brandShow("新增品牌")
	$("#name").val("");
	$("#logoPath").val("");
});

// 修改品牌
$(".edit").click(function(){
  var id = $(this).attr("data-id");
  edit(id,this)
});

function edit(id, obj){
	$("#hiddenId").val(id);
	$("#name").val($(obj).parent().parent().children().eq(0).text());
	var logoPath = $(obj).parent().parent().children().eq(2).attr("data-path");
	$("#pathDIV").find("a").attr("href", logoPath);
	brandShow("修改品牌");
}

//品牌表单添加验证
function brandShow(message)
{	
	$("#brand_modal").modal("show"); 
	$("#brandModalLabel").text(message);
	$("#brand").find(".check").removeClass("ignore");

}
//品牌表单去除验证
function brandHide()
{
	$("#brand").find(".check").addClass("ignore");
}

//查询品牌表单
function queryDataList()
{
	ajaxData("/brand/page_brand.htm", param, showDataList);
}

//查询的员工数据装入TABLE
var TR = $("#dataListBody tr:first").clone(true);
$("#dataListBody").empty();
function showDataList(data)
{
	setPaginateResult(data);
	
	$("#dataListBody").empty();	
	var list = data.recordList;
	if(list == null || list.length == 0)
	{	tr = "<tr><td clospan='9' text-algin='center'>暂无品牌！！</td></tr>"
		$("#dataListBody").append(tr);
	}
	$(list).each(function(i,brand){
		var tr = $(TR).clone(true);
		var tds = $(tr).find("td");
		$(tds[0]).text(brand.name);
		$(tds[1]).text(brand.visible == 0 ? "否" : "是");
		var path = fileURN + brand.logoPath;
		$(tds[2]).attr("data-path", path);
		$(tds[2]).find("a").attr("href", path);
		var html = '<button class="btn btn-primary btn-xs purple edit" data-id="'+brand.id+'" onclick="edit('+brand.id+',this)"><i class="fa fa-edit"></i> 修改</button>';
		if(brand.visible == 0){
			html += ' <button class="btn btn-primary btn-xs purple set_visible" data-id="'+brand.id+'" onclick="setVisible('+brand.id+',this)"><i class="fa fa-edit"></i> 启用</button>';
			
		} else if (brand.visible == 1) {
			html += ' <button class="btn btn-danger btn-xs purple set_invisible" data-id="'+brand.id+'" onclick="setInvisible('+brand.id+',this)"><i class="fa fa-edit"></i> 禁用</button>';
		}
		$(tds[3]).html(html);
		
		$("#dataListBody").append(tr);
	});
}

//启用品牌
$(".set_visible").click(function(){
    var id = $(this).attr("data-id");
    var obj = this;
    setVisible(id, obj);
});

function setVisible(id, obj) {
    $.get("/brand/visible_brand.htm",{"id":id},function(result){
        if (result) {   // 成功
            
            $(obj).parent().parent().children().eq(1).text("是");
            $(obj).removeClass("set_visible");
            $(obj).addClass("set_invisible");
            $(obj).removeClass("btn-primary");
            $(obj).addClass("btn-danger");
            $(obj).html('<i class="fa fa-edit"></i>'+' 禁用');
            $(obj).unbind("click").bind("click", function(){
                setInvisible(id, obj);
            });
        } else {
            //alert("启用失败！");
        }
    });    
}


// 禁用品牌
$(".set_invisible").click(function(){
    var id = $(this).attr("data-id");
    var obj = this;
    setInvisible(id, obj);
});

function setInvisible(id, obj) {
    $.get("/brand/invisible_brand.htm",{"id":id},function(result){
        if (result) {   // 成功
            
            $(obj).parent().parent().children().eq(1).text("否");
            $(obj).removeClass("set_invisible");
            $(obj).addClass("set_visible");
            $(obj).removeClass("btn-danger");
            $(obj).addClass("btn-primary");
            $(obj).html('<i class="fa fa-edit"></i>'+' 启用');
            $(obj).unbind("click").bind("click", function(){
                setVisible(id, obj);
            });
        } else {
            //alert("禁用失败！");
        }
    });    
}

//ajax方法封装
function ajaxData(actionUrl, paramters, fun) {
  	$.ajax({
  		type : "post",
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
  

var validate1 = $("#brand_form").validate({
    ignore: '.ignore',
    focusInvalid: false,
    rules: {
        'name': {
            required: true,
			maxlength:[20]
        }
    },
	messages:{
		'name': {
            required: "必填",
			maxlength:"长度最多是20的字符串"
        }
		
	},
    submitHandler: function () {
		var id = $("#hiddenId").val();
		var url = "/brand/add.htm";
		if(id != null && id != "")
		{
			url = "/brand/modify.htm"
		}
		ajaxData(url , 
		{id:id,name:$("#name").val(),
		logoPath:$("input[name='path']").val()} , 
		function(){window.location.href="/brand/list.htm"});
    }
});