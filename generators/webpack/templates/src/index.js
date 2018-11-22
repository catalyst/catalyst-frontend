<% if (options.react) { %>import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from 'app'

<% } %>import 'index.scss'<% if (options.react) { %>

const renderComponent = (Component) => {
  render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('app')
  )
}

renderComponent(App)

// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./app', () => {
    renderComponent(require('./app').default)
  })
}<% } %>
