var DATE_PATTEN = "yyyy-MM-dd";
var DATE_PATTEN_FULL = "yyyy-MM-dd HH:mm:ss";


//扩展Date的format方法   
Date.prototype.format=function(fmt) 
{
	var o = {
			"M+" : this.getMonth() + 1, 									//月份        
			"d+" : this.getDate(), 											//日        
			"h+" : this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, 	//12小时制        
			"H+" : this.getHours(), 										//24小时制        
			"m+" : this.getMinutes(), 										//分        
			"s+" : this.getSeconds(), 										//秒        
			"q+" : Math.floor((this.getMonth() + 3) / 3), 					//季度        
			"S" : this.getMilliseconds()									//毫秒        
		};
	var week = {
		"0" : "\u65e5",
		"1" : "\u4e00",
		"2" : "\u4e8c",
		"3" : "\u4e09",
		"4" : "\u56db",
		"5" : "\u4e94",
		"6" : "\u516d"
	};
    if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));        
    }
    if(/(E+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "\u661f\u671f" : "\u5468") : "")+week[this.getDay()+""]);        
    }
    for(var k in o){
        if(new RegExp("("+ k +")").test(fmt)){        
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));        
        }
    }       
    return fmt;
}

/**
 * 日期对象 TO 日期字符串
 * 
 * @param date 日期对象
 * @param isFull 是否为完整的日期数据, 为true时, 格式如"2000-03-05 01:05:04" 为false时, 格式如"2000-03-05"
 * @return 符合要求的日期字符串
 */
function getSmpFormatDate(date, isFull)
{
	if (isFull == true || isFull == undefined)
	{
		pattern = DATE_PATTEN_FULL;
	}
	else
	{
		pattern = DATE_PATTEN;
	}
	return getFormatDate(date, pattern);
}

/**
 * 当前日期对象 TO 日期字符串
 * 
 * @param date
 *            日期对象
 * @param isFull
 *            是否为完整的日期数据, 为true时, 格式如"2000-03-05 01:05:04" 为false时, 格式如
 *            "2000-03-05"
 * @return 符合要求的日期字符串
 */
function getSmpFormatNowDate(isFull)
{
	return getSmpFormatDate(new Date(), isFull);
}

/**
 * long值 TO 日期字符串
 * 
 * @param l
 *            long值
 * @param isFull
 *            是否为完整的日期数据, 为true时, 格式如"2000-03-05 01:05:04" 为false时, 格式如
 *            "2000-03-05"
 * @return 符合要求的日期字符串
 */
function getSmpFormatDateByLong(l, isFull)
{
	try
	{
		var result = null;
		if (l != null) {
			result = getSmpFormatDate(new Date(l), isFull);
		}
	}
	catch (ex)
	{
		return null;
	}
	return result;
}

/**
 * long值 TO 日期字符串 (自定义patten)
 * 
 * @param l
 *            long值
 * @param pattern
 *            格式字符串,例如：yyyy-MM-dd hh:mm:ss
 * @return 符合要求的日期字符串
 */
function getFormatDateByLong(l, pattern)
{

	return getFormatDate(new Date(l), pattern);
}

/**
 * 日期字符串 TO long值 (默认格式："yyyy-MM-dd")
 * 
 * @param date 日期
 * @return 日期的毫秒值
 */
function getLongByDate(strDate)
{
	var result = null;
	if (strDate == null || strDate == "" || strDate == undefined)
	{
		return result;
	}
	else
	{
		// 如果传入的日期字符串格式不正确，返回空字符串
		try 
		{
			var resultDate = new Date(strDate.replace(/-/g, "/"));
			result = resultDate.getTime();
		}
		catch (ex)
		{
			return null;
		}
	}
	
	return result;
}


/**
 * 调用format方法：转换日期对象为日期字符串
 * 
 * @param l
 *            long值
 * @param pattern
 *            格式字符串,例如：yyyy-MM-dd hh:mm:ss
 * @return 符合要求的日期字符串
 */
function getFormatDate(date, pattern)
{
	if (date == undefined)
	{
		date = new Date();
	}
	if (pattern == undefined)
	{
		pattern = DATE_PATTEN_FULL;
	}
	return date.format(pattern);
}