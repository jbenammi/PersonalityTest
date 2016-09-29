var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(function($routeProvider){
	$routeProvider
		.when('/', {
			templateUrl: 'static/partials/dashboard.html'
		})
		.when('/new_question', {
			templateUrl: 'static/partials/newquestion.html'
		})
		.when('/lets_play', {
			templateUrl: 'static/partials/game.html'
		})
		.otherwise({
			redirectTo: '/'
		})
})

myApp.factory('userFactory', function($http){
	var factory = {};
	var user_session = {};

	factory.chk_session = function(callback){
		callback(user_session);
	}
	factory.login = function(user, callback){
		$http.post('/users', user).success(function(fromDB){
			if(fromDB.success){
				user_session = fromDB
				callback(user_session);
			}
			else if(fromDB.errors){
				console.log(fromDB.errors);
			}
		})
	}
	factory.logout = function(callback){
		user_session = {};
		console.log('logout user session',user_session);
		callback()
	}

	factory.getAll = function(callback){
		$http.get('/users').success(function(fromDB){
			if(fromDB.errors){
				alert('There are errors, check console log');
				console.log(fromDB.errors);				
			}
			else{
				callback(fromDB);
			}
		})
	}

	factory.answer = function(answers, callback){
		var answer = answers
		var plant = 0
		var zombie = 0
		var human = 0
		var value = {}
		console.log('answers:',answer)
		var item
		for(item in answer){
			if (answer[item] == 'Plant'){
				plant ++
			}
			else if (answer[item] == 'Zombie'){
				zombie ++
			}
			else{
				human ++
			}
		}

		if(plant == zombie && plant == human){
			value['value'] = 'Human'
		}
		else if(plant > zombie && plant > human){
			value['value'] = 'Plant'
		}
		else if (zombie> plant && zombie > human){
			value['value'] = 'Zombie'
		}
		else if (human > plant && human> zombie){
			value['value'] = 'Human'
		}
		else{
			value['value'] = 'Human'
		}
		$http.post('/users/' + user_session._id, value).success(function(fromDB){
			if(fromDB.errors){
				alert('There are errors, check console log');
				console.log(fromDB.errors);				
			}
			else{
				callback();
			}
		})
	}

	return factory;
})

myApp.factory('questionFactory', function($http){
	var factory = {};
	var questions = [];

	factory.create = function(newQuestion, callback){
		$http.post('/questions', newQuestion).success(function(fromDB){
			if(fromDB.errors){
				alert('There are errors, check console log');
				console.log(fromDB.errors);
			}
			else{
				callback()
			}
		})
	}

	factory.getThree = function(callback){
		console.log('get questions triggered')
		$http.get('/questions').success(function(fromDB){
			if(fromDB.errors){
				alert('There are errors, check console log');
				console.log(fromDB.errors);				
			}
			else{
				callback(fromDB);
			}
		})
	}

	return factory;
})
myApp.controller('dashboardsController', function(questionFactory, userFactory, $location, $document){
	var self = this;
	self.chkUser = {};
	self.user_session = {};
	self.Users = [];

	var chk = function(){
			console.log('triggered');
			userFactory.chk_session(function(factoryUser_Session){
			self.user_session = factoryUser_Session;
			console.log(factoryUser_Session);
			if(!self.user_session.success){
				self.chkUser.name = prompt("Please Sign In To Play!")
				while(!self.chkUser.name){
					self.chkUser.name = prompt("Please Sign In To Play!")
				}
				userFactory.login(self.chkUser, function(factoryUser_Session){
				self.user_session = factoryUser_Session
				console.log(self.user_session);
				})
			}
		})
	};
	chk();
	userFactory.getAll(function(factoryUsers){
		self.Users = factoryUsers;
	})

	self.login = function(){
		userFactory.login(self.chkUser, function(factoryUser_Session){
			self.user_session = factoryUser_Session
		});
	}

	self.logout = function(){
		userFactory.logout(function(){
			chk();
		});
	}

	self.play = function(){
		$location.url('/lets_play');
	}

})

myApp.controller('questionsController', function(questionFactory, userFactory, $location){
	var self = this;
	self.chkUser = {};
	self.user_session = {};
	self.newQuestion = {};

	userFactory.chk_session(function(factoryUser_Session){
		self.user_session = factoryUser_Session;
		if(!self.user_session.success){
			$location.url('/logout');
		}
	});	

	self.create = function(){
		questionFactory.create(self.newQuestion, function(){
			$location.url('/')
		})
	}
})

myApp.controller('playsController', function(questionFactory, userFactory, $location){
	var self = this;
	self.chkUser = {};
	self.user_session = {};
	self.questions = [];
	self.answers = {}

	userFactory.chk_session(function(factoryUser_Session){
		self.user_session = factoryUser_Session;
		if(!self.user_session.success){
			$location.url('/');
		}
	});

	questionFactory.getThree(function(factoryQuestions){
		self.questions = factoryQuestions;
		for (var x = 0; x < self.questions.length; x++) {
			shuffle(self.questions[x]._answers);
		}
		function shuffle (array) {
			var i = 0
			var j = 0
			var temp;

		for (i = array.length - 1; i > 0; i --) {
		    j = Math.floor(Math.random() * (i + 1))
		    temp = array[i]
		    array[i] = array[j]
		    array[j] = temp
		  }
		}
	})

	self.answer = function(){
		userFactory.answer(self.answers, function(){
			$location.url('/');
		});
	}

})

