import React from 'react';
import { render } from '@testing-library/react-native';

import DashboardDisplay from '../../components/DashboardDisplay';

const dspr = 12;
const dsprDriver = {
  id: 12,
  user: 12,
  dspr: 12,
  currentRoute: 12,
  serviceAreas: [1, 2],
};
const isLoading = false;
const getDriverData = jest.fn();
const setDriverOnCallState = jest.fn();

describe('<DashboardDisplay />', () => {
  it('renders correctly', async () => {
    const tree = render(
      <DashboardDisplay
        dspr={dspr}
        dsprDriver={dsprDriver}
        isLoading={isLoading}
        getDriverData={getDriverData}
        setDriverOnCallState={setDriverOnCallState}
      />
    ).toJSON();
    await expect(tree).toMatchSnapshot();
  });
});
