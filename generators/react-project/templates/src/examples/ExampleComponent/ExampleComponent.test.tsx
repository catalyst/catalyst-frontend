import React from 'react';
import { render, screen } from '@testing-library/react';

import ExampleComponent from './ExampleComponent';

describe('ExampleComponent test suite', () => {
  test('It renders correctly', () => {
    render(<ExampleComponent />);

    expect(screen.getByText('Welcome to Catalyst React+Typescript starter')).toBeTruthy();
  });
});
