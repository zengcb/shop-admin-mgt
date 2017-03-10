$(
	function(){
		
		console.log($("#record").length);
		loadMemerPage();
		
	
	}	
)

	$(document).delegate(".release","click",function(){
		var id=$(this).attr("value");
		$.get("/member/release?id="+id,function(result){
			if(result.status=='ok'){
				$.msg("处理成功");
				history.go(0);
			}else{
				$.err(result.status);
			}
		})
	})

	$(document).delegate(".block","click",function(){
		var id=$(this).attr("value");
		$.get("/member/block?id="+id,function(result){
			if(result.status=='ok'){
				$.msg("处理成功");
				history.go(0);
			}else{
				$.err(result.status);
			}
		})
	})
		
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
	var moblie=$("#moblie").val();
	if(moblie==""){
		moblie=null;
	}
	var memberId=$("#memberId").val();
	if(memberId==""){
		memberId=null;
	}
	var name=$("#name").val();
	if(name==""){
		name=null;
	}
	var provinceCode=$("#seachprov").val();
	var province=$("#seachprov [value="+provinceCode+"]").text();
	
	if(province=="请选择"){
		province=null;
	}
	
	var gradeName=$("#gradeName").val();
	
	if(gradeName=="请选择"){
		gradeName=null;
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
		moblie:moblie,
		memberId:memberId,
		name:name,
		province:province,
		startRegisterTime:startRegisterTime,
		endRegisterTime:endRegisterTime,
		gradeName:gradeName,
	}
	
	$("#record").pagination({
		url:"/member/list",
		paramJson:jsonData,
		callback:function(){
			$('table').tablesort().data('tablesort');
			
			$('table thead th').data('sortBy', function(th, td, sorter) {
				return parseInt(td.text(), 10);
			});
			
			//Sorting indicator example
			
			$('table').on('tablesort:start', function(event, tablesort) {
				$('#record tbody').addClass("disabled");
			});
		}
	})
	
}
$(".searchBtn").click(function(){
	loadMemerPage();
})

$(".resetBtn").click(function(){
	$("#moblie").val("");
	$("#memberId").val("");
	$("#name").val("");
	$("#province").val("")
	$("#startRegisterTime").val("");
	$("#endRegisterTime").val("");
	$("#seachprov").val("0");	
	$("#gradeName").val("请选择");
})

$(".down").click(function(){
	var moblie=$("#moblie").val();
	if(moblie==null){
		moblie="";
	}
	var memberId=$("#memberId").val();
	if(memberId==null){
		memberId="";
	}
	var name=$("#name").val();
	if(name==null){
		name="";
	}
	var provinceCode=$("#seachprov").val();
	var province=$("#seachprov [value="+provinceCode+"]").text();
	
	if(province=="请选择"){
		province="";
	}
	
	var gradeName=$("#gradeName").val();
	
	if(gradeName=="请选择"){
		gradeName="";
	}
	
	var	startRegisterTime=$("#startRegisterTime").val();
	var endRegisterTime=$("#endRegisterTime").val();
	window.location.href="/member/downFile?moblie="+moblie+"&&memberId="+memberId+"&&name="+name+"&&province="+province+"&&gradeName="+gradeName+"&&startRegisterTime="+startRegisterTime+"&&endRegisterTime="+endRegisterTime;
	
})


