import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../utils/api";

const API_URL = "/tickets/";

export const getAllTickets = createAsyncThunk(
    'tickets/getAllTickets',
    async (_, thunkApi) => {
        try {
            const response = await api.get(API_URL);
           const data = await response.json();
            return data;
        } catch (error) {
            return thunkApi.rejectWithValue(
                error.response?.data?.detail || "Failed to get all tickets"
            );
        }
    }
);

export const getTicketById = createAsyncThunk(
    "tickets/getTicketById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/tickets/${id}`);
            const data = await response.json();
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.detail || err.message);
        }
    }
);

export const createTicket = createAsyncThunk(
    "tickets/createTicket",
    async (ticketData, { rejectWithValue }) => {
        try {
            const response = await api.post(API_URL, ticketData);
            const data = await response.json();
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.detail || "Failed to create ticket");
        }
    }
);

export const updateTicket = createAsyncThunk(
    "tickets/updateTicket",
    async ({ id, ticketData }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/tickets/${id}`, ticketData);
            const data = await response.json();
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.detail || "Failed to update ticket");
        }
    }
);

export const deleteTicket = createAsyncThunk(
    "tickets/deleteTicket",
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/tickets/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.detail || "Failed to delete ticket");
        }
    }
);
const initialState = {
    tickets: [],
    singleTicket: null,
    listStatus: "idle",
    ticketStatus: "idle",
    error: null,
};

const ticketsSlice = createSlice({
    name: "tickets",
    initialState,
    reducers: {
        clearSingleTicket: (state) => {
            state.singleTicket = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(getAllTickets.pending, (state) => {
                state.listStatus = "loading";
            })
            .addCase(getAllTickets.fulfilled, (state, action) => {
                state.listStatus = "succeeded";
                state.tickets = action.payload;
            })
            .addCase(getAllTickets.rejected, (state, action) => {
                state.listStatus = "failed";
                state.error = action.payload;
            })

            .addCase(getTicketById.pending, (state) => {
                state.ticketStatus = "loading";
            })
            .addCase(getTicketById.fulfilled, (state, action) => {
                state.ticketStatus = "succeeded";
                state.singleTicket = action.payload;
            })
            .addCase(getTicketById.rejected, (state, action) => {
                state.ticketStatus = "failed";
                state.error = action.payload;
            })

            .addCase(createTicket.fulfilled, (state, action) => {
                state.tickets.unshift(action.payload);
            })

            .addCase(updateTicket.fulfilled, (state, action) => {
                const index = state.tickets.findIndex(t => t.id === action.payload.id);
                if (index !== -1) {
                    state.tickets[index] = action.payload;
                }
                if (state.singleTicket && state.singleTicket.id === action.payload.id) {
                    state.singleTicket = action.payload;
                }
            })

            .addCase(deleteTicket.fulfilled, (state, action) => {
                state.tickets = state.tickets.filter(t => t.id !== action.payload);
            })
            .addCase(createTicket.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(updateTicket.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(deleteTicket.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const { clearSingleTicket, clearError } = ticketsSlice.actions;

export default ticketsSlice.reducer;