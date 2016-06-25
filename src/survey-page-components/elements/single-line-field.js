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
      value: (this.props.default || '')
    };
  },
  render: function() {
    return (<View style={styles.formElement}>
      <TextInput
          autoFocus={this.props.autoFocus}
          keyboardType={this.props.keyboardType}
          onChangeText={this.handleOnChangeText}
          placeholder={this.props.placeholder}
          placeholderTextColor='#C7C7CD'
          underlineColorAndroid='#FFF'
          value={this.state.value}
      />
    </View>);
  },
  handleOnChangeText: function (text) {
    // sanitize the text
    var sanitizedText = text;
    if(this.props.sanitizeText) {
      sanitizedText = this.props.sanitizeText(text);
    }

    this.setState({
      value: sanitizedText
    });
    Actions.saveInputs(this.props.name, sanitizedText);
  }
});

var styles = StyleSheet.create({
  formElement: {
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
    height: 48
  }
});
