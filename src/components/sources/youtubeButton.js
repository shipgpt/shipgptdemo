import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentSource, setProgressType } from "../../store/credentials";
import { removeAllLoaders, setLoader } from "@/src/store/loader";
import axios from "axios";
import PercentageLoading from "../libs/percentageLoader";
import { checkFileLimit, saveFileToStorage } from "../libs/common";
import { Input } from "../libs/input";
import Button from "../libs/button";
import { clearHistory } from "@/src/store/mainSlice";

export default function YoutubeButton() {
  const dispatch = useDispatch();
  const StoreLoader = useSelector((state) => state.entities.loader);

  const [linkName, setLinkName] = useState("");
  const youtubeUrl = linkName;

  async function handleGeneratelinkFile(e) {
    try {
      const limitExceeded = await checkFileLimit(dispatch);

      if (limitExceeded) {
        return;
      }

      await dispatch(setProgressType("link"));
      await dispatch(setLoader("linkUpload"));

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_NEXT_IP_GENERIG}/api/youtube?openai_key=${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        { url: youtubeUrl },
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
          type: "link",
          dispatch,
        });

        dispatch(setCurrentSource("chat"));
        dispatch(removeAllLoaders());
        dispatch(clearHistory());
      }
    } catch (error) {
      dispatch(removeAllLoaders());
    }
  }

  //================================================================
  return (
    <>
      <div className="mb-2">
        <Input
          id="folder-name-input"
          type="text"
          value={linkName}
          onChange={(e) => setLinkName(e.target.value)}
          className="addFolderInput withForUpload"
          placeholder="Add youtube link here"
        />

        <Button
          type="submit"
          className="addFolderBtn withForUpload simpleButton sideAnim"
          disabled={
            !linkName
              ? true
              : StoreLoader && StoreLoader["linkUpload"]
              ? true
              : false
          }
          text="Insert Link"
          onClick={handleGeneratelinkFile}
        />

        {StoreLoader && StoreLoader["linkUpload"] && (
          <PercentageLoading items={120} timePerItem={1000} id={"linkUpload"} />
        )}
        <p className="font_box text-center withForUpload mb-0 mt-2">
          This will scrape a youtube video.
        </p>
      </div>
    </>
  );
}
