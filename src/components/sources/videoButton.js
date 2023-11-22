import React from "react";
import {
  getUserFiles,
  setCurrentSource,
  setFile,
  setProgressType,
} from "@/src/store/credentials";
import { useDispatch, useSelector } from "react-redux";
import {
  checkFileLimit,
  removeExtension,
  saveFileToStorage,
  setEmailToStorage,
} from "../libs/common";
import { removeAllLoaders, setLoader } from "@/src/store/loader";
import axios from "axios";
import path from "path";
import PercentageLoading from "../libs/percentageLoader";
import Button from "../libs/button";
import { clearHistory } from "@/src/store/mainSlice";
import { useState } from "react";

const VideoButton = () => {
  const dispatch = useDispatch();

  const files = useSelector((state) => getUserFiles(state));

  const StoreLoader = useSelector((state) => state.entities.loader);
  const acceptFiles =
    "video/mp4,video/x-msvideo,video/x-matroska,video/quicktime";

  async function handleUpload(event) {
    const i = event?.target?.files[0];

    let name = i?.name;
    const response = files?.find((f) => f.file_name === name);

    if (response) {
      const file_extension = path.extname(name);
      const file_name = removeExtension(name);

      let counter = 1;
      while (
        files?.find(
          (f) => f.file_name === `${file_name}(${counter})${file_extension}`
        )
      ) {
        counter++;
      }
      name = `${file_name}(${counter})${file_extension}`;
    }
    dispatch(setFile(i));
    await dispatch(setProgressType("file"));
    await dispatch(setLoader("uploadVideo"));

    await uploadToServer({ event: i, name });
  }

  const uploadToServer = async ({ event, name }) => {
    try {
      const limitExceeded = await checkFileLimit(dispatch);

      if (limitExceeded) {
        dispatch(removeAllLoaders());
        return null;
      }

      const formData = new FormData();
      formData.append("file", event);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_NEXT_IP_GENERIG}/api/video?openai_key=${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response?.status === 200) {
        console.log("OPERATION SUCCESS");

        await saveFileToStorage({
          file_name: name,
          file_id: response?.data?.success?.name,
          file: response?.data?.success?.file,
          type: "video",
          dispatch,
        });

        dispatch(setCurrentSource("chat"));

        dispatch(removeAllLoaders());
        dispatch(clearHistory());
      }
    } catch (error) {
      dispatch(removeAllLoaders());
    }
  };

  return (
    <>
      <div className="mb-2">
        <div className="position-relative">
          <input
            type="file"
            className="position-absolute w-100 h-100 cursor-pointer"
            style={{
              zIndex: "999",
              opacity: "0%",
              pointerEvents:
                StoreLoader && StoreLoader["uploadVideo"] ? "none" : "auto",
            }}
            onChange={handleUpload}
            accept={acceptFiles}
          />

          <Button
            text={
              <div className="d-flex flex-column align-items-center justify-content-center mb-3 px-2 px-sm-5">
                <span className="font_box fw-semibold d-sm-block d-none mb-1">
                  Drag and Drop video here or click to select video
                </span>
                <span className="font_box fw-semibold d-sm-none d-block mb-1">
                  Click to select video
                </span>
                <span className="font_box  d-sm-block d-none">
                  Supported formats type .mp4, .avi, .mkv, .mov
                </span>
                <span className="font_box  d-sm-none d-block">
                  .mp4, .avi, .mkv, .mov
                </span>
              </div>
            }
            id="uploadVideo"
            className="upload_box"
            BIcon="bi bi-upload font-bold fs-5"
            loading={StoreLoader && StoreLoader["uploadVideo"] ? true : false}
            LoaderPosition="end"
            backgroundColor={"white"}
          />
        </div>
        {StoreLoader && StoreLoader["uploadVideo"] && (
          <PercentageLoading
            items={120}
            timePerItem={1000}
            id={"uploadVideo"}
          />
        )}
      </div>
    </>
  );
};

export default VideoButton;
