import _ from 'lodash';
import xmlParser from 'xmldoc';

var questionsXML = {
  asEntered: `<question qType="400" qID="7343310" trueQ="1">
    <qText>As entered</qText>
    <nText />
    <note>false</note>
    <other>false</other>
    <rand>0</rand>
    <elmType>0</elmType>
    <options oType="list" oIDcounter="3">
      <option oID="15961155">zebra</option>
      <option oID="15961156">dragon</option>
      <option oID="15961157">elephant</option>
    </options>
    <comments enabled="false">Please help us understand why you selected this answer</comments>
    <answer>15961155</answer>
    <mand>false</mand>
  </question>`,
  AtoZ: `<question qType="400" qID="7343313" trueQ="1">
    <qText>A-Z</qText>
    <nText />
    <note>false</note>
    <other>false</other>
    <rand>1</rand>
    <elmType>0</elmType>
    <options oType="list" oIDcounter="3">
      <option oID="15961155">zebra</option>
      <option oID="15961156">dragon</option>
      <option oID="15961157">elephant</option>
    </options>
    <comments enabled="false">Please help us understand why you selected this answer</comments>
    <answer>15961166</answer>
    <mand>false</mand>
  </question>`,
  ZtoA: `<question qType="400" qID="7343316" trueQ="1">
    <qText>Z-A</qText>
    <nText />
    <note>false</note>
    <other>false</other>
    <rand>2</rand>
    <elmType>0</elmType>
    <options oType="list" oIDcounter="3">
      <option oID="15961155">zebra</option>
      <option oID="15961156">dragon</option>
      <option oID="15961157">elephant</option>
    </options>
    <comments enabled="false">Please help us understand why you selected this answer</comments>
    <answer>15961171</answer>
    <mand>false</mand>
  </question>`,
  random: `<question qType="400" qID="7343316" trueQ="1">
    <qText>Z-A</qText>
    <nText />
    <note>false</note>
    <other>false</other>
    <rand>3</rand>
    <elmType>0</elmType>
    <options oType="list" oIDcounter="3">
      <option oID="15961155">zebra</option>
      <option oID="15961156">dragon</option>
      <option oID="15961157">elephant</option>
    </options>
    <comments enabled="false">Please help us understand why you selected this answer</comments>
    <answer>15961171</answer>
    <mand>false</mand>
  </question>`,
  oneChoiceAllowedRadio: `<question qType="400" qID="7343318" trueQ="1">
    <qText>One choice allowed - radio</qText>
    <nText />
    <note>false</note>
    <other>false</other>
    <rand>2</rand>
    <elmType>0</elmType>
    <options oType="list" oIDcounter="3">
      <option oID="15961176">zebra</option>
      <option oID="15961177">dragon</option>
      <option oID="15961178">elephant</option>
    </options>
    <comments enabled="false">Please help us understand why you selected this answer</comments>
    <answer>15961176</answer>
    <mand>false</mand>
  </question>`,
  oneChoiceAllowedList: `<question qType="400" qID="7343320" trueQ="1">
    <qText>One choice allowed - list</qText>
    <nText />
    <note>false</note>
    <other>false</other>
    <rand>2</rand>
    <elmType>1</elmType>
    <options oType="list" oIDcounter="3">
      <option oID="15961179">zebra</option>
      <option oID="15961180">dragon</option>
      <option oID="15961181">elephant</option>
    </options>
    <comments enabled="false">Please help us understand why you selected this answer</comments>
    <answer>15961179</answer>
    <mand>false</mand>
  </question>`,
  threeChoicesAllowedCheck: `<question qType="400" qID="7343323" trueQ="1">
    <qText>3 choices allowed - check</qText>
    <nText />
    <note>false</note>
    <other>false</other>
    <rand>0</rand>
    <elmType>2</elmType>
    <options oType="list" oIDcounter="4">
      <option oID="15961184">1</option>
      <option oID="15961185">2</option>
      <option oID="15961186">3</option>
      <option oID="15961194">4</option>
    </options>
    <comments enabled="false">Please help us understand why you selected this answer</comments>
    <answer>15961184</answer>
    <limits min="3" max="3" />
    <mand>true</mand>
  </question>`,
  threeChoicesAllowedList: `<question qType="400" qID="7343325" trueQ="1">
    <qText>3 choices allowed - list</qText>
    <nText />
    <note>false</note>
    <other>false</other>
    <rand>0</rand>
    <elmType>3</elmType>
    <options oType="list" oIDcounter="4">
      <option oID="15961189">1</option>
      <option oID="15961190">2</option>
      <option oID="15961191">3</option>
      <option oID="15961195">4</option>
    </options>
    <comments enabled="false">Please help us understand why you selected this answer</comments>
    <answer>15961189</answer>
    <limits min="3" max="3" />
    <mand>true</mand>
  </question>`,
  twoToFourChoicesAllowed: `<question qType="400" qID="7343329" trueQ="1">
    <qText>2-4 choices allowed - list</qText>
    <nText />
    <note>false</note>
    <other>false</other>
    <rand>0</rand>
    <elmType>3</elmType>
    <options oType="list" oIDcounter="5">
      <option oID="15961196">1</option>
      <option oID="15961197">2</option>
      <option oID="15961198">3</option>
      <option oID="15961199">4</option>
      <option oID="15961200">5</option>
    </options>
    <comments enabled="false">Please help us understand why you selected this answer</comments>
    <answer>15961196</answer>
    <limits min="2" max="4" />
    <mand>true</mand>
  </question>`,
  withImages: `<question qType="400" qID="7343340" trueQ="1">
    <qText>with images</qText>
    <nText />
    <note>false</note>
    <other>false</other>
    <rand>0</rand>
    <elmType>0</elmType>
    <options oType="list" oIDcounter="3">
      <option oID="15961218">with image</option>
      <option oID="15961219">with image 2</option>
      <option oID="15961220">no image</option>
    </options>
    <comments enabled="false">Please help us understand why you selected this answer</comments>
    <media>
      <mediaItem type="library" oID="15961218">http://i1.wp.com/files.polldaddy.com/d3e86d5c1cb2a31aa01c83df946592ee-577c40e0e7ceb.jpg</mediaItem>
      <mediaItem type="library" oID="15961219">http://i1.wp.com/files.polldaddy.com/d505868e0c297cc78ed917af90d0c521-577c4118eaae0.jpg</mediaItem>
    </media>
    <answer>15961218</answer>
    <mand>true</mand>
  </question>`,
  withoutImages: `<question qType="400" qID="7343310" trueQ="1">
    <qText>As entered</qText>
    <nText />
    <note>false</note>
    <other>false</other>
    <rand>0</rand>
    <elmType>0</elmType>
    <options oType="list" oIDcounter="3">
      <option oID="15961155">zebra</option>
      <option oID="15961156">dragon</option>
      <option oID="15961157">elephant</option>
    </options>
    <comments enabled="false">Please help us understand why you selected this answer</comments>
    <answer>15961155</answer>
    <mand>false</mand>
  </question>`,
  withNonImageMedia: `<question qType="400" qID="7343336" trueQ="1">
    <qText>non image media</qText>
    <nText />
    <note>false</note>
    <other>false</other>
    <rand>0</rand>
    <elmType>0</elmType>
    <options oType="list" oIDcounter="2">
      <option oID="15961212">embedded media<media type="embed">[youtube=http://www.youtube.com/watch?v=YpozspIMH9E]</media></option>
      <option oID="15961213">no media</option>
    </options>
    <comments enabled="false">Please help us understand why you selected this answer</comments>
    <answer>15961212</answer>
    <mand>false</mand>
  </question>`,
  withComment: `<question qType="400" qID="7343341" trueQ="1">
    <qText>with comment</qText>
    <nText />
    <note>false</note>
    <other>false</other>
    <rand>0</rand>
    <elmType>0</elmType>
    <options oType="list" oIDcounter="2">
      <option oID="15961224">1</option>
      <option oID="15961225">2</option>
    </options>
    <comments enabled="true">Please enter a comment here</comments>
    <answer>15961224</answer>
    <mand>false</mand>
  </question>`,
  withoutComment: `<question qType="400" qID="7343310" trueQ="1">
    <qText>As entered</qText>
    <nText />
    <note>false</note>
    <other>false</other>
    <rand>0</rand>
    <elmType>0</elmType>
    <options oType="list" oIDcounter="3">
      <option oID="15961155">zebra</option>
      <option oID="15961156">dragon</option>
      <option oID="15961157">elephant</option>
    </options>
    <comments enabled="false">Please help us understand why you selected this answer</comments>
    <answer>15961155</answer>
    <mand>false</mand>
  </question>`,
  withCommentMand: `<question qType="400" qID="7343341" trueQ="1">
    <qText>with comment</qText>
    <nText />
    <note>false</note>
    <other>false</other>
    <rand>0</rand>
    <elmType>0</elmType>
    <options oType="list" oIDcounter="2">
      <option oID="15961224">1</option>
      <option oID="15961225">2</option>
    </options>
    <comments enabled="true">Please enter a comment here</comments>
    <answer>15961224</answer>
    <mand>true</mand>
  </question>`,
  withoutCommentMand: `<question qType="400" qID="7343310" trueQ="1">
    <qText>As entered</qText>
    <nText />
    <note>false</note>
    <other>false</other>
    <rand>0</rand>
    <elmType>0</elmType>
    <options oType="list" oIDcounter="3">
      <option oID="15961155">zebra</option>
      <option oID="15961156">dragon</option>
      <option oID="15961157">elephant</option>
    </options>
    <comments enabled="false">Please help us understand why you selected this answer</comments>
    <answer>15961155</answer>
    <mand>true</mand>
  </question>`,
  withOtherChoice: `<question qType="400" qID="7343342" trueQ="1">
    <qText>With 'other' option</qText>
    <nText />
    <note>false</note>
    <other>true</other>
    <rand>0</rand>
    <elmType>0</elmType>
    <options oType="list" oIDcounter="2">
      <option oID="15961226">1</option>
      <option oID="15961227">2</option>
    </options>
    <comments enabled="false">Please help us understand why you selected this answer</comments>
    <answer>15961226</answer>
    <mand>false</mand>
  </question>`,
  withOtherChoiceNotMand: `<question qType="400" qID="7343342" trueQ="1">
    <qText>With 'other' option</qText>
    <nText />
    <note>false</note>
    <other>true</other>
    <rand>0</rand>
    <elmType>0</elmType>
    <options oType="list" oIDcounter="2">
      <option oID="15961226">1</option>
      <option oID="15961227">2</option>
    </options>
    <comments enabled="false">Please help us understand why you selected this answer</comments>
    <answer>15961226</answer>
    <mand>false</mand>
  </question>`,
  withOtherChoiceMand: `<question qType="400" qID="7343342" trueQ="1">
    <qText>With 'other' option</qText>
    <nText />
    <note>false</note>
    <other>true</other>
    <rand>0</rand>
    <elmType>0</elmType>
    <options oType="list" oIDcounter="2">
      <option oID="15961226">1</option>
      <option oID="15961227">2</option>
    </options>
    <comments enabled="false">Please help us understand why you selected this answer</comments>
    <answer>15961226</answer>
    <mand>false</mand>
  </question>`,
  withoutOtherChoice: `<question qType="400" qID="7343310" trueQ="1">
    <qText>As entered</qText>
    <nText />
    <note>false</note>
    <other>false</other>
    <rand>0</rand>
    <elmType>0</elmType>
    <options oType="list" oIDcounter="3">
      <option oID="15961155">zebra</option>
      <option oID="15961156">dragon</option>
      <option oID="15961157">elephant</option>
    </options>
    <comments enabled="false">Please help us understand why you selected this answer</comments>
    <answer>15961155</answer>
    <mand>false</mand>
  </question>`,
  minSetToZero: `<question qType="400" qID="7343310" trueQ="1">
    <qText>Min set to 0</qText>
    <nText />
    <note>false</note>
    <other>false</other>
    <rand>0</rand>
    <elmType>2</elmType>
    <options oType="list" oIDcounter="4">
      <option oID="15961155">zebra</option>
      <option oID="15961156">dragon</option>
      <option oID="15961157">elephant</option>
      <option oID="15961253">unicorn</option>
    </options>
    <comments enabled="false">Please help us understand why you selected this answer</comments>
    <answer>15961155</answer>
    <limits min="0" max="3" />
    <mand>false</mand>
  </question>`,
  mandatory: `<question qType="400" qID="7343310" trueQ="1">
    <qText>As entered</qText>
    <nText />
    <note>false</note>
    <other>false</other>
    <rand>0</rand>
    <elmType>0</elmType>
    <options oType="list" oIDcounter="3">
      <option oID="15961155">zebra</option>
      <option oID="15961156">dragon</option>
      <option oID="15961157">elephant</option>
    </options>
    <comments enabled="false">Please help us understand why you selected this answer</comments>
    <answer>15961155</answer>
    <mand>true</mand>
  </question>`,
  notMandatory: `<question qType="400" qID="7343310" trueQ="1">
    <qText>As entered</qText>
    <nText />
    <note>false</note>
    <other>false</other>
    <rand>0</rand>
    <elmType>0</elmType>
    <options oType="list" oIDcounter="3">
      <option oID="15961155">zebra</option>
      <option oID="15961156">dragon</option>
      <option oID="15961157">elephant</option>
    </options>
    <comments enabled="false">Please help us understand why you selected this answer</comments>
    <answer>15961155</answer>
    <mand>false</mand>
  </question>`,
  fakeNotMandatoryMinNumber: `<question qType="400" qID="7343329" trueQ="1">
    <qText>2-4 choices allowed - list</qText>
    <nText />
    <note>false</note>
    <other>false</other>
    <rand>0</rand>
    <elmType>3</elmType>
    <options oType="list" oIDcounter="5">
      <option oID="15961196">1</option>
      <option oID="15961197">2</option>
      <option oID="15961198">3</option>
      <option oID="15961199">4</option>
      <option oID="15961200">5</option>
    </options>
    <comments enabled="false">Please help us understand why you selected this answer</comments>
    <answer>15961196</answer>
    <limits min="2" max="4" />
    <mand>false</mand>
  </question>`
}

module.exports = _.mapValues(questionsXML, function (question) {
  return new xmlParser.XmlDocument(question);
});
