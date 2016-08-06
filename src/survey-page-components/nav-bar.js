import {
  Alert,
  AsyncStorage,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import _ from 'lodash';
import Actions from '../actions/current-question';
import AnswersStore from '../stores/answers-store';
import CurrentSurvey from '../utils/current-survey';
import { phrases } from '../utils/current-phrases';
import React from 'react';

module.exports = React.createClass({
  componentDidMount: function () {
    this.unsubscribeFromAnswers = AnswersStore.listen(this.onAnswersChange);
    this.focusListener = this.props.navigator.navigationContext.addListener('willfocus', () => {
      this.focusListener.remove();
      this.unsubscribeFromAnswers();
    });
  },
  componentWillUnmount: function () {
    if(this.focusListener) {
      this.focusListener.remove();
    }
    if(this.unsubscribeFromAnswers) {
      this.unsubscribeFromAnswers();
    }
  },
  render: function() {
    var nav = this.props.navigator;
    var rightButton = buttonTypes[this.props.pageType][this.props.navPosition]['right'];
    var leftButton = buttonTypes[this.props.pageType][this.props.navPosition]['left'];

    return (<View style={styles.container}>
      <TouchableHighlight
          onPress={() => {this.buttonFn(leftButton)(nav);}} // eslint-disable-line react/jsx-no-bind
          style={[styles.button, styles.leftButton]}
      >
        <Text style={styles.buttonText}>{this.buttonText(leftButton)}</Text>
      </TouchableHighlight>
      <TouchableHighlight
          onPress={() => {this.buttonFn(rightButton)(nav);}} // eslint-disable-line react/jsx-no-bind
          style={styles.button, styles.rightButton}
      >
        <Text style={styles.buttonText}>{this.buttonText(rightButton)}</Text>
      </TouchableHighlight>
    </View>);
  },
  onAnswersChange: function ({questionId, questionType, answers, hasError, errorMessage}) {
    this.setState({
      questionId,
      questionType,
      answers,
      hasError,
      errorMessage
    });
  },
  buttonText: function(buttonType) {
    var text = '';
    switch(buttonType) {
      case 'next':
        text = phrases.continue.toUpperCase();
        break;
      case 'exitWithoutSaving':
        text = phrases.close.toUpperCase();
        break;
      case 'startSurvey':
        text = phrases.start.toUpperCase();
        break;
      case 'startOverWithoutSaving':
        text = phrases.close.toUpperCase();
        break;
      case 'saveAndExit':
        text = phrases.finish.toUpperCase();
        break;
      case 'saveAndStartOver':
        text = phrases.start.toUpperCase();
        break;
    }
    return text;
  },
  buttonFn: function(buttonType) {
    var fn = function () {};
    switch(buttonType) {
      case 'next':
        fn = (nav) => {
          // make sure there are no errors on the page we're on
          if(!this.state.hasError) {
            CurrentSurvey.saveAnswer(this.state.questionId, this.state.questionType, this.state.answers);
            this.goToNextPage(nav);
          } else {
            var errorMessage = this.state.errorMessage;
            if(_.has(phrases, this.state.errorMessage)) {
              errorMessage = phrases[this.state.errorMessage];
            }
            Alert.alert('Error', errorMessage, [{text: 'Ok'}]);
          }
        };
        break;
      case 'exitWithoutSaving':
        fn = this.goBackToSurveyLauncherPage;
        break;
      case 'startSurvey':
        fn = (nav) => {
          CurrentSurvey.saveStartDate();
          this.goToNextPage(nav);
        };
        break;
      case 'startOverWithoutSaving':
        fn = (nav) => {
          Alert.alert(phrases.close,
            'Are you sure you want to exit the survey without saving your answers?',
            [
              {
                text: 'Exit without saving',
                onPress: () => {this.goBackToStartPage(nav);}
              },
              {text: 'Cancel'}
            ]);
        };
        break;
      case 'saveAndExit':
        fn = this.saveAndExit;
        break;
      case 'saveAndStartOver':
        fn = this.saveAndStartOver;
    }
    return fn;
  },
  saveSurveyAnswers: function (isComplete) {
    return AsyncStorage.getItem('userId')
    .then(function (userId) {
      if(!userId) {
        throw new Error('no user saved');
      }
      return Promise.resolve(userId);
    })
    .then(function (userId) {
      CurrentSurvey.saveEndDate();
      return CurrentSurvey.saveAnswersToDatabase({userId, isComplete});
    })
    .then(function () {
      return Promise.resolve();
    })
    .catch((error) => {
      if(error.message === 'no user saved')  {
        AsyncStorage.multiRemove(['userCode', 'userId'])
        .then(() => {
          Alert.alert('Whoops',
            "You're not logged in, please go back and log in.",
            [{text: 'Ok, take me to the login page',
              onPress: () => {
                this.props.navigator.immediatelyResetRouteStack([{name: 'signin'}]);
              }
          }]);
        });
      } else {
        // case: error.message === 'no saved result'
        Alert.alert('Error',
          "Couldn't save the answers for this survey. Please try again.",
          [{text: 'Ok',
            onPress: () => {
              this.goBackToStartPage(this.props.navigator);
            }
          }]
        );
      }
      return Promise.resolve('Went through alert error already');
    });
  },
  saveAndExit: function (nav) {
    return this.saveSurveyAnswers('complete')
    .then((result) => {
      if(result !== 'Went through alert error already') {
        this.goBackToSurveyLauncherPage(nav);
      }
    })
    .done();
  },
  saveAndStartOver: function (nav) {
    return this.saveSurveyAnswers('complete')
    .then((result) => {
      if(result !== 'Went through alert error already') {
        this.goBackToStartPage(nav);
      }
    })
    .done();
  },
  goBackToStartPage: function(nav) {
    // reset the survey to the start page
    Actions.reset();
    CurrentSurvey.resetAnswers();
    CurrentSurvey.setCurrentQuestionIndex(0);
    this.focusListener.remove();
    this.unsubscribeFromAnswers();

    // go to the survey start page
    var startPageIndex = this.findFirstRouteIndex(nav, 'surveyPage');
    nav.popToRoute(nav.getCurrentRoutes()[startPageIndex]);
  },
  goBackToSurveyLauncherPage: function(nav) {
    // reset the survey to before the starting point
    Actions.reset();
    CurrentSurvey.resetAnswers();
    CurrentSurvey.setCurrentQuestionIndex(-1);
    this.focusListener.remove();
    this.unsubscribeFromAnswers();

    // find the surveyLauncher index and go to it
    var surveyLauncherIndex = this.findFirstRouteIndex(nav, 'surveyLauncher');
    nav.popToRoute(nav.getCurrentRoutes()[surveyLauncherIndex]);
  },
  goToNextPage: function(nav) {
    this.focusListener.remove();
    this.unsubscribeFromAnswers();
    Actions.reset();
    CurrentSurvey.getNextQuestion()
      .then((question) => {
        if(question) {
          nav.push({
            name: 'surveyPage',
            question: question
          });
        }
      })
      .catch(function () {
        Alert.alert(
          'Error',
          "Couldn't continue with this survey. Please start again.",
          {
            text: 'Ok',
            onPress: () => {
              // find the surveyLauncher index and go to it
              var surveyLauncherIndex = this.findFirstRouteIndex(nav, 'surveyLauncher');
              nav.popToRoute(nav.getCurrentRoutes()[surveyLauncherIndex]);
            }
          });
      });
  },
  findFirstRouteIndex: function(nav, name) {
    var routes = nav.getCurrentRoutes();
    for (var i = 0; i <= routes.length; i++) {
      if(routes[i].name === name) {
        return i;
      }
    }
  }
});

var buttonTypes = {
  start: {
    top: {
      left: 'exitWithoutSaving',
      right: 'startSurvey'
    },
    bottom: {
      left: 'none',
      right: 'startSurvey'
    }
  },
  question: {
    top: {
      left: 'none',
      right: 'next'
    },
    bottom: {
      left: 'startOverWithoutSaving',
      right: 'next'
    }
  },
  finish: {
    top: {
      left: 'saveAndExit',
      right: 'saveAndStartOver'
    },
    bottom: {
      left: 'none',
      right: 'saveAndStartOver'
    }
  }
};

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#B72422',
    height: 54,
    flexWrap: 'nowrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '500',
    fontSize: 14,
    marginLeft: 8,
    marginRight: 8
  },
  leftButton: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  rightButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
});
