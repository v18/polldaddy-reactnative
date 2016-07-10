import _ from 'lodash';
import xmlParser from 'xmldoc';

var questionsXML = {
  mandatoryDateAndTimeAsked: `<question qType="1000" qID="7257836" trueQ="1">
    <qText></qText>
    <nText></nText>
    <note>false</note>
    <type>0</type>
    <mm>MM</mm>
    <dd>DD</dd>
    <yyyy>YYYY</yyyy>
    <h>H</h>
    <m>Mins</m>
    <mand>true</mand>
  </question>`,
  mandatoryOnlyTimeAsked: `<question qType="1000" qID="7257836" trueQ="1">
    <qText></qText>
    <nText></nText>
    <note>false</note>
    <type>4</type>
    <mm>MM</mm>
    <dd>DD</dd>
    <yyyy>YYYY</yyyy>
    <h>H</h>
    <m>Mins</m>
    <mand>true</mand>
  </question>`,
  mandatoryOnlyDateAsked: `<question qType="1000" qID="7257836" trueQ="1">
    <qText></qText>
    <nText></nText>
    <note>false</note>
    <type>2</type>
    <mm>MM</mm>
    <dd>DD</dd>
    <yyyy>YYYY</yyyy>
    <h>H</h>
    <m>Mins</m>
    <mand>true</mand>
  </question>`,
  notMandatoryDateAndTimeAsked: `<question qType="1000" qID="7257836" trueQ="1">
    <qText></qText>
    <nText></nText>
    <note>false</note>
    <type>1</type>
    <mm>MM</mm>
    <dd>DD</dd>
    <yyyy>YYYY</yyyy>
    <h>H</h>
    <m>Mins</m>
    <mand>false</mand>
  </question>`,
  notMandatoryOnlyTimeAsked: `<question qType="1000" qID="7257836" trueQ="1">
    <qText></qText>
    <nText></nText>
    <note>false</note>
    <type>4</type>
    <mm>MM</mm>
    <dd>DD</dd>
    <yyyy>YYYY</yyyy>
    <h>H</h>
    <m>Mins</m>
    <mand>false</mand>
  </question>`,
  notMandatoryOnlyDateAsked: `<question qType="1000" qID="7257836" trueQ="1">
    <qText></qText>
    <nText></nText>
    <note>false</note>
    <type>3</type>
    <mm>MM</mm>
    <dd>DD</dd>
    <yyyy>YYYY</yyyy>
    <h>H</h>
    <m>Mins</m>
    <mand>false</mand>
  </question>`,
  type0: `<question qType="1000" qID="7257836" trueQ="1">
    <qText></qText>
    <nText></nText>
    <note>false</note>
    <type>0</type>
    <mm>MM</mm>
    <dd>DD</dd>
    <yyyy>YYYY</yyyy>
    <h>H</h>
    <m>Mins</m>
    <mand>false</mand>
  </question>`,
  type1: `<question qType="1000" qID="7257836" trueQ="1">
    <qText></qText>
    <nText></nText>
    <note>false</note>
    <type>1</type>
    <mm>MM</mm>
    <dd>DD</dd>
    <yyyy>YYYY</yyyy>
    <h>H</h>
    <m>Mins</m>
    <mand>false</mand>
  </question>`,
  type2: `<question qType="1000" qID="7257836" trueQ="1">
    <qText></qText>
    <nText></nText>
    <note>false</note>
    <type>2</type>
    <mm>MM</mm>
    <dd>DD</dd>
    <yyyy>YYYY</yyyy>
    <h>H</h>
    <m>Mins</m>
    <mand>false</mand>
  </question>`,
  type3: `<question qType="1000" qID="7257836" trueQ="1">
    <qText></qText>
    <nText></nText>
    <note>false</note>
    <type>3</type>
    <mm>MM</mm>
    <dd>DD</dd>
    <yyyy>YYYY</yyyy>
    <h>H</h>
    <m>Mins</m>
    <mand>false</mand>
  </question>`,
  type4: `<question qType="1000" qID="7257836" trueQ="1">
    <qText></qText>
    <nText></nText>
    <note>false</note>
    <type>4</type>
    <mm>MM</mm>
    <dd>DD</dd>
    <yyyy>YYYY</yyyy>
    <h>H</h>
    <m>Mins</m>
    <mand>false</mand>
  </question>`
}

  module.exports = _.mapValues(questionsXML, function (question) {
    return new xmlParser.XmlDocument(question);
  });
