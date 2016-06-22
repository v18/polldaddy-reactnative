import {
  Alert,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import Actions from '../actions/current-question';
import AnswersStore from '../stores/answers-store';
import CurrentSurvey from '../utils/current-survey';
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
    this.focusListener.remove();
    this.unsubscribeFromAnswers();
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
  onAnswersChange: function (data) {
    this.setState({
      hasError: data.hasError,
      errorMessage: data.errorMessage
    });
  },
  buttonText: function(buttonType) {
    var text = '';
    switch(buttonType) {
      case 'next':
        text = 'Next'.toUpperCase();
        break;
      case 'done':
        text = 'Done'.toUpperCase();
        break;
      case 'startSurvey':
        text = 'Start Survey'.toUpperCase();
        break;
      case 'startOver':
        text = 'Start Over'.toUpperCase();
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
            this.goToNextPage(nav);
          } else {
            Alert.alert('Error', this.state.errorMessage, [{text: 'Ok'}]);
          }
        };
        break;
      case 'done':
        fn = this.goBackToSurveyLauncherPage;
        break;
      case 'startSurvey':
        fn = this.goToNextPage;
        break;
      case 'startOver':
        fn = this.goBackToStartPage;
        break;
    }
    return fn;
  },
  goBackToStartPage: function(nav) {
    // reset the survey to the start page
    Actions.reset();
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
      left: 'done',
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
      left: 'startOver',
      right: 'next'
    }
  },
  finish: {
    top: {
      left: 'done',
      right: 'startOver'
    },
    bottom: {
      left: 'none',
      right: 'startOver'
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
