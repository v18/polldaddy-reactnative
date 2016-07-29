import answerParser from './answer-parser';
import Database from './database';
import DateFormat from 'dateformat';
import xmlParser from 'xmldoc';

var currentQuestionIndex = -1, // have not begun survey yet
  questions = [],
  surveyId,
  answersXml = '',
  startDate,
  endDate,
  numberOfAnswered;

module.exports = {
  set: function (id, database) {
    if(!database) {
      database = Database;
    }

    // clear previous status
    questions = [];
    currentQuestionIndex = -1;
    surveyId = id;
    answersXml = '';
    startDate = null;
    endDate = null;
    numberOfAnswered = 0;

    return database.getItem(surveyId)
      .then((survey) => {
        var xmlDocument = new xmlParser.XmlDocument(survey.formXML.trim());

        // create and add start question to the beginning
        // provide '' as default in case API doesn't send default
        var startMessage = xmlDocument.childNamed('startMessage');
        var startHtml = '';
        if(startMessage) {
          startHtml = startMessage.val;
        }
        var startXml = createHTMLQuestionXml(survey.title, startHtml);
        var startQ = new xmlParser.XmlDocument(startXml);
        startQ.pageType = 'start';
        questions.push(startQ);

        // save the questions as an array and add to questions array
        questions = questions.concat(createQuestionsArrayFromXml(xmlDocument));

        // create and add start question to the beginning
        // API response is sent with default
        var endMessage = xmlDocument.childNamed('endMessage');
        var endHtml = '';
        if(endMessage) {
          endHtml = endMessage.val;
        }
        var finishXml = createHTMLQuestionXml(survey.title, endHtml);
        var finishQ = new xmlParser.XmlDocument(finishXml);
        finishQ.pageType = 'finish';
        questions.push(finishQ);
        return Promise.resolve(true);
      })
      .catch(function (error) {
        throw Promise.reject(error);
      });
  },
  setCurrentQuestionIndex: function (newIndex) {
    currentQuestionIndex = newIndex;
  },
  getNextQuestion: function () {
    currentQuestionIndex++;
    return Promise.resolve(questions[currentQuestionIndex]);
  },
  isLastQuestion: function () {
    if(currentQuestionIndex === questions.length) {
      return true;
    } else {
      return false;
    }
  },
  saveStartDate: function () {
    startDate = new Date();
  },
  saveEndDate: function () {
    endDate = new Date();
  },
  saveAnswer: function (questionId, questionType, answers) {
    var newXml = answerParser.getAnswerXml(questionId, questionType, answers);
    if(newXml && newXml !== '') {
      numberOfAnswered++;
    }
    answersXml = answersXml + newXml;
  },
  saveAnswersToDatabase: function ({userId, isCompleted}) {
    var responseXml = `<answers pCompleted='${numberOfAnswered}'>${answersXml}</answers>`;
    return Database.saveAnswers({
      surveyId: surveyId,
      responseXML: responseXml,
      startDate: DateFormat(startDate, 'yyyy-mm-dd hh:MM:ss Z'),
      endDate: DateFormat(endDate, 'yyyy-mm-dd hh:MM:ss Z'),
      completed: 1,
      latitude: 0,
      longitude: 0,
      userId: userId
    })
    .then(function () {
      return Promise.resolve();
    })
    .catch(function (error) {
      throw error;
    });
  }
};

var createQuestionsArrayFromXml = function(xmlDocument) {
  var pages = xmlDocument.childrenNamed('page');
  var questionsArray = [];
  // ignore the pages, we'll display each question on its own screen
  pages.map(function (page) {
    var questions = page.childrenNamed('question');
    questions.map(function (question) {
      questionsArray = questionsArray.concat(question);
    });
  });
  return questionsArray;
};

// used to add the start and finish pages
// as HTML snippet questions
var createHTMLQuestionXml = function (title, htmlContent) {
  return `<question qType="2000" qID="-1" trueQ="0"><qText>${title}</qText><nText></nText><note>false</note><chunk>${htmlContent}</chunk></question>`;
};
