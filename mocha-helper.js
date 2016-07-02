// Compile node_modules, too
require('babel-core/register')({
  ignore: '/node_modules/(?!react-native-htmlview)'
});

// Prevent Mocha from compiling png images
function returnNull() {
  return null;
}

require.extensions['.png'] = returnNull;
