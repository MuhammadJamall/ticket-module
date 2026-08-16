import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ticketsReducer from '../features/tickets/ticketsSlice'
import authReducer from '../features/auth/authSlice'
import TicketDetailPage from '../pages/TicketDetailPage'

vi.mock('../features/tickets/ticketsSlice', async () => {
  const actual = await vi.importActual('../features/tickets/ticketsSlice')
  return { ...actual, getTicketById: () => ({ type: 'tickets/getTicketById/mock' }) }
})

describe('TicketDetailPage', () => {
  it('shows a failure message when ticketStatus is failed', () => {
    const store = configureStore({
      reducer: { tickets: ticketsReducer, auth: authReducer },
      preloadedState: {
        tickets: {
          tickets: [],
          singleTicket: null,
          listStatus: 'idle',
          ticketStatus: 'failed',
          error: 'err',
        },
        auth: {
          token: 't',
          role: 'admin',
          email: 'a@a.com',
          isAuthenticated: true,
          loading: false,
          error: null,
        },
      },
    })

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/tickets/1']}>
          <Routes>
            <Route path="/tickets/:id" element={<TicketDetailPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByText(/failed to load ticket/i)).toBeInTheDocument()
  })
})
