import React from 'react';

import './ExampleComponent.scss';

const ExampleComponent: React.FC = () => (
  <div className="example-component">
    <h1>Welcome to Catalyst React+Typescript starter</h1>

    <div>
      We are using:
      <ul>
        <li>
          <strong>React</strong> for building beautiful user interfaces
        </li>
        <li>
          <strong>Sass</strong> for styling it
        </li>
        <li>
          <strong>Typescript</strong> for typechecking
        </li>
        <li>
          <strong>Testing Library</strong> for Unit Testing
        </li>
        <li>
          <strong>ESLint and Stylelint</strong> for static code analysis
        </li>
        <li>
          <strong>Prettier</strong> for code formatting
        </li>
        <li>
          <strong>Webpack</strong> for bundling modules
        </li>
      </ul>
    </div>
    <p>
      If you want to improve it, please submit a pull request to{' '}
      <a href="https://github.com/catalyst/catalyst-frontend">
        https://github.com/catalyst/catalyst-frontend
      </a>
    </p>
  </div>
);

export default ExampleComponent;
