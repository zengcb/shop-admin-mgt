/**
 *      $(curInput).data("province",allProId);省
 *      $(curInput).data("city",cityIdAll);市
 *      $(curInput).data("area",countyId);区
 */

var areaSelect=function() {
	var curInput=null;
	var allProvinces = null;
	var allCities = null;
	var allAreas = null;
	var allProId = null;
	var cityIdAll = null;
	var provinceAllTotalPage = null;
	var pa_pageSize = 12;
	var pa_currentPage = 1;
	var level=3;
	function sendAllProvinceAjax() {
		
	    allProvinces=[];
		$.each(getCityList(2),function(){
	       var param={};
	       param.id=this.code;
	       param.updateTime=this.type;
	       param.provinceName=this.name;
	       param.indexId=this.code;
	       allProvinces.push(param);
		});
	    $("body").data("allProvinces", allProvinces);
	    viewAllProvince(1);

	}

	function sendAllCitiesAjax() {
	    allCities=[];
		$.each(getCityList(3),function(){
	       var param={};
	       param.name=this.name;
	       param.id=this.code;
		   param.cityPinyin=this.enname;
		   param.lastModifyTime=null;
		   param.provinceId=this.parentCode;
		   param.hotCity=false;
		   param.cityShortPY=this.ensname;

	       allCities.push(param);
		});
	    $("body").data("CitysAll", allCities);
	    viewAllHotCities();

	}

	function sendAllCountiesAjax(){
	    allAreas=[];
		$.each(getCityList(4),function(){
	       var param={};
	       var areaInfo=getCity(this.parentCode);

			param.id=this.code;
			param.cityId=this.parentCode;
			param.cityName=areaInfo.name;
			param.areaName=this.name;
			param.updateTime=1335186853000;
			param.provinceId=areaInfo.parentCode;
			param.pinYin=this.enname;
			param.pinYinChar=this.ensname;
			param.isShowWithCity=0;
	        allAreas.push(param);
		});

	    $("body").data("allCountys",allAreas);
	    viewAllHotCities();
	}


	function viewAllHotCities() {
		$.each(allCities,
		function(i, city) {
			if (city.hotCity) {
				$("body").find(".hotCityAll .list ul").append("<li><a><input type='button' style='background:none;border:0px;cursor: pointer;' onclick=hotCityAddrInputAll(\'" + city.provinceId + "," + city.id + "," + city.name + "\') id='" + city.id + "' value='" + city.name + "'></a></li>");
			}
		});
	};


	function viewAllCities(i) {
		allProId = allProvinces[i].id;

		$("body").data("pAllName", allProvinces[i].provinceName);
		$("body").data("pAllId", allProId);
		$("body").find(".province").val(allProId);
		$(curInput).data("province",allProId);
		$(curInput).data("data",allProId);
		$(curInput).val(allProvinces[i].provinceName);
		if(level==1){
			changeDiv();
			return;
		}
		allCitys = [];
		var j = 0;
		$.each(allCities,
		function(i, city) {
			if (city.provinceId == allProId) {
				allCitys[j++] = city;
			}
		});
		allCityTotalPage = Math.ceil(allCitys.length / pa_pageSize);
		$("body").find(".provinceCityAll").find(".tabs").find("a").removeClass("current");
		$("body").find(".provinceCityAll .tabs").find("#cityAll").addClass("current");
		$("body").find(".con .provinceAll .list a").removeClass("current");
		$("body").find(".con .provinceAll .list a[id='" + allProId + "']").addClass("current");
		$("body").find(".provinceCityAll").find(".con").children().hide();
		$("body").find(".provinceCityAll").find(".con").find(".cityAll").show();
		allCityPage(1);
	};




	function viewAllProvince(page) {
		$("body").find(".provinceAll .list ul li").remove();
		if (page == 1) {
			$("body").find(".provinceAll .pre a").removeClass("can");
			$("body").find(".provinceAll .next a").addClass("can");
		} else {
			$("body").find(".provinceAll .pre a").addClass("can");
			$("body").find(".provinceAll .next a").addClass("can");
		}
		var end;
		var start;
		if (page == provinceAllTotalPage) {
			start = (page - 1) * pa_pageSize;
			end = allProvinces.length;
			$("body").find(".provinceAll .next a").removeClass("can");
		} else {
			start = (page - 1) * pa_pageSize;
			end = start + pa_pageSize;
		}
		for (var i = start; i < end; i++) {
			var p_id = allProvinces[i].id;
			var p_name = allProvinces[i].provinceName;
			if (allProvinces[i].provinceName == '内蒙古自治区') {
				p_name = '内蒙古';
			} else if (allProvinces[i].provinceName == '黑龙江省') {
				p_name = '黑龙江';
			} else {
				p_name = allProvinces[i].provinceName.substr(0, 2);
			}
			var li = $('<li><a style="background: none repeat scroll 0% 0% transparent; border: 0px none;" href="javascript:;" id="' + p_id + '">' + p_name + '</a></li>');
			$(li).data("i",i).click(function(){
				viewAllCities($(this).data("i"));
			});
			$("body").find(".provinceAll .list ul").append(li);
		}
		$("body").find(".provinceAll .list #provincePage1").remove();
		$("body").find(".provinceAll .list").append("<label id='provincePage1' style='display:none;'>" + page + "</label>");
	};



	function viewAllCounties(i) {
		cityIdAll = allCitys[i].id;
		
		$("body").data("cAllId", cityIdAll);

        $("body").find(".city").val(cityIdAll);
        $("body").find(".province").val($("body").data("pAllId"));
        
        $(curInput).data("province",$("body").data("pAllId"));
        $(curInput).data("city",cityIdAll);
        $(curInput).data("data",cityIdAll);
        
		var cityname = $.trim(allCitys[i].name);

		$("body").data("nameOfCityAll", cityname);
		countiesAll = [];
		var j = 0;
		$.each(allAreas,
		function(i, countys) {
			if (countys.cityId == cityIdAll) {
				countiesAll[j++] = countys;
			}
		});
		countyTotalPageAll = Math.ceil(countiesAll.length / pa_pageSize);
		$("body").find(".provinceCityAll").find(".tabs").find("a").removeClass("current");
		$("body").find(".provinceCityAll .tabs").find("#countyAll").addClass("current");
		$("body").find(".con .cityAll .list a").removeClass("current");
		$("body").find(".con .cityAll .list a[id='" + cityIdAll + "']").addClass("current");
		$("body").find(".provinceCityAll").find(".con").children().hide();
		$("body").find(".provinceCityAll").find(".con").find(".countyAll").show();
		allCountyPage(1);
	}



	function allCityPage(page) {
		$("body").find(".cityAll .list ul li").empty();
		$("body").find(".cityAll .list ul li").remove();
		if (page == 1) {
			$("body").find(".cityAll .pre a").removeClass("can");
		} else {
			$("body").find(".cityAll .pre a").addClass("can");
		}
		var start;
		var end;
		if (page <= 1) {
			page = 1;
			$("body").find(".cityAll .pre a").removeClass("can");
			$("body").find(".cityAll .next a").addClass("can");
		}
		if (allCityTotalPage == 1) {
			$("body").find(".cityAll .next a").removeClass("can");
			$("body").find(".cityAll .pre a").removeClass("can");
		}
		if (page >= allCityTotalPage) {
			page = allCityTotalPage;
			$("body").find(".cityAll .next a").removeClass("can");
			start = (page - 1) * pa_pageSize;
			end = allCitys.length;
		} else if (page == 1) {
			start = (page - 1) * pa_pageSize;
			end = start + pa_pageSize;
			$("body").find(".cityAll .pre a").removeClass("can");
			$("body").find(".cityAll .next a").addClass("can");
		} else {
			start = (page - 1) * pa_pageSize;
			end = start + pa_pageSize;
			$("body").find(".cityAll .next a").addClass("can");
			$("body").find(".cityAll .pre a").addClass("can");
		}
		for (var i = start; i < end; i++) {
			var c_id = allCitys[i].id;
			var cityName = allCitys[i].name.substr(0, 4);
			var li = $('<li><a href="javascript:;" id="' + c_id + '">' + cityName + '</a></li>');
			$(li).data("i",i).click(function(){
				viewAllCounties($(this).data("i"));
			});

			$("body").find(".cityAll .list ul").append(li);
		}
		$("body").find(".cityAll .list #cityPage1").remove();
		$("body").find(".cityAll .list").append("<label id='cityPage1' style='display:none;'>" + page + "</label>");
	};


	function allCountyPage(page) {
		var nameOfProvince = $("body").data("pAllName");
		var cityCurrentName = $("body").data("nameOfCityAll");
		
		$(curInput).removeClass("iGrays");
		$(curInput).val(nameOfProvince + cityCurrentName);
		if(level==2){
			changeDiv();
			return;
		}
		$("body").find(".countyAll .list ul li").remove();
		if (page == 1) {
			$("body").find(".countyAll .pre a").removeClass("can");
		} else {
			$("body").find(".countyAll .pre a").addClass("can");
		}
		var start;
		var end;
		if (page <= 1) {
			page = 1;
			$("body").find(".countyAll .pre a").removeClass("can");
			$("body").find(".countyAll .next a").addClass("can");
		}
		if (countyTotalPageAll == 1) {
			$("body").find(".countyAll .next a").removeClass("can");
			$("body").find(".countyAll .pre a").removeClass("can");
		}
		if (page >= countyTotalPageAll) {
			page = countyTotalPageAll;
			$("body").find(".countyAll .next a").removeClass("can");
			start = (page - 1) * pa_pageSize;
			end = countiesAll.length;
		} else if (page == 1) {
			start = (page - 1) * pa_pageSize;
			end = start + pa_pageSize;
			$("body").find(".countyAll .pre a").removeClass("can");
			$("body").find(".countyAll .next a").addClass("can");
		} else {
			start = (page - 1) * pa_pageSize;
			end = start + pa_pageSize;
			$("body").find(".countyAll .next a").addClass("can");
			$("body").find(".countyAll .pre a").addClass("can");
		}
		for (var i = start; i < end; i++) {
			var c_id = countiesAll[i].id;
			var countyName = countiesAll[i].areaName.substr(0, 4);;
			var li = $('<li><a href="javascript:;" id="' + c_id + '">' + countyName + '</a></li>');

			$(li).data("i",i).click(function(){
				addrInputAll($(this).data("i"));
			});

			$("body").find(".countyAll .list ul").append(li);
		}
		$("body").find(".countyAll .list #countyPage1").remove();
		$("body").find(".countyAll .list").append("<label id='countyPage1' style='display:none;'>" + page + "</label>");
	}

	function addrInputAll(i) {
		var countyId = $.trim(countiesAll[i].id);
		$("body").find(".con .hotCityAll .list a input").removeClass("current");
		$("body").find(".con .hotCityAll .list a input[id='" + cityIdAll + "']").addClass("current");
		$("body").find(".con .countyAll .list a").removeClass("current");
		$("body").find(".con .countyAll .list a[id='" + countyId + "']").addClass("current");
		allProId = $("body").data("pAllId");
		cityIdAll = $("body").data("cAllId");
		$("body").data("aAllId",countyId);
        
        $(curInput).data("province",allProId);
        $(curInput).data("city",cityIdAll);
        $(curInput).data("area",countyId);
        $(curInput).data("data",countyId);
        
		var p = null;
		
		$.each(allProvinces,
		function(i, province) {
			if (province.id == allProId) {
				p = province.provinceName;
			
				return false;
			}
		});
		var c = null;
	
		$.each(allCities,
		function(i, city) {
			if (city.id == cityIdAll) {
				c = city.name;
			
				return false;
			}
		});
		var a = null;
		
		$.each(countiesAll,
		function(i, county) {
			if (county.id == countyId) {
				a = county.areaName;
				return false;
			}
		});
		var rtn = p + c + a;
		$(curInput).val(rtn);
		changeDiv();
	};

    function changeDiv(){
    	var nameValue = $(curInput);
		nameValue.removeClass("iGrays");
		$("body").find(".provinceCityAll").hide();
		$("body").find(".backifname").hide();
		var nameValue = $(curInput).attr("name");
		if (nameValue == "consignor.addrProCity") {
			$("body").find("#provinceId").val(allProId);
			$("body").find("#cityId").val(cityIdAll);
		}
		if (nameValue == "order.caddrProCity")
		 {
			$("body").find("input[name='order.caddrProCity']").trigger("change");
		}
		if (nameValue == "consigneeInfo.addrProCity")
		 {
			$("body").find("input[name='consigneeInfo.addrProCity']").trigger("change");
		}
		if (nameValue == 'template.caddrProCity')
		 {
			$("body").find("input[name='template.caddrProCity']").trigger("change");
		}
    };

	function addrInput(i) {
		
		var countyId = $.trim(counties[i].id);
		$("body").find(".con .hotCity .list a input").removeClass("current");
		$("body").find(".con .hotCity .list a input[id='" + cityId + "']").addClass("current");
		$("body").find(".con .county .list a").removeClass("current");
		$("body").find(".con .county .list a[id='" + countyId + "']").addClass("current");
		proId = $("body").data("pId");
		cityId = $("body").data("cId");

		var p = null;
		$.each(provinces,
		function(i, province) {
			if (province.id == proId) {
				p = province.provinceName;
				return false;
			}
		});
		var c = null;
		$.each(cities,
		function(i, city) {
			if (city.id == cityId) {
				c = city.name;
				return false;
			}
		});
		var a = null;
		$.each(counties,
		function(i, county) {
			if (county.id == countyId) {
				a = county.areaName;
				return false;
			}
		});
		$("body").find("input.current1").removeClass("iGrays");
		$("body").find(".provinceCity").hide();
		var rtn = p + c  + a;
		$("body").find("input.current1").val(rtn);
		$("body").find(".backifname").hide();
		var nameValue = $("body").find("input.current1").attr("name");
		if (nameValue == 'order.sdeptProCity')
		 {
			$("body").find("#deptCityId").val(cityId);
			$("body").find("input[name='order.sdeptProCity']").trigger("change", [cityId, countyId]);
		}
		if (nameValue == 'consignor.deptProCity')
		 {
			$("body").find("input[name='consignor.deptProCity']").trigger("change", [cityId, countyId]);
		}
		if (nameValue == 'template.sdeptProCity')
		 {
			$("body").find("input[name='template.sdeptProCity']").trigger("change", [cityId, countyId]);
		}
	}

	function countAllProvincePages() {
		provinceAllTotalPage = Math.ceil(allProvinces.length / pa_pageSize);
		return provinceAllTotalPage;
	}





     var bindEvent=function(){
		$("input.proCitySelAll").click(function(event) {
			curInput=$(this);
            $("body").find(".province").val("");
            $("body").find(".city").val("");
            $("body").find(".area").val("");
            $(this).val("");

			if ($("body").data("CitysAll") == null) {
				sendAllCitiesAjax();
			}
			$(this).select();
			$("body").find(".provinceCity").hide();
			$("body").find(".provinceCityAll").hide();
			$("body").find("#dimCityQuery").hide();
			

			var o2 = $(this).offset();
			var l2 = o2.left;
			var t2 = o2.top;
			var h2 = $(this).height();//t2 + h2 -20
			$("body").find(".provinceCityAll").css("top", t2).css("left", l2).toggle();
			$("body").find(".provinceCityAll").click(function(event) {
				event.stopPropagation();
			});

			event.stopPropagation();
			
			$("body").find(".provinceCityAll").find("div>ul>li>a#sureArea").click(function() {
				$("body").find(".provinceCityAll").hide();
			});
			$("html").click(function() {
				$("body").find(".provinceCityAll").hide();
			});

			$(this).removeClass("current2");
			$(this).addClass("current2");
			$("body").find(".provinceCityAll").find(".tabs").find("a").removeClass("current");
			$("body").find(".provinceCityAll").find(".tabs").find("a[tb=provinceAll]").addClass("current");
			$("body").find(".provinceCityAll").find(".con").children().hide();
			$("body").find(".provinceCityAll").find(".con").find(".provinceAll").show();

			if ($("body").data("allProvinces") == null) {
				sendAllProvinceAjax();
			}
			if ($("body").data("allCountys") == null) {
				sendAllCountiesAjax();
			}

			$(".provinceCityAll").find(".tabs").find("a").click(function() {
				if ($(this).attr("tb") == "cityAll" && $("body").find(".provinceAll .list .current").val() == null) {
					return;
				};
				if ($(this).attr("tb") == "countyAll" && $("body").find(".cityAll .list .current").val() == null && $("body").find(".hotCityAll .list .current").val() == null) {
					return;
				};
				$("body").find(".provinceCityAll").find(".tabs").find("a").removeClass("current");
				$(this).addClass("current");
				var tb = $(this).attr("tb");
				$("body").find(".provinceCityAll").find(".con").children().hide();
				$("body").find(".provinceCityAll").find(".con").find("." + tb).show();
			});

		});



		$("body").find(".provinceAll .pre a").bind('click',
			function() {
				var provincePage1 = parseInt($("body").find('#provincePage1').html());
				if (provincePage1 == 1) {
					return;
				}
				viewAllProvince(provincePage1 - 1);
			}
		);
		$("body").find(".cityAll .pre a").bind('click',
			function() {
				var cityPages1 = parseInt($("body").find('#cityPage1').html());
				if (cityPages1 == 1) {
					return;
				}
				allCityPage(cityPages1 - 1);
			}
		);
		$("body").find(".countyAll .pre a").bind('click',
			function() {
				var countyPages = parseInt($("body").find('#countyPage1').html());
				if (countyPages == 1) {
					return;
				}
				allCountyPage(countyPages - 1);
			}
		);
		$("body").find(".provinceAll .next a").bind('click',
			function() {
				var provincePage1 = parseInt($("body").find('#provincePage1').html());
				provinceAllTotalPage = countAllProvincePages();
				if (provincePage1 >= provinceAllTotalPage) {
					return;
				}
				viewAllProvince(provincePage1 + 1);
			}
		);
		$("body").find(".cityAll .next a").bind('click',
			function() {
				if ($(this).hasClass("can")) {
					var cityPages1 = parseInt($("body").find('#cityPage1').html());
					allCityPage(cityPages1 + 1);
				}
			}
		);

		$("body").find(".countyAll .next a").bind('click',
			function() {
				if ($(this).hasClass("can")) {
					var countyPages = parseInt($("body").find('#countyPage1').html());
					allCountyPage(countyPages + 1);
				}
			}
		);

     };

    return {
    	init:function(param){
    		  if(typeof(param.level)!="undefined")
    		  {
    			  level=param.level;
    		  }	  
              bindEvent();
    	}
    }
}(); 