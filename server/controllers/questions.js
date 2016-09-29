var Question = mongoose.model('questions');
var Answer = mongoose.model('answers');

module.exports = {
	create: function(request, response){
		console.log(request.body)
		var questionInfo = {question: request.body.question}
		var newQuestion = new Question(questionInfo)
		newQuestion.save(function(err){
			console.log('after 1st save', newQuestion)
			if(err){
				console.log(err);
				response.json({errors: err});
			}
			else{
				var answer1Info = {answer: request.body.answer1}
				var newAnswer1 = new Answer(answer1Info);
				newAnswer1.value = 'Plant';
				console.log(newAnswer1);
				newAnswer1.save(function(err){
					if(err){
						response.json({errors: err});
					}
					else{
						var answer2Info = {answer: request.body.answer2}						
						var newAnswer2 = new Answer(answer2Info);
						newAnswer2.value = 'Zombie';
						newAnswer2._question = newQuestion._id;
						newAnswer2.save(function(err){
							if(err){
								response.json({errors: err});
							}
							else{
								var answer3Info= {answer: request.body.answer3}
								var newAnswer3 = new Answer(answer3Info);
								newAnswer3.value = 'Human';
								newAnswer3._question = newQuestion._id;
								newAnswer3.save(function(err){
									if(err){
										response.json({errors: err});
									}
									else{
										newQuestion._answers.push(newAnswer1._id);
										newQuestion._answers.push(newAnswer2._id);
										newQuestion._answers.push(newAnswer3._id);
										newQuestion.save(function(err){
											if(err){
												response.json({errors: err});
											}
											else{
												console.log(newQuestion);
												response.json({success: true});
											}
										})
									}
								})
							}
						})
					}												
				})
			}
		})
	},

	showThree: function(request, response){
		Question.findRandom().limit(3).populate('_answers').exec(function(err, questions){
			if(err){
				response.json({errors: err});
			}
			else{
				response.json(questions);
			}
		})
	}

}