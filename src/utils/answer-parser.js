import _ from 'lodash';
module.exports = {
  getAnswerXml: function (qId, qType, answers) {
    var answersXml = '';
    switch(qType) {
      // the field questions
      case 900: // address
      case 1000: // date/time
      case 1400: // email
      case 200: // free text
      case 100: // free text
      case 800: // name
      case 1100: // number
      case 1500: // url
      case 950: // phone number
        answersXml = this.getXmlForSimpleInputs(answers);
        break;
      case 1200: // matrix
        answersXml = this.getMatrixXml(answers);
        break;
      case 400: // multiple choice
        answersXml = this.getMultipleChoiceXml(answers);
        break;
      case 1300: // rank
        answersXml = this.getRankXml(answers);
        break;
      case 2000: // html snippet & custom android start and finish questions
      case 1900: // page header
        // do nothing - no answer xml is returned for these questions
        break;
    }
    if(!answersXml || answersXml === '') {
      return '';
    }
    return `<answer qID='${qId}' qType='${qType}'>${answersXml}</answer>`;
  },
  getXmlTag: function (fieldName, fieldValue) {
    var xml = '';
    if(fieldName
      && fieldValue
      && fieldValue !== ''
      && typeof fieldValue !== 'undefined')
    {
      xml = `<${fieldName}>${fieldValue}</${fieldName}>`;
    }
    return xml;
  },
  getXmlForSimpleInputs: function (answers) {
    var fieldsXml = '',
      fields,
      allEmpty = true;

    if(answers && typeof answers === 'object') {
      fields = Object.keys(answers);
      allEmpty = this.allFieldsEmpty(answers);
    }

    if(!allEmpty) {
      fieldsXml = fields.reduce((xml, field) => {
        return xml + this.getXmlTag(field, answers[field]);
      }, '');
    }
    return fieldsXml;
  },
  getMatrixXml: function (answers) {
    if(!answers) {
      return '';
    }

    var keys = Object.keys(answers);

    var optionsXml = keys.reduce(function (xml, rowId) {
      var optionXml = '';

      if(answers[rowId] && answers[rowId].length > 0) {
        var colIds = answers[rowId].join(',');
        optionXml = `<option rowID='${rowId}' colID='${colIds}'/>`;
      }

      return xml + optionXml;
    }, '');

    if(!optionsXml) {
      return '';
    }

    return `<options>${optionsXml}</options>`;
  },
  getMultipleChoiceXml: function (answers) {
    var xml = '';

    if(!answers || _.isEmpty(answers)) {
      return '';
    }

    // other choice
    if(answers.otherText
      && answers.otherText !== ''
      && answers.selectedAnswers.indexOf(-1) > -1) {
      xml = xml + this.getXmlTag('otherText', answers.otherText);
    }

    // user comment
    if(answers.commentText && answers.commentText !== '') {
      xml = xml + this.getXmlTag('commentText', answers.commentText);
    }

    // selections
    if(answers.selectedAnswers && !_.isEmpty(answers.selectedAnswers)) {
      var list = answers.selectedAnswers.join(','),
        selectionsXml = `<option oID='${list}'/>`;
      xml = xml + selectionsXml;
    }

    if(xml !== '') {
      xml = `<options>${xml}</options>`;
    }

    return xml;
  },
  getRankXml: function (answers) {
    if(!answers || _.isEmpty(answers)) {
      return '';
    }
    var list = _.map(answers, 'id').join(',');
    return `<rank>${list}</rank>`;
  },
  allFieldsEmpty: function (answers) {
    var fields = Object.keys(answers),
      allEmpty;

    allEmpty = fields.reduce(function (isEmptySoFar, field) {
      var currentFieldIsEmpty = (answers[field] === ''
        || typeof answers[field] === 'undefined'
        || answers[field] === null);
      return isEmptySoFar && currentFieldIsEmpty;
    }, true);

    return allEmpty;
  }
};
