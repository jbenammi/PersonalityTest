var users = require('../controllers/users.js');
var questions = require('../controllers/questions.js');

module.exports = function(){

	app.post('/users', function(request, response){
		users.loginreg(request, response);
	});

	app.get('/users', function(request, response){
		users.getAll(request, response);
	})

	app.get('/questions', function(request, response){
		questions.showThree(request, response);
	});

	app.post('/questions', function(request, response){
		questions.create(request, response);
	});

	app.post('/users/:id', function(request, response){
		users.value(request, response);
	});

}