import React, { useEffect, useState, useRef, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentSource,
  setProgressType,
  uploadfileName,
} from "@/src/store/credentials";
import { removeAllLoaders, setLoader } from "@/src/store/loader";
import axios from "axios";
import {
  checkFileLimit,
  saveFileToStorage,
  setEmailToStorage,
} from "../libs/common";
import PercentageLoading from "../libs/percentageLoader";
import { Input } from "../libs/input";
import Button from "../libs/button";
import { clearHistory } from "@/src/store/mainSlice";

const WebButton = () => {
  return (
    <div>
      <WebCovertButton />
    </div>
  );
};

export default WebButton;

export function WebCovertButton(props) {
  const dispatch = useDispatch();
  const StoreLoader = useSelector((state) => state.entities.loader);

  const [linkName, setLinkName] = useState("");

  const linkRef = useRef(null);

  const WebUrl = linkName;

  async function handleGeneratelinkFile() {
    const limitExceeded = await checkFileLimit(dispatch);

    if (limitExceeded) {
      return;
    }

    console.log("file ready for conver", WebUrl);

    await dispatch(setProgressType("link"));
    await dispatch(setLoader("linkUploadweb"));

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_NEXT_IP_GENERIG}/api/web?openai_key=${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      { url: WebUrl },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.status === 200) {
      console.log("OPERATION SUCCESS");

      saveFileToStorage({
        file_name: response?.data?.success?.name,
        file_id: response?.data?.success?.name,
        file: response?.data?.success?.file,
        type: "web",
        dispatch,
      });

      dispatch(setCurrentSource("chat"));
      dispatch(removeAllLoaders());
      dispatch(clearHistory());
    }
  }

  //================================================================
  return (
    <>
      <div className="mb-2">
        <Input
          id="folder-name-input"
          type="text"
          refs={linkRef}
          value={linkName}
          onChange={(e) => setLinkName(e.target.value)}
          className="addFolderInput withForUpload"
          placeholder="Add web url here"
        />

        <Button
          type="submit"
          className="addFolderBtn simpleButton withForUpload sideAnim"
          disabled={
            !linkName
              ? true
              : StoreLoader && StoreLoader["linkUploadweb"]
              ? true
              : false
          }
          text="Insert Link"
          onClick={handleGeneratelinkFile}
        />
        {StoreLoader && StoreLoader["linkUploadweb"] && (
          <PercentageLoading
            items={120}
            timePerItem={1000}
            id={"linkUploadweb"}
          />
        )}
        <p className="font_box text-center withForUpload  mb-0 mt-2">
          This will scrape a single specified page, excluding linked files.
        </p>
      </div>
    </>
  );
}
