import {
  Navigator,
  StyleSheet
} from 'react-native';
import LocalSurveyList from './local-survey-list';
import React from 'react';
import Signin from './signin';
import Splash from './splash';


var ROUTES = {
  splash: Splash,
  signin: Signin,
  localSurveyList: LocalSurveyList
};

module.exports = React.createClass({
  render: function() {
    return (
      <Navigator
          configureScene={function() {
            return Navigator.SceneConfigs.FloatFromRight;
          }}
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
