import { store } from "./configureStore";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { AppLoader } from "../components/libs/Loader";

export function Persist({ children }) {
  const persistor = persistStore(store);

  return (
    <PersistGate loading={<AppLoader />} persistor={persistor}>
      {children}
    </PersistGate>
  );
}
