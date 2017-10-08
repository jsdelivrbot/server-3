var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var players = [];

server.listen("5858", function(){
	console.log("Server is now running...");
});

io.on('connection', function(socket){
	console.log("Player Connected!");
	socket.emit('socketID', { id: socket.id });
	socket.on('playerMoved', function(data){
        console.log("Resending move data...");
        socket.broadcast.emit('playerMoved', data);
	});
	socket.on('mySetting', function(data){
	    console.log("Player Sent his data");
	    players.push(new player(socket.id, data.start, data.dist));
	    if (players.length >= 2){
        	    console.log("Two players found");
        	    for (var i = 0; i < players.length; i++){
           	        if(players[i].id != socket.id){
           	            for (var j = 0; j < players.length; j++){
                            if(players[j].id == socket.id){
                                socket.emit('foundPlayer', { id: players[i].id, start: players[i].start, dist: players[i].dist, inverseColors: 0 });
                                socket.broadcast.emit('foundPlayer', { id: socket.id, start: players[j].start, dist: players[j].dist, inverseColors: 1 });
                                console.log(socket.id + " plays with " + players[i].id);
                                break;
                            }
                        }
                        players.splice(i, 1);
                        break;
                    }
                }
                for (var j = 0; j < players.length; j++){
                    if(players[j].id == socket.id){
                        players.splice(j, 1);
                        break;
                    }
                }
        	}
	});
	socket.on('disconnect', function(){
		console.log("Player Disconnected");
		for (var i = 0; i < players.length; i++){
		    if (players[i].id == socket.id){
		        players.splice(i, 1);
		        break;
		    }
		}
	});
});

function player(id, start, dist){
	this.id = id;
	this.start = start;
	this.dist = dist;
}
