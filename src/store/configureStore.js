import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";
// import api from "./middleware/api";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { createWrapper } from "next-redux-wrapper";

export const persistConfig = {
  key: "root",
  storage: storage,
};
const persistedReducer = persistReducer(persistConfig, reducer);
export default function makestore() {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
  });
}
export const store = makestore();
export const wrapper = createWrapper(makestore);
