import { createSlice } from "@reduxjs/toolkit";
import { IOrganization } from "src/constants/types";
import { organizationsMock } from "src/mocks/organizations";

interface SearchState {
    searchedOrganizations: IOrganization[];
}
  
const initialState: SearchState = {
    searchedOrganizations: []
};

export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers:{
        searchOrganization: (state, {payload}) => {
            if (!payload.trim()) {
                state.searchedOrganizations = [];
                return;
              }
            state.searchedOrganizations = organizationsMock.filter(item =>
                item.name.toLowerCase().includes(payload.toLowerCase()))
        }
    }
})

export const { searchOrganization } = searchSlice.actions;