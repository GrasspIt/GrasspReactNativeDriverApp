import { createSelector } from 'reselect';
import { State } from '../store/reduxStoreState';
import { getDSPRDriverServiceAreaVerticesForDsprFromProps } from './dsprDriverServiceAreaVertexSelectors';

export const getDSPRDriverServiceAreasFromProps = (state: State) =>
  state.api.entities.dsprDriverServiceAreas;

export const getDSPRDriverServiceAreasForDSPRFromProps = (state: State, props) =>
  Object.values(state.api.entities.dsprDriverServiceAreas).filter(
    (area) => area.dspr === parseInt(props.dsprId)
  );

export const getDSPRServiceAreasForDSPRWithVertices = createSelector(
  [getDSPRDriverServiceAreasForDSPRFromProps, getDSPRDriverServiceAreaVerticesForDsprFromProps],
  (dsprDriverServiceAreas, dsprDriverServiceAreaVertices) =>
    dsprDriverServiceAreas
      ? dsprDriverServiceAreaVertices
        ? dsprDriverServiceAreas.map((dsprDriverServiceArea) => ({
            ...dsprDriverServiceArea,
            dsprDriverServiceAreaVertices: dsprDriverServiceAreaVertices.filter(
              (vertex) =>
                vertex.dsprDriverServiceArea === dsprDriverServiceArea.id &&
                dsprDriverServiceArea.dsprDriverServiceAreaVertices.includes(vertex.id)
            ),
          }))
        : undefined
      : undefined
);

export const getActiveDSPRServiceAreasForDSPRWithVertices = createSelector(
  [getDSPRDriverServiceAreasForDSPRFromProps, getDSPRDriverServiceAreaVerticesForDsprFromProps],
  (dsprDriverServiceAreas, dsprDriverServiceAreaVertices) =>
    dsprDriverServiceAreas
      ? dsprDriverServiceAreaVertices
        ? dsprDriverServiceAreas
            .filter((dsprDriverServiceArea) => dsprDriverServiceArea.active)
            .map((dsprDriverServiceArea) => ({
              ...dsprDriverServiceArea,
              dsprDriverServiceAreaVertices: dsprDriverServiceAreaVertices.filter(
                (vertex) =>
                  vertex.dsprDriverServiceArea === dsprDriverServiceArea.id &&
                  dsprDriverServiceArea.dsprDriverServiceAreaVertices.includes(vertex.id)
              ),
            }))
        : undefined
      : undefined
);
