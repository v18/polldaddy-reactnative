import _ from 'lodash';
import xmlParser from 'xmldoc';

var questionsXML = {
  mandatorySingleLineSmall: `<question qType="100" qID="7250228" trueQ="1">
	<qText>mandatory, single line, small</qText>
	<nText></nText>
	<note>false</note>
	<size>0</size>
	<type>0</type>
	<mand>true</mand>
  </question>`,
  mandatorySingleLineMedium: `<question qType="100" qID="7250228" trueQ="1">
	<qText>mandatory, single line, medium</qText>
	<nText></nText>
	<note>false</note>
	<size>1</size>
	<type>0</type>
	<mand>true</mand>
  </question>`,
  mandatorySingleLineLarge: `<question qType="100" qID="7250228" trueQ="1">
	<qText>mandatory, single line, large</qText>
	<nText></nText>
	<note>false</note>
	<size>2</size>
	<type>0</type>
	<mand>true</mand>
  </question>`,
  notMandatorySingleLineSmall: `<question qType="100" qID="7250228" trueQ="1">
	<qText>not mandatory, single line, small</qText>
	<nText></nText>
	<note>false</note>
	<size>0</size>
	<type>0</type>
	<mand>false</mand>
  </question>`,
  notMandatorySingleLineMedium: `<question qType="100" qID="7250228" trueQ="1">
	<qText>not mandatory, single line, medium</qText>
	<nText></nText>
	<note>false</note>
	<size>1</size>
	<type>0</type>
	<mand>false</mand>
  </question>`,
  notMandatorySingleLineLarge: `<question qType="100" qID="7250228" trueQ="1">
	<qText>not mandatory, single line, large</qText>
	<nText></nText>
	<note>false</note>
	<size>2</size>
	<type>0</type>
	<mand>false</mand>
  </question>`,
  mandatoryMultiLineSmall: `<question qType="200" qID="7250228" trueQ="1">
	<qText>mandatory, multi line, small</qText>
	<nText></nText>
	<note>false</note>
	<size>0</size>
	<type>1</type>
	<mand>true</mand>
  </question>`,
  mandatoryMultiLineMedium: `<question qType="200" qID="7250228" trueQ="1">
	<qText>mandatory, multi line, medium</qText>
	<nText></nText>
	<note>false</note>
	<size>1</size>
	<type>1</type>
	<mand>true</mand>
  </question>`,
  mandatoryMultiLineLarge: `<question qType="200" qID="7250228" trueQ="1">
	<qText>mandatory, multi line, large</qText>
	<nText></nText>
	<note>false</note>
	<size>2</size>
	<type>1</type>
	<mand>true</mand>
  </question>`,
  notMandatoryMultiLineSmall: `<question qType="200" qID="7250228" trueQ="1">
	<qText>not mandatory, multi line, small</qText>
	<nText></nText>
	<note>false</note>
	<size>0</size>
	<type>1</type>
	<mand>false</mand>
  </question>`,
  notMandatoryMultiLineMedium: `<question qType="200" qID="7250228" trueQ="1">
	<qText>not mandatory, multi line, medium</qText>
	<nText></nText>
	<note>false</note>
	<size>1</size>
	<type>1</type>
	<mand>false</mand>
  </question>`,
  notMandatoryMultiLineLarge: `<question qType="200" qID="7250228" trueQ="1">
	<qText>not mandatory, multi line, large</qText>
	<nText></nText>
	<note>false</note>
	<size>2</size>
	<type>1</type>
	<mand>false</mand>
  </question>`,
  mandatoryPasswordSmall: `<question qType="100" qID="7250228" trueQ="1">
    <qText>mandatory, password, small</qText>
    <nText></nText>
    <note>false</note>
    <size>0</size>
    <type>2</type>
    <mand>true</mand>
  </question>`,
  mandatoryPasswordMedium: `<question qType="100" qID="7250228" trueQ="1">
    <qText>mandatory, password, medium</qText>
    <nText></nText>
    <note>false</note>
    <size>1</size>
    <type>2</type>
    <mand>true</mand>
  </question>`,
  mandatoryPasswordLarge: `<question qType="100" qID="7250228" trueQ="1">
    <qText>mandatory, password, large</qText>
    <nText></nText>
    <note>false</note>
    <size>1</size>
    <type>2</type>
    <mand>true</mand>
  </question>`,
  notMandatoryPasswordSmall: `<question qType="100" qID="7250228" trueQ="1">
    <qText>mandatory, password, small</qText>
    <nText></nText>
    <note>false</note>
    <size>0</size>
    <type>2</type>
    <mand>false</mand>
  </question>`,
  notMandatoryPasswordMedium: `<question qType="100" qID="7250228" trueQ="1">
    <qText>mandatory, password, medium</qText>
    <nText></nText>
    <note>false</note>
    <size>1</size>
    <type>2</type>
    <mand>false</mand>
  </question>`,
  notMandatoryPasswordLarge: `<question qType="100" qID="7250228" trueQ="1">
    <qText>mandatory, password, large</qText>
    <nText></nText>
    <note>false</note>
    <size>1</size>
    <type>2</type>
    <mand>false</mand>
  </question>`
}

module.exports = _.mapValues(questionsXML, function (question) {
  return new xmlParser.XmlDocument(question);
});
