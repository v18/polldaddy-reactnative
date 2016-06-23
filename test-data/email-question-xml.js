import _ from 'lodash';
import xmlParser from 'xmldoc';

var questionsXML = {
  mandatoryNoExample: `<question qType="1400" qID="7257504" trueQ="1">
    <qText>mandatory, no example</qText>
    <nText></nText>
    <note>false</note>
    <example></example>
    <mand>true</mand>
</question>`,
  mandatoryExample: ` <question qType="1400" qID="7257504" trueQ="1">
    <qText>mandatory, with example</qText>
    <nText></nText>
    <note>false</note>
    <example>person@place.com</example>
    <mand>true</mand>
</question>`,
  notMandatoryNoExample: ` <question qType="1400" qID="7257504" trueQ="1">
    <qText>not mandatory, no example</qText>
    <nText></nText>
    <note>false</note>
    <example></example>
    <mand>false</mand>
</question>`,
  notMandatoryExample: ` <question qType="1400" qID="7257504" trueQ="1">
    <qText>not mandatory, with example</qText>
    <nText></nText>
    <note>false</note>
    <example>person@place.com</example>
    <mand>false</mand>
</question>`
}

module.exports = _.mapValues(questionsXML, function (question) {
  return new xmlParser.XmlDocument(question);
});
