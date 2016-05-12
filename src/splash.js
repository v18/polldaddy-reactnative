import {
  AsyncStorage,
  Image,
  StyleSheet,
  View
} from 'react-native';
import React from 'react';

module.exports = React.createClass({
  componentDidMount: function() {
    var route = {name: 'signin'};
    AsyncStorage.getItem('userCode')
      .then(function(userCode) {
        if(userCode) {
          route = {name: 'localSurveyList'};
        }
      })
      .finally(function() {
        this.props.navigator.immediatelyResetRouteStack([route]);
      }.bind(this));
  },
  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
              resizeMode='contain'
              source={require('./img/polldaddy-logo.png')}
              style={styles.logo}
          />
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B72422',
    justifyContent: 'center'
  },
  logoContainer: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  logo: {
    flex: 1
  }
});
