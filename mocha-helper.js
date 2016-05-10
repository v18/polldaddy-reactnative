// Prevent Mocha from compiling png images
function returnNull() {
  return null;
}

require.extensions['.png'] = returnNull;
