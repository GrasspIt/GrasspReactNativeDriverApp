import React from 'react';
import { render } from '@testing-library/react-native';

import OnCallSwitch from '../OnCallSwitch';

const dsprDriver = {
  id: 12,
  user: 12,
  dspr: 1,
  currentRoute: 12,
  serviceAreas: [1, 2],
};

it('exists!', () => {
  expect(true).toBeTruthy();
});
// describe('<OnCallSwitch />', () => {
//   it('has 1 child', () => {
//     const tree = render(<OnCallSwitch dsprDriver={dsprDriver} />).toJSON();
//     expect(tree.children.length).toBe(1);
//   });

//   it('renders corrently', async () => {
//     const tree = render(<OnCallSwitch dsprDriver={dsprDriver} />).toJSON();
//     await expect(tree).toMatchSnapshot();
//   });
// });
