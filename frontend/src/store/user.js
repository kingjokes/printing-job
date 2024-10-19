import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import _ from 'lodash'
import { fetchPricing, fetchPrintJobs } from "../services/user-service";


export const getJobs = createAsyncThunk(
  "admin/getJobs",
  async () => {
    try {
      return await fetchPrintJobs().then((response) => response.data);
    } catch (e) {
      return e?.response;
    }
  }
);

export const getPricing = createAsyncThunk(
  "admin/getPricing",
  async () => {
    try {
      return await fetchPricing().then((response) => response.data);
    } catch (e) {
      return e?.response;
    }
  }
);


const UserStore = createSlice({
  name: "userStore",
  initialState: {
    pricing: '',
    jobs: '',
    user: '',

  },
  reducers: {
    updatePricing: (state, actions) => {
      state.fee = actions.payload
    }


  },
  extraReducers: (builder) => {
    builder.addCase(getJobs.fulfilled, (state, action) => {
      if (action.payload.status) state.jobs = action.payload.data;
    });

    builder.addCase(getPricing.fulfilled, (state, action) => {
      if (action.payload.status) state.pricing = action.payload.details;
    });



  },
});

const { reducer } = UserStore;

export const {
  updatePricing

} = UserStore.actions;

export default reducer;