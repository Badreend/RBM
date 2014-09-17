
if(true){
var express  = require('express')
    , app    = express()
    , server = require('http').createServer(app)
    , io     = require('socket.io').listen(server)
    , connect = require('connect')
    , pg     = require('pg')
    , Client = pg.Client
    , nicknames = []
    , ids = []
    , idsData = [];

// Setup express middleware
app.use(express.static('public'));
app.use(connect.logger());

app.use(express.static(__dirname + '/data'));
app.get('/', function(req, res){
    res.sendfile(__dirname + '/index.html');
});
// Start the server

}else{
	var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	nicknames = [],
	ids = [],
	idsData = [];
	
	server.listen(8000);

	app.use(express.static(__dirname + '/data'));
	app.get('/', function(req, res){
	res.sendfile(__dirname + '/index.html');
});
}

io.sockets.on('connection', function(socket){

	socket.on('idAvailable',function(newId,available){
		console.log(newId);
		if(ids.indexOf(newId) === -1){
			console.log('id IS Available');	
			available(true);
		}else{
			console.log('id is NOT Available');
			available(false);
		}
	});

	socket.on('clicked',function(play){
		socket.broadcast.emit('playSound',play)
	});

	socket.on('clientMoving',function(data){
	var index = ids.indexOf(data.id) // ik heb index nr nodig om achter halen welke wordt geupdate
	if (index != -1){
		console.log("bestaat al");
		console.log(data.id);
		idsData[index].x = data.x;		// updating data
		idsData[index].y = data.y;
		console.log(idsData);
	 	io.sockets.emit("idsOnline",ids,idsData);
	}else
{		socket.ids = data.id; // check
		console.log("het is nieuw dus ik ga een nieuwe aanmaken");
		ids.push(data.id);
		idsData.push({x:data.x,y:data.y,play:data.play});
		io.sockets.emit("idsOnline",ids,idsData);
	}
		console.log(ids);

	//console.log(ids)
  });


	socket.on('disconnect',function(data){
		console.log('someDisconnected');
		console.log(socket.ids);
		 if(!socket.ids) return; // al er niet is ga terug
		 ids.splice(ids.indexOf(socket.ids),1);
		 idsData.splice(idsData.indexOf(socket.ids))
		 io.sockets.emit("idsOnline",ids,idsData);
	})



});