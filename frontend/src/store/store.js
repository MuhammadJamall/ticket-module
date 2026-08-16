import { configureStore } from "@reduxjs/toolkit";
import ticketReducer from "../features/tickets/ticketsSlice";
import authReducer from "../features/auth/authSlice"
const store = configureStore({
    reducer: {
        tickets: ticketReducer,
        auth: authReducer,
    },
});
export default store;
