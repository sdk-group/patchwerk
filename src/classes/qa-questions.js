'use strict'

let BasicDocument = require('./basic.js');

class QaQuestions extends BasicDocument {
	static description() {
		return {
			"key": "qa_questions"
		};
	}
}

module.exports = QaQuestions;
