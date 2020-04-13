const path = require('path'),
	routes = require('./routes'),
	exphbs = require('express-handlebars'),
	express = require('express'),
	cookieParser = require('cookie-parser'),
	morgan = require('morgan'),
	moment = require('moment'),
	errorHandler = require('errorhandler');

module.exports = (app)=>{
 	app.use(morgan('dev'));
 	app.use(cookieParser('some-secret-value-here'));
 	routes(app);//moving the routes to routes folder.

 	app.use('/public/', express.static(path.join(__dirname,
 	'../public')));  // we can reference any static file with /public prefix

 	
	if ('development' === app.get('env')) {
 		app.use(errorHandler());
	}

	app.set('view engine', 'handlebars');
	app.engine('handlebars', exphbs.create({

	defaultLayout: 'main',
	layoutsDir: `${app.get('Views')}/layouts`,
	partialsDir: `${app.get('Views') }/partials`,

	// global helper function
	helpers: {
 		timeago: (timestamp)=> {
 			return moment(timestamp).startOf('minute').fromNow();
 		}
 	}
	
	}).engine);

 	return app;
}; 