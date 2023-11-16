import { createSlice } from "@reduxjs/toolkit";
import data from '../data.json';

export const kanbanBoard = createSlice({
    name: 'boards', 
    initialState: data.boards,
    reducers: {

    }
})

export default kanbanBoard.reducer; 