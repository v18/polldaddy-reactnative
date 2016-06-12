import {
  Navigator,
  StyleSheet
} from 'react-native';
import React from 'react';
import RemoteSurveysList from './remote-surveys-list';
import SavedSurveysList from './saved-surveys-list';
import Signin from './signin';
import Splash from './splash';
import SurveyLauncher from './survey-launcher';
import SurveyPage from './survey-page';

var ROUTES = {
  splash: Splash,
  signin: Signin,
  savedSurveysList: SavedSurveysList,
  remoteSurveysList: RemoteSurveysList,
  surveyPage: SurveyPage,
  surveyLauncher: SurveyLauncher
};

module.exports = React.createClass({
  render: function() {
    return (
      <Navigator
          initialRoute={{name: 'splash'}}
          renderScene={this.renderScene}
          style={styles.container}
      />
    );
  },
  renderScene: function(route, navigator) {
    var Component = ROUTES[route.name];
    return (
      <Component
          navigator={navigator}
          route={route}
      />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
