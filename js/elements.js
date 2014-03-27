function App(data){
	var players ={};
	processData(data);

	this.getPlayers = function(){
		return players;
	}
	this.getPlayer = function(playerId){
		return players[playerId];
	}
	this.getScore = function(playerId){
		//hardcoding the match to fetch as there is only 1 match per player in this example
		return players[playerId].getPlayerMatches()[0].getPlayerScore();
	}
	this.getMatchup = function(playerId){
		//hardcoding the match to fetch as there is only 1 match per player in this example
		return players[playerId].getPlayerMatches()[0].getMatchup();
	}
	this.getMatchScore = function(playerId){
		//hardcoding the match to fetch as there is only 1 match per player in this example
		return players[playerId].getPlayerMatches()[0].getMatchScore();
	}
	this.getAmountOfPlayerActions = function(playerId){
		//hardcoding the match to fetch as there is only 1 match per player in this example
		return players[playerId].getPlayerMatches()[0].getAmountOfPlayerActions();
	}
	this.getPlayerMatchData = function(playerId){
		//hardcoding the match to fetch as there is only 1 match per player in this example
		return players[playerId].getPlayerMatches()[0];
	}

	//private function to process JSON data - to be called on App object creation
	function processData(actionData){
		//Foreach loop to group actions in a player and playermatch object
		$.each(actionData, function( key, action ) {
			var playerId = action.player_id;
			var matchData = action.match;

			//create the player if the player doesn't exist yet and add it to the list of players
			var player = players[playerId];
			if(typeof(player)=='undefined'){ 
				player = new Player(action.player_name,playerId,action.squad);
				players[playerId] = player;
			}
			
			//create the playermatch object if it doesn't exist yet
			var playerMatch = player.getPlayerMatch(matchData.played_on);
			if(typeof(playerMatch)=='undefined'){ 
				playerMatch = new PlayerMatch(matchData.played_on,matchData.away_squad,matchData.away_score,matchData.home_squad,matchData.home_score,action.league.name,action.league.season);
				player.addPlayerMatch(playerMatch);
			}
			//add the playeraction to the playermatch
			playerMatch.addAction(new Action(action.action_name,action.id,action.minutes,action.period,action.occurences,action.timestamp,action.total_points));
		});
	}
}
function Player(name,id){
	var playerName = name;
	var playerId = id;
	var playerMatches = [];
	//data set is inconsistent - sometimes uses squad, sometimes uses squadid
	//var playerSquad = squad;

	//Accessor methods
	this.getName = function(){
		return playerName;
	}
	this.getId = function(){
		return playerId;
	}
	//returns the playermatch with matching playedOn timestamp
	this.getPlayerMatch = function(playedOn){
		var p;
		$.each(playerMatches,function(key,playerMatch){
			if(playerMatch.getPlayedOn() == playedOn)
				p = playerMatch;
		});
		return p;
	}
	this.getPlayerMatches = function(){
		return playerMatches;
	}
	//data set is inconsistent - sometimes uses squad, sometimes uses squadid
	/*this.getSquad = function(){
		return playerSquad;
	}*/

	//Mutator methods
	this.addPlayerMatch = function(playerMatch){
		playerMatches.push(playerMatch);
	}	
}
function PlayerMatch(playedOn,awaySquad,awayScore,homeSquad,homeScore,leagueName,leagueSeason){
	var playedOn  = playedOn;
	var awaySquad = awaySquad;
	var awayScore = awayScore;
	var homeSquad = homeSquad
	var homeScore = homeScore;
	var leagueName= leagueName;
	var leagueSeason=leagueSeason;

	var actions = [];

	//Mutator Methods
	this.addAction = function(action){
		actions.push(action);
	}

	//Accessor Methods
	this.getPlayedOn = function(){
		return playedOn;
	}
	this.getMatchup = function(){
		return homeSquad + " - " + awaySquad;
	}
	this.getMatchScore = function(){
		return homeScore + " - " + awayScore;
	}
	this.getLeagueName = function(){
		return leagueName;
	}
	this.getLeagueSeason = function(){
		return leagueSeason;
	}
	this.getActions = function(){
		//sort actions before returning them
		actions.sort(actionSort);
		return actions;
	}
	this.getAmountOfPlayerActions = function(){
		var amount = 0;
		$.each(actions,function(key,action){
			amount += action.getOccurences();
		});
		return amount;
	}
	this.getPlayerScore = function(){
		var score = 0;
		$.each(actions,function(key,action){
			score += action.getTotalPoints();
		});
		return score;
	}

	//private costum compare function to help sort the actions based on the timestamp
	function actionSort(a,b){
		if (a.getTimestamp() < b.getTimestamp())
	    	return -1;
	  	if (a.getTimestamp() > b.getTimestamp())
	    	return 1;
	  	return 0;
	}
}
function Action(name,id,minutes,period,occurences,timestamp,points){
	var actionName = name;
	var actionId   = id;
	var minutes    = minutes;
	var period     = period;
	var occurences = occurences;
	var timestamp  = timestamp;
	var totalPoints= points;
	var fancyName = {'match_won'           	: 'Match Won',
					'match_lost'          	: 'Match lost',
					'goal_scored_team'    	: 'Goal scored by team',
					'goal_against_team'   	: 'Goal against team',
					'goal'                	: 'Goal',
					'assist'              	: 'Assist',
					'big_chance_created'  	: 'Big chance created',
					'aerial_duel_won'     	: 'Aerial duel won',
					'dribble_won'         	: 'Dribble won',
					'successful_pass'		: 'Successful pass',
					'successful_duel'     	: 'Successful duel',
					'shot_on_target'      	: 'Shot on target',
					'long_pass'           	: 'Long pass',
					'defensive_clearance'	: 'Defensive clearance',
					'starting_11'         	: 'Starting 11',
					'clean_sheet'         	: 'Clean sheet',
					'cross_completed'     	: 'Cross completed',
					'interception'        	: 'Interception',
					'offside'             	: 'Offside',
					'blocked_shot'        	: 'Blocked Shot',
					'attempt_saved'       	: 'Attempt Saved'};

	//Accessor methods
	this.getName = function(){
		return actionName;
	}
	this.getFancyName = function(){
		//returns the name out of the fancy name array that corresponds to the actionname
		return fancyName[actionName];
	}
	this.getId = function(){
		return actionId;
	}
	this.getMinutes = function(){
		return minutes;
	}
	this.getPeriod = function(){
		return period;
	}
	this.getOccurences = function(){
		return occurences;
	}
	this.getTimestamp = function(){
		return timestamp;
	}
	this.getTotalPoints = function(){
		return totalPoints;
	}
}
function Graph(element,playerMatch){
	//fetches the actions
	var actions = playerMatch.getActions();

	//properties
	var firstMinute = actions[0].getMinutes(); //amount of minutes from first action
	var lastMinute = actions[actions.length-1].getMinutes(); //amount of minutes from last action
	var points = [];
	var totals = [];
	var labels =[[],[]];
	var plot;

	//clear the element where the graph will attach to
	element.unbind();
	element.empty();

	//generate data to be used in the graph, will flow in class properties
	generateChartData();

	//initial values for the graph + color of the legend
	var init = [{ data: totals, label: "Total Points",color: 'white'},
				{ data: points, label: "Points/min",color: 'blue'}];

	//markings to show 45 & 90 mins & the last action
	var markingsize = (lastMinute - firstMinute)/1000;
	var markings = [{ xaxis: { from: 45 - markingsize, to: 45+markingsize }, color: "red" },
        			{ xaxis: { from: 90-markingsize, to: 90.+markingsize }, color: "red" },
        			{ xaxis: {from: lastMinute-markingsize, to:lastMinute+markingsize},color:"red"}];

    //options for the graph
	var options = {	grid: {markings: markings,hoverable: true,clickable: false,color:'#E1E6FA'},			
				   	xaxis: {zoomRange: [15, 100],panRange: [firstMinute-0.5, lastMinute+0.5],ticks: 20,tickDecimals:0},
				   	yaxis: {zoomRange: false,ticks: 20,tickDecimals:0,position:"left"},
				   	zoom: {interactive: true},
				   	pan: {interactive: true},
				   	legend:{position:"nw",backgroundOpacity:0}};

	//plot the graph!
	plot = $.plot(element, init , options);
	//attach the tooltip listener to the chart
	element.bind("plothover", plotHover);

	this.animate = function(){
		//starting animation
		element.animate( {tabIndex: 0}, {
			duration: 1000,
	     	step: function ( now, fx ) {
	        	var r = $.map( init[1].data, function ( o ) {
	           		if(typeof(o)!="undefined")
	           			return [[ o[0], o[1] * fx.pos ]];
	            });
					
				var s = $.map( init[0].data, function ( o ) {
					if(typeof(o)!="undefined")
	                	return [[ o[0], o[1] * fx.pos ]];
	            });

	           	plot.setData([{ data:s,label: "Total Points",lines: { show: true,fill:true},color: 'white',hoverable: true},
	           				  { data:r,label: "Points/min",lines: {show: true,fill:true},color: 'blue'}]);		        	
	           	plot.draw(); 
	        }
		});
	}
	function generateChartData(){
		var minutes=0;
		var result = {};

		//initialise arrays from start to end
		for (var i = firstMinute; i <= lastMinute; i++) {
			points[i] = [i, 0];
			totals[i] = [i, 0];
		};

		//Loop to tally actions
		$.each(actions,function(key,action){
			minutes = action.getMinutes();

			//Tally points per minute
			points[minutes][1] += action.getTotalPoints();

			//Tally type of actions per minute
			if(typeof(result[minutes])=='undefined')
				result[minutes] = {};
			if(typeof(result[minutes][action.getName()])!='undefined'){
				result[minutes][action.getName()].amount += action.getOccurences();
				result[minutes][action.getName()].points += action.getTotalPoints();
			}
			else{
				result[minutes][action.getName()] = {'name':action.getFancyName(),'amount':action.getOccurences(),'points':action.getTotalPoints()};
			}
		});
	
		//Loop to fill total score array + generate tooltip array
		for(var i=firstMinute;i<=lastMinute;i++){
			//calculate totalScore
			if(i==firstMinute)
				totals[firstMinute][1] = points[firstMinute][1];
			else
				totals[i][1] = points[i][1] + totals[i-1][1];
			
			//generate tooltips
			var output = 'No actions';
			if(result.hasOwnProperty(i)){
				output = '';
				$.each(result[i],function(key,result){
					output += result.amount + " x " + result.name +' (<strong><span class="' + (result.points>=0 ? "positive":"negative")+'">' + result.points/1000 +"k</span></strong>) <br/>";
				});
			}
			//Total score label
			labels[0][i] = "<strong>Minute " + i + ' - Total points: <span class="' + (totals[i][1]>=0 ? "positive":"negative")+'">' + totals[i][1] /1000 + 'k</span></strong>';
			//points label
			labels[1][i] = "<strong>Minute " + i + ' - Points: <span class="'+ (points[i][1]>=0 ? "positive":"negative")+'">'+ points[i][1]/1000 +"k</span></strong><br/>" + output;
		}
	}
	function plotHover(event,pos,item){
		var tooltip = $("#tooltip");

		if (item) {
			var tooltipLocationX;
			var x = item.datapoint[0].toFixed(0);
			
			//calculate location of the tooltip so it floats to correct side (small resolution browsers)
			//does not support zooming
			var middle = (firstMinute+lastMinute)/2;
			if(x>(middle+(middle/4)))
				tooltipLocationX = item.pageX-200;
			else if(x<(middle-(middle/1.7)))
				tooltipLocationX = item.pageX;
			else
				tooltipLocationX = item.pageX-100;

			//set tooltip label + location
			if(item.seriesIndex==1)
				tooltip.html(labels[1][x]).css({top: item.pageY+15, left: tooltipLocationX}).fadeIn(200);
			else
				tooltip.html(labels[0][x]).css({top: item.pageY+15, left: tooltipLocationX}).fadeIn(200);
		} 
		else {
			tooltip.hide();
		}
	}
}
function Table(element,playerMatch,period){
	//fetches actions
	var actions = playerMatch.getActions();
	var summary = [];

	//clear the element where the table will attach to
	element.unbind();
	element.empty();

	//remove the no data <p> (gets set if there is no data)
	element.next(".nodata").fadeOut("slow").remove();

	//generate data to be used in the table, will flow in class properties
	generateTableData();
	
	//check if there is data	
	if(summary.length!=0){

		//build the table
		var tableBody ='<thead><tr><th data-sort="string">Action</th><th data-sort="int" data-sort-default="desc">No. of actions</th>';
		 	tableBody+='<th data-sort="int">Total earnings<span class="arrow">↓</span></th></tr></thead><tbody></tbody>';
		element.append(tableBody);

		var body = element.find('tbody');
		$.each(summary,function(key,value){
			$('<tr><td>'+ value.name+'</td><td class="tableamount">'+ value.amount+'</td><td class="tablepoints"><strong><span class="'+ (value.points>=0 ? "positive":"negative")+'">'+value.points/1000 +'k</span></strong></td></tr>').appendTo(body);
		});
		
		//attach sorting to the table
		element.stupidtable();

		//attach sorting arrow when the sorting has been used
		element.bind('aftertablesort', function (event, data) {
		    // data.column - the index of the column sorted after a click
		    // data.direction - the sorting direction (either asc or desc)

		    var th = $(this).find("th");
		    th.find(".arrow").remove();
		    var arrow = data.direction === "asc" ? "↑" : "↓";
		    th.eq(data.column).append('<span class="arrow">' + arrow +'</span>');
		});
	}
	else{ //display if there is no data
		element.after('<p class="nodata updateable" style="display:none;">No data available for this period.</p>');
		$('.nodata').fadeIn('slow');
	}
	

	function generateTableData(){
		var result = {};
		var p;
		//select actions from first half if period = 0
		if(period == 0 || period == "FirstHalf")
			p = "FirstHalf";
		else
			p = "SecondHalf";

		$.each(actions,function(key,action){
			//Separate actions by playperiod
			if(action.getPeriod()==p)
			{
				// Tallies up different occurences of actions and the total points
				if(typeof(result[action.getName()])!='undefined'){
					result[action.getName()].amount += action.getOccurences();
					result[action.getName()].points += action.getTotalPoints();
				}
				else{
					result[action.getName()] = {'name':action.getFancyName(),'amount':action.getOccurences(),'points':action.getTotalPoints()};
				}
			}
		});

		//load actions over in array
		for(var action in result){
			summary.push(result[action]);
		}
		//sort the data
		summary.sort(tableSort);
	}
	//private costum compare function to help sort the data
	function tableSort(a,b){
		if(a.points < b.points)
			return 1;
		if(a.points > b.points)
			return -1;
		if(a.name > b.name)
			return 1;
		if(a.name < b.name)
			return -1;
		return 0;
	}
}