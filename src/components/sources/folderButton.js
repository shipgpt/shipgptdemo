import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserFolders, setCurrentSource } from "@/src/store/credentials";
import {
  getObjectId,
  removeExtension,
  saveFolderToStorage,
  setEmailToStorage,
} from "../libs/common";
import { hideLoader, removeAllLoaders, setLoader } from "@/src/store/loader";
import path from "path";
import { Input } from "../libs/input";
import Button from "../libs/button";

const FolderButton = () => {
  const dispatch = useDispatch();
  const folders = useSelector((state) => getUserFolders(state));
  const [folderName, setFolderName] = useState("");

  const loader = useSelector((state) => state.entities.loader);
  //=================================================================
  const refFolder = useRef(null);
  const outClickRef2 = useRef(null);

  const handleCreateFolder = async () => {
    try {
      dispatch(setLoader("createFolder"));
      const folder_id = getObjectId() + ".txt";

      let name = folderName;

      const response = folders?.find((f) => f.folder_name === name);

      if (response) {
        const folder_extension = path.extname(name);

        const folder_name = removeExtension(name);

        let counter = 1;
        while (
          folders?.find(
            (f) =>
              f.folder_name === `${folder_name}(${counter})${folder_extension}`
          )
        ) {
          counter++;
        }
        name = `${folder_name}(${counter})${folder_extension}`;
      }

      await saveFolderToStorage({
        folder_name: name,
        folder_id,
        text_content: "",
        dispatch,
      });

      dispatch(setCurrentSource("chat"));

      setFolderName("");
      dispatch(hideLoader("createFolder"));
    } catch (err) {
      console.log("err", err);
      dispatch(removeAllLoaders());
    }
  };

  return (
    <>
      {/* ============================== Add Folder ================================== */}

      <div className="mb-2">
        <Input
          id="folder-name-input"
          type="text"
          ref={refFolder}
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          className="addFolderInput withForUpload"
          autoComplete="off"
          placeholder="Add folder name here "
        />

        <Button
          text="Create folder"
          type="submit"
          className="addFolderBtn simpleButton withForUpload sideAnim"
          disabled={
            !folderName || (loader && loader["createFolder"]) ? true : false
          }
          onClick={handleCreateFolder}
        />
        <p className="font_box text-center withForUpload mb-0 mt-2">
          You can ask questions from group of files by adding folder.
        </p>
      </div>
    </>
  );
};

export default FolderButton;
