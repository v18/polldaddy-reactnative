import _ from 'lodash';
import xmlParser from 'xmldoc';

var questionsXML = {
    withCountry: `<question qType="950" qID="7257820" trueQ="1">
      <qText></qText>
      <nText></nText>
      <note>false</note>
      <example>Placeholder</example>
      <default_country>JP</default_country>
      <change_country>true</change_country>
      <mand>false</mand>
    </question>`,
    withoutCountry: `<question qType="950" qID="7257820" trueQ="1">
      <qText></qText>
      <nText></nText>
      <note>false</note>
      <example></example>
      <default_country>JP</default_country>
      <change_country>false</change_country>
      <mand>false</mand>
    </question>`,
    mandatory: `<question qType="950" qID="7257820" trueQ="1">
      <qText></qText>
      <nText></nText>
      <note>false</note>
      <example></example>
      <default_country>JP</default_country>
      <change_country>false</change_country>
      <mand>true</mand>
    </question>`,
    notMandatory: `<question qType="950" qID="7257820" trueQ="1">
      <qText></qText>
      <nText></nText>
      <note>false</note>
      <example></example>
      <default_country>JP</default_country>
      <change_country>false</change_country>
      <mand>false</mand>
    </question>`
}

module.exports = _.mapValues(questionsXML, function (question) {
  return new xmlParser.XmlDocument(question);
});
