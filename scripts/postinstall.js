#!/usr/bin/env node
"use strict";

var spawn = require('child_process').spawn;
var path = require('path');

var child = spawn('make', ['clean', 'all'], {
	cwd: path.join(__dirname, '..'),
	stdio: [null, process.stdout, process.stderr]
})
.on('error', function(err)
{
	console.error('Compile failed: ' + err.message);
	process.exit(1);
})
.on('exit', function(code)
{
	if (code == null || code !== 0)
	{
		console.error('Compile failed.');
		process.exit(code || 1);
	}
	else
	{
		console.error('Compile succeeded.');
	}
});
