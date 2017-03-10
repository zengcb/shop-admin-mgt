var param = { "page":1,
				"pageSize":10

			   };


//设置分页结果
function setPaginateResult(result) 
{
	var pageNo = param.page;
	if(result.recordList == undefined)
	{
		$("#pageCountInfo").html("");
		$("#selectPageNoList").html("");
	}
	else
	{
		// 分页按钮起始页		
		endNo = result.pageCount < 5 ? result.pageCount : (pageNo - 2 > 0 ? (pageNo + 2 <= result.pageCount ? pageNo + 2 : result.pageCount) : pageNo + 2 - (pageNo - 3));
		
		// 分页按钮结束页
		benginNo = pageNo - 2 > 0 ? (endNo - 4 > 0 ? endNo - 4 : 1) : 1;
		
		// 上一页样式
		prev = pageNo <= 1 ? 'class="disabled"' : "class='prev'";
		
		//下一页样式
		next = pageNo >= result.pageCount ? "class='disabled'" : 'class="next"';
		
		//上一页按钮
		var html = '<li '+ prev +' value="1" id="btnPriorPage"><a title="首页">«</a></li>';
		
		for(var i = benginNo; i <= endNo; i++){
			
			active = i == pageNo ? 'class="active"' : "";
			
			//对应分页按钮
			html += '<li '+ active +' value="'+ i +'" ><a>'+ i +'</a></li>';
		}
		
		//下一页按钮
		html += '<li '+ next +' value="'+ result.pageCount +'" id="btnNextPage" ><a title="尾页">»</a></li>';
		var beginPageindex = result.recordList.length > 0 ? (pageNo - 1) * param.pageSize + 1 : 0;
		var currentSize = result.recordList.length > 0 ? beginPageindex - 1 + result.recordList.length : beginPageindex;
		$("#selectPageNoList").html(html);
		pageCountInfo = '当前显示：' + beginPageindex  + '到' + currentSize + '条，&nbsp;共'+ result.totalCount + '条';
		$("#pageCountInfo").html(pageCountInfo);
		//绑定li按钮事件
		$("#selectPageNoList li").each(function(){
			$(this).bind("click",function(){
				var value = $(this).val();
				if( value > 0 && value <= result.pageCount && pageNo != value)
				{
					param.page = value;
					queryDataList();
				}
			});
		});
	}
}