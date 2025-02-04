import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60 * 1000, refetchOnWindowFocus: false },
    mutations: {
      onError: (err) =>
        toast.error(err.response.data.message || "Something went wrong"),
    },
  },
});

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      <PersistGate persistor={persistor}>
        <Provider store={store}>
          <Toaster position="top-center" />
          <App />
        </Provider>
      </PersistGate>
    </QueryClientProvider>
  </BrowserRouter>,
);

// createRoot(document.getElementById("root")).render(<App />);
