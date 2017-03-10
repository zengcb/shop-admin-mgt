$(
	function(){
		loadMemerPage();
	}	
)


function loadMemerPage(){
	var jsonData={
	}
	
	$("#record").pagination({
		url:"/grade/list",
		paramJson:jsonData
	})
	
}
$(document).delegate(".delete","click",function(e){
	var $dom=$(e.target); 
	var id=$dom.attr("delId");
	var jsonData={
			id:id
	}
	  bootbox.confirm({
          message:   '确定要删除该会员?',
          className: 'bootbox-sm',
          buttons: {
        	  confirm: {  
                  label: '确定',  
                  className: 'btn-primary'  
              },  
              cancel: {  
                  label: '取消',  
                  className: 'btn-default'  
              }  
          },
          callback: function(result) {
               if(result){
            		$.ajax({
            			url:"/grade/list/delete",
            			data:jsonData,
            		    success:function(data){
            		    	if(data=='处理成功'){
            					$.msg(data);
            					$dom.parent().parent().remove();
            				}else{
            					$.err(data);
            				}
            			}
            				
            		})
               }
            },

        
        });


}
)
