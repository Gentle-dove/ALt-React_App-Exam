import React from 'react';

function CrashTest() {
  throw new Error('This is a test error!');
}

export default CrashTest;