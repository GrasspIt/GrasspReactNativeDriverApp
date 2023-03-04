export const SET_DEMO_MODE = 'SET_DEMO_MODE';

const demoModeSetter = (value) => {
    return {type: SET_DEMO_MODE, value}
};

export const setDemoMode = (value: boolean) => (dispatch) => {
  return dispatch(demoModeSetter(value));
};