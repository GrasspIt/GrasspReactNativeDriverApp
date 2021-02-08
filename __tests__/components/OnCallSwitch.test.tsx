import React from 'react';
import { render } from '@testing-library/react-native';
import OnCallSwitch from '../../components/OnCallSwitch';

const dsprDriver = {
  id: 12,
  user: 12,
  dspr: 1,
  currentRoute: 12,
  serviceAreas: [1, 2],
};

const setDriverOnCallState = jest.fn();

describe('<OnCallSwitch />', () => {
  it('renders correctly', async () => {
    const tree = render(
      <OnCallSwitch dsprDriver={dsprDriver} setDriverOnCallState={setDriverOnCallState} />
    ).toJSON();
    await expect(tree).toMatchSnapshot();
  });
});
