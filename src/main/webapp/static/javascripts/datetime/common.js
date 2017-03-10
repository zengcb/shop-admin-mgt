/**
 * day.Format(regex); 直接可以使用 day代表时间long值,regex传入格式
 */
Date.prototype.Format = function(fmt) {
	var o = {
		"M+" : this.getMonth() + 1, // 月份
		"d+" : this.getDate(), // 日
		"h+" : this.getHours(), // 小时
		"m+" : this.getMinutes(), // 分
		"s+" : this.getSeconds(), // 秒
		"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
		"S" : this.getMilliseconds()
	// 毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	for ( var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
					: (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

function getRegexDate(day, regex) {
	return day.Format(regex);
}

var option = {
	tooltip : {
		trigger : 'item',
		formatter : '{a}<br/>{c}<br/>{b}'
	},
	toolbox : {
		show : true,
		orient : 'horizontal',
		x : 'right',
		y : 'top',
		color : [ '#1e90ff', '#22bb22', '#4b0082', '#d2691e' ],
		backgroundColor : 'rgba(0,0,0,0)', // 工具箱背景颜色
		borderColor : '#ccc',
		borderWidth : 0,
		padding : 5,
		showTitle : true,
		feature : {
			saveAsImage : {
				show : true,
				title : '下载',
				type : 'jpeg',
				lang : [ '点击本地保存' ]
			}
		}
	},
	calculable : false,
	xAxis : [ {
		type : 'category',
		boundaryGap : false,
		data : []
	} ],
	yAxis : [ {
		type : 'value'
	} ],
	series : [ {
		name : '',
		type : 'line',
		stack : '总量',
		smooth : false,
		data : []
	} ]
};

// 选择日期
// 选择日期
$('#date01').val(
		(moment().subtract('hours', 1).format('YYYY/MM/DD') + ' to ' + moment()
				.format('YYYY/MM/DD')));
$('#date01').daterangepicker(
		{
			startDate : moment().startOf('day'),

			endDate : moment(),
			minDate : '01/01/2012', // 最小时间
			maxDate : moment(), // 最大时间
			/*
			 * dateLimit : { days : 30 }, //起止时间的最大间隔
			 */
			showDropdowns : false,
			showWeekNumbers : false, // 是否显示第几周
			timePicker : false, // 是否显示小时和分钟
			timePickerIncrement : 60, // 时间的增量，单位为分钟
			timePicker12Hour : false, // 是否使用12小时制来显示时间
			ranges : {
				// '最近1小时': [moment().subtract('hours',1), moment()],
				'今日' : [ moment().startOf('day'), moment() ],
				'昨日' : [ moment().subtract('days', 1).startOf('day'),
						moment().subtract('days', 1).endOf('day') ],
				'最近7日' : [ moment().subtract('days', 6), moment() ],
				'最近30日' : [ moment().subtract('days', 29), moment() ]
			},
			opens : 'right', // 日期选择框的弹出位置
			buttonClasses : [ 'btn btn-default' ],
			applyClass : 'btn-small btn-primary blue',
			cancelClass : 'btn-small',
			format : 'YYYY/MM/DD', // 控件中from和to 显示的日期格式
			separator : ' to ',
			locale : {
				applyLabel : '确定',
				cancelLabel : '取消',
				fromLabel : '起始时间',
				toLabel : '结束时间',
				customRangeLabel : '自定义',
				daysOfWeek : [ '日', '一', '二', '三', '四', '五', '六' ],
				monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月',
						'九月', '十月', '十一月', '十二月' ],
				firstDay : 1
			}
		},
		function(start, end, label) {// 格式化日期显示框

			$('#reportrange span').html(
					start.format('YYYY/MM/DD') + ' - '
							+ end.format('YYYY/MM/DD'));

		});


function displayHoliday(){
	var startDate=$("#date01").data("daterangepicker").startDate.format('YYYYMMDD');
	var endDate=$("#date01").data("daterangepicker").endDate.format('YYYYMMDD');
	if(startDate==endDate){
		$(".holidayCheckbox").parent().hide();
	}else{
		$(".holidayCheckbox").parent().show();
	}
}