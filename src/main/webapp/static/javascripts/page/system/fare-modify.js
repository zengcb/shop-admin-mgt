/**
 * 
 */
  
    	$(function(){
    		
    		
		$("#return").click(function(){
			window.location.href="/system/fare";
		})
		$("#submit").click(function(){
				var canPackage=$("input[name='canPackage']:checked").val();
				if(canPackage=='0'){
					submitByUser();
				}else{
					submitByAdmin();
				}
		})
		
    		
		//如果用户先选择了包邮，然后修改的时候选不包邮，要清空defaultTid
		$(document).delegate(".packageCond","change",function(){
			var dom=$(this);
			//var cond=$(".packageCond").val();
			
			var cond=dom.val();
			//金额
			if(cond=="0"){
				$(this).parent().parent().find(".kind").hide();
				$(this).parent().parent().find(".priceAndkind").hide();
				$(this).parent().parent().find(".price").css("display","inline");
			}
			//件数
			else if(cond=="1"){
				$(this).parent().parent().find(".kind").css("display","inline");
				$(this).parent().parent().find(".priceAndkind").hide();
				$(this).parent().parent().find(".price").hide();
			}
			//金额+件数
			else if(cond=="2"){
				$(this).parent().parent().find(".kind").hide();
				$(this).parent().parent().find(".priceAndkind").css("display","inline");
				$(this).parent().parent().find(".price").hide();
			}
		})
		
		$("#addPackage").click(function(){
			$("#setting").toggle();
		})
		
	})
	
	
  
   	//点击为指定地区城市设置运费 添加运费行
	$("#setFare").click(function(){
		addFareTr();
	});
	
	$("#setPackage").click(function(){
		$("#packageTable").toggle();
	});
	
	$(document).delegate(".delFare","click",function(){
		$(this).parent().parent().remove();
		var id=$(this).attr("tid");
		if(id){
			delTransport(id);
		 }
	});
	
	
   function delTransport(id){
			$.ajax({
				url:"/system/fare/delTransport",
				type:"post",
				data:{id:id},
				success:function(result){
					if(result.status=="ok"){
	                $.msg("删除成功");
	                setTimeout(function(){
	                	window.loocation.reload();
	                },1000);
				}else{
				   $.err(result.status);
	            }
				},
				
			})
		}
	
   
   
	$(document).delegate(".delPackage","click",function(){
		$(this).parent().parent().remove();
		var id=$(this).attr("pid");
		delPackage(id);
	});
	
	
   	function delPackage(id){
			$.ajax({
				url:"/system/fare/delPackage",
				type:"post",
				data:{id:id},
				success:function(result){
					if(result.status=="ok"){
	                $.msg("删除成功");
				}else{
				   $.err(result.status);
	            }
				},
				
			})
		}
   	
   function addFareTr(){
		var dom=$("#fm").clone();
		dom.css("display","table-row");
		dom.removeAttr("id");
		dom.find(".tagId").SumoSelect({csvDispCount: 200,
	       captionFormat: '已经选择{0}个城市	',
	       isSingle:false,
	       search:false});
		$("#fareTable").append(dom);
	}
    
	function addPackageTr(){
		var dom=$("#pm").clone();
		dom.css("display","table-row");
		dom.removeAttr("id");
		dom.find(".tagId").SumoSelect({csvDispCount: 200,
	       captionFormat: '已经选择{0}个城市	',
	       isSingle:false,
	       search:false});
		$("#packageTable").append(dom);
		
	}
	
	$(document).delegate(".delFare","click",function(){
		$(this).parent().parent().remove();
	});
	
	$(document).delegate(".delPackage","click",function(){
		$(this).parent().parent().remove();
	});
	
	function submitByUser(){
		var packageMails=new Array();
		$(".baoyou .baoyouActive").each(function(i,elem){
			packageMails.push($(elem).html());					
			console.log(packageMails);
		})
		var name=$("#name").val();
		var canPackage=$("input[name='canPackage']:checked").val();
		var priceWay=$("input[name='priceWay']:checked").val();
		if(name==""){
			$.err("模板名称不能为空");
			return false;
		}
		if(canPackage==""){
			$.err("是否包邮不能为空");
			return false;
		}
		if(priceWay==""){
			$.err("计价方式不能为空");
			return false;
		}
		var transportTemplate = {};  
		transportTemplate.name = name;  
		transportTemplate.priceWay = priceWay;  
		transportTemplate.canPackage=canPackage
		
		transportTemplate.packageMails=packageMails.toString();
		
		var transportTemplateId=$("#submit").attr("value");
		$.ajax({  
		    type: "POST",  
		    url: "/system/fare/modifyuser",  
		    data: {
		    	transportTemplate:JSON.stringify(transportTemplate),
		    	transportTemplateId:transportTemplateId
		    },
		    success: function(data){  
		    	if(data.status=='ok'){
		    		$.msg("添加成功");
		    		window.location.href="/system/fare";
		    	}else{
		    		$.err(data.status);
		    	}
		    }  
		});  
}

