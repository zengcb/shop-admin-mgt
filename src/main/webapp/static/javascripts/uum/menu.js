
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
		$("#deleteMenuBtn").click(function(){
			bootbox.confirm({
				message: "确定删除此菜单?",
				callback: function(result) {
					if(result)
					{
						ajaxData("/menu/delete.htm", {"menuId":menuId}, function(){window.location.href="/menu/list.htm"});
					}
				},
				buttons: {  
					confirm: {  
						label: '确认',  
						className: 'btn-myStyle'  
					},  
					cancel: {  
						label: '取消',  
						className: 'btn-default'  
					}  
				},  
				className: "bootbox-sm"
			});
		});
		//修改
	    $("#updateMenuBtn").click(function () {
        	if(menuId != "" && menuId != 0){
            	$("#deleteMenuBtn").hide();
        		$("#menu_name").text("修改菜单");
        		$("#name").removeAttr("readonly");
            	$("#url").removeAttr("readonly");
            	$("#priority").removeAttr("readonly");
            	$("#submitBtn").show();
        	}
        	else{
				waringAlert("请选择要修改的菜单！");

        	}
        });
	    
		//新增
	    $("#createMenuBtn").click(function () {
        	if(menuId != "" || menuId == 0){
            	$("#deleteMenuBtn").hide();
        		parentId = menuId;
        		menuId = "";
        		$("#menu_name").text("新增子菜单");
        		$("#name").removeAttr("readonly").val("");
            	$("#url").removeAttr("readonly").val("");
            	$("#priority").removeAttr("readonly").val("");
            	$("#submitBtn").show();
        	}
        	else{
				waringAlert("请选择新增的上级菜单！");

        	}
        });
		
		var menuId = "";
		var parentId = "";

        //树
        $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
        $('.menuTree li.parent_li > span').on('click', function (e) {
        	$('.bg-default').removeClass('bg-default');
        	$(this).addClass('bg-default');
        	var info = $(this).next().next().text();
        	menuDetail(eval("("+info+")"));
        });
        
        function menuDetail(obj){
        	if(obj.status == 1)
        	{
        		$("#deleteMenuBtn").show();
        	}
        	menuId = obj.id;
    		parentId = obj.parentId;
        	$("#menu_name").text("查看菜单");
        	$("#name").val(obj.name).attr("readonly","readonly");
        	$("#url").val(obj.url).attr("readonly","readonly");
        	$("#priority").val(obj.priority).attr("readonly","readonly");
        	$("#menu_disabled").empty().append(bindMenuDisbled(obj.status, obj.id));
        	$("#submitBtn").hide();
        }
        
        function bindMenuDisbled(disabled, deptId)
		{
			var label = null;
			var url = "/menu";
			if(!disabled)
			{
				label = $("<label>").addClass("btn btn-sm btn-danger").text("禁用菜单");
				url += "/disabled.htm";
			}
			else
			{
				label = $("<label>").addClass("btn btn-sm btn-success").text("启用菜单");
				url += "/enable.htm";
			}
			$(label).click(function(){
				ajaxData(url, {"menuId":menuId}, function(){window.location.href="/menu/list.htm"});
			});
			return label;
		}

        $('.menuTree i').on('click', function (e) {
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
        
        $("#treeTitle").unbind().click(function(){
        	menuId = 0;
        	$("#deleteMenuBtn").hide();
			$('.bg-default').removeClass('bg-default');
        	$(this).addClass('bg-default');
        	$("#menu_name").text("查看菜单");
        	$("#name").val("").attr("readonly","readonly");
        	$("#url").val("").attr("readonly","readonly");
        	$("#priority").val("").attr("readonly","readonly");
        	$("#menu_disabled").empty();
        	$("#submitBtn").hide();
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
		  
		
		var validate = $("#menu_from").validate({
            ignore: '.ignore',
            focusInvalid: false,
            rules: {
                'name': {
                    required: true,
					maxlength:[20]
                },
                'url': {
                    required: true
                },
				'priority':{
					required: true,
					digits:true,
					maxlength:20
				}
            },
        	messages:{
        		'name': {
                    required: "必填",
					maxlength:"长度最多是20的字符串"
                },
        		'name': {
                    required: "必填"
                },
                'priority': {
                    required: "必填",
					digits:"必须输入整数",
					maxlength:"长度最多是20个数字"
                }
				
        	},
            submitHandler: function () {
    			var url = "/menu/add.htm";
    			var data = {
    				"id":menuId,
    				"name":$("#name").val(),
    				"url":$("#url").val(),
    				"priority":$("#priority").val(),
    				"parentId": parentId
    				
    			} 
    			if(menuId != null && menuId != "")
    			{
    				url = "/menu/modify.htm";
    			}
    			ajaxData(url , data, 
				function(){window.location.href="/menu/list.htm"});
            }
		});