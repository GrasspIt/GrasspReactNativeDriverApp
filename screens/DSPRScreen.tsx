import React from 'react';
import { connect } from 'react-redux';
import { setDsprDriverId } from '../actions/driverActions';

import DSPRList from '../components/DSPRList';

type Props = { setDsprDriverId; dsprs; dsprDrivers };

const DSPRScreen = ({ setDsprDriverId, dsprs, dsprDrivers }: Props) => {
  const dsprDataList = Object.values(dsprs);
  const dsprDriverDataList = dsprDrivers && Object.values(dsprDrivers);

  const handleSelectDspr = (dsprId: number) => {
    // find the dsprDriver that matches the dsprId
    const selectedDriver: any = dsprDriverDataList.find((driver: any) => driver.dspr === dsprId);
    setDsprDriverId(selectedDriver.id);
  };

  return <DSPRList handleSelectDspr={handleSelectDspr} dsprDataList={dsprDataList} />;
};

const mapStateToProps = (state) => {
  const isLoading = state.api.isLoading;
  const dsprs = state.api.entities.DSPRs;
  const dsprDrivers = state.api.entities.dsprDrivers;
  return {
    isLoading,
    dsprs,
    dsprDrivers,
  };
};

const mapDispatchToProps = { setDsprDriverId };

export default connect(mapStateToProps, mapDispatchToProps)(DSPRScreen);
