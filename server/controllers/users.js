var User = mongoose.model('users');

module.exports = {
	loginreg: function(request, response){
		User.findOne({name: request.body.name}, function(err, fromDB){
			if(err){
				response.json({errors: err});
			}
			else if(!fromDB){
				var newUser = new User(request.body);
				newUser.save(function(err){
					if(err){
						response.json({errors: err});
					}
					else{
						var logged_user = {name: newUser.name, _id: newUser._id, success: true};
						console.log('new User', logged_user)
						response.json(logged_user);
					}
				})
			}
			else{
				var logged_user = {name: fromDB.name, _id: fromDB._id, success: true};
				console.log('logging User', logged_user)
				response.json(logged_user);			}
		})
	},

	getAll: function(request, response){
		User.find({}, function(err, users){
			if(err){
				response.json({errors: err});
			}
			else{
				response.json(users);
			}
		})
	},

	value: function(request, response){
		console.log(request.body.value)
		User.findOne({_id: request.params.id}, function(err, user){
			if(err){
				response.json({errors: err});
			}
			else{
				user.score = request.body.value
				user.save(function(err){
					if(err){
						response.json({errors: err});
					}
					else{
						response.json({success: true});
					}
				})
			}
		})
	}
}