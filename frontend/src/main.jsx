import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createTheme, ThemeProvider } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import ScreenLoading from "./components/screenLoading.jsx";
import { persistor, store } from "./store/store.js";
import "react-toastify/dist/ReactToastify.css";
const theme = createTheme({
  palette: {
    primary: {
      main: "#F79320",
    },
  },
});
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={<ScreenLoading />} persistor={persistor}>
      <ToastContainer />
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </PersistGate>
  </Provider>
);
