// actions.js
export const SHOW_ALERT = "SHOW_ALERT";
export const HIDE_ALERT = "HIDE_ALERT";
export const SHOW_WIFI_ERROR = "SHOW_WIFI_ERROR";
export const HIDE_WIFI_ERROR = "HIDE_WIFI_ERROR";
export const showAlert = (message, type) => ({
  type: SHOW_ALERT,
  payload: { message, type },
});

export const hideAlert = (index) => ({
  type: HIDE_ALERT,
  payload: { index },
});
export const hideWifiError = (status) => ({
  type: HIDE_WIFI_ERROR,
  payload: status,
});
export const WifiError = (status) => ({
  type: SHOW_WIFI_ERROR,
  payload: status,
});

const initialState = {
  alerts: [],
  showWifiError: false,
};

export default function alert(state = initialState, action) {
  switch (action.type) {
    case SHOW_ALERT:
      console.log("SHOW_ALERT", action.payload);
      return {
        ...state,
        alerts: [...state.alerts, action.payload],
      };
    case HIDE_ALERT:
      return {
        ...state,
        alerts: state.alerts.filter(
          (alert, index) => index !== action.payload.index
        ),
      };
    case SHOW_WIFI_ERROR:
      return {
        ...state,
        showWifiError: true,
      };
    case HIDE_WIFI_ERROR:
      return {
        ...state,
        showWifiError: false,
      };
    default:
      return state;
  }
}
