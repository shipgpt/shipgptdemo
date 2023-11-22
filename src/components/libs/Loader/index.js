import React from "react";
import styles from "./Loader.module.scss";
import Image from "next/image";

import loadingStyles from "@/styles/loading-dots.module.css";

export function AppLoader() {
  return (
    <div className={styles["loaderContainer"]}>
      <div
        className={`${styles["Loader"]} d-flex justify-centent-center align-items-center`}
      >
        <Image
          src={"/images/icon.png"}
          alt="...Loading"
          width="100"
          height="100"
        />
      </div>
    </div>
  );
}

export function BtnLoader(props) {
  const { position, pR, style, py } = props;
  return (
    <>
      <div
        className={`d-flex  justify-content-${position} ${
          position == "end" && `pe-${!pR ? "3" : pR}`
        } align-items-center w-100 h-100 `}
        style={{
          zIndex: "1080",
        }}
      >
        <div className={styles["dot-flashing"]} />
      </div>
    </>
  );
  // } else return null;
}

export function BtnLoaderSimple(props) {
  const { status, position, loadingValue } = props;
  if (status) {
    return (
      <>
        <div
          className={`position-absolute d-flex justify-content-${position} ${
            position == "end" && "pe-4"
          } align-items-center w-100 h-100`}
        >
          {loadingValue ? (
            loadingValue + "%"
          ) : (
            // <Image
            //   src={'/Assets/image/btnSpinner.gif'}
            //   alt="...Loading"
            //   width="20"
            //   height="20"
            // />
            <div className={styles["dot-flashing"]} />
          )}
        </div>
      </>
    );
  } else return null;
}

export const LoadingDots = ({ color = "#000", style = "small" }) => {
  return (
    <span
      className={
        style == "small" ? loadingStyles.loading2 : loadingStyles.loading
      }
    >
      <span style={{ backgroundColor: color }} />
      <span style={{ backgroundColor: color }} />
      <span style={{ backgroundColor: color }} />
    </span>
  );
};
