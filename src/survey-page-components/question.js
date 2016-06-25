import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import Actions from '../actions/current-question';
import Address from './questions/address';
import DateTime from './questions/date-time';
import Email from './questions/email';
import FileUpload from './questions/file-upload';
import FreeText from './questions/free-text';
import HtmlSnippet from './questions/html-snippet';
import Matrix from './questions/matrix';
import MultipleChoice from './questions/multiple-choice';
import Name from './questions/name';
import NumberQuestion from './questions/number';
import PageHeader from './questions/page-header';
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
    var isMand = this.props.question.childNamed('mand');
    if(isMand && isMand.val === 'true') {
      // make sure that initial state for error is true
      Actions.saveError('This is a mandatory question.');
      return <Text>*</Text>;
    } else {
      Actions.saveAnswers({});
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
    if(this.props.question.childNamed('note').val) {
      return <Text>{this.props.question.childNamed('nText').val}</Text>;
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
        return <DateTime question={this.props.question} />;
      case 1400: // email
        return <Email {...props} />;
      case 1600: // file upload
        return <FileUpload question={this.props.question} />;
      case 200: // free text
        return <FreeText question={this.props.question} />;
      case 2000: // html snippet
        return <HtmlSnippet question={this.props.question} />;
      case 1200: // matrix / likert
        return <Matrix question={this.props.question} />;
      case 400: // multiple choice
        return <MultipleChoice question={this.props.question} />;
      case 800: // name
        return <Name {...props} />;
      case 1100: // number
        var props2 = this.getNumberProps();
        props2.navigator = props.navigator;
        return <NumberQuestion {...props2} />;
      case 1900: // page header
        return <PageHeader question={this.props.question} />;
      case 950: // phone number
        return <PhoneNumber question={this.props.question} />;
      case 1300: // rank
        return <Rank question={this.props.question} />;
      case 1500: // URL
        return <Url question={this.props.question} />;
    }
  },
  getNumberProps: function (question = this.props.question) {
    var min = Number(question.childNamed('min_value').val);
    var max =  Number(question.childNamed('max_value').val);
    var decimalPlaces = Number(
      question.childNamed('decimal_places').val);
    var isSlider = question.childNamed('slider').val === 'true' ? true : false;
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

    var isMandatory = false;
    var isMand = question.childNamed('mand');
    if(isMand && isMand.val === 'true') {
      isMandatory = true;
    }

    return {
      min,
      max,
      defaultValue,
      isSlider,
      decimalPlaces,
      labelPosition,
      labelValue,
      isMandatory
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
