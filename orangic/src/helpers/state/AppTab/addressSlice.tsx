import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import Location from '../../../components/custom/data/location.json';
import AxiosInstance from '../../AxiosInstance';
import { showMessage } from 'react-native-flash-message';

const data = Location.data;

interface AddressState {
  address: string;
  phone: string;
  city: string;
  cityIndex: number;
  cityFocus: boolean;
  cityList: {name: string}[];
  district: string;
  districtIndex: number;
  districtFocus: boolean;
  districtList: {name: string}[];
  ward: string;
  wardFocus: boolean;
  wardList: {name: string}[];
}

const initialState: AddressState = {
  address: '',
  city: '',
  phone: '',
  cityIndex: 0,
  cityFocus: false,
  cityList: data.map((item: {name: string}) => ({name: item.name})),
  district: '',
  districtIndex: 0,
  districtFocus: false,
  districtList: data[0].level2s.map((item: {name: string}) => ({
    name: item.name,
  })),
  ward: '',
  wardFocus: false,
  wardList: data[0].level2s[0].level3s.map((item: {name: string}) => ({
    name: item.name,
  })),
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setAddress: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
    },
    setPhone: (state, action: PayloadAction<string>) => {
      state.phone = action.payload;
    },
    setCity: (state, action: PayloadAction<string>) => {
      state.city = action.payload;
    },
    setCityIndex: (state, action: PayloadAction<number>) => {
      state.cityIndex = action.payload;
    },
    setCityFocus: (state, action: PayloadAction<boolean>) => {
      state.cityFocus = action.payload;
    },
    setCityList: (state, action: PayloadAction<{name: string}[]>) => {
      state.cityList = action.payload;
    },
    setDistrict: (state, action: PayloadAction<string>) => {
      state.district = action.payload;
    },
    setDistrictIndex: (state, action: PayloadAction<number>) => {
      state.districtIndex = action.payload;
    },
    setDistrictFocus: (state, action: PayloadAction<boolean>) => {
      state.districtFocus = action.payload;
    },
    setDistrictList: (state, action: PayloadAction<{name: string}[]>) => {
      state.districtList = action.payload;
    },
    setWard: (state, action: PayloadAction<string>) => {
      state.ward = action.payload;
    },
    setWardFocus: (state, action: PayloadAction<boolean>) => {
      state.wardFocus = action.payload;
    },
    setWardList: (state, action: PayloadAction<{name: string}[]>) => {
      state.wardList = action.payload;
    },
  },extraReducers: (builder) => {
    builder.addCase(createAddress.fulfilled, (state, action) => {
        showMessage({
            message: 'Đã thêm địa chỉ mới',
            type: 'success',

        });
    });
    builder.addCase(createAddress.rejected, (state, action) => {
        showMessage({
            message: 'Đã có lỗi xảy ra',
            type: 'danger',

        });
    });
  
  }
});

export const createAddress = createAsyncThunk(
  'address/createAddress',
  async (data: any) => {
    const response = await AxiosInstance().post(
        '/post-create-address.php',
        data,
      );
    return response;
  },
);

export const {
  setAddress,
  setCity,
  setPhone,
  setCityIndex,
  setCityFocus,
  setCityList,
  setDistrict,
  setDistrictIndex,
  setDistrictFocus,
  setDistrictList,
  setWard,
  setWardFocus,
  setWardList,
} = addressSlice.actions;

export const selectAddress = (state: {address: AddressState}) =>
  state.address.address;
export const selectPhone = (state: {address: AddressState}) =>
  state.address.phone;
export const selectAddressValue = (state: {address: AddressState}) =>
  state.address.address;
export const selectCity = (state: {address: AddressState}) =>
  state.address.city;
export const selectCityIndex = (state: {address: AddressState}) =>
  state.address.cityIndex;
export const selectCityFocus = (state: {address: AddressState}) =>
  state.address.cityFocus;
export const selectCityList = (state: {address: AddressState}) =>
  state.address.cityList;
export const selectDistrict = (state: {address: AddressState}) =>
  state.address.district;
export const selectDistrictIndex = (state: {address: AddressState}) =>
  state.address.districtIndex;
export const selectDistrictFocus = (state: {address: AddressState}) =>
  state.address.districtFocus;
export const selectDistrictList = (state: {address: AddressState}) =>
  state.address.districtList;
export const selectWard = (state: {address: AddressState}) =>
  state.address.ward;
export const selectWardFocus = (state: {address: AddressState}) =>
  state.address.wardFocus;
export const selectWardList = (state: {address: AddressState}) =>
  state.address.wardList;

export default addressSlice.reducer;
