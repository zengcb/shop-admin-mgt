$().ready(function(){
	var gradeName=$("#grade").text();
	var $dom=$("input[name=gradeName][gradename='"+gradeName+"']");
	if($dom!=null){
		$dom.attr("checked","checked")
	}
})
$("#add").click(modifyMember);

function modifyMember(){
	var $dom=$('input:radio[name="gradeName"]:checked');
	var memberId=$("#add").val();
	var gradeId=$dom.attr("gradeid");
	var gradeName=$dom.attr("gradename");
	var jsonData={
			memberId:memberId,
			gradeId:gradeId,
			gradeName:gradeName
	}
	$.ajax({
		type:'post',
		url:'/member/list/update',
		data:jsonData,
		success:function(data){
			if(data=='处理成功'){
				$.msg("添加成功");
				window.location.href="/member"
			}else{
				$.err(data);
			}
		}
	})
	
}