import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import { ResponseAPI } from '../Global/globalSlice';
import AxiosInstance from '../../AxiosInstance';

interface StoreState {
    restaurantID: string;

}

const initialState: StoreState = {
    restaurantID: '',
}

const storeSlice = createSlice({
    name: 'store',
    initialState,
    reducers: {
        setRestaurantID: (state, action) => {
            state.restaurantID = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchRestaurantID.fulfilled, (state, action) => {
            state.restaurantID = action.payload;
        });
        builder.addCase(fetchRestaurantID.rejected, (state, action) => {
            state.restaurantID = '';
        });
    
    }
})

export const fetchRestaurantID = createAsyncThunk('store/fetchRestaurantID',
    async (id: string) => {
        const response = await AxiosInstance().post('get-user-restaurant.php',{id});
        return response.data.Id;
    });

export const {setRestaurantID} = storeSlice.actions;
export const selectRestaurantID = (state: {store: StoreState}) => state.store.restaurantID;
export default storeSlice.reducer;