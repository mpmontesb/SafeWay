/**
 * myapi.js
 * 
 * @version 1.1 - updated for Express 4.x : April 2015
 *
 * 
 * DESCRIPTION:
 * a "HELLO WORLD" server-side application to demonstrate running a node 
 * API Appserver on a Raspberry Pi to access IOs
 * Uses the Express node packages. 
 * 
 * 
 * @throws none
 * @see nodejs.org
 * @see express.org
 * 
 * @author Robert Drummond
 * (C) 2013 PINK PELICAN NZ LTD
 */

var http      = require('http');
var express   = require('express');

var serialport = require("serialport"); 
var SerialPort = serialport.SerialPort; 

var sp = new SerialPort("/dev/ttyUSB1", { 
	baudrate: 9600, 	
	parser: serialport.parsers.readline("\n") 
	}); 
	
var sp2 = new SerialPort("/dev/ttyUSB0", { 
	baudrate: 9600, 	
	parser: serialport.parsers.readline("\n") 
	}, false); 
var inputs,temp, hum, co, anm, x, y, z, l, t;
temp = 27.0;
hum = 2.0;
co = 0.0;
anm = 2600;
x = 0.0;
y = 0.0;
z = 0.0;
l = -74.065232;
t = 4.627002;

inputs = [    { temperatura: temp, humedad: hum, altura: anm, CO: co, X: x, Y: y, Z: z, Latitud: t, Longitud: l }];

sp.open(function () 
	{ 
	sp.on("data", function (data) 
		{ 
		if(data[0] == 'C'){
			console.log('temperatura:', data.slice(1,data.length-1));
			temp = data.slice(1,data.length-1);
		}
		else if (data[0] == 'H'){
			console.log('humedad:', data.slice(1,data.length-1));
			hum = data.slice(1,data.length-1);
		}		
		else if (data[0] == 'O'){
			console.log('CO:', data.slice(1,data.length-1));
			co = data.slice(1,data.length-1);
		}
		else if (data[0] == 'Q'){
			console.log('A.N.M.:', data.slice(1,data.length-1)/10);
			anm = data.slice(1,data.length-1)/10;
		}
		else if (data[0] == 'X'){
			console.log('X:', data.slice(1,data.length-1));
			x = data.slice(1,data.length-1);
		}
		else if (data[0] == 'Y'){
			console.log('Y:', data.slice(1,data.length-1));
			y = data.slice(1,data.length-1);
		}
		else if (data[0] == 'Z'){
			console.log('Z:', data.slice(1,data.length-1));
			z = data.slice(1,data.length-1);
		}
		else if (data[0] == 'L'){
			console.log('Z:', data.slice(1,data.length-1));
			l = data.slice(1,data.length-1);
		}
		else if (data[0] == 'T'){
			console.log('Z:', data.slice(1,data.length-1));
			t = data.slice(1,data.length-1);
		}
		else
			return;
		
		
		inputs = [    { temperatura: temp, humedad: hum, altura: anm, CO: co, X: x, Y: y, Z: z, Latitud: t, Longitud: l }];
		
	 	}); 
	 	
 	});
 	
 	
sp2.open(function () 
	{ 
	sp2.on("data", function (data2) 
		{ 
		if(data2[0] == 'c'){
			//console.log('temperatura 2:', temp);
			sp2.write(temp.toString());


		}
		else if (data2[0] == 'h'){
			//console.log('humedad 2:', hum);
			sp2.write(hum.toString());
		}		
		else if (data2[0] == 'o'){
			//console.log('CO:', co);
			//co = data.slice(1,data.length-1);
			sp2.write(co.toString());
		}
		else if (data2[0] == 'q'){
			//console.log('A.N.M. 2:', anm/10);
			sp2.write(anm.toString());

		}
		else if (data2[0] == 'x'){
			//console.log('X2:', x);
			sp2.write(x.toString());

		}
		else if (data2[0] == 'y'){
			//console.log('Y2:', y);
			sp2.write(y.toString());

		}
		else if (data2[0] == 'z'){
			//console.log('Z2:', z);
			sp2.write(z.toString());

		}
		else if (data2[0] == 't'){
			//console.log('Z2:', z);
			sp2.write(t.toString());

		}
		else if (data2[0] == 'l'){
			//console.log('Z2:', z);
			sp2.write(l.toString());

		}
		else
			return;
		
		
		//console.log(data2);
	 	}); 
	 	
 	});
 	
 

 	
 	
/*sp2.open(function (error) { 
	if (error){
		console.log('Error while openning the port ' + error);
	}
	else{
		console.log('Port Open');
		sp2.write(temp, function (err, result){
			if(err) {
				console.log(err);
			}else{
				console.log(result);
			}
		});
	
	}
	 	
 	});*/

var app       = express();

// dummy input port values for our example


// = [    { temperatura: 22.3, humedad: 49.8, altura: 2600, co2: 114, inclinacion: 0.0 }];

// ------------------------------------------------------------------------
// configure Express to serve index.html and any other static pages stored 
// in the home directory
app.use(express.static(__dirname));

// Express route for incoming requests for a single input
app.get('/inputs/:id', function (req, res) {
  // send an object as a JSON string
  console.log('id = ' + req.params.id);
  res.send(inputs[req.params.id]);
}); // apt.get()

// Express route for incoming requests for a list of all inputs
app.get('/inputs', function (req, res) {
  // send an object as a JSON string
  console.log('all inputs');
  res.status(200).send(inputs);
}); // apt.get()

// Express route for any other unrecognised incoming requests
app.get('*', function (req, res) {
  res.status(404).send('Unrecognised API call');
});

// Express route to handle errors
app.use(function (err, req, res, next) {
  if (req.xhr) {
    res.status(500).send('Oops, Something went wrong!');
  } else {
    next(err);
  }
}); // apt.use()

// ------------------------------------------------------------------------
// Start Express App Server
//
app.listen(3000);
console.log('App Server is listening on port 3000');

