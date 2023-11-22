import "@/styles/globals.css";
import "@/styles/bootstrap.min.css";
import "@/styles/style.scss";
import "bootstrap-icons/font/bootstrap-icons.css";

import AlertMessage from "@/src/components/libs/alertMessage";
import { Persist } from "@/src/store/persistGate";
import { wrapper } from "@/src/store/configureStore";
import { getObjectId } from "@/src/components/libs/common";

function App({ Component, pageProps }) {
  let machine_id = "";
  if (typeof window !== "undefined") {
    const currentDomain = window.location.hostname;
    const storedDomain = localStorage.getItem(currentDomain);
    machine_id = localStorage.getItem(`${storedDomain}_machine_id`);

    if (!machine_id || storedDomain !== currentDomain) {
      machine_id = getObjectId();
      localStorage.setItem(currentDomain, currentDomain);
      localStorage.setItem(`${currentDomain}_machine_id`, machine_id);
    }
  }

  return (
    <>
      <Persist>
        <AlertMessage />
        <Component {...pageProps} />
      </Persist>
    </>
  );
}

export default wrapper.withRedux(App);
