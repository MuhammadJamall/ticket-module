import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter } from 'react-router-dom'
import ticketsReducer from '../features/tickets/ticketsSlice'
import authReducer from '../features/auth/authSlice'
import TicketListPage from '../pages/TicketListPage'

vi.mock('../features/tickets/ticketsSlice', async () => {
  const actual = await vi.importActual('../features/tickets/ticketsSlice')
  return { ...actual, getAllTickets: () => ({ type: 'tickets/getAllTickets/mock' }) }
})

function renderWithStore(preloadedTickets) {
  const store = configureStore({
    reducer: { tickets: ticketsReducer, auth: authReducer },
    preloadedState: {
      tickets: {
        tickets: preloadedTickets,
        singleTicket: null,
        listStatus: 'succeeded',
        ticketStatus: 'idle',
        error: null,
      },
      auth: {
        token: 't',
        role: 'user',
        email: 'a@a.com',
        isAuthenticated: true,
        loading: false,
        error: null,
      },
    },
  })

  render(
    <Provider store={store}>
      <MemoryRouter>
        <TicketListPage />
      </MemoryRouter>
    </Provider>
  )
}

describe('TicketListPage', () => {
  const tickets = [
    { id: 1, title: 'Fix login bug', status: 'open' },
    { id: 2, title: 'Update docs', status: 'closed' },
  ]

  it('renders ticket titles from the store', () => {
    renderWithStore(tickets)
    expect(screen.getByText('Fix login bug')).toBeInTheDocument()
    expect(screen.getByText('Update docs')).toBeInTheDocument()
  })

  it('filters tickets by status when the dropdown changes', () => {
    renderWithStore(tickets)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'open' } })
    expect(screen.getByText('Fix login bug')).toBeInTheDocument()
    expect(screen.queryByText('Update docs')).not.toBeInTheDocument()
  })
})
