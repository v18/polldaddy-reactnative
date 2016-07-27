import _ from 'lodash';
import xmlParser from 'xmldoc';

var questionsXML = {
  standard: `<question qType="1200" qID="7257336" trueQ="1">
    <qText>What is this thing anyway?</qText>
    <nText></nText>
    <note>false</note>
    <elmType>0</elmType>
    <orderType>0</orderType>
    <options oType="rows" oIDcounter="3">
        <option oID="3555584">What?</option>
        <option oID="3555585">Something?</option>
    </options>
    <options oType="cols" oIDcounter="3">
        <option oID="3324137">This</option>
        <option oID="3324138">That</option>
        <option oID="3324139">Another</option>
    </options>
    <mand>false</mand>
  </question>`,
  elmType0: `<question qType="1200" qID="7257336" trueQ="1">
    <qText>What is this thing anyway?</qText>
    <nText></nText>
    <note>false</note>
    <elmType>0</elmType>
    <orderType>3</orderType>
    <options oType="rows" oIDcounter="3">
        <option oID="3555584">What?</option>
        <option oID="3555585">Something?</option>
        <option oID="3555586">Huh?</option>
    </options>
    <options oType="cols" oIDcounter="3">
        <option oID="3324137">This</option>
        <option oID="3324138">That</option>
        <option oID="3324139">Another</option>
    </options>
    <mand>false</mand>
  </question>`,
  elmType1: `<question qType="1200" qID="7257336" trueQ="1">
    <qText>What is this thing anyway?</qText>
    <nText></nText>
    <note>false</note>
    <elmType>1</elmType>
    <orderType>3</orderType>
    <options oType="rows" oIDcounter="3">
        <option oID="3555584">What?</option>
        <option oID="3555585">Something?</option>
        <option oID="3555586">Huh?</option>
    </options>
    <options oType="cols" oIDcounter="3">
        <option oID="3324137">This</option>
        <option oID="3324138">That</option>
        <option oID="3324139">Another</option>
    </options>
    <mand>false</mand>
  </question>`,
  elmType2: `<question qType="1200" qID="7257336" trueQ="1">
    <qText>What is this thing anyway?</qText>
    <nText></nText>
    <note>false</note>
    <elmType>2</elmType>
    <orderType>3</orderType>
    <options oType="rows" oIDcounter="3">
        <option oID="3555584">What?</option>
        <option oID="3555585">Something?</option>
        <option oID="3555586">Huh?</option>
    </options>
    <options oType="cols" oIDcounter="3">
        <option oID="3324137">This</option>
        <option oID="3324138">That</option>
        <option oID="3324139">Another</option>
    </options>
    <mand>false</mand>
  </question>`,
  randomRows: `<question qType="1200" qID="7257336" trueQ="1">
    <qText>What is this thing anyway?</qText>
    <nText></nText>
    <note>false</note>
    <elmType>2</elmType>
    <orderType>2</orderType>
    <options oType="rows" oIDcounter="3">
        <option oID="3555584">What?</option>
        <option oID="3555585">Something?</option>
    </options>
    <options oType="cols" oIDcounter="3">
        <option oID="3324137">This</option>
        <option oID="3324138">That</option>
        <option oID="3324139">Another</option>
    </options>
    <mand>false</mand>
  </question>`,
  randomColumns: `<question qType="1200" qID="7257336" trueQ="1">
    <qText>What is this thing anyway?</qText>
    <nText></nText>
    <note>false</note>
    <elmType>2</elmType>
    <orderType>1</orderType>
    <options oType="rows" oIDcounter="3">
        <option oID="3555584">What?</option>
        <option oID="3555585">Something?</option>
    </options>
    <options oType="cols" oIDcounter="3">
        <option oID="3324137">This</option>
        <option oID="3324138">That</option>
        <option oID="3324139">Another</option>
    </options>
    <mand>false</mand>
  </question>`,
  bothRandom: `<question qType="1200" qID="7257336" trueQ="1">
    <qText>What is this thing anyway?</qText>
    <nText></nText>
    <note>false</note>
    <elmType>2</elmType>
    <orderType>3</orderType>
    <options oType="rows" oIDcounter="3">
        <option oID="3555584">What?</option>
        <option oID="3555585">Something?</option>
    </options>
    <options oType="cols" oIDcounter="3">
        <option oID="3324137">This</option>
        <option oID="3324138">That</option>
        <option oID="3324139">Another</option>
    </options>
    <mand>false</mand>
  </question>`
};

module.exports = _.mapValues(questionsXML, function (question) {
  return new xmlParser.XmlDocument(question);
});
