/**
 * 通过弹出框选择数据
 * Created by ll on 2015/7/6.
 * 使用说明
 * $().openselect({
 *          dataUrl: '/purchase/system-data/employees.json',//获取数据URL
 *          dataType: 'get',//获取数据的请求方式
 *          dataParam:{code:null,isSubDept:false},//获取数据的请求参数
 *          dataConf:[ {key:'value',desc:''},//展示数据的配置 默认只展示'desc'中的数据（如果默认展示则数据中必须有'desc'）
 *                     {key:'desc',desc:'名称',check:true},
 *                     {key:'pinyinFirst',desc:'',check:true},
 *                     {key:'pinyin',desc:'',check:true},
 *                     {key:'dep',desc:'部门'}],//所展示的数据key为获取数据的关键字，desc为显示行的名称当desc为空时不显示，check是否作为查询验证条件
 *          dataKey:'employee',//数据在localStorage中存储的KEY
 *          dataTitle:'请选择员工',//默认为请选择数据
 *          dataSuccess:function(){},//选择请求回调函数
 *          dataFilter:function(data){}数据筛选函数
 *
 *
 *        支持以下两种回调形式。
 *            dataSuccess:function(data){
 *                $(this).find("input:text").val($(data).attr("desc"));
 *                $(this).find("input:hidden").val($(data).attr("value"));
 *            }
 *           dataSuccess:function(elm,data){
 *              $(elm).find("input:text").val($(data).attr("desc"));
 *              $(elm).find("input:hidden").val($(data).attr("value"));
 *          }
 */

