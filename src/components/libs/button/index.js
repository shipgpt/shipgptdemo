import React, { useState } from "react";
import { BtnLoader, BtnLoaderSimple } from "../Loader";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import Dropdown from "react-bootstrap/Dropdown";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { ViewPoint } from "../common";
import Modal from "react-bootstrap/Modal";
import { Input } from "../input";

export default function Button(props) {
  const {
    border,
    text,
    onClick,
    height,
    width,
    ariacontrols,
    ariaexpanded,
    backgroundColor,
    color,
    position,
    right,
    id,
    type,
    onChange,
    visibility,
    src,
    onDoubleClick,
    onKeyDown,
    className,
    fontSize,
    opacity,
    display,
    classImg,
    BIcon,
    disabled,
    loading,
    LoaderPosition,
    onMouseOver,
    onMouseOut,
    classNameMain,
    accept,
    autoWidth,
    whiteSpace,
    loadingValue,
    borderBottom,
    tooltip,
    tooltiPContent,
    handleStopApi,
    apiCancel,

    alert,

    padding,
    StopApiStyle,
    tag,
    tagBgColor,
    tagText,
    tagColor,
    btnLoaderPadding,
    title,
    showLoading,
    iconClick,
    overflow,
    preventClosingSidebar,
  } = props;
  const loader = useSelector((state) => state.entities?.loader);
  const sidebar = useSelector((state) => state.entities.mainSlice.sidebar);
  const view = ViewPoint("600px");

  const [modalInput, setModalInput] = useState(null);
  const [show, setShow] = useState(false);
  function handleClick() {
    setShow(true);
  }
  function handleClose() {
    setShow(false);
  }

  const cancelTokenSource = useSelector(
    (state) => state?.entities?.credentials?.cancelTokenSource
  );

  const apiRequests = useSelector(
    (state) => state?.entities?.credentials?.apiRequests
  );

  const handleCancelRequest = async () => {
    try {
      const requestId = id;
      if (apiRequests?.hasOwnProperty(requestId)) {
        await cancelTokenSource?.cancel(requestId);
        await apiRequests[requestId]?.cancelToken001?.cancel();
        console.log("apiRequests", apiRequests);
        console.log("Request cancelled successfully.");
      } else {
        console.log("Request not found.");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <div
        className={`position-relative ${classNameMain}`}
        style={{
          height,
          width,
          pointerEvents: !loading && loader && loader[id] ? "none" : "",
        }}
      >
        {alert && alert?.visible && (
          <Modal
            show={show}
            onHide={handleClose}
            centered
            size={alert?.size ? alert?.size : "sm"}
          >
            <Modal.Header closeButton>
              <Modal.Title>
                {alert?.title ? alert?.title : "Email Required!"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-2">
              &nbsp;
              {alert?.description
                ? alert?.description
                : "Submit your email to use free plan:"}
              {alert?.input ? (
                <Input
                  onChange={(e) => setModalInput(e)}
                  type={alert?.inputType ? alert?.inputType : "text"}
                />
              ) : null}
            </Modal.Body>
            <Modal.Footer className="py-2">
              <Button
                onClick={handleClose}
                text="Close"
                className="bg-transparent outline-0 border border-secondary p-3 py-1"
                padding="2px 6px"
              />
              <Button
                onClick={
                  alert?.visible
                    ? alert?.onClick
                      ? (e) => {
                          alert?.onClick(alert?.input ? modalInput : e),
                            handleClose();
                        }
                      : () => {
                          onClick(), handleClose();
                        }
                    : null
                }
                id={id}
                text="Proceed"
                className="simpleButton py-1"
              />
            </Modal.Footer>
          </Modal>
        )}

        {apiCancel && id && loader && loader[id] && (
          <div
            className="position-absolute btn-cancel-api"
            onClick={(e) => (
              e.stopPropagation(),
              handleStopApi ? handleStopApi() : handleCancelRequest()
            )}
            style={StopApiStyle}
          >
            <i className="bi bi-x-lg" />
          </div>
        )}

        {!showLoading && id && loader && loader[id] && (
          <BtnLoaderSimple
            loadingValue={loadingValue}
            status={loading}
            position={LoaderPosition}
          />
        )}

        {tag && (
          <div
            className=" text-center rounded position-absolute px-2"
            style={{
              zoom: "80%",
              top: "20%",
              right: "10%",
              backgroundColor: !tagBgColor ? "#fae69e" : tagBgColor,
              color: !tagColor ? "black" : tagColor,
              zIndex: "1080",
            }}
          >
            <p className="mb-1 ">{tagText}</p>
          </div>
        )}

        {!loading && tooltip && (
          <div className=" position-absolute info-btn-button">
            <OverlayTrigger
              placement={view ? "right" : "bottom"}
              overlay={
                <div
                  className="tooltip text rounded"
                  style={{
                    marginTop: view ? "50px" : "10px",
                    marginRight: "150px",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: tooltiPContent,
                  }}
                />
              }
            >
              <div className="bi bi-info-circle" />
            </OverlayTrigger>
          </div>
        )}

        <div
          style={
            loading
              ? {
                  opacity: "50%",
                  pointerEvents: "none",
                }
              : {}
          }
        >
          <button
            id={id}
            tabIndex="-1"
            title={title}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            onKeyDown={onKeyDown}
            disabled={disabled}
            aria-controls={ariacontrols}
            aria-expanded={ariaexpanded}
            className={` ${
              !autoWidth && "w-100"
            } ${className} rounded position-relative `}
            type={type}
            onDoubleClick={onDoubleClick}
            onClick={
              alert && alert?.visible
                ? handleClick
                : !preventClosingSidebar && !view && sidebar
                ? () => {
                    onClick();
                  }
                : onClick
            }
            style={{
              backgroundColor,
              fontSize,
              color,
              position,
              opacity,
              right,
              border,
              borderBottom,
              height,
              width,
              visibility,
              display,
              whiteSpace,
              padding,
            }}
          >
            {!text && !loading && loader && loader[id] ? (
              <div
                style={{
                  padding: `${btnLoaderPadding ? btnLoaderPadding : "7px"} 0`,
                }}
              >
                <BtnLoader position="center" />
              </div>
            ) : (
              BIcon && (
                <i
                  onClick={(e) => {
                    e.stopPropagation(),
                      iconClick ? iconClick() : onClick ? onClick() : null;
                  }}
                  className={BIcon}
                />
              )
            )}

            {text && !loading && loader && loader[id] ? (
              <div
                style={{
                  padding: `${btnLoaderPadding ? btnLoaderPadding : "7px"} 0`,
                }}
              >
                <BtnLoader position="center" />
              </div>
            ) : (
              <span className={overflow ? "" : "overflow"}>{text}</span>
            )}

            {src && (
              <div style={{ width: "18px" }}>
                <Image
                  width="25"
                  height="25"
                  src={src}
                  className={`${classImg}`}
                />
              </div>
            )}
            {type == "file" ? (
              <label
                className="btn btn-default "
                style={{
                  height: "100%",
                  width: "100%",
                  position: "absolute",
                  top: "0",
                  left: "0",
                }}
              >
                <input
                  style={{
                    height: "100%",
                    width: "100%",
                  }}
                  type="file"
                  onChange={alert && alert?.visible ? handleClick : onChange}
                  disabled={disabled}
                  hidden
                  accept={accept}
                />
              </label>
            ) : (
              ""
            )}
          </button>
        </div>
      </div>
    </>
  );
}
