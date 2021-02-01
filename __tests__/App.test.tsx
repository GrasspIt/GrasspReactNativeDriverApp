import React from 'react';
import { render } from '@testing-library/react-native';

import App from '../App';

describe('<App />', () => {
  it('has 1 child', () => {
    const tree = render(<App />).toJSON();
    expect(tree.children.length).toBe(1);
  });

  it('renders correctly', async () => {
    const tree = render(<App />).toJSON();
    await expect(tree).toMatchSnapshot();
  });
});
