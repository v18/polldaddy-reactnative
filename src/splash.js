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

    // make sure both userId and userCode exist

    Promise.all([AsyncStorage.getItem('userCode'),
    AsyncStorage.getItem('userId')])
      .then(function ([userCode, userId]) {
        if(userCode && userId) {
          route = {name: 'savedSurveysList'};
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
