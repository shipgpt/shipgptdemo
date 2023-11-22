import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

const slice = createSlice({
  name: "credentials",
  initialState: {
    selectedUserFiles: [],
    assignedFiles: [],
    selectedUserFolders: [],
    selectedFolderValues: {
      folder_id: "",
      folder_name: "",
      user_email: "",
      status: "",
    },
    selectedFileValues: {
      file_id: "",
      file_name: "",
      user_email: "",
      status: "",
    },
    selectedFolder: {
      name: "",
      id: "",
      group: false,
      fileGroup: [],
      type: "",
    },
    userEmail: "",
    keyValues: [],
    lengthCount: 0,
    fileCount: 0,
    deletedFileCount: 0,
    countDate: null,
    file: null,
    progressType: "file",
    cancelTokenSource: null,
    apiRequests: {},
    fileView: 0,
    // ================= new data =======================================

    currentSource: "file",
    showChatMobile: false,
  },

  reducers: {
    setCurrentSource: (state, action) => {
      state.currentSource = action.payload;
    },
    setChatMobile: (state, action) => {
      state.showChatMobile = action.payload;
    },
    //=============================================================================================
    getFileData: (state, action) => {
      const data = action.payload;
      console.log("getFileData", data);
      state.selectedUserFiles?.push(data);
      state.fileValue = data;

      if (!state.selectedFolder) {
        state.selectedFolder = {
          name: "",
          id: "",
          group: false,
          fileGroup: [],
          type: "",
        };
      }
      const { file_id, file_name, type } = data;
      state.selectedFolder.name = file_name;
      state.selectedFolder.id = file_id;
      state.selectedFolder.group = false;
      state.selectedFolder.fileGroup = [];
      state.selectedFolder.type = type;
    },
    getFileName: (state, action) => {
      const data = action.payload.success[0];

      const _id = data?.file_id;
      const _name = data?.file_name;
      const listOffiles = [...state.selectedUserFiles];
      const objectIndex = listOffiles.findIndex((f) => f.file_id == _id);
      if (objectIndex !== -1) {
        console.log("calls");
        state.selectedUserFiles[objectIndex].file_name = _name;
      }
      const { file_id, file_name, type } = data;
      state.selectedFolder.name = file_name;
      state.selectedFolder.id = file_id;
      state.selectedFolder.group = false;
      state.selectedFolder.fileGroup = [];
      state.selectedFolder.type = type;
    },
    insertFolderData: (state, action) => {
      const data = action.payload;
      state.selectedUserFolders?.push(data);
    },
    updateFolderData: (state, action) => {
      const Index = action?.payload?.objectIndex;
      const folder_data = action?.payload?.newObj;
      state.selectedUserFolders[Index] = folder_data;
    },
    getFolderData: (state, action) => {
      console.log("getFolderData", action.payload.success);
      const folderResponse = action.payload?.folderResponse;
      const fileResponse = action.payload?.fileResponse;
      if (folderResponse) {
        state.selectedUserFolders = folderResponse;
      }
      if (fileResponse) {
        state.selectedUserFiles = fileResponse;
      }
    },
    getAssignFolderData: (state, action) => {
      const assingResponse = action.payload;
      state.assignedFiles = assingResponse;
    },
    setFile: (state, action) => {
      state.file = action.payload;
    },
    getFileResopnse: (state, action) => {
      console.log("getFileResopnse", action.payload);
      if (action.payload.success !== null) {
        state.selectedUserFiles = action.payload.success;
      }
    },
    setProgressType: (state, action) => {
      state.progressType = action.payload;
    },
    getdataOnHome: (state, action) => {
      console.log("getdataOnHome", action.payload);
      if (action.payload !== null) {
        const file_data = action?.payload?.file_data;
        const folder_data = action?.payload?.folder_data;
        const assign_data = action?.payload?.assign_data;
        const key_data = action?.payload?.key_data;

        if (file_data) {
          state.selectedUserFiles = file_data;
        }
        if (folder_data) {
          state.selectedUserFolders = folder_data;
        }
        if (assign_data) {
          state.assignedFiles = assign_data;
        }
        if (key_data) {
          state.keyValues = key_data;
        }
      } else {
        console.log("error in it");
      }
    },
    deletekeyReducer: (state, action) => {
      console.log("deletekeyReducer", action.payload);
      state.keyValues = [];
    },
    setFileLength: (state, action) => {
      console.log("setFileLength", action.payload?.success?.[0]?.length);
      const payload = action.payload?.success?.[0]?.length;
      state.lengthCount += payload;
    },
    setCancelTokenSource: (state, action) => {
      console.log("setCancelTokenSource", action.payload);
      state.cancelTokenSource = action.payload;
    },
    setApiRequest: (state, action) => {
      console.log("setApiRequest", action.payload);
      state.apiRequests = state.apiRequests || {};
      const cancelToken001 = action.payload?.cancelToken001;
      state.apiRequests[action.payload?.requestId] = { cancelToken001 };
    },
    setFileView: (state, action) => {
      state.fileView = action.payload;
    },
    setSelectedFolderORFile: (state, action) => {
      if (!state.selectedFolder) {
        state.selectedFolder = {
          name: "",
          id: "",
          group: false,
          fileGroup: [],
          type: "",
        };
      }

      state.selectedFolder.name = action.payload.name;
      state.selectedFolder.id = action.payload.id;
      state.selectedFolder.group = action.payload.group;
      state.selectedFolder.fileGroup = action.payload.fileGroup;
      state.selectedFolder.type = action.payload.type;
    },
    setEmail: (state, action) => {
      state.userEmail = action.payload.success;
    },
  },
});

export const {
  setCurrentSource,
  setChatMobile,
  setEmail,
  setProgressType,
  setApiRequest,
  getdataOnHome,
  setCancelTokenSource,
  updateFolderData,
  deletekeyReducer,
  setLinkToTextLoader,
  getFileName,
  getKeyData,
  setFileView,
  setSelectedFolderORFile,
  getAssignFolderData,
  setusage,
  insertFolderData,
  getFileData,
  logout,
  setFile,
  getFileResopnse,
  getFolderData,
  getDeleteStatus,
  setFileLength,
} = slice.actions;
export default slice.reducer;

export const getUserFiles = createSelector(
  (state) => state.entities.credentials,
  (credentials) => credentials.selectedUserFiles
);

export const getUserFolders = createSelector(
  (state) => state.entities.credentials,
  (credentials) => credentials.selectedUserFolders
);
