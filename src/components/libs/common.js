import React, { useEffect, useState } from "react";
import { addApiMessage, saveHistory } from "../../store/mainSlice";

import { v4 as uuidv4 } from "uuid";
import {
  updateFolderData,
  getAssignFolderData,
  getFileData,
  getFolderData,
  insertFolderData,
} from "@/src/store/credentials";
import { hideLoader } from "@/src/store/loader";
import { showAlert } from "@/src/store/alert";

export function getObjectId() {
  return uuidv4();
}

const isWindowDefined = typeof window !== "undefined";

export function ViewPoint(value) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (isWindowDefined) {
      setMatches(window?.matchMedia(`(min-width: ${value})`).matches);

      window
        ?.matchMedia(`(min-width: ${value})`)
        .addEventListener("change", (e) => setMatches(e.matches));
    }
  }, []);

  return isWindowDefined ? matches : false;
}

export const newDate = new Date().toISOString().slice(0, 10);

const extensions = [
  ".pdf",
  ".PDF",
  ".csv",
  ".CSV",
  ".doc",
  ".docx",
  ".DOCX",
  ".DOC",
  ".txt",
  ".TXT",
  ".epub",
  ".EPUB",
];
export const removeExtension = (filename) => {
  for (let i = 0; i < extensions.length; i++) {
    const extension = extensions[i];
    if (filename.endsWith(extension)) {
      console.log("test", filename.slice(0, -extension.length));
      return filename.slice(0, -extension.length);
    }
  }
  return filename;
};

export function createCancellationToken() {
  let isCancelled = false;

  function cancel() {
    isCancelled = true;
  }

  return {
    isCancelled: () => isCancelled,
    cancel: cancel,
  };
}

export const handleCompleteChat = async (status, dispatch) => {
  const stopChat = await dispatch(
    (_, getState) => getState()?.entities?.mainSlice?.stopChat
  );
  await dispatch(addApiMessage());
  await stopChat?.abort();
  await dispatch(saveHistory(status));
  await dispatch(hideLoader("chatLoader"));
};

export const saveFileToStorage = async ({
  file_name,
  file_id,
  file,
  type,
  dispatch,
}) => {
  let fileData = JSON.parse(localStorage.getItem(`file_data`)) || [];
  const newObj = {
    file_name,
    file_id,
    status: "active",
    type,
    file,
  };
  await fileData.push(newObj);
  localStorage.setItem(`file_data`, JSON.stringify(fileData));

  dispatch(getFileData(newObj));
};

export const saveFolderToStorage = async ({
  folder_name,
  folder_id,
  text_content,
  dispatch,
}) => {
  let folderData = JSON.parse(localStorage.getItem(`folder_data`)) || [];
  const newObj = {
    folder_name,
    folder_id,
    text_content,
    status: "active",
  };
  await folderData.push(newObj);
  localStorage.setItem(`folder_data`, JSON.stringify(folderData));

  dispatch(insertFolderData(newObj));
};

export const updateFOlderInStorage = async ({
  folder_id,
  folder_name,
  prev_id,
  text_content,
  dispatch,
}) => {
  let folderData = JSON.parse(localStorage.getItem(`folder_data`)) || [];

  const newObj = {
    folder_name,
    folder_id,
    text_content,
    status: "active",
  };
  const _id = prev_id;
  const objectIndex = folderData.findIndex((item) => item.folder_id === _id);
  folderData[objectIndex] = newObj;
  localStorage.setItem(`folder_data`, JSON.stringify(folderData));

  await dispatch(updateFolderData({ objectIndex, newObj }));
  dispatch(getFolderData({ folderResponse: folderData }));
};

export const saveAssignToStorage = async ({
  folder_id,
  file_ids,
  prev_id,
  dispatch,
}) => {
  let AsignData = JSON.parse(localStorage.getItem(`asign_data`)) || [];
  const newObj = file_ids?.map((f) => {
    return {
      assign_id: getObjectId(),
      folder_id,
      file_id: f,
      status: "true",
    };
  });

  await AsignData.push(...newObj);

  await updateFolderIdInAssignStorage({
    folder_id,
    prev_id,
    AsignData,
    dispatch,
  });
};

export const updateAssignInStorage = async ({
  folder_id,
  prev_id,
  dispatch,
}) => {
  let AsignData = JSON.parse(localStorage.getItem(`asign_data`)) || [];

  await updateFolderIdInAssignStorage({
    folder_id,
    prev_id,
    AsignData,
    dispatch,
  });
};

export const updateFolderIdInAssignStorage = async ({
  folder_id,
  prev_id,
  AsignData,
  dispatch,
}) => {
  const updatedFolders = AsignData.map((assign) => {
    if (assign.folder_id === prev_id) {
      return {
        ...assign,
        folder_id: folder_id,
        status: "true",
      };
    }
    return assign;
  });

  localStorage.setItem(`asign_data`, JSON.stringify(updatedFolders));

  dispatch(getAssignFolderData(updatedFolders));
};

export const removeAssignFromStorage = async ({ file_ids, dispatch }) => {
  let AsignData = JSON.parse(localStorage.getItem(`asign_data`)) || [];

  const newObj = AsignData?.filter((file) =>
    file_ids?.some((assign) => assign !== file.file_id)
  );

  localStorage.setItem(`asign_data`, JSON.stringify(newObj));

  dispatch(getAssignFolderData(newObj));
};

export const getChatObject = async (_id) => {
  let machine_id = await localStorage.getItem(
    `${window.location.hostname}_machine_id`
  );
  let chatData =
    (await JSON.parse(localStorage.getItem(`chat_${machine_id}`)))?.filter(
      (f) => f?._id == _id
    ) || [];

  const newData = {
    success: [
      {
        message: "Hi, what would you like to learn about your document?",
        type: "apiMessage",
        _id: _id,
      },
    ],
  };

  for (let i = 0; i < chatData?.length; i++) {
    await newData?.success.push({
      message: chatData[i]?.question,
      type: "userMessage",
      _id: chatData[i]?._id,
    });

    await newData?.success.push({
      message: chatData[i]?.response,
      type: "apiMessage",
      _id: chatData[i]?._id,
    });
  }

  return newData;
};

export async function checkFileLimit(dispatch) {
  const files = await dispatch(
    (_, getState) => getState()?.entities?.credentials?.selectedUserFiles
  );

  if (files?.length >= 8) {
    dispatch(showAlert("Exceeded maximum file limit of 8.", "error"));
    return true;
  } else {
    return false;
  }
}
