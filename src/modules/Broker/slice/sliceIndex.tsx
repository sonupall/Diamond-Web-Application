import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/brokers"; // Replace with your actual API URL

interface Broker {
    id?: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    brokerRate: string;
}

interface BrokerState {
    brokers: Broker[];
    loading: boolean;
    error: string | null;
}

// **Initial State**
const initialState: BrokerState = {
    brokers: [],
    loading: false,
    error: null,
};

// **Async Thunk for Adding Broker**
export const addBrokerAsync = createAsyncThunk("brokers/addBroker", async (broker: Broker, { rejectWithValue }) => {
    try {
        const response = await axios.post(API_URL, broker);
        return response.data; // Return new broker data
    } catch (error: any) {
        return rejectWithValue(error.response?.data || "Failed to add broker");
    }
});
export const editBrokerAsync = createAsyncThunk(
    "brokers/editBroker",
    async ({ id, brokerData }) => {
        const response = await axios.put(`${API_URL}/${id}`, brokerData);
        return response.data;
    }
);
export const fetchBrokersAsync = createAsyncThunk("brokers/fetchBrokers", async () => {
    const response = await axios.get(API_URL);
    return response.data;
});
export const updateBrokerAsync = createAsyncThunk("brokers/updateBroker", async (broker) => {
    const response = await axios.put(`${API_URL}/${broker.id}`, broker);
    return response.data;
});
export const deleteBrokerAsync = createAsyncThunk("brokers/deleteBroker", async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
});
const brokerSlice = createSlice({
    name: "brokers",
    initialState,
    reducers: {
        setBrokers: (state, action: PayloadAction<Broker[]>) => {
            state.brokers = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder


            .addCase(fetchBrokersAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBrokersAsync.fulfilled, (state, action: PayloadAction<Broker>) => {
                state.loading = false;
                state.brokers = action.payload; // Add broker to state
            })
            .addCase(fetchBrokersAsync.rejected, (state, action) => {
                state.loading = false;
            })
            .addCase(updateBrokerAsync.fulfilled, (state, action) => {
                const index = state.brokers.findIndex((b) => b.id === action.payload.id);
                if (index !== -1) state.brokers[index] = action.payload;
            })
            .addCase(addBrokerAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addBrokerAsync.fulfilled, (state, action: PayloadAction<Broker>) => {
                state.loading = false;
                state.brokers.push(action.payload); // Add broker to state
            })
            .addCase(addBrokerAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(editBrokerAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(editBrokerAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.brokers = state.brokers.map((broker) =>
                    broker.id === action.payload.id ? action.payload : broker
                );
            })
            .addCase(editBrokerAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            .addCase(deleteBrokerAsync.pending, (state) => {
                    state.loading = true;
                })
            .addCase(deleteBrokerAsync.fulfilled, (state, action) => {
                    state.brokers = state.brokers.filter((b) => b.id !== action.payload);
                state.loading = false;
                })
            .addCase(deleteBrokerAsync.rejected, (state, action) => {
                    state.loading = false;
                });
    },
});

export const { setBrokers } = brokerSlice.actions;
export default brokerSlice.reducer;
