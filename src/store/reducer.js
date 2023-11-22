import loader from "./loader";
import { REHYDRATE } from "redux-persist";
import credentials from "./credentials";
import mainSlice from "./mainSlice";
import alert from "./alert";

export default function reducer(state, action) {
  if (action.type === REHYDRATE && action.payload) {
    return {
      entities: {
        ...state?.entities,
        credentials: action?.payload?.entities?.credentials,
      },
    };
  } else if (action.type === "credentials/logout") {
    localStorage.removeItem("persist:root");
    return {
      entities: {
        credentials: credentials(undefined, action),
        loader: loader(undefined, action),
        mainSlice: mainSlice(undefined, action),
        alert: alert(undefined, action),
      },
    };
  } else if (action.type === "loginalltabs") {
    return {
      entities: {
        ...state?.entities,
        credentials: action?.payload,
        loader: loader(state?.entities?.loader, action),
        mainSlice: mainSlice(state?.entities?.mainSlice, action),
        alert: alert(state?.entities?.alert, action),
      },
    };
  } else {
    action.store = state;
    return {
      entities: {
        credentials: credentials(state?.entities?.credentials, action),
        loader: loader(state?.entities?.loader, action),
        mainSlice: mainSlice(state?.entities?.mainSlice, action),
        alert: alert(state?.entities?.alert, action),
      },
    };
  }
}
