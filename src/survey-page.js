import {
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import NavBar from './survey-page-components/nav-bar';
import Question from './survey-page-components/question';
import React from 'react';

module.exports = React.createClass({
  render: function() {
    return (<View style={styles.container}>
      <NavBar
          navigator={this.props.navigator}
          navPosition='top'
          pageType={this.props.route.question.pageType || 'question'}
          style={[styles.nav, styles.topNav]}
          titleColor='#FFF'
      />
      <ScrollView style={styles.content}>
        <Question
            navigator={this.props.navigator}
            question={this.props.route.question}
        />
      </ScrollView>
      <NavBar
          navigator={this.props.navigator}
          navPosition='bottom'
          pageType={this.props.route.question.pageType || 'question'}
          style={[styles.nav, styles.topNav]}
          titleColor='#FFF'
      />
    </View>);
  }
});

var styles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#B72422',
    height: 54
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  }
});