function submitByAdmin(){
		var packageMails=null;
		var transportFrees=null;
		transportFrees=loadFareArray();
		if($("#setting").css("display")!="none"){
			packageMails=loadPackageArray();
		}
		var name=$("#name").val();
		var canPackage=$("input[name='canPackage']:checked").val();
		var priceWay=$("input[name='priceWay']:checked").val();
		if(name==""){
			$.err("模板名称不能为空");
			return false;
		}
		if(canPackage==""){
			$.err("是否包邮不能为空");
			return false;
		}
		if(priceWay==""){
			$.err("计价方式不能为空");
			return false;
		}
		var transportTemplate = {};  
		transportTemplate.name = name;  
		transportTemplate.priceWay = priceWay;  
		transportTemplate.canPackage=canPackage
		
		transportTemplate.packageMails=packageMails;
		transportTemplate.transportFrees=transportFrees;
		console.log(transportTemplate);
		
		var transportTemplateId=$("#submit").attr("value");
		$.ajax({  
		    type: "POST",  
		    url: "/system/fare/modify",  
		    data: {
		    	transportTemplate:JSON.stringify(transportTemplate),
		    	transportTemplateId:transportTemplateId
		    },
		    success: function(data){  
		    	if(data.status=='ok'){
		    		$.msg("修改成功");
		    		setTimeout(function(){window.location.href="/system/fare";},1000);
		    	}else{
		    		$.err(data.status);
		    	}
		    }  
		});  
}

function loadFareArray(){
	//获取运送记录和包邮费集合
	var len=$("#fareTable tr:gt(2)").length+2;
	var transportFrees = new Array();
	var defaultArea="全国"
	var defaultNum=$(".header input[name='num']").val();
	var defaultPrice=$(".header input[name='price']").val();
	var defaultAddNum=$(".header input[name='addNum']").val();
	var defaultAddPrice=$(".header input[name='addPrice']").val();
	var tid=$("#defaultTid").attr("tid");
	var canDefault=1;
	transportFrees.push({areas:defaultArea,canDefault:canDefault,num:defaultNum,price:defaultPrice,addNum:defaultAddNum,addPrice:defaultAddPrice,id:tid});
	for(var i=2;i<=len;i++){
		var areas=$("#fareTable tr:eq("+i+") td .tagId").val();
		if(areas==undefined){
			continue;
		}
		var area="";
		for(var j=0;j<areas.length;j++){
			area+=areas[j];
			if(j!=areas.length-1){
				area+="/";
			}
		}
		var canDefault=0;
		var num=$("#fareTable tr:eq("+i+") td .num").val();
		var price=$("#fareTable tr:eq("+i+") td .price").val();
		var addNum=$("#fareTable tr:eq("+i+") td .addNum").val();
		var addPrice=$("#fareTable tr:eq("+i+") td .addPrice").val();
		var tid=$("#fareTable tr:eq("+i+") td .delFare").attr("tid");
		transportFrees.push({areas:area,canDefault:canDefault,num:num,price:price,addNum:addNum,addPrice:addPrice,id:tid});
	}
	
	
		console.log(transportFrees);
		return transportFrees;
}

function loadPackageArray(){
	var len=$("#packageTable tr:gt(1)").length+2;
	var packageMails = new Array();
	var defaultArea="全国"
	var transportWay="快递";
	var defaultConditionParameter=$("#packageTable tr:eq(1) .conditionParameter").val();
	var defaultNum=null;
	var canDefault=1;
	var defaultPrice=null;
	//TODO
	var defaultPid=$("#packageTable tr:eq(1) td:eq(3) .delPackage").attr("pid");
	if(defaultConditionParameter==0){
		defaultPrice=$("#packageTable tr:eq(1) input[name='price']:eq(0)").val();
	}else if(defaultConditionParameter==1){
		defaultNum=$("#packageTable tr:eq(1) input[name='num']:eq(0)").val();
	}else{
		defaultNum=$("#packageTable tr:eq(1) input[name='num']:eq(1)").val();
		defaultPrice=$("#packageTable tr:eq(1) input[name='price']:eq(1)").val();
	}
	
	var canDefault=1;
	packageMails.push({areas:defaultArea,canDefault:1,num:defaultNum,price:defaultPrice,conditionParameter:defaultConditionParameter,transportWay:transportWay,canDefault:canDefault,id:defaultPid});
	return packageMails;
}	