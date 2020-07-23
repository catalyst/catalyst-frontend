<% if (options.react) { %>import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader'; // eslint-disable-line import/no-extraneous-dependencies
import App from 'app';

<% } %>import 'index.scss';<% if (options.react) { %>

const renderComponent = (Component) => {
  render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('app')
  );
};

renderComponent(App);

// Webpack Hot Module Replacement API
if (module.hot) { // only ever in dev
  module.hot.accept('./app', () => {
    // global-require
    renderComponent(require('./app').default); // eslint-disable-line
  });
}<% } %>
