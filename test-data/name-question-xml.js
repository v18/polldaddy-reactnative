import _ from 'lodash';
import xmlParser from 'xmldoc';

var questionsXML = {
  mandatoryFullName: `<question qType="800" qID="7257406" trueQ="1">
    <qText>mandatory, full name (first option), no placeholders</qText>
    <nText></nText>
    <note>false</note>
    <type>0</type>
    <title>Title</title>
    <firstName>First Name</firstName>
    <lastName>Last Name</lastName>
    <suffix>Suffix</suffix>
    <mand>true</mand>
  </question>`,
  mandatoryTitleFirstAndLast: `<question qType="800" qID="7257406" trueQ="1">
    <qText>mandatory, title first and last name (second option), no placeholders</qText>
    <nText></nText>
    <note>false</note>
    <type>1</type>
    <title>Title</title>
    <firstName>First Name</firstName>
    <lastName>Last Name</lastName>
    <suffix>Suffix</suffix>
    <mand>true</mand>
  </question>`,
  mandatoryFirstAndLast: `<question qType="800" qID="7257406" trueQ="1">
    <qText>mandatory, first and last name (third option), no placeholders</qText>
    <nText></nText>
    <note>false</note>
    <type>2</type>
    <title>Title</title>
    <firstName>First Name</firstName>
    <lastName>Last Name</lastName>
    <suffix>Suffix</suffix>
    <mand>true</mand>
  </question>`,
  notMandatoryFullName: `<question qType="800" qID="7257406" trueQ="1">
    <qText>not mandatory, full name (first option), no placeholders</qText>
    <nText></nText>
    <note>false</note>
    <type>0</type>
    <title>Title</title>
    <firstName>First Name</firstName>
    <lastName>Last Name</lastName>
    <suffix>Suffix</suffix>
    <mand>false</mand>
  </question>`,
  notMandatoryTitleFirstAndLast: `<question qType="800" qID="7257406" trueQ="1">
    <qText>not mandatory, title first and last name (second option), no placeholders</qText>
    <nText></nText>
    <note>false</note>
    <type>1</type>
    <title>Title</title>
    <firstName>First Name</firstName>
    <lastName>Last Name</lastName>
    <suffix>Suffix</suffix>
    <mand>false</mand>
  </question>`,
  notMandatoryFirstAndLast: `<question qType="800" qID="7257406" trueQ="1">
    <qText>not mandatory, first and last name (third option), no placeholders</qText>
    <nText></nText>
    <note>false</note>
    <type>2</type>
    <title>Title</title>
    <firstName>First Name</firstName>
    <lastName>Last Name</lastName>
    <suffix>Suffix</suffix>
    <mand>false</mand>
  </question>`
}

module.exports = _.mapValues(questionsXML, function (question) {
  return new xmlParser.XmlDocument(question);
});
