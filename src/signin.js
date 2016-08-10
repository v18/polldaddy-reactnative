import {
  Alert,
  AsyncStorage,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';
import Api from './utils/api';
import React from 'react';

module.exports = React.createClass({
  getInitialState: function() {
    return {
      email: '',
      password: ''
    };
  },
  render: function() {
    return (<View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
            resizeMode='contain'
            source={require('./img/logo/polldaddy-logo.png')}
            style={styles.logo}
        />
      </View>
      <View>
        <View style={styles.formElement}>
          <Text style={styles.label}>Email</Text>
          <TextInput
              onChangeText={this.handleEmailChange}
              placeholder='email'
              style={styles.textInput}
              underlineColorAndroid='#FFF'
              value={this.state.email}
          />
        </View>
        <View style={styles.formElement}>
          <Text style={styles.label}>Password</Text>
          <TextInput
              onChangeText={this.handlePasswordChange}
              placeholder='password'
              secureTextEntry={true}
              style={styles.textInput}
              underlineColorAndroid='#FFF'
              value={this.state.password}
          />
        </View>
        <View style={styles.signinContainer}>
          <TouchableHighlight
              onPress={this.handlePressSignin}
              style={styles.signinButton}
              underlayColor='#A2201E'
          >
            <Text style={styles.signinText}>Sign in</Text>
          </TouchableHighlight>
        </View>
      </View>
    </View>);
  },
  handleEmailChange: function(text) {
    this.setState({
      email: text
    });
  },
  handlePasswordChange: function(text) {
    this.setState({
      password: text
    });
  },
  handlePressSignin: function() {
    Api.signin(this.state.email, this.state.password, fetch)
      .then(function(response) {
        return Promise.all([
          AsyncStorage.setItem('userId', response.userId.toString()),
          AsyncStorage.setItem('userCode', response.userCode)
        ]);
      })
      .then(function() {
        this.props.navigator.immediatelyResetRouteStack([{
          name: 'savedSurveysList'
        }]);
      }.bind(this))
      .catch(function(error) {
        var alertMessage = 'There was a problem connecting to Polldaddy.com.';
        if(error.message === 'Could not log in') {
          alertMessage = 'That was not the right username or password. Try again.';
        }
        Alert.alert('Error', alertMessage, [{text: 'OK'}]);
      })
      .done();
  }
});

var window = Dimensions.get('window');
var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B72422'
  },
  logoContainer: {
    alignItems: 'center',
    margin: 10,
    marginTop: 30,
    flexDirection: 'column'
  },
  formElement: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderBottomColor: '#B72422',
    borderBottomWidth: 1
  },
  label: {
    flex: 1,
    color: '#B72422',
    marginLeft: 10,
    marginRight: 10,
    fontWeight: 'bold'
  },
  textInput: {
    flex: 4,
    marginRight: 10
  },
  signinContainer: {
    alignItems: 'flex-end',
    marginTop: 4,
    marginRight: 4
  },
  signinButton: {
    minHeight: 36,
    borderRadius: 2
  },
  signinText: {
    color: '#FFF',
    fontWeight: 'bold',
    padding: 12,
    textAlignVertical: 'center',
    textAlign: 'center'
  },
  logo: {
    maxWidth: window.width - 20
  }
});
