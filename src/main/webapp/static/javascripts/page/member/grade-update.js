$.fn.datetimepicker.dates['zh'] = {  
        days:       ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六","星期日"],  
        daysShort:  ["日", "一", "二", "三", "四", "五", "六","日"],  
        daysMin:    ["日", "一", "二", "三", "四", "五", "六","日"],  
        months:     ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月","十二月"],  
        monthsShort:  ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],  
        meridiem:    ["上午", "下午"],  
        today:       "今天"  
};  
	
$(function(){
	 $("#validate").datetimepicker({
		 	language:"zh-CN",
	        todayBtn:  1,
			autoclose: 1,
			format:"yyyy-mm-dd HH:ss:mm",
			todayHighlight: 1,
			startView: 2,
			minView: 2,
			forceParse: 0
	});
}) 
$("#add").on("click",function(){
	var flag=formcheck();
	if(!flag){
		return false;
	}
	var name=$("#name").val();
	var cond=$(":radio[name=cond]:checked").val();
	var moneyBegin=$("#sv").val();
	var moneyEnd=$("#ev").val();
	var id=$("#add").attr("value");
	var type="0";
	if(cond=="price"){
		type="1";
	}
	var period=$(":radio[name=qixian]:checked").val();
	var rate=$("#rate").val();
	var validate="";
	if(period==3){
		validate=$("#validate").val();
		validate=new Date(validate).getTime();
	}
	var jsonData={
		validate:validate,	
		name:name,
		moneyBegin:moneyBegin,
		moneyEnd:moneyEnd,
		period:period,
		rate:rate,
		id:id,
		type:type
	}
	$.ajax({
	    type:'POST',
	    url:'/grade/modify',
	    data: jsonData,
	    success: function(data) {
	    	if(data.status=="ok"){
				$.msg("编辑成功");
				setTimeout(function(){
					window.location.href="/grade";
				},1000);
			}else{
				$.err(data.status);
			}
	    }
	});
})
$("input[name=qixian]").on("click",function(e){
	if($(e.target).val()=="3"){
		$("#validate").show();
	}else{
		$("#validate").hide();
	}
})

function formcheck(){
	if($("#name").val()==""){
		$.err("会员类型不能为空");
		return false;
	}
	if($("#sv").val()==""||$("#ev").val()==""){
		$.err("值不能为空");
		return false;
	}
	if($("#rate").val()==""){
		$.err("占比不能为空");
		return false;
	}
	return true;
}