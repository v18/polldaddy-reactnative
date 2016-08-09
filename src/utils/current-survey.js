import _ from 'lodash';
import answerParser from './answer-parser';
import CurrentPhrases from './current-phrases';
import Database from './database';
import language from './language';
import xmlParser from 'xmldoc';
import QuizInfo from './current-quiz-info';

var currentQuestionIndex = -1, // have not begun survey yet
  questions = [],
  surveyId,
  answersXml = '',
  startDate,
  endDate,
  numberOfAnswered,
  isQuiz = false;

module.exports = {
  resetAnswers: function () {
    answersXml = '';
    startDate = null;
    endDate = null;
    numberOfAnswered = 0;
    QuizInfo.resetAnswers();
  },
  set: function (id, userId, database) {
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
    isQuiz = false;
    CurrentPhrases.resetPhrases();

    return database.getItem(surveyId, userId)
      .then((survey) => {
        var xmlDocument = new xmlParser.XmlDocument(survey.formXML.trim());
        var surveyXml = createQuestionsArrayFromXml(xmlDocument);

        // quiz settings
        isQuiz = (Number(xmlDocument.attr.fType) === 4);
        if(isQuiz) {
          QuizInfo.setQuestions(surveyXml);
          QuizInfo.setQuizSettings({
            resultsView: xmlDocument.childNamed('quizData').attr.resultsView,
            passThreshold: xmlDocument.childNamed('quizData').attr.passThreshold
          });
        }

        // create and add start question to the beginning
        // provide '' as default in case API doesn't send default
        var startMessage = xmlDocument.childNamed('startMessage');
        var startHtml = '';
        if(startMessage) {
            startHtml = startMessage.val;
        }
        var startXml = getXml(survey.title, startHtml);
        var startQ = new xmlParser.XmlDocument(startXml);
        startQ.pageType = 'start';
        questions.push(startQ);

        // save the questions as an array and add to questions array
        questions = questions.concat(surveyXml);

        // create and add start question to the beginning
        // API response is sent with default
        var finishMessage = xmlDocument.childNamed('endMessage');
        var finishHtml = '';
        if(finishMessage) {
          finishHtml = finishMessage.val;
        }
        var finishXml = getXml(survey.title, finishHtml, isQuiz);
        var finishQ = new xmlParser.XmlDocument(finishXml);
        finishQ.pageType = 'finish';
        questions.push(finishQ);



        // set the phrases for this survey
        var languagePack = JSON.parse(survey.languagePack);
        var customPhrases = language.getCustomPhrasesFromLanguagePack(languagePack);
        var type = (isQuiz ? 'quiz' : 'survey');
        CurrentPhrases.setPhrases(language.getFullPhrases(customPhrases, type));

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
    var now = new Date();
    startDate = now.toUTCString();
  },
  saveEndDate: function () {
    var now = new Date();
    endDate = now.toUTCString();
  },
  saveAnswer: function (questionId, questionType, answers) {
    // save as xml
    var newXml = answerParser.getAnswerXml(questionId, questionType, answers);
    if(newXml && newXml !== '') {
      numberOfAnswered++;
    }
    answersXml = answersXml + newXml;

    // save in QuizInfo
    if(isQuiz
      && Number(questionType) === 400
      && _.has(answers, 'selectedAnswers')) {
      var answer = {
        questionId,
        answer: answers.selectedAnswers
      }
      QuizInfo.saveAnswer(answer);
    }
  },
  saveAnswersToDatabase: function ({userId, isComplete}) {
    var responseXml = `<answers pCompleted='${numberOfAnswered}'>
        ${answersXml}</answers>`;
    var completedStatus = (isComplete === 'complete' ? 2 : 1);
    // save questions to db
    return Database.saveResponse({
      surveyId: surveyId,
      responseXML: responseXml,
      startDate: startDate,
      endDate: endDate,
      completed: completedStatus,
      latitude: 0, // Polldaddy.com API does not accept coordinates
      longitude: 0, // Polldaddy.com API does not accept coordinates
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
var getXml = function (title, htmlContent, isQuiz) {
  // add qType
  var qType = 2000;
  if(isQuiz) {
    qType = 2001;
  }

  // prepare for xml parsing
  htmlContent = htmlContent.replace('<', '&lt;');
  htmlContent = htmlContent.replace('>', '&gt;');

  return `<question qType="${qType}" qID="-1" trueQ="0"><qText>${title}</qText><nText></nText><note>false</note><chunk>${htmlContent}</chunk></question>`;
};
