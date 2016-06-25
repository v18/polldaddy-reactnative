import _ from 'lodash';
import xmlParser from 'xmldoc';

var questionsXML = {
  withLabel: `<question qType="1100" qID="7257860" trueQ="1">
    <qText>number question with label</qText>
    <nText></nText>
    <note>false</note>
    <decimal_places>0</decimal_places>
    <label_position>1</label_position>
    <min_value />
    <max_value />
    <default_value />
    <label>$</label>
    <slider>false</slider>
    <mand>true</mand>
  </question>`,
  decimalPlaces: `<question qType="1100" qID="7257860" trueQ="1">
    <qText>number question with decimal places</qText>
    <nText></nText>
    <note>false</note>
    <decimal_places>1</decimal_places>
    <label_position>1</label_position>
    <min_value />
    <max_value />
    <default_value />
    <label>$</label>
    <slider>false</slider>
    <mand>true</mand>
  </question>`,
  labelPositionNone: `<question qType="1100" qID="7257860" trueQ="1">
    <qText>number question with no label</qText>
    <nText></nText>
    <note>false</note>
    <decimal_places>1</decimal_places>
    <label_position>0</label_position>
    <min_value />
    <max_value />
    <default_value />
    <label>$</label>
    <slider>false</slider>
    <mand>true</mand>
  </question>`,
  labelPositionBefore: `<question qType="1100" qID="7257860" trueQ="1">
    <qText>number question with label before</qText>
    <nText></nText>
    <note>false</note>
    <decimal_places>1</decimal_places>
    <label_position>1</label_position>
    <min_value />
    <max_value />
    <default_value />
    <label>$</label>
    <slider>false</slider>
    <mand>true</mand>
  </question>`,
  labelPositionAfter: `<question qType="1100" qID="7257860" trueQ="1">
    <qText>number question with label after</qText>
    <nText></nText>
    <note>false</note>
    <decimal_places>1</decimal_places>
    <label_position>2</label_position>
    <min_value />
    <max_value />
    <default_value />
    <label>$</label>
    <slider>false</slider>
    <mand>true</mand>
  </question>`,
  sliderDefaultValueSet: `<question qType="1100" qID="7257860" trueQ="1">
    <qText>slider with label</qText>
    <nText></nText>
    <note>false</note>
    <decimal_places>1</decimal_places>
    <label_position>2</label_position>
    <min_value>1</min_value>
    <max_value>3</max_value>
    <default_value>2</default_value>
    <label>$</label>
    <slider>true</slider>
    <mand>true</mand>
  </question>`,
  sliderDefaultValueNotSet: `<question qType="1100" qID="7257860" trueQ="1">
    <qText>slider with label</qText>
    <nText></nText>
    <note>false</note>
    <decimal_places>1</decimal_places>
    <label_position>2</label_position>
    <min_value>10</min_value>
    <max_value>30</max_value>
    <default_value />
    <label>$</label>
    <slider>true</slider>
    <mand>true</mand>
  </question>`,
  sliderMinSet: `<question qType="1100" qID="7257860" trueQ="1">
    <qText>slider with min set</qText>
    <nText></nText>
    <note>false</note>
    <decimal_places>1</decimal_places>
    <label_position>2</label_position>
    <min_value>10</min_value>
    <max_value>30</max_value>
    <default_value />
    <label>$</label>
    <slider>true</slider>
    <mand>true</mand>
  </question>`,
  sliderMinNotSet: `<question qType="1100" qID="7257860" trueQ="1">
    <qText>slider with min not set</qText>
    <nText></nText>
    <note>false</note>
    <decimal_places>1</decimal_places>
    <label_position>2</label_position>
    <min_value />
    <max_value />
    <default_value />
    <label>$</label>
    <slider>true</slider>
    <mand>true</mand>
  </question>`,
  sliderMaxSet: `<question qType="1100" qID="7257860" trueQ="1">
    <qText>slider with max set</qText>
    <nText></nText>
    <note>false</note>
    <decimal_places>1</decimal_places>
    <label_position>2</label_position>
    <min_value>10</min_value>
    <max_value>30</max_value>
    <default_value />
    <label>$</label>
    <slider>true</slider>
    <mand>true</mand>
  </question>`,
  sliderMaxNotSet: `<question qType="1100" qID="7257860" trueQ="1">
    <qText>slider with max not set</qText>
    <nText></nText>
    <note>false</note>
    <decimal_places>1</decimal_places>
    <label_position>2</label_position>
    <min_value />
    <max_value />
    <default_value />
    <label>$</label>
    <slider>true</slider>
    <mand>true</mand>
  </question>`,
  inputDefaultValueSet: `<question qType="1100" qID="7257860" trueQ="1">
    <qText>input with default value set</qText>
    <nText></nText>
    <note>false</note>
    <decimal_places>1</decimal_places>
    <label_position>2</label_position>
    <min_value>1</min_value>
    <max_value>3</max_value>
    <default_value>2</default_value>
    <label>$</label>
    <slider>false</slider>
    <mand>true</mand>
  </question>`,
  inputDefaultValueNotSet: `<question qType="1100" qID="7257860" trueQ="1">
    <qText>input with default value not set</qText>
    <nText></nText>
    <note>false</note>
    <decimal_places>1</decimal_places>
    <label_position>2</label_position>
    <min_value>1</min_value>
    <max_value>3</max_value>
    <default_value />
    <label>$</label>
    <slider>false</slider>
    <mand>true</mand>
  </question>`,
  inputMinSet: `<question qType="1100" qID="7257860" trueQ="1">
    <qText>input with min value set</qText>
    <nText></nText>
    <note>false</note>
    <decimal_places>1</decimal_places>
    <label_position>2</label_position>
    <min_value>10</min_value>
    <max_value>30</max_value>
    <default_value />
    <label>$</label>
    <slider>false</slider>
    <mand>true</mand>
  </question>`,
  inputMinNotSet: `<question qType="1100" qID="7257860" trueQ="1">
    <qText>input with min value not set</qText>
    <nText></nText>
    <note>false</note>
    <decimal_places>1</decimal_places>
    <label_position>2</label_position>
    <min_value />
    <max_value />
    <default_value />
    <label>$</label>
    <slider>false</slider>
    <mand>true</mand>
  </question>`,
  inputMaxSet: `<question qType="1100" qID="7257860" trueQ="1">
    <qText>input with max value set</qText>
    <nText></nText>
    <note>false</note>
    <decimal_places>1</decimal_places>
    <label_position>2</label_position>
    <min_value>10</min_value>
    <max_value>30</max_value>
    <default_value />
    <label>$</label>
    <slider>false</slider>
    <mand>true</mand>
  </question>`,
  inputMaxNotSet: `<question qType="1100" qID="7257860" trueQ="1">
    <qText>input with max value not set</qText>
    <nText></nText>
    <note>false</note>
    <decimal_places>1</decimal_places>
    <label_position>2</label_position>
    <min_value />
    <max_value />
    <default_value />
    <label>$</label>
    <slider>false</slider>
    <mand>true</mand>
  </question>`
}

module.exports = _.mapValues(questionsXML, function (question) {
  return new xmlParser.XmlDocument(question);
});
