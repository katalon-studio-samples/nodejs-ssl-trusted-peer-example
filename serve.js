#!/usr/bin/env node
'use strict';

var https = require('https')
  , port = process.argv[2] || 8043
  , fs = require('fs')
  , path = require('path')
  , server
  , options
  ;

options = {
  key: fs.readFileSync(path.join(__dirname, 'certs', 'server', 'my-server.key.pem'))
, ca: [ fs.readFileSync(path.join(__dirname, 'certs', 'server', 'my-root-ca.crt.pem'))]
, cert: fs.readFileSync(path.join(__dirname, 'certs', 'server', 'my-server.crt.pem'))
, requestCert: true
, rejectUnauthorized: false
};


function app(req, res) {
  var common_name = "UNKNOWN"
  try {
    common_name = req.socket.getPeerCertificate().subject.CN
  } catch (error) {
    console.log("Error extracting commmon name!")
  }
  console.log(new Date()+' '+ 
        req.connection.remoteAddress+' '+ 
        common_name+' '+ 
        req.method+' '+req.url);
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, ' + common_name + '!');
}

server = https.createServer(options, app).listen(port, function () {
  port = server.address().port;
  console.log('Listening on https://127.0.0.1:' + port);
  console.log('Listening on https://' + server.address().address + ':' + port);
  console.log('Listening on https://local.foobar3000.com:' + port);
});
