import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import _ from 'lodash';
import Actions from '../actions/current-question';
import Address from './questions/address';
import DateTime from './questions/date-time';
import Email from './questions/email';
import FileUpload from './questions/file-upload';
import FreeText from './questions/free-text';
import Html from './elements/html';
import HtmlSnippet from './questions/html-snippet';
import Matrix from './questions/matrix';
import MultipleChoice from './questions/multiple-choice';
import Name from './questions/name';
import NumberQuestion from './questions/number';
import PhoneNumber from './questions/phone-number';
import Rank from './questions/rank';
import React from 'react';
import Url from './questions/url';

module.exports = React.createClass({
  render: function () {
    return (
      <View>
        {this.renderMandatoryIndicator()}
        {this.renderTitle()}
        {this.renderNote()}
        {this.renderQuestion(this.props.question)}
      </View>
    );
  },
  renderMandatoryIndicator: function () {
    var questionId = Number(this.props.question.attr.qID);
    var questionType = Number(this.props.question.attr.qType);

    var isMandatory = this.getIsMandatory();
    if(isMandatory) {
      // make sure that initial state for error is true
      Actions.saveError('mandatory');
      return <Text>*</Text>;
    } else {
      Actions.saveAnswers(questionId, questionType, {});
    }
  },
  renderTitle: function () {
    // if it's not the start or finish page (i.e. pageType exists)
    // do not render qText for HTML snippet
    var qType = Number(this.props.question.attr.qType);
    if(qType === 2000 && !this.props.question.pageType) {
      return;
    } else {
      return (
        <Text
            style={styles.title}
        >
          {this.props.question.childNamed('qText').val}
        </Text>);
    }
  },
  renderNote: function() {
    if(this.props.question.childNamed('note').val === 'true') {
      var htmlString = this.props.question.childNamed('nText').val;
      return <Html htmlString={htmlString} />;
    }
  },
  renderQuestion: function(question) {
    var questionType = Number(question.attr.qType);
    var props = {
      question: this.props.question,
      navigator: this.props.navigator
    };
    switch(questionType) {
      case 900: // address
        return <Address {...props} />;
      case 1000: // date/time
        return <DateTime {...props} />;
      case 1400: // email
        return <Email {...props} />;
      case 1600: // file upload
        return <FileUpload question={this.props.question} />;
      case 200: // free text
        return <FreeText {...props} />;
      case 100:
        return <FreeText {...props} />;
      case 2000: // html snippet
        return <HtmlSnippet {...props} />;
      case 1200: // matrix / likert
        var matrixProps = this.getMatrixProps(this.props.question);
        matrixProps.navigator = props.navigator;
        return <Matrix {...matrixProps} />;
      case 400: // multiple choice
        var multipleChoiceProps = this.getMultipleChoiceProps();
        multipleChoiceProps.navigator = props.navigator;
        return <MultipleChoice {...multipleChoiceProps} />;
      case 800: // name
        return <Name {...props} />;
      case 1100: // number
        var numberProps = this.getNumberProps();
        numberProps.navigator = props.navigator;
        return <NumberQuestion {...numberProps} />;
      case 1900: // page header
        // do nothing, page headers do not have question content
        break;
      case 950: // phone number
        return <PhoneNumber {...props} />;
      case 1300: // rank
        var rankProps = this.getRankProps();
        rankProps.navigator = props.navigator;
        return <Rank {...rankProps} />;
      case 1500: // URL
        return <Url {...props} />;
    }
  },
  getNumberProps: function (question = this.props.question) {
    var questionId = Number(question.attr.qID);
    var questionType = Number(question.attr.qType);
    var min = Number(question.childNamed('min_value').val);
    var max =  Number(question.childNamed('max_value').val);
    var decimalPlaces = Number(
      question.childNamed('decimal_places').val);
    var isSlider = (question.childNamed('slider').val === 'true');
    var labelValue = question.childNamed('label').val;

    var defaultValue = Number(question.childNamed('default_value').val);

    if(isSlider) {
      defaultValue = defaultValue || min;
      min = min || 0;
      max = max || 1;
    } else {
      defaultValue = defaultValue || '';
      min = min || '';
      max = max || '';
    }

    var labelPositionNum = Number(question.childNamed('label_position').val);
    var labelPosition;
    switch (labelPositionNum) {
      case 0:
        labelPosition = 'none';
        break;
      case 1:
        labelPosition = 'before';
        break;
      case 2:
        labelPosition = 'after';
        break;
    }

    var isMandatory = this.getIsMandatory(question);

    return {
      min,
      max,
      defaultValue,
      isSlider,
      decimalPlaces,
      labelPosition,
      labelValue,
      isMandatory,
      questionId,
      questionType
    };
  },
  getIsMandatory: function (question = this.props.question) {
    var mandatoryField = question.childNamed('mand');
    return mandatoryField && (mandatoryField.val === 'true');
  },
  getMultipleChoiceProps: function (question = this.props.question) {
    var questionId = Number(question.attr.qID);
    var questionType = Number(question.attr.qType);
    var other = (question.childNamed('other').val === 'true');
    var max = 1;
    var min = 0;
    var type = Number(question.childNamed('elmType').val);
    var multipleChoicesAllowed = type === 2 || type === 3;
    if(multipleChoicesAllowed) { // multiple selections allowed
      var limits = question.childNamed('limits');
      if(limits) {
        min = Number(limits.attr.min);
        max = Number(limits.attr.max);
      }
    }

    var comments = question.childNamed('comments').attr.enabled === 'true';
    if(comments) {
      comments = question.childNamed('comments').val;
    }

    var correctAnswerId = Number(question.childNamed('answer').val);

    var answers = this.getMultipleChoiceAnswerArray(question);

    var isMandatory = this.getIsMandatory(question);

    return {
      other,
      max,
      min,
      comments,
      correctAnswerId,
      answers,
      isMandatory,
      questionId,
      questionType
    };
  },
  getMultipleChoiceAnswerArray: function (question = this.props.question,
    shuffle = _.shuffle) {
    var options = question.childNamed('options').childrenNamed('option');
    var orderType = Number(question.childNamed('rand').val);

    // create answers array
    var answers = [];
    options.map(function (option) {
      var id = Number(option.attr.oID);
      var text = _.trim(option.val);
      var selected = false;
      answers.push({
        id,
        text,
        selected
      });
    });

    // order by specified ordering
    switch(orderType) {
      case 1: // A to Z
        answers = _.orderBy(answers, 'text', 'asc');
        break;
      case 2: // Z to A
        answers = _.orderBy(answers, 'text', 'desc');
        break;
      case 3: // random
        answers = shuffle(answers);
        break;
    }

    // add in any images
    var media = question.childNamed('media');
    if(media) {
      var mediaList = media.childrenNamed('mediaItem');

      mediaList.map(function (item) {
        if(item.attr.type === 'library') {
          var id = Number(item.attr.oID);
          var matchingAnswer = _.find(answers, function (answer) {
            return answer.id === id;
          });
          if(matchingAnswer) {
            matchingAnswer.image = item.val;
          }
        }
      });
    }

    // add in other choice
    var other = question.childNamed('other').val === 'true';
    if(other) {
      answers.push({
        id: -1,
        text: 'Other',
        selected: false
      });
    }

    return answers;
  },
  getRankProps: function (question = this.props.question, shuffle = _.shuffle) {
    var isMandatory = this.getIsMandatory(question);
    var questionId = Number(question.attr.qID);
    var questionType = Number(question.attr.qType);

    // create answers array
    var options = question.childNamed('options').childrenNamed('option');
    var answers = [];
    options.map(function (option) {
      var id = Number(option.attr.oID);
      var text = _.trim(option.val);
      answers.push({
        id,
        text
      });
    });

    // order by specified ordering
    var orderType = Number(question.childNamed('rand').val);
    switch(orderType) {
      case 1: // A to Z
        answers = _.orderBy(answers, 'text', 'asc');
        break;
      case 2: // Z to A
        answers = _.orderBy(answers, 'text', 'desc');
        break;
      case 3: // random
        answers = shuffle(answers);
        break;
    }

    // add in any images
    var media = question.childNamed('media');
    if(media) {
      var mediaList = media.childrenNamed('mediaItem');

      mediaList.map(function (item) {
        if(item.attr.type === 'library') {
          var id = Number(item.attr.oID);
          var matchingAnswer = _.find(answers, function (answer) {
            return answer.id === id;
          });
          if(matchingAnswer) {
            matchingAnswer.image = item.val;
          }
        }
      });
    }

    return {
      answers,
      isMandatory,
      questionId,
      questionType
    };
  },
  getMatrixProps: function (question = this.props.question) {
    var questionId = Number(question.attr.qID);
    var questionType = Number(question.attr.qType);
    var isMandatory = this.getIsMandatory(question);
    var type = Number(question.childNamed('elmType').val);
    var multipleChoicesAllowed = (type === 1);

    var {rows, columns} = this.getMatrixOptions(question);

    return {
      isMandatory,
      multipleChoicesAllowed,
      rows,
      columns,
      questionId,
      questionType
    };
  },
  getMatrixOptions: function (question = this.props.question,
  shuffle = _.shuffle) {
    var rowOptions = question.childWithAttribute('oType', 'rows').children;
    var colOptions = question.childWithAttribute('oType', 'cols').children;

    var rows = rowOptions.map(function (row) {
      return {
        id: Number(row.attr.oID),
        text: row.val
      };
    });

    var columns = colOptions.map(function (column) {
      return {
        id: Number(column.attr.oID),
        text: column.val
      };
    });

    // put them in order
    var orderType = Number(question.childNamed('orderType').val);
    var rowsShouldBeRandom = orderType === 2 || orderType === 3;
    var columnsShouldBeRandom = orderType === 1 || orderType === 3;

    if(rowsShouldBeRandom) {
      rows = shuffle(rows);
    }

    if(columnsShouldBeRandom) {
      columns = shuffle(columns);
    }

    return {
      rows,
      columns
    };
  }
});

var styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000'
  }
});
