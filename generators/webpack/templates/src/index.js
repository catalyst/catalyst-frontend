<% if (options.react) { %>import React from 'react';
import { render } from 'react-dom';
import App from 'app';

<% } %>import 'index.scss';<% if (options.react) { %>

render(<App />, document.getElementById('app'));<% } %>
