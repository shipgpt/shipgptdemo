const SET_LOADER = "SET_LOADER";
const HIDE_LOADER = "HIDE_LOADER";
const REMOVE_All_LOADERS = "REMOVE_All_LOADERS";
const SET_PERCENTAGE = "SET_PERCENTAGE";

export function setLoader(ploader) {
  return { type: SET_LOADER, payload: ploader };
}

export function hideLoader(ploader) {
  return { type: HIDE_LOADER, payload: ploader };
}

export function removeAllLoaders() {
  return { type: REMOVE_All_LOADERS };
}

export function setPercentage(loaderName, percentage) {
  return { type: SET_PERCENTAGE, payload: { loaderName, percentage } };
}

const initState = null;

export default function loader(state = initState, action) {
  if (action.payload === null) return state;

  if (action.type === SET_LOADER) {
    return { ...state, [action.payload]: { percentage: 0, loading: true } };
  } else if (action.type === HIDE_LOADER) {
    if (state?.[action.payload]) {
      const { [action.payload]: tmp, ...rest } = state;
      return rest;
    }
    return state;
  } else if (action.type === REMOVE_All_LOADERS) {
    return null;
  } else if (action.type === SET_PERCENTAGE) {
    return {
      ...state,
      [action.payload.loaderName]: {
        ...state[action.payload.loaderName],
        percentage: action.payload.percentage,
      },
    };
  }

  return state;
}
