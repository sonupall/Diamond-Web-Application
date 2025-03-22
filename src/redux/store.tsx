import { configureStore } from "@reduxjs/toolkit";

import brokerReducer from "../modules/Broker/slice/sliceIndex";
import diamondReducer from "../modules/Diamond/slice/diamondSlice";
import transactionReducer from "../modules/Transaction/slice/transactionSlice"
export const store = configureStore({
    reducer: {
        brokers: brokerReducer,
        diamonds:diamondReducer,
        transaction:transactionReducer
    },
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
