#!/usr/bin/env node
"use strict";

var pkg = require(__dirname + '/package.json');
var isIP = require('net').isIP;
var optimist = require('optimist');

var argv = optimist
	.usage('Version: ' + pkg.version + '\nUsage: $0 [<wikiroot>] [<options>]\n\nCommand line options override options found in the <wikiroot>/wikimd.yml file.')
	.options('h', {
		alias: 'help',
		description: 'show this help text',
		'boolean': true
	})
	.options('p', {
		alias: 'port',
		description: 'IP port number (Default: 8888)'
	})
	.options('a', {
		alias: 'ipaddress',
		description: 'IPv4/6 address (Default: 127.0.0.1)',
		'string': true
	})
	.options('u', {
		alias: 'socket',
		description: 'UNIX socket path',
		'string': true
	})
	.options('k', {
		alias: 'key',
		description: 'TLS - private key file in PEM format',
		'string': true
	})
	.options('c', {
		alias: 'cert',
		description: 'TLS - certificate key file in PEM format',
		'string': true
	})
	.options('x', {
		alias: 'pfx',
		description: 'TLS - archive containing private key, certificate, and CA certs, in PKCS#12 format',
		'string': true
	})
	.options('s', {
		alias: 'passphrase',
		description: 'TLS - passphase for private key or pfx',
		'string': true
	})
	.options('t', {
		alias: 'ca',
		description: 'TLS - trusted certificate file in PEM format (this option can be used more than once)',
		'string': true
	})
	.check(function(args)
	{
		if (args.help)
			throw "";

		function exists(name)
		{
			return args.hasOwnProperty(name);
		}

		function trim(value)
		{
			return value == null ? '' : (''+value).replace(/(^\s+|\s+$)/g, '');
		}

		if (exists('pfx'))
		{
			args.x = args.pfx = trim(args.pfx);
			if (!args.pfx)
				throw "PFX cannot be empty.";

			if (exists('cert') || exists('key'))
				throw "PFX is mutually exclusive with certicate and key.";

			args.secure = true;
		}
		else if (exists('cert') || exists('key'))
		{
			args.c = args.cert = trim(args.cert);
			if (!args.cert)
				throw "Certicate cannot be empty.";

			args.k = args.key = trim(args.key);
			if (!args.key)
				throw "Key cannot be empty.";

			args.secure = true;
		}
		else
		{
			if (exists('passphase'))
				throw "Passphrase only valid with PFX or certificate and key.";
			if (exists('ca'))
				throw "Trusted certificates only valid with PFX or certificate and key.";

			args.secure = false;
		}

		if (exists('socket'))
		{
			if (exists('port') || exists('ipaddress'))
				throw "Socket is mutually exclusive with port and IP address.";

			args.u = args.socket = trim(args.socket);
			if (!args.socket)
				throw "Socket cannot be empty.";
		}
		else
		{
			if (exists('port'))
			{
				if (typeof args.port !== 'number' || args.port <= 0 || args.port > 65535)
					throw "Invalid port number.";
			}
			else
			{
				args.p = args.port = 8888;
			}

			if (exists('ipaddress'))
			{
				args.a = args.ipaddress = trim(args.ipaddress);
				if (!args.ipaddress)
					throw "IP address cannot be empty";
				if (!isIP(args.ipaddress))
					throw "Invalid IP address";
			}
			else
			{
				args.a = args.ipaddress = '127.0.0.1';
			}
		}
	})
	.argv;

var server;

if (argv.secure)
{
	var https = require('https');

	var options = {};
	if (argv.pfx)
	{
		options.pfx = argv.pfx;
	}
	else
	{
		options.cert = argv.cert;
		options.key = argv.key;
	}

	if (argv.ca)
		options.ca = argv.ca;
	if (argv.passphase)
		options.passphase = argv.passphase;

	server = https.createServer(options);
}
else
{
	var http = require('http');

	server = http.createServer();
}

if (argv.socket)
	server.listen(argv.socket);
else
	server.listen(argv.port, argv.ipaddress);
