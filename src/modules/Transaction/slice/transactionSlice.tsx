import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const BROKER_API_URL = "http://localhost:5000/brokers";
const DIAMOND_API_URL = "http://localhost:5000/diamonds";
const PURCHASE_API_URL = "http://localhost:5000/purchase";

// Broker Interface
interface Broker {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    brokerRate: number;
}

// Diamond Interface
interface Diamond {
    id: number;
    stockNo: string;
    carat: number;
    shape: string;
    color: string;
    clarity: string;
    rapPrice: number;
    discount: number;
    ppc: number;
    totalAmount: number;
}

// Initial State
interface TransactionState {
    brokers: Broker[];
    diamonds: Diamond[];
    selectedDiamonds: Diamond[];
    loading: boolean;
    error: string | null;
}

const initialState: TransactionState = {
    brokers: [],
    diamonds: [],
    selectedDiamonds: [],
    loading: false,
    error: null,
};

// Fetch brokers
export const fetchBrokersAsync = createAsyncThunk("transaction/fetchBrokers", async () => {
    const response = await axios.get(BROKER_API_URL);
    return response.data;
});

// Fetch diamonds
export const fetchDiamondsAsync = createAsyncThunk("transaction/fetchDiamonds", async () => {
    const response = await axios.get(DIAMOND_API_URL);
    return response.data;
});

// Purchase selected diamonds
export const purchaseDiamondsAsync = createAsyncThunk(
    "transaction/purchaseDiamonds",
    async (selectedDiamonds: Diamond[], { rejectWithValue }) => {
        try {
            const response = await axios.post(PURCHASE_API_URL, { diamonds: selectedDiamonds });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to process purchase");
        }
    }
);

const transactionSlice = createSlice({
    name: "transaction",
    initialState,
    reducers: {
        setSelectedDiamonds: (state, action: PayloadAction<Diamond[]>) => {
            state.selectedDiamonds = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBrokersAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBrokersAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.brokers = action.payload;
            })
            .addCase(fetchBrokersAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchDiamondsAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDiamondsAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.diamonds = action.payload;
            })
            .addCase(fetchDiamondsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(purchaseDiamondsAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(purchaseDiamondsAsync.fulfilled, (state) => {
                state.loading = false;
                state.selectedDiamonds = [];
            })
            .addCase(purchaseDiamondsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setSelectedDiamonds } = transactionSlice.actions;
export default transactionSlice.reducer;
