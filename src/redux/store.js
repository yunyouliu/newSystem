import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // 默认使用 localStorage
import collapseReducer from "./collapseSlice";
import userReducer from "./userSlice";
import isloadingReducer from "./loadingSlice";

// 配置 collapseReducer 的持久化
const collapsePersistConfig = {
  key: "collapse", // 储存的 key
  storage, // 使用 localStorage 作为存储引擎
};

const persistedCollapseReducer = persistReducer(
  collapsePersistConfig,
  collapseReducer
);

const store = configureStore({
  reducer: {
    collapse: persistedCollapseReducer, // 使用持久化的 collapseReducer
    user: userReducer,
    isloading: isloadingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 忽略 redux-persist 的一些特殊字段
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        ignoredPaths: ["register"],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };
