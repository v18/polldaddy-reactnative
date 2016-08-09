import React from 'react';
import { View, Text } from 'react-native';

module.exports = React.createClass({
  render: function () {
    return <View>{this.renderQuestionsList()}</View>;
  },
  renderQuestionsList: function () {
    return this.props.questions.map((question, index) => {
      return <Text key={index}>{this.renderQuestion(question)}</Text>;
    });
  },
  renderQuestion: function (question) {
    return (
      <View>
        <Text>question.name</Text>
        {this.renderOptions(question.options, question.correctAnswer)}
      </View>
    );
  },
  renderOptions: function (options, correctAnswer) {
    return this.props.options.map((option, index) => {
      return <Text key={index}>{this.renderQuestion(question)}</Text>;
    });
  },
  renderOption: function (option, correctAnswer) {

  }
});


// id: Number(question.attr.qID),
// correctAnswer: Number(question.childNamed('answer').val),
// name: question.childNamed('qText').val,
// options: optionsInfo

// id: Number(option.attr.oID),
// text: option.val
