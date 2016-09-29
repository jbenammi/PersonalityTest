var express = require('express');
app = express();
path = require('path');
bodyParser = require('body-parser');
mongoose = require('mongoose');

app.use(express.static(path.join(__dirname, '/client')));
app.use(bodyParser.json());

require('./server/config/mongoose.js');
require('./server/config/routes.js')();

app.listen(8000, function(){
	console.log('Now running on port 8000');
})
