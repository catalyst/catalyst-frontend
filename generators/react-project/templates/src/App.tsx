import React from 'react';
import ExampleComponent from 'examples/ExampleComponent/ExampleComponent';

// if you are integrating redux this is a good place to wrap your app in <Provider store={store}>
// if you are using react-router this is a good place to set up your router

function App() {
  return (
    <div>
      <ExampleComponent />
    </div>
  );
}

export default App;
