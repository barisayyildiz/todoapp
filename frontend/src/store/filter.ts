import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { FilterType } from "../types";
import { AppState } from ".";

const initialState: FilterType = {
  query: '',
  tags: [],
  selectedTags: []
};

const filter = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setTags: (state, action: PayloadAction<string[]>) => {
      state.tags = action.payload
    },
    setSelectedTags: (state, action: PayloadAction<string[]>) => {
      state.selectedTags = action.payload
    }
  }
});


export const selectFilter = (state: AppState) => state.filter;
export const { setQuery, setTags, setSelectedTags } = filter.actions;
export default filter.reducer;
