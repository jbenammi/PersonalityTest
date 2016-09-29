var random = require('mongoose-random')


var UsersSchema = new mongoose.Schema({
	name: {type: String, required: true},
	score: {type: String, default: "Nothing"}
}, {timestamps: true});

var QuestionSchema = new mongoose.Schema({
	question: {type: String, required: true, minlength: 15},
	_answers: [{type: mongoose.Schema.Types.ObjectId, ref: 'answers'}]
	}, {timestamps: true});

QuestionSchema.plugin(random, {path: 'r'});

var AnswersSchema = new mongoose.Schema({
	answer: {type: String, required: true},
	value: {type: String, required: true},
	_question: {type: mongoose.Schema.Types.ObjectId, ref: 'questions'}
}, {timestamps: true});

mongoose.model('users', UsersSchema);
mongoose.model('questions', QuestionSchema);
mongoose.model('answers', AnswersSchema);
