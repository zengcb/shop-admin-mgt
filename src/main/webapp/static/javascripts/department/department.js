
		$("#search").click(function(){
			param.name=$("#search_name").val();
			queryDataList();
		});

		function getIds(data, id, arr)
		{
			$(deptOptions).each(function(key,obj){
				if(id == obj.parentId)
				{
					arr[arr.length]=obj.id;
					arr = getIds(deptOptions,obj.id,arr);
				}
			});
			return arr;
		}
		
		//获得表单对象
		function getEmpData()
		{
			return {
			id:$("#id").val(),
			name:$("#name").val(),
			sex:$("input[name=sex]:checked").val(),
			phone:$("#phone").val(),
			fax:$("#fax").val(),
			mobile:$("#mobile").val(),
			email:$("#email").val(),
			qq:$("#qq").val(),
			skype:$("#skype").val(),
			im:$("#im").val(),
			departmentId:$("#departmentId").val(),
			status:$("#status").val(),
			address:$("#address").val(),
			postcode:$("#postcode").val(),
			photoURL:$("#photoURL").val(),
			userName:$("#username").val(),
			password:$("#password").val(),
			degree:$("#degree").prop("checked"),
			
			};		
		}
		//清空表单对象
		function cleanEmpTable()
		{
			$("#id").val("");
			$("#name").val("");
			$("input[name=sex]").each(function(){
				if($(this).val() == 1)
				{
					$(this).prop("checked","checked");
				}
			});
			$("#phone").val("");
			$("#fax").val("");
			$("#mobile").val("");
			$("#email").val("");
			$("#qq").val("");
			$("#skype").val("");
			$("#im").val("");
			$("#address").val("");
			$("#postcode").val("");
			$("#photoURL").val("");
			$("#status").val(0);
			$("#departmentId").val("");
			$("#username").val("");
			$("#password").val("");
			$("#degree").prop("checked","");
			$("#superAdmin").prop("checked","");
		}
		//添加只读
		function addReadonly()
		{
			$("#name").attr("readonly","readonly"); 
			$("#username").attr("readonly","readonly");
			$('#password').attr('readonly',"readonly");
		}
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
		//移动部门提交
		$("#moveBtn").click(function(){
    			var dept = getDept(param.id);
    			ajaxData("/department/department_move.htm" , {
    				departmentId:dept.id,
    				parentId:$("#deptSelect").val(),
    				oldParentId:dept.parentId,
    			} , function(){window.location.href="/employee/list.htm"});
		});
		
		//获得部门信息
		function getDept(id)
		{
			var dept = "";
			$(deptOptions).each(function(k,v){
				if(id == v.id)
				{
					dept = v;
				}
			});
			return dept;
		}
		//移除部门弹层显示
		$("#moveSubDepartmentBtn").click(function () {
			if(param.id == null || param.id == "" || param.id == 0)
			{
				waringAlert("请选择部门");
			}
			else
			{
                $("#move-sub-department").modal("show");
    			$("#deptName").val(getDept(param.id).name);
				$("#deptSelect").empty();
				$("#deptSelect").append(new Option("根节点",0));
				
				//var ids = getdeptSubsId(param.id)
				var ids = getIds(deptOptions,param.id,[param.id]);
				var optionsData = new Array();
				
				$(deptOptions).each(function(k,v){
					var flag = true;
					$(ids).each(function(idk,idv){
            			if(idv == v.id)
            			{
							flag = false;
            			}
					});
					if(flag)
					{
						optionsData[optionsData.length] = v;
					}
    			});
				
				setTreeData(optionsData,0)				
				
			}
        });
		
		
		function setTree(data, id)
		{
			$(data).each(function(k,v){
				if(v.parentId == id)
				{
					$("#departmentId").append(new Option(getTreeStr(v.code) + v.name,v.id));	
					setTree(data, v.id);
				}
    		});
		}
		
		setTree(deptOptions, 0);
		
		
		
		function setTreeData(data, id)
		{
			$(data).each(function(k,v){
				if(v.parentId == id)
				{
					$("#deptSelect").append(new Option(getTreeStr(v.code) + v.name,v.id));	
					setTreeData(data, v.id);
				}
    		});
		}
		
		function getTreeStr(code)
		{
			var str = "";
			for(var i = 0; i <code.length/2; i ++)
			{
				str += " |===";
			}
			return str;
		}
		
		
		//修改部门弹层显示
	    $("#updateDepartmentBtn").click(function () {
			if(param.id == null || param.id == "" || param.id == 0)
			{
				waringAlert("请选择部门");
			}
			else
			{	
 		        departmentShow("修改部门")
    			var dept = getDept(param.id);
    			$("#dept_modify_id").val(param.id);
    			$("#dept_modify_name").val(dept.name);
    			$("#dept_modify_priority").val(dept.priority);
			}
        });
		//创建部门弹层显示
        $("#createSubDepartmentBtn").click(function () {
			departmentShow("新增部门")
			$("#dept_modify_id").val("");
			$("#dept_modify_name").val("");
			$("#dept_modify_priority").val("");
        });
		//部门表单添加验证
		function departmentShow(message)
		{	
			$("#department").modal("show");
			$("#deptModalLabel").text(message);
			$("#department").find(".check").removeClass("ignore");

		}
		//部门表单去除验证
		function departmentHide()
		{
			$("#department").find(".check").addClass("ignore");
		}
		//创建用户弹层显示
        $("#createUserBtn").click(function () {
			if(param.id == null || param.id == ""|| param.id == 0)
			{
				waringAlert("请选择部门");
			}
			else
			{	
				$('#password').rules('add',{required: true});
				$('#password').attr('placeholder','');
                $("#create-user").modal("show");
    			cleanEmpTable();
    			$("#name").removeAttr("readonly");
    			$("#password").removeAttr("readonly");
    			$("#username").removeAttr("readonly");
    			$("#userModalLabel").text("创建用户");
				$("#departmentId").val(param.id);
			}
        });
        
        $("#importData").click(function(){
			
			 $('#uploadYearContract').click();
		});
		
		//var obj = $('#uploadYearContract').pixelFileInput({placeholder: '请选择文件...'});
		$('#uploadYearContract').change(function(){
               $.ajaxFileUpload({
                   url: '/employee/employee_import.htm',
                   type: 'post',
                   secureuri: false, //一般设置为false
                   fileElementId: 'uploadYearContract', // 上传文件的id、name属性名
                   dataType: 'application/json', //返回值类型，一般设置为json、application/json
                   success: function (data, status) {
					console.log(data);
   					getQuotationList(data);
                       //$("#hiddenPath").val(data);
                   },
                   error: function (data, status, e) {
                       console.log(data);
                   }
               });
         })
		
		function getQuotationList(dataList) {
			var dataList = $.parseJSON(dataList);
			
			if (dataList.length > 0){
				//APPLYITEMLIST = dataList;
				console.log(APPLYITEMLIST);
				$("#dataBodyList").empty();
				$(dataList).each(function(i, data){
				
					APPLYITEMLIST.push(data);
					var html = "<tr><td name='breedCode'>"
							+ data.breedCode
							+"</td><td name='specCode'>"
							+ data.specCode
                           +"</td><td name='materialCode'>"
							+ data.materialCode
                           +"</td><td name='steelFactory'>"
							+ data.steelFactory
                           +"</td><td name='weight'>"
							+ data.weight
                           +"</td><td name='weightWay'>"
							+ data.weightType
                           +"</td><td name='unitPrice'>"
							+ data.unitPrice
                           +"</td><td name='note'>"
							+ data.note
                           +"</td><td name='DEV_OPT'>"
   						+"<a class='edit' href='javascript:;'>编辑</a>"
   						+"<a class='delete' href='javascript:;'>删除</a>"
   						+"</td></tr>";
					$("#dataBodyList").append(html);
				});
			}
		}
        
      //创建用户弹层显示
	    $("#batchImportUserBtn").click(function () {
			if(param.id == null || param.id == ""|| param.id == 0)
			{
				waringAlert("请选择部门");
			}
			else
			{	
	            $("#batch-create-user").modal("show");
//				$("#name").removeAttr("readonly");
//				$("#username").removeAttr("readonly");
//				$("#userModalLabel").text("创建用户");
				$("#departmentId").val(param.id);
			}
	    });
		
		var refreshDeptData = function(id)
		{
			$("#search_name").val("");
			$("#departmentId").val(id);
			param.departmentId = id;
			if(id != 0)
			{
            	var dept = getDept(id);	
            	$("#dept_name").text(dept.name);
            	$("#dept_priority").text(dept.priority);
            	$("#dept_code").text(dept.code);
            	$("#dept_status").text(dept.disabled?"禁用":"启用");
    			$("#dept_disabled").empty().append(bindDeptDisbled(dept.disabled, id));
			}
        	queryDataList();
		}
		
        param.code="";
        param.isSubdept=true;
        //部门树
        $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
        $('.deptTree li.parent_li > span').on('click', function (e) {
        	$('.bg-default').removeClass('bg-default');
        	$(this).addClass('bg-default');
        	param.code = $(this).next().attr("data-code");
        	param.page = 1;
			param.name = "";
        	param.id = $(this).next().attr("data-id");
			refreshDeptData($(this).next().attr("data-id"));
        });
		
		function bindDeptDisbled(disabled, deptId)
		{
			var label = null;
			var url = "/department";
			/*if(!disabled)
			{
				label = $("<label>").addClass("btn btn-sm btn-danger").text("禁用部门");
				url += "/disabled_dept.htm";
			}
			else
			{
				label = $("<label>").addClass("btn btn-sm btn-success").text("启用部门");
				url += "/enabled_dept.htm";
			}*/
			label = $("<label>").addClass("btn btn-sm btn-danger").text("删除部门");
			url += "/remove_dept.htm";
			$(label).click(function(){
				ajaxData(url, {id:deptId}, function(data){
							if(data){
								alert("删除部门成功!");
							} else {
								alert("该部门下包含子部门，删除部门失败!");
							}
							window.location.href="/department/list.htm"
						});
			});
			return label;
		}
        
        
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
        
        $("#treeTitle").unbind().click(function(){
			$('.bg-default').removeClass('bg-default');
        	$(this).addClass('bg-default');
			param.id=0;
			param.name="";
			param.code="";
			$("#dept_name").text("所有部门");
        	$("#dept_priority").text(0);
        	$("#dept_code").text(0);
        	$("#dept_status").text("启用");
        	$("#dept_disabled").empty();
        	$("#departmentId").val("");
			queryDataList();
		});
        //查询员工表单
        function queryDataList()
        {
        	ajaxData("/employee/emp_list.htm", param, showDataList);
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
		  
        var empTr = $("#dataListBody tr").clone(true);
        $("#dataListBody").empty();
		//查询的员工数据装入TABLE
        function showDataList(data)
        {
			setPaginateResult(data);
        	$("#dataListBody").empty();	
        	var list = data.recordList;
        	var managers = "";
        	if(list == null || list.length == 0)
        	{	tr = "<tr><td clospan='9' text-algin='center'>此部门暂无员工！！</td></tr>"
        		$("#dataListBody").append(tr);
        	}
        	$(list).each(function(k,v){
        		if(v.manager)
        		{
        			managers += v.name + "&nbsp;&nbsp;";
        		}
        		var tr = empTr.clone(true);
        		$(tr).find("td:eq(0)").text(v.userName);
            	$(tr).find("td:eq(1)").text(v.name);
        		$(tr).find("td:eq(2)").text(v.phone);
        		$(tr).find("td:eq(3)").text(v.email);
        		$(tr).find("td:eq(4)").text(getDept($("#departmentId").val()).name);
        		//$(tr).find("td:eq(5)").text(v.manager?"是":"否");
        		$(tr).find("td:eq(5)").text(v.degree?"是":"否");
				var select = $(tr).find("td:eq(6) > select");
        		select.val(v.status);
				//下拉提交事件
				select.change(function(){
					var currentSelect = $(this);
					var thisValue = $(this).val();
					bootbox.confirm({
        				message: "更新<span class='text-primary'>"+v.name+"</span>状态为："+$(this).find("option:selected").text(),
        				callback: function(result) {
        					if(result)
							{
								var url = thisValue == 0 ? "/employee/employee_enable.htm" :
								(thisValue == 1 ? "/employee/employee_disable.htm" : 
								"/employee/employee_dimiss.htm")
								$(currentSelect).val(v.status);
								ajaxData(url , {id:v.id,} , queryDataList);
							}
							else
							{
								$(currentSelect).val(v.status);
							}
        				},
						buttons: {  
                        confirm: {  
                            label: '确认',  
                            className: 'btn-primary'  
                            },  
                            cancel: {  
                                label: '取消',  
                                className: 'btn-default'  
                            }  
                        },  
        				className: "bootbox-sm"
        			});
				});
				//修改弹层赋值
        		$(tr).find("td:eq(7) > button").click(function () {
                    $("#create-user").modal("show");
        			$("#userModalLabel").text("修改用户");
                    $('#password').rules('add',{required: false});
					$('#password').attr('placeholder','******');
					
        			cleanEmpTable();
        			addReadonly();
        			$("#id").val(v.id);
//        			$("#departmentId").val(v.id);
        			$("#name").val(v.name);
					$("input[name=sex]").each(function(){
						if($(this).val() == v.sex)
						{
							$(this).prop("checked","checked");
						}
					});
        			$("#phone").val(v.phone);
        			$("#fax").val(v.fax);
        			$("#mobile").val(v.mobile);
        			$("#email").val(v.email);
        			$("#qq").val(v.qq);
        			$("#skype").val(v.skype);
        			$("#im").val(v.im);
        			$("#status").val(v.status);
        			$("#address").val(v.address);
        			$("#postcode").val(v.postcode);
        			$("#photoURL").val(v.photoURL);
        			$("#foldMoney").val(v.foldMoney);
        			$("#departmentId").val(param.id);
        			$("#degree").prop("checked", v.degree ? "checked" : "");
        			$("#username").val(v.userName);
        			//$("#password").val("");
        			//$("#superAdmin").prop("checked",v.superAdmin ? "checked" : "");
                });
        		//删除用户
        		$(tr).find("td:eq(8) > button").click(function () {
					bootbox.confirm({
        				message: "确认删除用户<span class='text-primary'>"+v.name+"</span>吗？",
        				callback: function(result) {
        					if(result)
							{
								var url = "/employee/delete.htm";
								ajaxData(url , {id:v.id,} , queryDataList);
							}
        				},
						buttons: {  
                        confirm: {  
                            label: '确认',  
                            className: 'btn-primary'  
                            },  
                            cancel: {  
                                label: '取消',  
                                className: 'btn-default'  
                            }  
                        },  
        				className: "bootbox-sm"
        			});
                });
        		//重置弹层赋值
        		$(tr).find("td:eq(9) > button").click(function () {
        			bootbox.confirm({
        				message: "确认要重置用户<span class='text-primary'>"+v.name+"</span>密码吗？",
        				callback: function(result) {
        					if(result)
							{
								var url = "/employee/resetPwd.htm";
								ajaxData(url , {id:v.id,} , queryDataList);
							}
        				},
						buttons: {  
                        confirm: {  
                            label: '确认',  
                            className: 'btn-primary'  
                            },  
                            cancel: {  
                                label: '取消',  
                                className: 'btn-default'  
                            }  
                        },  
        				className: "bootbox-sm"
        			});

                });
            	$("#dataListBody").append(tr);
        	});
        	$("#dept_manager").html(param.id==0? "" : managers);
        }
		var validate = $("#emp_form").validate({
            ignore: '.ignore',
            focusInvalid: false,
            rules: {
                'username': {
                    required: true,
					rangelength:[3,20]
                },
                'name': {
                    required: true,
					maxlength:[10]
                },
				'password':{
					required: true,
					rangelength:[6,20]
				}
            },
        	messages:{
        		'name': {
                    required: "必填",
					maxlength:"长度最多是10的字符串"
                },
                'username': {
                    required: "必填",
					rangelength:"长度必须介于 3 和 20 之间"
                },
				'password':{
					required: "必填",
					rangelength:"长度必须介于 6 和 20 之间"
				}
				
        	},
            submitHandler: function () {
        		var obj = getEmpData();
        		if(obj.degree == true){
        			obj.degree = 1;
        		} else {
        			obj.degree = 0;
        		}
    			var url = "/employee/add.htm";
    			if(obj.id != null && obj.id != "")
    			{
    				url = "/employee/modify.htm"
    			}
    			ajaxData(url , obj , function(){$("#create_user_cancel_modal").click();queryDataList()});
            }
		});
		
		var validate1 = $("#dept_form").validate({
            ignore: '.ignore',
            focusInvalid: false,
            rules: {
                'name': {
                    required: true,
					maxlength:[20]
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
                'priority': {
                    required: "必填",
					digits:"必须输入整数",
					maxlength:"长度最多是20个数字"
                }
				
        	},
            submitHandler: function () {
        		var dept_id = $("#dept_modify_id").val();
    			var url = "/department/add.htm";
    			if(dept_id != null && dept_id != "")
    			{
    				url = "/department/modify.htm"
    			}
    			ajaxData(url , 
    			{id:dept_id,name:$("#dept_modify_name").val(),
    			parentId:$("#departmentId").val(),
				priority:$("#dept_modify_priority").val()} , 
				function(){window.location.href="/department/list.htm"});
            }
		});