$.fn.openselect=function(s){
     s = jQuery.extend({}, jQuery.ajaxSettings, s);//获取设置信息
     s.dataDom=$(this);
     var initOpenSelect=function(s){//初始化选择框
         if(!checkSetting(s))
         {
             return ;
         }
         var id="model"+new Date().getTime();
         createModelDiv(s,id);
         loadData(s);
         bindEvent(s,id);
     };
     var checkSetting=function(s){
         var b=true;

         if (!store.enabled) {
             alert('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.')
             b=false;
         }

         var key=s.dataKey;
         if(typeof(key)=='undefined'|| key==null|| $.trim(key)==''){
             b=false;
             alert('请设置有效的dataKey');
         }
         var fun=s.dataSuccess;
         if(typeof (fun)!='function'||s.dataSuccess.length==0||s.dataSuccess.length>2){
             b=false;
             alert('请设置有效的dataSuccess');
         }

         if(typeof (s.dataFilter)=='function'&& s.dataFilter.length!=1){
             b=false;
             alert('请设置有效的dataFilter');
         }

         return b;
     };
     var createModelDiv=function(s,id){//创建模态框
         var title=s.dataTitle;
         if(typeof(title)=='undefined'||title==null|| $.trim(title)=='')
         {
             title="请选择数据";
         }

         var divHTML='<div id="'+id+'" class="modal fade" tabindex="-1" role="dialog" style="display: none;">'+
             '<div class="modal-dialog">'+
                 '<div class="modal-content">'+
                     '<div class="modal-header">'+
                         '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>'+
                         '<h4 class="modal-title">'+title+'</h4>'+
                     '</div>'+
                     '<div class="modal-body ">'+
                         '<div class="row input-group">'+
                                 '<span class="input-group-addon">'+
                                     '<i class="fa fa-search"></i>'+
                                 '</span>'+
                                 '<input type="text" class="form-control" placeholder="在此输入进行搜索..." maxlength="20" name="" value="" />'+
                         '</div>'+
                         '<hr>'+
                         '<div class="row" style="height:200px;overflow-y:scroll; position: relative;">'+
                             '<table class="table table-striped table-bordered table-hover ">'+
                             '<thead> <tr><th></th> </tr> </thead>'+
                             '<tbody > <tr><td></td> </tbody>'+
                             '</table>'+
                         '</div>'+
                     '</div>'+
                     '<div class="modal-footer">'+
                         '<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>'+
                         '<button type="button" class="btn btn-primary">确定</button>'+
                     '</div>'+
                 '</div>'+
                 '</div>'+
             '</div>';

         $(s.dataDom).append(divHTML);



         //绑定弹出框事件
         $(s.dataDom).find("span").click(function(){
             if($("#"+id).is(":hidden")){
                 //$('#'+id).modal("show");
                 $("#"+id).modal({ keyboard: true});

                 var defVal= $(s.dataDom).find("input:text").val();
                 if(defVal.length!=null){
                     $("#"+id).find("input").val(defVal);
                 }else{
                     $("#"+id).find("input").val("");
                 }
                 $("#"+id).find("input").trigger("keyup");
                 //console.log($("#"+id).find("input").prop("outerHTML"));
                 $("#"+id).find("input").focus();

             }
         });
         //绑定选中事件
         $("#"+id).find("table>tbody>tr").click(function(){
             $(this).addClass("success");
             $(this).siblings().removeClass("success");
         }).dblclick(function(){
             $(s.dataDom).find("button.btn-primary").trigger("click");
         });

         //绑定确定事件
         $(s.dataDom).find("button.btn-primary").click(function(){
             var data=$("#"+id).find("table>tbody>tr.success").data("data");
             if(s.dataSuccess.length==2){
                 s.dataSuccess(s.dataDom,data);
             }else{
                 s.dataSuccess.call(s.dataDom,data);
             }

             $('#'+id).modal("hide");
         });

     };
     var checkLoad=function(dataKey){
         var loadTimeKey=dataKey+"_loadTime";
         var nowTime=new Date().getTime();
         var datas = store.get(dataKey);//需判断key的有效性
         var loadTime=store.get(loadTimeKey);

         if(typeof(datas)=='undefined'||datas==null||typeof(loadTime)=='undefined'||loadTime==null) {//store中没有数据获取数据；
             return true;
         }else{
             var subTime=nowTime-loadTime;
             var tagTime=60*60*1000;//获取数据时间间隔

             if(subTime>tagTime){//超时重新获取数据
                  return true;
             }
             return false;
         }
     };

     var loadData=function(s){//加载数据
         var loadTimeKey=s.dataKey+"_loadTime";
         if(checkLoad(s.dataKey)) {
             //console.log(new Date());
             var url= s.dataUrl;
             var type= s.dataType;

             $.ajax({
                 type: type,
                 url:url,
                 data: s.dataParam,
                 cache:false,
                 async:false,
                 success: function(data){
                     store.set(s.dataKey, data);
                     store.set(loadTimeKey, new Date().getTime());
                 }
             });

         }

         return store.get(s.dataKey);
     };
     var bindEvent=function(s,id){

         var conf= s.dataConf;
         var thead=$("#"+id).find("table>thead");
         var tbody=$("#"+id).find("table>tbody");
         var tdr=$(tbody).find("tr:first").clone(true);
         var defVal= $(s.dataDom).find("input:text").val();
         $(tbody).empty();
         var b=true;
         if(typeof (conf)=='undefined'||conf==null||conf.length==0)
         {
             b=false;//没有配制，只验证desc
         }


         renderTitle(thead,b,conf);

         $("#"+id).find("input").keyup(function(){
             var value= $.trim($(this).val());
             if(value.length==0)
             {
                 return  ;
             }
             var datas=loadData(s);

             if(typeof (s.dataFilter)=='function'&& s.dataFilter.length==1)
             {
                 datas= $.grep(datas,function(data){
                     return s.dataFilter(data);
                 });
             }

             renderBody(tbody,tdr,b,conf,datas,value);
         });

         if(defVal.length!=null){
             $("#"+id).find("input").val(defVal);
         }else{
             $("#"+id).find("input").val("");
         }
         $("#"+id).find("input").trigger("key");
     };
     var renderTitle=function(thead,b,conf){
         var thr=$(thead).find("tr:first");
         var th=$(thr).find("th:first").clone(true);
         $(thr).empty();

         var th_s=$(th).clone(true).text("");
         $(thr).append(th_s);

         if(b){
             $(conf).each(function(){
                 if(this.desc.length>0){
                     var _th=$(th).clone(true).text(this.desc);
                     $(thr).append(_th);
                 }
             });
         }else{
             var _th=$(th).clone(true).text("名称");
             $(thr).append(_th);
         }
     };
     var renderBody=function(tbody,tdr,b,conf,datas,value){
         value=value.toLowerCase();
         //清空
         $(tbody).empty();
         //渲染
         var showData=$.grep(datas,function(data){
             var check=false;
             if(b){
                 $(conf).each(function(){
                     var dataVal=$(data).attr(this.key)+"";

                     if(dataVal.indexOf(value)>=0&&this.check==true)
                     {
                         check=true;
                     }
                 });
             }else{
                 if(data.attr("desc").indexOf(value)>=0)
                 {
                     check=true;
                 }
             }
             return check;
         });

         renderTr(tbody,tdr,b,conf,showData);
     };
     var renderTr=function(tbody,tdr,b,conf,showData){

         $.each(showData,function(i,data){
             var tr=$(tdr).clone(true);
             var td=$(tr).find("td:first").clone(true);
             $(tr).empty();

             var th_s=$(td).clone(true).text(i+1);
             $(tr).append(th_s);

             if(b){
                 $(conf).each(function(){
                     if(this.desc.length>0){
                         var _td=$(td).clone(true).text($(data).attr(this.key));
                         $(tr).append(_td);
                     }
                 });
             }else{
                 var _td=$(td).clone(true).text($(data).attr("desc"));
                 $(tr).append(_td);
             }
             $(tr).data("data",data);

             $(tbody).append(tr);
         });

     };
     initOpenSelect(s);
};
