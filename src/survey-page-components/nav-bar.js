import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import CurrentSurvey from '../utils/current-survey';
import React from 'react';

module.exports = React.createClass({
  render: function () {
    var nav = this.props.navigator;
    var rightButton = buttonTypes[this.props.pageType][this.props.navPosition]['right'];
    var leftButton = buttonTypes[this.props.pageType][this.props.navPosition]['left'];

    return (<View style={styles.container}>
      <TouchableHighlight
          onPress={() => {buttons[leftButton].fn(nav);}} // eslint-disable-line react/jsx-no-bind
          style={[styles.button, styles.leftButton]}
      >
        <Text style={styles.buttonText}>{buttons[leftButton].text}</Text>
      </TouchableHighlight>
      <TouchableHighlight
          onPress={() => {buttons[rightButton].fn(nav);}} // eslint-disable-line react/jsx-no-bind
          style={styles.button, styles.leftButton}
      >
        <Text style={styles.buttonText}>{buttons[rightButton].text}</Text>
      </TouchableHighlight>
    </View>);
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

var buttons = {
  done: {
    text: 'Done'.toUpperCase(),
    fn: function(nav) {
      goBackToSurveyLauncherPage(nav);
    }
  },
  startSurvey: {
    text: 'Start Survey'.toUpperCase(),
    fn: function (nav) {
      goToNextPage(nav);
    }
  },
  next: {
    text: 'Next'.toUpperCase(),
    fn: function(nav) {
      goToNextPage(nav);
    }
  },
  startOver: {
    text: 'Start Over'.toUpperCase(),
    fn: function(nav) {
      goBackToStartPage(nav);
    }
  },
  none: {
    text: '',
    fn: function () {
    }
  }
};

var goBackToStartPage = function (nav) {
  // reset the survey to the start page
  CurrentSurvey.setCurrentQuestionIndex(0);

  // go to the survey start page
  var startPageIndex = findFirstRouteIndex(nav, 'surveyPage');
  nav.popToRoute(nav.getCurrentRoutes()[startPageIndex]);
};

// works
var goBackToSurveyLauncherPage = function (nav) {
  // reset the survey to before the starting point
  CurrentSurvey.setCurrentQuestionIndex(-1);

  // find the surveyLauncher index and go to it
  var surveyLauncherIndex = findFirstRouteIndex(nav, 'surveyLauncher');
  nav.popToRoute(nav.getCurrentRoutes()[surveyLauncherIndex]);
};

// does not work
var goToNextPage = function (nav) {
  CurrentSurvey.getNextQuestion()
    .then((question) => {
      if(question) {
        nav.push({
          name: 'surveyPage',
          question: question
        });
      }
    })
    .catch(function (error) {
    });
};

var findFirstRouteIndex = function(nav, name) {
  var routes = nav.getCurrentRoutes();
  for (var i = 0; i <= routes.length; i++) {
    if(routes[i].name === name) {
      return i;
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
