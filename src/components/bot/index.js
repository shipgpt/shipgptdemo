import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import Image from "next/image";
import { ViewPoint, handleCompleteChat } from "../libs/common";
import { hideLoader, setLoader } from "@/src/store/loader";
import { useDispatch, useSelector } from "react-redux";
import {
  addUserMessage,
  clearPending,
  addPendingData,
  setStopChat,
  addSourceDocs,
} from "@/src/store/mainSlice";

import {
  getUserFiles,
  getUserFolders,
  setChatMobile,
} from "@/src/store/credentials";
import Button from "../libs/button";
import { LoadingDots } from "../libs/Loader";
import FileSystem from "../fileSystem";
import { showAlert } from "@/src/store/alert";

export default function Bot() {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");

  const messageState = useSelector(
    (state) => state?.entities?.mainSlice?.messageState
  );
  const { messages, pending, pendingSourceDocs } = messageState;

  const _id = useSelector(
    (state) => state?.entities?.credentials?.selectedFolder?.id
  );

  const file_name = useSelector(
    (state) => state?.entities?.credentials?.selectedFolder?.name
  );

  const showChatMobile = useSelector(
    (state) => state?.entities?.credentials?.showChatMobile
  );

  const StoreLoader = useSelector((state) => state.entities.loader);

  const keyValues = useSelector(
    (state) => state?.entities?.credentials?.keyValues
  );
  const key_id = keyValues ? keyValues[0] : [];

  const messageListRef = useRef(null);
  const files = useSelector((state) => getUserFiles(state));
  const folders = useSelector((state) => getUserFolders(state));

  const textareaRef1 = useRef();

  const handleInput = (event) => {
    const textarea = event.target;
    textarea.parentNode.dataset.replicatedValue = textarea.value;
  };

  const handleSetMessage = (e) => {
    setQuery(e.target.value);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!query) {
      return;
    }
    const question = query.trim();
    dispatch(addUserMessage({ question, _id }));
    await dispatch(setLoader("chatLoader"));
    setQuery("");
    dispatch(clearPending());

    const ctrl = new AbortController();
    await dispatch(setStopChat(ctrl));

    try {
      fetchEventSource(
        `${process.env.NEXT_PUBLIC_NEXT_IP_GENERIG}/api/chat?openai_key=${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question,
            history,
            file_id: _id,
            model: "gpt-3.5-turbo",
          }),
          signal: ctrl.signal,

          onmessage: (event) => {
            console.log("data", event);
            if (event.data === "[DONE]") {
              handleResponse("true");
            } else {
              const data = JSON.parse(event.data);
              if (data.sourceDocs) {
                dispatch(addSourceDocs(data));
              } else {
                dispatch(addPendingData(data));
              }
            }
          },
        }
      );
    } catch (error) {
      await dispatch(hideLoader("chatLoader"));
      console.log("error", error);
    }
  }

  const handleResponse = async (status) => {
    setTimeout(() => {
      textareaRef1.current?.focus();
    }, 300);
    await handleCompleteChat(status, dispatch);
  };

  const handleEnter = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey && query) {
        e.preventDefault();
        handleSubmit(e);
      } else if (e.key == "Enter" && !e.shiftKey) {
        e.preventDefault();
      } else if (e.key === "Enter" && e.shiftKey) {
        console.log("Shift + Enter key pressed");
      }
    },
    [query]
  );

  const chatMessages = useMemo(() => {
    return [
      ...messages,
      ...(pending
        ? [
            {
              type: "apiMessage",
              message: pending,
              sourceDocs: pendingSourceDocs,
            },
          ]
        : []),
    ];
  }, [messages, pending, pendingSourceDocs]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleClickinput = () => {
    if (!_id) {
      dispatch(showAlert("Please select file to start conversation", "error"));
    }
  };

  const view = ViewPoint("700px");

  return (
    <div className="d-flex position-relative h-100">
      <div
        className={` ${
          !view ? "position-absolute h-100 w-100 bg-white" : "col-3 "
        }`}
        style={{
          borderRight: "1px solid lightgrey",
          zIndex: "1080",
          display: !view ? (showChatMobile ? "none" : "block") : "block",
        }}
      >
        <FileSystem />
      </div>
      <main className={"main main-data position-relative"}>
        {!view ? (
          <div
            style={{ padding: "12px 0", zIndex: "999" }}
            className="w-100 bg-light border-bottom d-flex align-items-center position-absolute"
          >
            <i
              className="bi bi-arrow-left ps-3"
              style={{
                fontSize: "18px",
                zIndex: "1000",
              }}
              onClick={() => dispatch(setChatMobile(false))}
            />
            <p className="mb-0 text-dark ms-4">{file_name}</p>
          </div>
        ) : null}
        <div className={"cloud flex-column mt-5 mt-sm-4"}>
          <div ref={messageListRef} className={"messagelist"}>
            {chatMessages.map((message, index) => {
              let icon;
              let className;
              if (message.type === "apiMessage") {
                icon = (
                  <Image
                    src="/images/icon.png"
                    alt="AI"
                    width="40"
                    height="40"
                    className={"boticon"}
                    priority
                  />
                );
                className = "apimessage";
              } else {
                icon = (
                  <>
                    <i className="bi bi-person-fill usericonBoot" />
                  </>
                );
                className =
                  StoreLoader &&
                  StoreLoader["chatLoader"] &&
                  index === chatMessages.length - 1
                    ? "usermessagewaiting"
                    : "usermessage";
              }
              return (
                <>
                  <div key={`chatMessage-${index}`} className={className}>
                    {icon}
                    <div className={"markdownanswer"}>
                      <pre className="MsgResponse mb-0">{message.message}</pre>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>

        <div className={`${"center"} px-3 px-sm-5`}>
          <div className={"cloudform"}>
            <form onSubmit={handleSubmit} action="#0">
              <div className="grow-wrap">
                <textarea
                  readOnly={!_id ? true : false}
                  disabled={
                    StoreLoader && StoreLoader["chatLoader"] ? true : false
                  }
                  style={{
                    opacity: files?.length || folders?.length ? "100%" : "20%",
                  }}
                  onKeyDown={handleEnter}
                  ref={textareaRef1}
                  autoFocus={false}
                  maxLength={700}
                  rows={1}
                  id="userInput"
                  name="userInput"
                  placeholder={
                    StoreLoader && StoreLoader["chatLoader"]
                      ? "Waiting for response..."
                      : files?.length == 0
                      ? "Upload file to start conversation"
                      : "Ask a question about your document?"
                  }
                  value={query}
                  onClick={handleClickinput}
                  onChange={(e) => handleSetMessage(e)}
                  onInput={handleInput}
                  className={"scrollbar"}
                />
              </div>
              <button type="submit" className={"generatebutton"}>
                {StoreLoader && StoreLoader["chatLoader"] ? (
                  <>
                    <div className={"loadingwheel"}>
                      <LoadingDots color="#474747" />
                    </div>

                    <Button
                      className="chatCancelButton border"
                      BIcon="bi bi-x-lg"
                      onClick={(e) => {
                        e.stopPropagation(), handleResponse("false");
                      }}
                    />
                  </>
                ) : (
                  <div
                    className="sideAnim"
                    style={
                      query
                        ? {
                            padding: "5px",
                            backgroundColor: "#0056fd",
                            borderRadius: "4px",
                          }
                        : { marginBottom: "4px" }
                    }
                  >
                    <svg
                      viewBox="0 0 20 20"
                      className={"svgicon"}
                      style={
                        query
                          ? {
                              color: "white",
                              opacity: "80%",
                              width: "1.1em",
                              height: "1.1em",
                            }
                          : { width: "1.2em", height: "1.2em" }
                      }
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
