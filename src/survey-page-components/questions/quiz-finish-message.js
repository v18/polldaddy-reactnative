import _ from 'lodash';
import Html from '../elements/html';
import React from 'react';
import { View, Text } from 'react-native';
import QuizInfo from '../../utils/current-quiz-info';
import { phrases, getScorePhraseFromTemplate } from '../../utils/current-phrases';
import QuizAnswersDetails from '../elements/quiz-answers-details';

module.exports = React.createClass({
  componentDidMount: function () {
    var score = this._calculateScore();
    this.setState({
      score
    });
  },
  getInitialState: function () {
    return {
      score: -1
    }
  },
  render: function () {
    // var htmlString = '';
    // var chunk = this.props.question.childNamed('chunk');
    // if(chunk.val) {
    //   htmlString = chunk.val;
    // }
    if(this.state.score === -1) {
      return <View><Text>loading</Text></View>;
    }
    return (
      <View>
        {this.renderFinishMessage()}
        {this.renderQuizResults()}
      </View>
    );
  },
  renderFinishMessage: function () {
    if(this.state.score >= QuizInfo.passThreshold) {
      return <View><Text>pass finish message</Text></View>;
    } else {
      return <View><Text>fail finish message</Text></View>;
    }
  },
  renderQuizResults: function () {
    if(Number(QuizInfo.resultsView) === 1 || Number(QuizInfo.resultsView) === 2) {
      return (
        <View>
        <Text>renderQuizResults</Text>
          {this.renderScore()}
          {this.renderScoreDescription()}
          {this.renderUserAnswers()}
        </View>
      );
    }
  },
  renderScore: function () {
    var scorePhrase = getScorePhraseFromTemplate(
      phrases.scored, this.state.score);
    return (
      <View>
        <Text>{scorePhrase}</Text>
      </View>
    );
  },
  renderScoreDescription: function () {
    if(Number(QuizInfo.passThreshold) > 0) {
      if(this.state.score >= QuizInfo.passThreshold) {
        return <Text>{phrases.passed}</Text>;
      } else {
        return <Text>{phrases.failed}</Text>;
      }
    }
  },
  renderUserAnswers: function () {
    console.log('--renderUserAnswers');
    if(Number(QuizInfo.resultsView) === 1) {
      return (
        <QuizAnswersDetails
            questions={QuizInfo.questions}
            answers={QuizInfo.answers}
        />
      );
    }
  },
  _calculateScore: function (answers = QuizInfo.answers, questions = QuizInfo.questions) {
    if(answers.length === 0) {
      return 0;
    }

    var totalRight = questions.reduce(function (score, currentQuestion, index) {
      var answeredCorrectly = false;
      var answerForCurrentQuestion = _.find(answers, function (answer) {
        return answer.questionId === currentQuestion.id;
      });
      if(answerForCurrentQuestion) {

        // answerForCurrentQuestion.answer is an array of answers
        var arrayOfAnswers = answerForCurrentQuestion.answer;
        var correctAnswerId = currentQuestion.correctAnswer;
        answeredCorrectly = (arrayOfAnswers.indexOf(correctAnswerId) > -1);
      }
      return score + (answeredCorrectly ? 1 : 0);
    }, 0);

    return Math.round(100 * totalRight / questions.length);
  }
});
