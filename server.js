const express = require('express');
const path = require('path')
config = require('./server/configure');// for configuring modules
var mongoose = require('mongoose');
let app = express(); 

app.set('port', process.env.PORT || 3300);// for setting port number
app.set('Views', `${__dirname}/views`); // for setting views folder for handlebars files
app = config(app); 

mongoose.connect('mongodb://localhost/imgPloadr', {
 useMongoClient : true
});
mongoose.connection.on('open',()=>{
 console.log('Mongoose connected.');
}); 

app.listen(app.get('port'), () => {
	console.log(`Server up: http://localhost:${app.get('port')}`);
});