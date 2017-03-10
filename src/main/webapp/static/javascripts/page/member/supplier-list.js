$(
	function(){
		loadMemerPage();
		$(".toAddPageBtn").on("click",toAddPage)
	}	
)
function toAddPage(){
	
	window.location.href="/admin/suppliescompany";
	
}
$.fn.datetimepicker.dates['zh'] = {  
        days:       ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六","星期日"],  
        daysShort:  ["日", "一", "二", "三", "四", "五", "六","日"],  
        daysMin:    ["日", "一", "二", "三", "四", "五", "六","日"],  
        months:     ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月","十二月"],  
        monthsShort:  ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],  
        meridiem:    ["上午", "下午"],  
        today:       "今天"  
};  
	 $("#startRegisterTime").datetimepicker({
		 language:"zh-CN",
	        todayBtn:  1,
			autoclose: 1,
			format:"yyyy-mm-dd",
			todayHighlight: 1,
			startView: 2,
			minView: 2,
			forceParse: 0
    });
	 $("#endRegisterTime").datetimepicker({
		 language:"zh-CN",
	        todayBtn:  1,
			autoclose: 1,
			format:"yyyy-mm-dd",
			todayHighlight: 1,
			startView: 2,
			minView: 2,
			forceParse: 0
    });
function loadMemerPage(){
	var linker=$("#linker").val();
	if(linker==""){
		linker=null;
	}
	var linkerPhone=$("#linkerPhone").val();
	if(linkerPhone==""){
		linkerPhone=null;
	}
	var supplierCompanyId=$("#supplierCompanyId").val();
	if(supplierCompanyId==""){
		supplierCompanyId=null;
	}
	
	var name=$("#name").val();
	if(name==""){
		name=null;
	}
	var startRegisterTime=null;
	var endRegisterTime=null;
	if($("#startRegisterTime").val()!=""){
		startRegisterTime=$("#startRegisterTime").val();
	}
	if($("#endRegisterTime").val()!=""){
		endRegisterTime=$("#endRegisterTime").val();
	}
	var jsonData={
			pageNum:1,
			numPerPage:10,
			linker:linker,
			linkerPhone:linkerPhone,
			supplierCompanyId:supplierCompanyId,
			name:name,
			startRegisterTime:startRegisterTime,
			endRegisterTime:endRegisterTime
	}
	
	$("#record").pagination({
		url:"/supplier/list",
		paramJson:jsonData
	})
	
}

$(".searchBtn").on("click",function(){
	loadMemerPage();
})

$(".resetBtn").click(function(){
		$("#linker").val("");
		$("#linkerPhone").val("");
		$("#supplierCompanyId").val("");
		$("#startRegisterTime").val("");
		$("#endRegisterTime").val("")
		$("#name").val("");	
	})

$(".down").on("click",function(){
	var linker=$("#linker").val();
	if(linker==null){
		linker="";
	}
	var linkerPhone=$("#linkerPhone").val();
	if(linkerPhone==null){
		linkerPhone="";
	}
	var supplierCompanyId=$("#supplierCompanyId").val();
	if(supplierCompanyId==null){
		supplierCompanyId="";
	}
	
	var name=$("#name").val();
	if(name==null){
		name="";
	}
	var startRegisterTime="";
	var endRegisterTime="";
	if($("#startRegisterTime").val()!=""){
		startRegisterTime=$("#startRegisterTime").val();
	}
	if($("#endRegisterTime").val()!=""){
		endRegisterTime=$("#endRegisterTime").val();
	}
	window.location.href="/supplier/downFile?linker="+linker+"&&linkerPhone="+linkerPhone+"&&supplierCompanyId="+supplierCompanyId+"&&name="+name+"&&startRegisterTime="+startRegisterTime+"&&endRegisterTime="+endRegisterTime;
})