import { hideAlert } from "@/src/store/alert";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const AlertMessage = () => {
  const alerts = useSelector((state) => state.entities?.alert?.alerts);
  const dispatch = useDispatch();
  useEffect(() => {
    if (alerts?.length > 0) {
      const timer = setTimeout(() => {
        dispatch(hideAlert(0));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alerts, dispatch]);

  return (
    <>
      <div className="position-fixed d-flex flex-column align-items-center alertmessage-style">
        {alerts?.map((alert, index) => (
          <div key={alert.id} className="alert__container ">
            <div
              className={`alert alert__${alert.type} spacer d-flex justify-content-center`}
              role="alert"
            >
              <p className="alert__text mb-0" style={{ fontSize: "16px" }}>
                {alert.message}
              </p>
              <button
                className="mx-3 p-0 bg-transparent"
                onClick={() => dispatch(hideAlert(index))}
              >
                <i className="bi bi-x-lg text-dark" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AlertMessage;
