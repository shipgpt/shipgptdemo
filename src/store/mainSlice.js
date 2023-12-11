import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "mainSlice",
  initialState: {
    sidebar: false,
    darkMode: false,
    priceModal: {
      message: "",
      heading: "",
      status: false,
    },
    alertModal: false,
    messageState: {
      messages: [
        {
          message: "Hi, what would you like to learn about your document?",
          type: "apiMessage",
          _id: "",
        },
      ],
      history: [],
      pendingSourceDocs: [],
      pending: "",
      responseMessage: "",
      question: "",
    },
    selectedPayment: {
      duration: "",
      amount: "",
      discountPrice: "",
    },
    stopChat: null,
  },

  reducers: {
    toggleSidebar: (state) => {
      state.sidebar = !state.sidebar;
    },
    setMode: (state, action) => {
      state.darkMode = action.payload;
    },

    setAlertModal: (state, action) => {
      state.alertModal = action.payload;
    },

    addUserMessage: (state, action) => {
      const { question, _id } = action.payload;
      state.messageState.messages.push({
        type: "userMessage",
        message: question,
        _id: _id,
      });

      state.messageState.question = question;
      state.messageState.pending = undefined;
    },

    clearPending: (state) => {
      state.messageState.pending = "";
    },

    addApiMessage: (state, action) => {
      state.messageState.history.push([
        state.messageState.question,
        state.messageState.pending ?? "",
      ]);

      state.messageState.messages.push({
        type: "apiMessage",
        message: state.messageState.pending ?? "",
        sourceDocs: state.messageState.pendingSourceDocs,
        _id: action?.store?.entities?.credentials?.selectedFolder?.id,
      });
      state.messageState.pending = undefined;
      state.messageState.pendingSourceDocs = undefined;
    },

    addSourceDocs: (state, action) => {
      const data = action.payload;
      console.log("addSourceDocs", data);
      state.messageState.pendingSourceDocs = data.sourceDocs;
    },

    addPendingData: (state, action) => {
      const data = action.payload;

      console.log("addPendingData", data.data);

      state.messageState.pending =
        (state.messageState.pending ?? "") + data.data;
      console.log(
        "state.messageState.responseMessage",
        state.messageState.pending
      );
      state.messageState.responseMessage =
        (state.messageState.pending ?? "") + data.data;
    },

    clearHistory: (state, action) => {
      state.messageState.history = [];
      state.messageState.messages = [
        {
          message: "Hi, what would you like to learn about your document?",
          type: "apiMessage",
          _id: "",
        },
      ];
    },
    getHistory: (state, action) => {
      const Messages = action.payload?.success;
      console.log("getHistory", Messages);
      state.messageState.messages = Messages;
    },
    setStopChat: (state, action) => {
      state.stopChat = action?.payload;
    },
  },
});

export const {
  toggleSidebar,
  addUserMessage,
  setAlertModal,
  clearPending,
  addApiMessage,
  addSourceDocs,
  addPendingData,
  clearHistory,
  getHistory,
  setMode,
  setStopChat,
} = slice.actions;

export default slice.reducer;

export const saveHistory = createAsyncThunk(
  "mainSlice/saveHistory",
  async (data, { getState }) => {
    try {
      const _id = getState().entities?.credentials?.selectedFolder?.id;
      const question = getState().entities?.mainSlice?.messageState?.question;
      const response =
        getState().entities?.mainSlice?.messageState?.responseMessage;

      let machine_id = await localStorage.getItem(
        `${window.location.hostname}_machine_id`
      );
      let chatData =
        (await JSON.parse(localStorage.getItem(`chat_${machine_id}`))) || [];

      const newObj = { question, _id, response, machine_id };
      chatData.push(newObj);
      localStorage.setItem(`chat_${machine_id}`, JSON.stringify(chatData));
    } catch (error) {
      console.log(error);
    }
  }
);
