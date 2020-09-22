import React from 'react';
import { Text } from 'react-native';

type Props = { location: Location };

const CurrentLocation = ({ location }: Props) => {
  return (
    <>
      {location && (
        <Text style={{ textAlign: 'center', paddingBottom: 10 }}>
          Current Location: {location.longitude}, {location.latitude}
        </Text>
      )}
    </>
  );
};

export default CurrentLocation;
