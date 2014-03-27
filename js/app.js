var app;
$(document).ready(function () {
	$.ajax({
	url: "data/actions.json",
	async: false,
	dataType: 'json',
	success: function(data) {
		app = new App(data);
	}});

	var players = app.getPlayers();

	// fills in the menu
	$.each(players,function(key,player) {
		$('<li class="playermenu"><a href="#">' + '<strong>' + player.getName() + '</strong> <span class="scoreminimenu"> - Score: <small class="'+ (app.getScore(player.getId())>=0 ? "positive":"negative")+'">'+ app.getScore(player.getId())+'</small></span></a></li>').click(function(e){
			e.preventDefault();
			displayElements(player.getId());
		}).appendTo('#players');
	});
});


function displayElements(playerId){
	var chart,table1,table2,matchdetails,playerdetails,scoredetails,welcome;
	var graphspot = $('#graph'); //proper spot of the graph
	var initialWidth = graphspot.width(); // finds the default container width
	var updateable = $(".updateable");

	//hide the graph tooltip (sometimes it doesn't hide automaticly)
	$("#tooltip").hide();

	//hide the welcome message
	welcome = $('#welcome');
	welcome.fadeOut('slow');
	
	//fade out all the updateable elements
	updateable.fadeOut('slow').promise().done(function(){//using promise().done() so events don't get fired multiple times
		welcome.remove();
		//uses a fix to draw the graph offscreen, hide and move it, and then let it fade in (flot accepts no graphs with zero width)

		//removes and inserts the offscreen div
		$('#chartfix').remove();
		$('#initialPlaceHolder').remove();
		$('body').append('<div style="position: absolute; left: -2000px;" id="chartfix"><div id="initialPlaceHolder" style="width:'+    initialWidth +'px;height:400px"></div></div>');

		//initiate matchdetails, scoredetails & playerdetails
		playerdetails = $('#playerdetails');
		scoredetails = $('#scoredetails');
		matchdetails = $('#matchdetails');

		playerdetails.empty();
		scoredetails.empty();
		matchdetails.empty();
		$('<h2>'+ app.getPlayer(playerId).getName()+'</h2>' +
		  '<h3><a href="#actiontable1">Total actions:'+ app.getAmountOfPlayerActions(playerId)+'</a></h3>').appendTo(playerdetails);
		$('<h1>Score: <span class="' + (app.getScore(playerId)>=0 ? "positive":"negative") + '">'+app.getScore(playerId) + '</span></h1>').appendTo(scoredetails);
		$('<h2>'+app.getMatchup(playerId) +'</h2>'+
		  '<h3>' + app.getMatchScore(playerId) +'</h3>').appendTo(matchdetails);

		//initiate tables and graph
		table1 = new Table($("#actiontable1"),app.getPlayerMatchData(playerId),"FirstHalf");
		table2 = new Table($("#actiontable2"),app.getPlayerMatchData(playerId),"SecondHalf");
		chart = new Graph($('#initialPlaceHolder'),app.getPlayerMatchData(playerId));

		//put graph in it's proper spot
		graphspot.append($('#initialPlaceHolder'));

		//start the chart animation
		chart.animate();

		// fade in all the updateable elemens who should have gotten their values updated
		updateable.fadeIn('slow').promise().done(function(){
			//changes the graphs width to undefined, so it can resize when the window resizes
			$('#initialPlaceHolder').css('width','');
		});
	});
}