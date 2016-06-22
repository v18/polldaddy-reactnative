import _ from 'lodash';
import xmlParser from 'xmldoc';

var questionsXML = {
  mandatoryAll: `<question qType="900" qID="7267525" trueQ="1">
    <qText>mandatory, all</qText>
    <nText />
    <note>false</note>
    <add1>Address Line 1</add1>
    <add2>Address Line 2</add2>
    <city>City</city>
    <state>State</state>
    <zip>Zip Code</zip>
    <country>Country</country>
    <showZip>true</showZip>
    <showCountry>true</showCountry>
    <showPlace>true</showPlace>
    <showState>true</showState>
    <showCity>true</showCity>
    <mand>true</mand>
  </question>`,
  mandatoryTwoNonPlace: `<question qType="900" qID="7267529" trueQ="1">
    <qText>mandatory, two non place</qText>
    <nText />
    <note>false</note>
    <add1>Address Line 1</add1>
    <add2>Address Line 2</add2>
    <city>City</city>
    <state>State</state>
    <zip>Zip Code</zip>
    <country>Country</country>
    <showZip>false</showZip>
    <showCountry>true</showCountry>
    <showPlace>false</showPlace>
    <showState>false</showState>
    <showCity>true</showCity>
    <mand>true</mand>
  </question>`,
  mandatoryPlace: `<question qType="900" qID="7267532" trueQ="1">
    <qText>mandatory, one, place</qText>
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
    <showState>false</showState>
    <showCity>false</showCity>
    <mand>true</mand>
  </question>`,
  mandatoryState: `<question qType="900" qID="7267534" trueQ="1">
    <qText>mandatory, one, state</qText>
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
    <showPlace>false</showPlace>
    <showState>true</showState>
    <showCity>false</showCity>
    <mand>true</mand>
  </question>`,
  notMandatoryAll: `<question qType="900" qID="7267526" trueQ="1">
    <qText>not mandatory, all</qText>
    <nText />
    <note>false</note>
    <add1>Address Line 1</add1>
    <add2>Address Line 2</add2>
    <city>City</city>
    <state>State</state>
    <zip>Zip Code</zip>
    <country>Country</country>
    <showZip>true</showZip>
    <showCountry>true</showCountry>
    <showPlace>true</showPlace>
    <showState>true</showState>
    <showCity>true</showCity>
    <mand>false</mand>
  </question>`,
  notMandatoryTwoNonPlace: `<question qType="900" qID="7267531" trueQ="1">
    <qText>not mandatory, two non place</qText>
    <nText />
    <note>false</note>
    <add1>Address Line 1</add1>
    <add2>Address Line 2</add2>
    <city>City</city>
    <state>State</state>
    <zip>Zip Code</zip>
    <country>Country</country>
    <showZip>false</showZip>
    <showCountry>true</showCountry>
    <showPlace>false</showPlace>
    <showState>false</showState>
    <showCity>true</showCity>
    <mand>false</mand>
  </question>`,
  notMandatoryPlace: `<question qType="900" qID="7267533" trueQ="1">
    <qText>not mandatory, one, place</qText>
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
    <showState>false</showState>
    <showCity>false</showCity>
    <mand>false</mand>
  </question>`,
  notMandatoryState: `<question qType="900" qID="7267533" trueQ="1">
    <qText>not mandatory, one, place</qText>
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
    <showPlace>false</showPlace>
    <showState>true</showState>
    <showCity>false</showCity>
    <mand>false</mand>
  </question>`
}

module.exports = _.mapValues(questionsXML, function (question) {
  return new xmlParser.XmlDocument(question);
});
