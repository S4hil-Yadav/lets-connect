import { combineReducers, configureStore } from "@reduxjs/toolkit";
import draftReducer from "./draft/draftSlice";
import themeReducer from "./theme/themeSlice";
import { persistReducer, persistStore } from "redux-persist";
import localforage from "localforage";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  blacklist: ["draft"],
};

const draftConfig = {
  key: "draft",
  storage: localforage,
  blacklist: ["posting"],
};

const rootReducer = combineReducers({
  theme: themeReducer,
  draft: persistReducer(draftConfig, draftReducer),
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
