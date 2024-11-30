import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { fetchRestaurantID } from "../AppTab/storeSlice";
import { set } from "mongoose";

export interface GlobalState {
    login: boolean;
    userID: string;
    loading: boolean;
    host: string;
    name: string;
    point: number;
    image: string;
}

export interface ResponseAPI {
    status: string;
    message: string;
    data: any;
}

const initialState: GlobalState = {
    login: false,
    userID: "",
    loading: false,
    host: "http://",
    name: "",
    point: 0,
    image: "",
};

const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        isLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        isLogin: (state, action: PayloadAction<boolean>) => {
            state.login = action.payload;
        },
        setUserID: (state, action: PayloadAction<string>) => {
            state.userID = action.payload;
        },
        setHost: (state, action: PayloadAction<string>) => {
            state.host = action.payload;
        },
        setPoint: (state, action: PayloadAction<number>) => {
            state.point = action.payload;
        },
        setName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        },
        setImage: (state, action: PayloadAction<string>) => {
            state.image = action.payload;
        }
    },
});

export const { isLoading, isLogin, setUserID, setHost, setName, setPoint, setImage } = globalSlice.actions;
export const selectIsLogin = (state: { global: GlobalState }) => state.global.login;
export const selectName = (state: { global: GlobalState }) => state.global.name;
export const selectPoint = (state: { global: GlobalState }) => state.global.point;
export const selectLoading = (state: { global: GlobalState }) => state.global.loading;
export const selectUserID = (state: { global: GlobalState }) => state.global.userID;
export const selectHost = (state: { global: GlobalState }) => state.global.host;
export const selectImage = (state: { global: GlobalState }) => state.global.image;

export default globalSlice.reducer;