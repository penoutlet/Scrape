// on.click and ajax 
$(document).ready(function(){


$(document).on("click", "#scrape-button", function(){  
	$("#footer").empty()
	
	$.ajax ({
		method: "GET",
		url: "http://localhost:3000/articles"
	}).done(function(response){
		// console.log("response" + JSON.stringify(response[0].title));

	for (var i = 0; i < 20; i++) {
		var title = JSON.stringify(response[i].title);
		var link =  JSON.stringify(response[i].link);
		
		var stories = title + link; 
		console.log(stories);
		// var element=  + stories + ;
		var element = $("<p>" + "<a href =" + link  + ">" + title + "</a>"  + "<p>");
		$("#footer").append(element);

		// button for bootstrap
		// "<a class='btn btn-warning btn-lg' id='scrape-button' href='#' role='button'><span class=""aria-hidden='true'></span> Scrape</a>"
	}
	});


});
});
// document.ready function end
