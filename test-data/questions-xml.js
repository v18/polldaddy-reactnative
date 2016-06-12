import _ from 'lodash';
import xmlParser from 'xmldoc';

var questionsXML = {
  pageHeader:
    `<question qType="1900" qID="7111441" trueQ="0">
      <qText>Page Header</qText>
      <nText>[Page Header Question] Note</nText>
      <note>true</note>
    </question>`,
  freeText:
    `<question qType="200" qID="7111442" trueQ="1">
      <qText>Free text</qText>
      <nText>[Free Text Question] note</nText>
      <note>true</note>
      <size>0</size>
      <type>1</type>
      <mand>false</mand>
    </question>`,
  multipleChoice:
    `<question qType="400" qID="7111443" trueQ="1">
      <qText>Multiple Choice</qText>
      <nText />
      <note>false</note>
      <other>true</other>
      <rand>0</rand>
      <elmType>0</elmType>
      <options oType="list" oIDcounter="3">
         <option oID="15436302">1</option>
         <option oID="15436303">2</option>
         <option oID="15436306">3</option>
      </options>
      <comments enabled="true">Please help us understand why you selected this answer</comments>
      <answer>15436302</answer>
      <mand>false</mand>
    </question>`,
  matrix:
    `<question qType="1200" qID="7111445" trueQ="1">
      <qText>Matrix/Likert</qText>
      <nText />
      <note>false</note>
      <elmType>1</elmType>
      <orderType>0</orderType>
      <options oType="rows" oIDcounter="3">
        <option oID="3468980">Dogs</option>
        <option oID="3468981">Cats</option>
        <option oID="3468982">Rabbits</option>
      </options>
      <options oType="cols" oIDcounter="6">
        <option oID="3251573">5 - Like ALOT</option>
        <option oID="3251574">4 - Like a little</option>
        <option oID="3251575">3 - Meh</option>
        <option oID="3251576">2 - Don't Like!</option>
        <option oID="3251583">1 - HATE!</option>
        <option oID="3251584">0 - go to hell</option>
      </options>
      <mand>false</mand>
    </question>`,
  rank:
    `<question qType="1300" qID="7111447" trueQ="1">
      <qText>Rank</qText>
      <nText />
      <note>false</note>
      <other>false</other>
      <rand>0</rand>
      <elmType>0</elmType>
      <options oType="list" oIDcounter="3">
        <option oID="501199">Castles</option>
        <option oID="501200">Palaces</option>
        <option oID="501201">Fortresses</option>
      </options>
      <comments enabled="false">Please help us understand why you selected this answer</comments>
      <answer>501199</answer>
      <mand>false</mand>
    </question>`,
  name:
    `<question qType="800" qID="7111449" trueQ="1">
      <qText>Name</qText>
      <nText />
      <note>false</note>
      <type>0</type>
      <title>Title</title>
      <firstName>First Name</firstName>
      <lastName>Last Name</lastName>
      <suffix>Suffix</suffix>
      <mand>false</mand>
    </question>`,
    email:
    `<question qType="1400" qID="7111450" trueQ="1">
      <qText>Email address</qText>
      <nText />
      <note>false</note>
      <example />
      <mand>false</mand>
    </question>`,
  address:
    `<question qType="900" qID="7111453" trueQ="1">
      <qText>Address</qText>
      <nText />
      <note>false</note>
      <add1>Address Line 1</add1>
      <add2>Address Line 2</add2>
      <city>City</city>
      <state>State</state>
      <zip>Zip Code</zip>
      <country>Country</country>
      <showZip>false</showZip>
      <showCountry>false</showCountry>
      <showPlace>true</showPlace>
      <showState>true</showState>
      <showCity>true</showCity>
      <mand>false</mand>
    </question>`,
  phoneNumber:
    `<question qType="950" qID="7111454" trueQ="1">
      <qText>Phone number</qText>
      <nText />
      <note>false</note>
      <example />
      <default_country>US</default_country>
      <change_country>true</change_country>
      <mand>false</mand>
    </question>`,
  dateTime:
    `<question qType="1000" qID="7111455" trueQ="1">
      <qText>Date/Time</qText>
      <nText />
      <note>false</note>
      <type>2</type>
      <mm>MM</mm>
      <dd>DD</dd>
      <yyyy>YYYY</yyyy>
      <h>H</h>
      <m>Mins</m>
      <mand>false</mand>
    </question>`,
  numberQuestion:
    `<question qType="1100" qID="7111456" trueQ="1">
      <qText>Number Question</qText>
      <nText />
      <note>false</note>
      <decimal_places>0</decimal_places>
      <label_position>0</label_position>
      <min_value />
      <max_value />
      <default_value />
      <label>$</label>
      <slider>false</slider>
      <mand>false</mand>
    </question>`,
  url:
    `<question qType="1500" qID="7111457" trueQ="1">
      <qText>URL</qText>
      <nText />
      <note>false</note>
      <example />
      <mand>false</mand>
    </question>`,
  fileUpload:
    `<question qType="1600" qID="7111458" trueQ="1">
      <qText>File upload</qText>
      <nText />
      <note>false</note>
      <mand>false</mand>
    </question>`,
  htmlSnippet:
    `<question qType="2000" qID="7111459" trueQ="0">
      <qText>Please enter your question here.</qText>
      <nText />
      <note>false</note>
      <chunk>QB - &lt;p&gt;HTML Snippet&lt;/p&gt;</chunk>
    </question>`,
    withNote:
      `<question qType="1500" qID="7262591" trueQ="1">
        <qText>With note</qText>
        <nText>This is a note</nText>
        <note>true</note>
        <example />
        <mand>false</mand>
      </question>`,
    withoutNote:
      `<question qType="1500" qID="7262589" trueQ="1">
        <qText>No note</qText>
        <nText />
        <note>false</note>
        <example />
        <mand>false</mand>
      </question>`,
    mandatory:
      `<question qType="1500" qID="7262588" trueQ="1">
        <qText>Mandatory</qText>
        <nText />
        <note>false</note>
        <example />
        <mand>true</mand>
      </question>`,
    notMandatory:
      `<question qType="1500" qID="7262590" trueQ="1">
        <qText>Not Mandatory</qText>
        <nText />
        <note>false</note>
        <example />
        <mand>false</mand>
      </question>`
}

module.exports = _.mapValues(questionsXML, function (question) {
  return new xmlParser.XmlDocument(question);
});
