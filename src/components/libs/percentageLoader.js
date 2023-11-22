import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPercentage } from "../../store/loader";
import ProgressBar from "react-bootstrap/ProgressBar";

const PercentageLoading = ({ items, timePerItem, id }) => {
  //============================================================================
  const dispatch = useDispatch();
  const percentage = useSelector(
    (state) => state.entities?.loader[id]?.percentage
  );

  useEffect(() => {
    const totalLoadTime = items * timePerItem;
    const interval = totalLoadTime / 100;
    let count = percentage;
    const loadingInterval = setInterval(() => {
      count += 1;
      if (count <= 100) {
        dispatch(setPercentage(id, count));
      } else {
        clearInterval(loadingInterval);
      }
    }, interval);

    return () => {
      clearInterval(loadingInterval);
    };
  }, [items, timePerItem]);

  return (
    <div className="d-flex align-items-center w-100">
      <div className="w-100">
        <ProgressBar
          now={percentage}
          animated
          style={{ height: "6px" }}
          className="rounded-0"
        />
      </div>
      <p
        className="mb-0 ms-3"
        style={{ fontSize: "12px" }}
      >{`${percentage}%`}</p>
    </div>
  );
};

export default PercentageLoading;
