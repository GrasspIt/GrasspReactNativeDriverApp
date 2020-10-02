import { State } from '../store/reduxStoreState';

export const getDSPRDriverServiceAreaVerticesFromProps = (state: State) =>
  state.api.entities.dsprDriverServiceAreaVertices;

export const getDSPRDriverServiceAreaVerticesForDsprFromProps = (state: State, props) =>
  Object.values(state.api.entities.dsprDriverServiceAreaVertices).filter(
    (vertex) => vertex.dspr === parseInt(props.dsprId)
  );
