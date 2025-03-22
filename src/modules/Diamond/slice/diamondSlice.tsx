import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/diamonds"; // Replace with your actual API URL

interface Diamond {
    id?: number;
    stockNumber: string;
    carat: number;
    shape: string;
    color: string;
    clarity: string;
    rapPrice: number;
    discount: number;
    ppc: number;
    totalAmount: number;
}

interface DiamondState {
    diamonds: Diamond[];
    loading: boolean;
    error: string | null;
}

// **Initial State**
const initialState: DiamondState = {
    diamonds: [],
    loading: false,
    error: null,
};

// **Async Thunks**
export const addDiamondAsync = createAsyncThunk("diamonds/addDiamond", async (diamond: Diamond, { rejectWithValue }) => {
    try {
        const response = await axios.post(API_URL, diamond);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || "Failed to add diamond");
    }
});

export const fetchDiamondsAsync = createAsyncThunk("diamonds/fetchDiamonds", async () => {
    const response = await axios.get(API_URL);
    return response.data;
});

export const updateDiamondAsync = createAsyncThunk("diamonds/updateDiamond", async (diamond: Diamond) => {
    const response = await axios.put(`${API_URL}/${diamond.id}`, diamond);
    return response.data;
});

export const deleteDiamondAsync = createAsyncThunk("diamonds/deleteDiamond", async (id: number) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
});

const diamondSlice = createSlice({
    name: "diamonds",
    initialState,
    reducers: {
        setDiamonds: (state, action: PayloadAction<Diamond[]>) => {
            state.diamonds = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDiamondsAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDiamondsAsync.fulfilled, (state, action: PayloadAction<Diamond[]>) => {
                state.loading = false;
                state.diamonds = action.payload;
            })
            .addCase(fetchDiamondsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(addDiamondAsync.fulfilled, (state, action: PayloadAction<Diamond>) => {
                state.diamonds.push(action.payload);
                state.loading = false;
            })
            .addCase(updateDiamondAsync.fulfilled, (state, action: PayloadAction<Diamond>) => {
                const index = state.diamonds.findIndex((d) => d.id === action.payload.id);
                if (index !== -1) state.diamonds[index] = action.payload;
            })
            .addCase(deleteDiamondAsync.fulfilled, (state, action) => {
                state.diamonds = state.diamonds.filter((d) => d.id !== action.payload);
            });
    },
});

export const { setDiamonds } = diamondSlice.actions;
export default diamondSlice.reducer;
