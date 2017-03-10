
var ajax=function(param,callBack){
	console.log(param.data);
	$.ajax({
         type: param.type,
         url:  param.url,
         data: param.data,
         success:callBack
   });
};

var ajaxGet=function(params,callBack){
     	params.type="GET";
		ajax(params,callBack);
};

var ajaxPost=function(params,callBack){
	params.type="POST";
	ajax(params,callBack);
};
