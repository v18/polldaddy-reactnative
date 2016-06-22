import {
  StyleSheet,
  TextInput,
  View
} from 'react-native';
import Actions from '../../actions/current-question.js';
import React from 'react';

module.exports = React.createClass({
  getInitialState: function () {
    return {
      value: ''
    };
  },
  render: function() {
    return (<View style={styles.formElement}>
      <TextInput
          onChangeText={this.handleOnChangeText}
          placeholder={this.props.placeholder}
          placeholderTextColor='#C7C7CD'
          underlineColorAndroid='#FFF'
          value={this.state.value}
      />
    </View>);
  },
  handleOnChangeText: function (text) {
    this.setState({
      value: text
    });
    Actions.saveInputs(this.props.name, text);
  }
});

var styles = StyleSheet.create({
  formElement: {
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
    height: 48
  }
});
