/**
 * 采购合同计算公式
 * 
 * 
 * 钢厂优惠（网价下浮）	75.00 		采购合同	
 * 托盘公司利息（日息）	0.033%		采购合同	托盘公司利息，如自有资金则数值为 0
 * 钢银资金成本(年化）	8.00%		基础数据	财务规定，可调整
 * 暂估订货平均单价		2600.00 	采购合同	
 * 发货周期				30.00 		计算	预计到货日期-预计付款日期
 * 销售周期				21.00 		采购合同	
 * 预付款				260.00 		采购合同	5~10%比例保证金，抵最后一笔货款
 * 网价虚高				10.00 		采购申请	
 * 票差					6.00 		采购合同	
 * 钢银承担物流费用		20.00 		采购合同	
 * 发货周期利息			23.17 		计算	(合同单价-预付款)*托盘公司日息*发货周期
 * 预计销售单价			2590.00 	计算	平均单价-网价虚高 ？？
 * 预计尾款				45.83 		计算	钢厂优惠（网价下浮）-票差-发货周期利息
 * 理论采购利润	 		15.83 		计算	显示结果
 * 钢银资金成本	 		10.19 		计算	显示结果 (假设暂定价虚高200，结算款平均迟30天, 200和30可调）
 * 采购收益	 			5.64 		计算	显示结果
 * 采购收益 （NPV）		5.64 		计算	净现值（无需计算）
 * 
 * 注： 1. 仅用于后结算模式，包括保价代销 和 周期后结	
 *      2. 粗略假设：托盘或到港口付清； 采购钢材一次性按发货周期发货	
 *	
 * 理论采购利润=预计尾款+预计销售单价-钢银承担的物流费用-暂估订货平均单价	
 * 
 * 钢银资金成本=（预计销售单价-200）*[发货周期+(销售周期/2）]*（钢银资金成本/365）+（预计尾款+200）*（销售周期+发货周期+30）*（钢银资金成本/365）-（暂估订货平均单价-预付款）*发货周期*（钢银资金成本/365）	
 *
 * 采购收益=理论采购利润-钢银资金成本	
 * 
 */


	//********************************计算公式基础数据需要的参数值

	// 预计到货日期
	var arrivalDate = function ()
	{
		return $("#arrivalTime").val();
	}
	
	// 预计付款日期
	var payTime = function ()
	{
		return $("#payTime").val();
	}
	
	//合同明细总重量
	function getSumWeight()
	{
		var weight = 0;
		$("#createApplyItem tbody tr").each(function(){
			weight = Number(weight) + Number($(this).find("td:eq(4) input").val());
		})
		return checkNumber(weight); 
	}
	
	//合同明细总货值
	function getSumPrice()
	{
		var price = 0;
		$("#createApplyItem tbody tr").each(function(){
			var weight = checkNumber($(this).find("td:eq(4) input").val());
			var unprice = checkNumber($(this).find("td:eq(6) input").val());
 			price = price + weight * unprice;
		});
		
		return checkNumber(price);
	}

	//*********************************

	//钢银资金
	var fund = 6;
	
	//虚高价
	var highPrice = 200;
	
	//延期时间（天）
	var delayTime = 30;
	
	//托盘公司利息
	function getInterest()
	{
		var type = $("#cashServiceWay").val();
		if(type == 1)
		{
			return checkNumber($("#freeRate1").val());
		}
		else if(type == 3)
		{
			return checkNumber($("#freeRateM1").val()/30);
		}
		else
		{
			return 0;
		}
		
	}
	
	// 票税差
	function getTicketDifferential()
	{
		var ticketType = $("#pz").val();
		if(ticketType == 1)
		{
			return parseFloat(checkNumber($("#ticketFree").val()));
		}
		else
		{
			return 0;
		}
	}
	
	// 发货周期 
	function getDeliveryCycle()
	{
		var cycle = getLongByDate(arrivalDate()) - getLongByDate(payTime());
		var dayMilliseconds  = 24*60*60*1000;
		if(cycle/dayMilliseconds > 0)
		{
			return cycle/dayMilliseconds;
		}
		else
		{
			return 0;
		}
	}
	
	function checkNumber(obj)
	{
		if (!isNaN(obj))
		{
			return obj;
		}
		else
		{
			return 0;
		}
	}
	
	//初始化值 获得对象
	function initData()
	{
		var obj = {};
		//钢厂优惠（网价下浮）
		obj.favorable = Number(checkNumber($("#favorable").val()));
		//托盘公司利息（日息）
		obj.companyInterest = Number(checkNumber(getInterest())/100);
		//钢银资金成本(年化）
		obj.steelFunding = Number(fund/100);
		//暂估订货平均单价
		obj.price = Number(getSumPrice() / getSumWeight());
		//发货周期
		obj.deliveryCycle = getDeliveryCycle();
		//销售周期
		obj.sellCycle = Number($("#sellCycle").val());
		//预付款
		obj.imprest = getPrePaymentValue()/getSumWeight();
		//网价虚高
		obj.vitualNetPrice = Number(checkNumber($("#favorable").val()));
		//票差
		obj.ticketDifferential = Number(checkNumber(getTicketDifferential()));
		//钢银承担物流费用
		obj.totalLogisticsFree = Number(checkNumber($("#totalFree").val())/getSumWeight());
		
		return obj;
	}
	
	function profitCalculation()
	{	
		var settleType = $("#settleType").val();
		if (settleType == 2 || settleType == 4)
		{
			var obj = initData();
			// 预计尾款
			var finalPayment = obj.favorable - obj.ticketDifferential - ((obj.price - obj.imprest) * obj.companyInterest * obj.deliveryCycle);
			// 资金
			var fund = obj.steelFunding / 365;
			
			// 钢银资金成本
			var steelFunding = (obj.price - obj.vitualNetPrice - highPrice) * (obj.deliveryCycle + obj.sellCycle/2) * fund +
			(finalPayment + 200) * (Number(obj.sellCycle) + Number(obj.deliveryCycle) + 30) * fund - (obj.price - obj.imprest) * obj.deliveryCycle * fund;
			
			// 理论采购利润
			var purchaseProfit = finalPayment + (obj.price - obj.vitualNetPrice) - obj.totalLogisticsFree - obj.price; 
			
			// 采购收益
			
			var profit = purchaseProfit - steelFunding;
			
			$("#capitalCost").val(checkNumber(Number(steelFunding).toFixed(2)));
			$("#purchaseProfits").val(checkNumber(Number(purchaseProfit).toFixed(2)));
			$("#purchaseIncome").val(checkNumber(Number(profit).toFixed(2)));
		}
		else
		{
			$("#capitalCost").val();
			$("#purchaseProfits").val();
			$("#purchaseIncome").val();
		}
		
	}
	
	//计算预付款
	function getPrePaymentValue()
	{
		var value = $("#prepaymentMethod").val();
		
		if(value == 1)
		{
			return $("#prePayment").val() * getSumWeight();
		}
		else if(value == 2)
		{
			return getSumPrice() * $("#prePayment").val()/100;
		}
		else
		{
			return $("#prePayment").val()*10000;
		}
	}
	
	$("#profit").click(function(){
		profitCalculation();
	});
