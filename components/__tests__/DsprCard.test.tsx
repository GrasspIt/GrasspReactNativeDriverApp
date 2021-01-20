import React from 'react';
import { render } from '@testing-library/react-native';

import DsprCard from '../DsprCard';

const dspr = {
  id: 12,
  name: 'name',
  deliveryServiceProvider: 12,
};

const handleSelect = jest.fn();

describe('<DsprCard />', () => {
  it('renders correctly', async () => {
    const tree = render(<DsprCard dspr={dspr} handleSelect={handleSelect} />).toJSON();
    await expect(tree).toMatchSnapshot();
  });
});
