import * as React from 'react';

export const navigationRef: React.RefObject<any> = React.createRef();

export const navigate = (name, params) => {
  navigationRef.current?.navigate(name, params);
}