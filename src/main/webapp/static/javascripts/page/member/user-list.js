$(
	function(){
		loadMemerPage();
	}	
)


function loadMemerPage(){
	var moblie=$("#moblie").val();
	var memberId=$("#memberId").val();
	var name=$("#name").val();
	var provinceCode=$("#seachprov").val();
	var province=$("#tags")[0].value;
	
	if(province=="请选择"||province==""){
		province="";
	}
	var userId=$("#userId").val();
	var jsonData={
		
		pageNum:1,
		numPerPage:10,
		moblie:moblie,
		memberId:memberId,
		name:name,
		province:province,
		userId:userId
	}
	
	$("#record").pagination({
		url:"/user/list",
		paramJson:jsonData
	})
}
	$(".searchBtn").click(function(){
		loadMemerPage();
	})
	
	$(".resetBtn").click(function(){
		$("#moblie").val("");
		$("#userId").val("");
		$("#memberId").val("");
		$("#name").val("");
		$("#province").val("")
		$("#tags")[0].value=""
		$("#seachprov").val("0");	
	})
	
$(".down").click(function(){
	var userId=$("#userId").val();
	if(userId==null){
		userId="";
	}
	var moblie=$("#mobile").val();
	if(moblie==null){
		moblie="";
	}
	var memberId=$("#memberId").val();
	if(memberId==null){
		memberId="";
	}
	var name=$("#name").val();
	if(name==null){
		name="";
	}
	var provinceCode=$("#seachprov").val();
	var province=$("#seachprov [value="+provinceCode+"]").text();
	if(province=="请选择"){
		province="";
	}
	window.location.href="/user/downFile?moblie="+moblie+"&&memberId="+memberId+"&&name="+name+"&&province="+province+"&&userId="+userId;
	
})