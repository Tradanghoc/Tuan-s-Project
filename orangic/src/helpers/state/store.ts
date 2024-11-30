import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./Test/counterSlice";
import globalSlice from "./Global/globalSlice";
import homeSlice from "./AppTab/homeSlice";
import storeSlice from "./AppTab/storeSlice";
import addressSlice from "./AppTab/addressSlice";

export const store = configureStore({
    reducer:{
        counter: counterSlice,
        global: globalSlice,
        home: homeSlice,
        store: storeSlice,
        address: addressSlice,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;