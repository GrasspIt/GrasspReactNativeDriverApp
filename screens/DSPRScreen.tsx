import React from 'react';
import { connect } from 'react-redux';
import { setDsprDriverId } from '../actions/driverActions';

import DSPRList from '../components/DSPRList';
import { DSPR, DsprDriver, DsprDriverLocation } from "../store/reduxStoreState";

type Props = {
  setDsprDriverId: (id: number) => any;
  dsprs: { [key: number]: DSPR };
  dsprDrivers: { [key: number]: DsprDriver };
};

/**Fetch information needed to render DSPRList, which displays dsprs a user is assigned as a driver for.
 * Define ability for user to select DSPR to drive for during a current shift
 * */
const DSPRScreen = ({ setDsprDriverId, dsprs, dsprDrivers }: Props) => {
  const dsprDataList:DSPR[] = Object.values(dsprs);
  const dsprDriverDataList: DsprDriver[] = dsprDrivers && Object.values(dsprDrivers);
  const dsprsUserDriversFor: number[] = dsprDriverDataList.map((dsprDriver) => dsprDriver.dspr)
  const dsprDataListFilteredForDrivers: DSPR[] = dsprDataList.filter(dspr =>dsprsUserDriversFor.includes(dspr.id));

  const handleSelectDspr = (dsprId: number) => {
    // find the dsprDriver that matches the dsprId
    const selectedDriver: any = dsprDriverDataList.find((driver: any) => driver.dspr === dsprId);
    setDsprDriverId(selectedDriver.id);
  };

  return <DSPRList handleSelectDspr={handleSelectDspr} dsprDataList={dsprDataListFilteredForDrivers} />;
};

const mapStateToProps = (state) => {
  const isLoading: boolean = state.api.isLoading;
  const dsprs: { [key: number]: DSPR } = state.api.entities.DSPRs;
  const dsprDrivers: { [key: number]: DsprDriver } = state.api.entities.dsprDrivers;
  return {
    isLoading,
    dsprs,
    dsprDrivers,
  };
};

const mapDispatchToProps = { setDsprDriverId };

export default connect(mapStateToProps, mapDispatchToProps)(DSPRScreen);
