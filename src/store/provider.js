import { Provider, useSelector, useDispatch } from "react-redux";
import { store } from "./configureStore";

export function Providers({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
