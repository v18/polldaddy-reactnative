import _ from 'lodash';
import xmlParser from 'xmldoc';

var questionsXML = {
  mandatoryNoPlaceholder: `<question qType="1500" qID="7298694" trueQ="1">
    <qText>mandatory, no placeholder</qText>
    <nText></nText>
    <note>false</note>
    <example></example>
    <mand>true</mand>
  </question>`,
  mandatoryWithPlaceholder: `<question qType="1500" qID="7298694" trueQ="1">
    <qText>mandatory, with placeholder</qText>
    <nText></nText>
    <note>false</note>
    <example>http://www.example.com</example>
    <mand>true</mand>
  </question>`,
  notMandatoryNoPlaceholder: `<question qType="1500" qID="7298694" trueQ="1">
    <qText>not mandatory, no placeholder</qText>
    <nText></nText>
    <note>false</note>
    <example></example>
    <mand>false</mand>
  </question>`,
  notMandatoryWithPlaceholder: `<question qType="1500" qID="7298694" trueQ="1">
    <qText>not mandatory, with placeholder</qText>
    <nText></nText>
    <note>false</note>
    <example>http://www.example.com</example>
    <mand>false</mand>
  </question>`
}

module.exports = _.mapValues(questionsXML, function (question) {
  return new xmlParser.XmlDocument(question);
});
