var teachers;
function getParam(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return decodeURI(results[1]) || 0;
    }
}
function renderSite(res) {
    var data = res["data"];
    $("#extramessage").text(data["extramessage"])
    $("#title").text(data["classname"]);
    $("#class-name").text(data["classname"]);
    $("#class-description").text(data["description"]);
    $("#dates").html("<strong>Dates: </strong>"+data["dates"]);
    $("#time").html("<strong>Time: </strong>"+data["time"]);
	$("#location").html("<strong>Location: </strong>"+data["location"]);
	// $("#grades").html("<strong>Grades: </strong>" + mainteacher[0]["grades"]);
    $("#teacher1").text(data["teacher1"]);
    $("#bio1").text(data["bio"]);
    $("#img1").attr("src", "../../../images/Spring2020Headshots/"+data["teacher1img"]+".jpg")
    if(data["teacher2"] != '') {
        $("#teacher2label").text(data["teacher2position"]);
        $("#teacher2").text(data["teacher2"]);	
        $("#img2").css("image-orientation", "from-image")
        $("#bio2").text(data["bio"]);
        $("#img2").attr("src", "../../../images/Spring2020Headshots/"+data["teacher2img"]+".jpg")
    }
    if(data["teacher3"] != '') {
        $("#teacher3label").text(data["teacher3position"]);
        $("#teacher3").text(data["teacher3"]);	
        $("#img3").css("image-orientation", "from-image")
        $("#bio3").text(data["bio"]);
        $("#img3").attr("src", "../../../images/Spring2020Headshots/"+data["teacher3img"]+".jpg")
    }
    getExif()
}
$(document).ready(function() {
    var id = getParam("id");
    console.log(id)
    $.ajax({
        type: "GET",
        contentType: 'application/json',
        url : "http://localhost:3000/class2020spring?id="+id,
        // url : "https://siliconvalleyyouth.herokuapp.com/class2020?id="+id,
        dataType: "json",
        success: function(res) {
            console.log("success")
            renderSite(res)
        }
    })
})

