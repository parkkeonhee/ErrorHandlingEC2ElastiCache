/**
 * Author: Keon Hee Park
 * Latest version to date: August 20, 2016.
 * 
 * Topic: File Upload on Node.js using AWS EC2 and ElastiCache
 * 
 * Description: 
 *  Deploys a website which uploads a file on Node.js using Amazon Web Services’ EC2 and ElastiCache.
 *  Note: This program uses Redis for ElastiCache.
 * 
 * Instructions:
 *  1. Same directory as server.js
 *  2. Dependencies needed: express, formidable, and redis.
 *  3. HTML submit form for JSON files.
 *  4. ElastiCache's node endpoint address.
 */

// Required node_modules
var express = require('express');
var formidable = require('formidable');

// Setup server
var http = require('http');
var path = require('path');
var redis = require('redis');

var client = redis.createClient(6379, "myfirstcluster.lbf1q2.0001.use1.cache.amazonaws.com");

// Error handler that checks if the redis endpoint on client is valid or not.
client.on('error', function (err){
  console.log(err);
  console.error(new Error("Redis node endpoint address is not valid."));
  client.end(true);
  
  // Exit the program with failure code
  process.exit(1);
});

// find out how to exit after an error has occurred.

var router = express();
var server = http.createServer(router);

router.use(express.static(path.resolve(__dirname, 'client')));

router.get('/key/:key', function (req, res) {
  var fs = require('fs');
  var filename = req.params.key;
	debugger;
  client.get(filename, function(err, reply) {
	if (err) {
          console.log("Get error: " + err);
        }
	else if(reply === null){
		var error = {"errorMessage": "File does not exist"};
		console.error(new Error("File does not exist"));
		res.send(JSON.stringify(error));
		//res.status = 500;
		//res.end(error);
		client.end(true);
	}
        else {
          fs.writeFile(filename, reply, function(err) {
            if (err) {
              console.log("Error on write: " + err);
            }
            else {
		console.log(reply);
              console.log("File written.");
              res.send(reply);
            }
            client.end(true);
          })
	}
})
});

router.post('/', function(req, res) {

  var form = new formidable.IncomingForm();

  // Specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  form.on('file', function(field, file) {
    // Read a file from disk, store it in Redis, then read it back from Redis.
    var fs = require('fs');

    // Directory that stores the JSON file.
    var filepath = file.path;
    var filename = file.name;

    // Prints out the directory location of the uploaded JSON file.
    console.log("File successfully saved in: " + filename);

    // Read a file from fs, store it in Redis, get it back from Redis, write it back to fs.
    fs.readFile(filepath, function(err, data) {
      if (err) throw err;
      console.log("Read " + data.length + " bytes from filesystem.");

      // Set entire file
      try {
        client.set(filename, data, redis.print);
      }
      catch (err) {
        console.log("set log");
      }
      // Get entire file
      client.get(filename, function(err, reply) {
        if (err) {
          console.log("Get error: " + err);
        }
        else {
          fs.writeFile(filename, reply, function(err) {
            if (err) {
              console.log("Error on write: " + err);
            }
            else {
              console.log("File written.");
            }

            // node_redis: Using .end() without the flush parameter is deprecated and throws from v.3.0.0 on.
            // client.end(flush) forcibly close the connection to the Redis server.
            // Set flush to true.
            // If flush is set to false, then all running commands that are still running will silently fail.
            client.end(true);
          });
        }
      });
    });
  });

  // Log any occurring errors.
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // Send a response to the client after all the files have been uploaded.
  form.on('end', function() {
    res.end('Successfully uploaded!');
  });

  // Parse the incoming request containing the form data.
  form.parse(req);
});


// fix where it only listens when its valid
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
