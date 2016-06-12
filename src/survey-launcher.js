import {
  Alert,
  StyleSheet,
  Text,
  ToolbarAndroid,
  TouchableHighlight,
  View
} from 'react-native';
import CurrentSurvey from './utils/current-survey';
import React from 'react';

module.exports = React.createClass({
  getInitialState: function () {
    return {
      responses: this.props.route.responses,
      isLoaded: false
    };
  },
  componentWillMount: function () {
    // save the current survey
    CurrentSurvey.set(this.props.route.surveyId)
      .then(() => {
        this.setState({
          isLoaded: true
        });
      })
      .catch(() => {
        Alert.alert('Error',
          'Sorry we were not able to load the survey, please go back and try again.',
          [{
            text: 'Ok',
            onPress: () => {this.props.navigator.pop();} // eslint-disable-line react/jsx-no-bind
          }]);
      });
  },
  render: function () {
    return (<View style={styles.container}>
      <ToolbarAndroid
          navIcon={require('./img/back/ic_arrow_back_white.png')}
          onIconClicked={() => {this.props.navigator.pop();}} // eslint-disable-line react/jsx-no-bind
          style={styles.toolbar}
          title={this.props.route.surveyTitle}
          titleColor='#FFF'
      />
      <View>
        <TouchableHighlight
            onPress={this.handleStartSurveyPress}
            style={[styles.button]}
            underlayColor='#e0e0e0'
        >
          <Text style={[styles.text, loadingButton(this.state.isLoaded)]}>Start survey</Text>
        </TouchableHighlight>
        {this.renderSyncButton()}
      </View>
    </View>);
  },
  renderSyncButton: function () {
    if(this.state.responses > 0) {
      return (<TouchableHighlight style={styles.button}>
        <Text style={styles.text}>Sync {this.state.responses} offline responses</Text>
      </TouchableHighlight>);
    }
  },
  handleStartSurveyPress: function() {
    CurrentSurvey.getNextQuestion()
      .then((question) => {
        this.props.navigator.push({
          name: 'surveyPage',
          question: question
        });
      })
      .catch((error) => {
        Alert.alert('Error',
          error.message,
          [{
            text: 'Ok',
            onPress: () => {this.props.navigator.pop();}
          }]);
      });
  }
});

var loadingButton = function (isLoaded) {
  var color = '#e0e0e0';
  if(isLoaded) {
    color = '#000';
  }
  return {
    color: color
  };
};

var styles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#B72422',
    height: 54
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
    height: 48
  },
  text: {
    marginLeft: 16,
    color: 'black',
    fontSize: 16
  }
});
