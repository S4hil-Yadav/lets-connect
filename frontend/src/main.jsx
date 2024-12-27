// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    {/* <StrictMode> */}
    <PersistGate persistor={persistor}>
      <Provider store={store}>
        <Toaster position="top-right" />
        <App />
      </Provider>
    </PersistGate>
    ,{/* </StrictMode> */},
  </BrowserRouter>,
);
