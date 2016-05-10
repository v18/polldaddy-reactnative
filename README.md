WIP. Create an Android app for Polldaddy using React Native.

# Install

1. Follow the [React Native installation instructions](https://facebook.github.io/react-native/docs/getting-started.html) to get
  - git
  - node
  - npm
  - react native command line tools
  - android studio and `adb`
  - `ANDROID_HOME` environment variable
2. Clone this repo using the link above, for example

  `git clone git@github.com:v18/polldaddy-reactnative.git`

3. Enter the directory and install using

  `cd polldaddy-reactnative`

  `npm install`


# Run on Genymotion
Make sure you've got [Genymotion](https://www.genymotion.com/) installed and at least one virtual device added

1. Start a Genymotion device
2. Start the JS server using

  `npm start`

3. In a  new terminal window, start the app on the Android emulator

  `react-native run-android`

You can also just run `react-native run-android` and it will start the JS server for you.
