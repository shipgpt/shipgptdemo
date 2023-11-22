import { combineReducers } from "redux";
import mainSlice from "./mainSlice";
import credentials from "./credentials";
import loader from "./loaderReducer";

export default combineReducers({
  mainSlice: mainSlice,
  credentials: credentials,
  loader: loader,
});
