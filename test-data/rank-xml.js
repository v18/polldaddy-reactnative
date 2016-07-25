import _ from 'lodash';
import xmlParser from 'xmldoc';

var questionsXML = {
  'asEntered': `<question qType="1300" qID="7361189" trueQ="1">
    <qText>Standard, as entered</qText>
    <nText />
    <note>false</note>
    <other>false</other>
    <rand>0</rand>
    <elmType>0</elmType>
    <options oType="list" oIDcounter="3">
      <option oID="521154">Zebra</option>
      <option oID="521155">Dragon</option>
      <option oID="521156">Elephant</option>
    </options>
    <comments enabled="false">Please help us understand why you selected this answer</comments>
    <answer>521154</answer>
    <mand>false</mand>
  </question>`,
  'asEnteredMandatory': `<question qType="1300" qID="7361189" trueQ="1">
    <qText>Standard, as entered</qText>
    <nText />
    <note>false</note>
    <other>false</other>
    <rand>0</rand>
    <elmType>0</elmType>
    <options oType="list" oIDcounter="3">
      <option oID="521154">Zebra</option>
      <option oID="521155">Dragon</option>
      <option oID="521156">Elephant</option>
    </options>
    <comments enabled="false">Please help us understand why you selected this answer</comments>
    <answer>521154</answer>
    <mand>true</mand>
  </question>`,
  'az': `<question qType="1300" qID="7361192" trueQ="1">
    <qText>Standard, A-Z</qText>
    <nText />
    <note>false</note>
    <other>false</other>
    <rand>1</rand>
    <elmType>0</elmType>
    <options oType="list" oIDcounter="3">
      <option oID="521154">Zebra</option>
      <option oID="521155">Dragon</option>
      <option oID="521156">Elephant</option>
    </options>
    <comments enabled="false">Please help us understand why you selected this answer</comments>
    <answer>521154</answer>
    <mand>false</mand>
  </question>`,
  'za': `<question qType="1300" qID="7361194" trueQ="1">
    <qText>Standard, Z-A</qText>
    <nText />
    <note>false</note>
    <other>false</other>
    <rand>2</rand>
    <elmType>0</elmType>
    <options oType="list" oIDcounter="3">
      <option oID="521154">Zebra</option>
      <option oID="521155">Dragon</option>
      <option oID="521156">Elephant</option>
    </options>
    <comments enabled="false">Please help us understand why you selected this answer</comments>
    <answer>521154</answer>
    <mand>false</mand>
  </question>`,
  'random': `<question qType="1300" qID="7361195" trueQ="1">
    <qText>Standard, random</qText>
    <nText />
    <note>false</note>
    <other>false</other>
    <rand>3</rand>
    <elmType>0</elmType>
    <options oType="list" oIDcounter="3">
      <option oID="521154">Zebra</option>
      <option oID="521155">Dragon</option>
      <option oID="521156">Elephant</option>
    </options>
    <comments enabled="false">Please help us understand why you selected this answer</comments>
    <answer>521154</answer>
    <mand>false</mand>
  </question>`,
  'withLibraryMedia': `<question qType="1300" qID="7361197" trueQ="1">
    <qText>With library media</qText>
    <nText />
    <note>false</note>
    <other>false</other>
    <rand>0</rand>
    <elmType>0</elmType>
    <options oType="list" oIDcounter="3">
      <option oID="521154">Zebra, with library media</option>
      <option oID="521155">Dragon</option>
      <option oID="521156">Elephant</option>
    </options>
    <comments enabled="false">Please help us understand why you selected this answer</comments>
    <media>
      <mediaItem type="library" oID="521154">file:///data/user/0/com.polldaddy/files/surveyImages/2300490/56220b276b87fc4ec430256e633bfe28-577c2a6ee63db.png</mediaItem>
    </media>
    <answer>521154</answer>
    <mand>false</mand>
  </question>`,
  'withEmbedMedia': `<question qType="1300" qID="7361228" trueQ="1">
    <qText>With embed media</qText>
    <nText />
    <note>false</note>
    <other>false</other>
    <rand>0</rand>
    <elmType>0</elmType>
    <options oType="list" oIDcounter="3">
      <option oID="521154">Zebra</option>
      <option oID="521155">Dragon</option>
      <option oID="521156">Elephant with embed media<media type="embed">[youtube=http://www.youtube.com/watch?v=YpozspIMH9E]</media></option>
    </options>
    <comments enabled="false">Please help us understand why you selected this answer</comments>
    <answer>521154</answer>
    <mand>false</mand>
  </question>`
};

module.exports = _.mapValues(questionsXML, function (question) {
  return new xmlParser.XmlDocument(question);
});
