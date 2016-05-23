import {
  StyleSheet,
  Text,
  ToolbarAndroid,
  View
} from 'react-native';
import React from 'react';

module.exports = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <ToolbarAndroid
            actions={toolbarActions}
            onActionSelected={this.onActionSelected}
            style={styles.toolbar}
            title='My Surveys'
            titleColor='#FFF'
        />
        <View style={styles.info}>
          <Text style={styles.text}>
            You don't have any local surveys.
          </Text>
          <Text style={[styles.text, styles.link]}>
            Select Cloud Surveys
          </Text>
        </View>
      </View>
    );
  },
  onActionSelected: function(position) {
    if(position === 0) {
      this.props.navigator.push({name: 'remoteSurveyList'});
    }
  }
});

var toolbarActions = [
  {title: 'Select Polldaddy Surveys', icon: require('./img/cloud-icon/cloud-toolbar.png'), show: 'always'},
  {title: 'Sign out', show: 'never'}
];

var styles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#B72422',
    height: 54
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  info: {
    marginTop: 5
  },
  text: {
    textAlign: 'center',
    padding: 5
  },
  link: {
    color: '#B72422'
  }
});
