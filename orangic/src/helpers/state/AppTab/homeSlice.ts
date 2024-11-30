import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import AxiosInstance from '../../AxiosInstance';

export type FoodDisplayType = {
  Id: string;
  Name: string;
  TimeMade: string;
  FeatureItem: number;
  Image: string;
  Point: number;
  TotalReview: number;
  Price: number;
  Discount: number;
  UserFavorite: number;
};

export type RestaurantDisplayType = {
  Id: string;
  Name: string;
  Introduction: string;
  Image: string;
  Point: number;
  TotalReview: number;
  Status: string;
  ownerID: string;
  UserFavorite: number;
};

interface HomeState {
  featureArray: FoodDisplayType[];
  newItemsArray: FoodDisplayType[];
  popularItemsArray: FoodDisplayType[];
  recommendedItemsArray: FoodDisplayType[];
  restaurantsArray: RestaurantDisplayType[];
}

const initialState: HomeState = {
  featureArray: [],
  newItemsArray: [],
  popularItemsArray: [],
  recommendedItemsArray: [],
  restaurantsArray: [],
};

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setFeatureArray: (state, action: PayloadAction<FoodDisplayType[]>) => {
      state.featureArray = action.payload;
    },
    setNewItemsArray: (state, action: PayloadAction<FoodDisplayType[]>) => {
      state.newItemsArray = action.payload;
    },
    setPopularItemsArray: (state, action: PayloadAction<FoodDisplayType[]>) => {
      state.popularItemsArray = action.payload;
    },
    setRecommendedItemsArray: (
      state,
      action: PayloadAction<FoodDisplayType[]>,
    ) => {
      state.recommendedItemsArray = action.payload;
    },
    setRestaurantsArray: (
      state,
      action: PayloadAction<RestaurantDisplayType[]>,
    ) => {
      state.restaurantsArray = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchHomeItem.fulfilled, (state, action: PayloadAction<HomeState>) => {
      console.log(action)
      if(action.payload) {
        state.featureArray = action.payload.featureArray as FoodDisplayType[];
        state.newItemsArray = action.payload.newItemsArray as FoodDisplayType[];
        state.popularItemsArray = action.payload.popularItemsArray as FoodDisplayType[];
        state.restaurantsArray = action.payload.restaurantsArray as RestaurantDisplayType[];
      }
    });
    builder.addCase(fetchHomeItem.rejected, (state, action) => {
      state.featureArray = [];
      state.newItemsArray = [];
      state.popularItemsArray = [];
      state.recommendedItemsArray = [];
    });
  },
});

export const fetchHomeItem = createAsyncThunk(
  'home/fetchHomeItem',
  async (userID: string) => {
    const response = await AxiosInstance().post('/get-home-20-items.php', {
      id: userID,
    });
    console.log('data in redux home', response.data.length);
    return response.data;
  },
);

export const {
  setFeatureArray,
  setNewItemsArray,
  setPopularItemsArray,
  setRecommendedItemsArray,
  setRestaurantsArray,
} = homeSlice.actions;

export const selectFeatureArray = (state: {home: HomeState}) => state.home.featureArray;
export const selectNewItemsArray = (state: {home: HomeState}) => state.home.newItemsArray;
export const selectPopularItemsArray = (state: {home: HomeState}) => state.home.popularItemsArray;
export const selectRecommendedItemsArray = (state: {home: HomeState}) => state.home.recommendedItemsArray;
export const selectRestaurantsArray = (state: {home: HomeState}) => state.home.restaurantsArray;

export default homeSlice.reducer;
