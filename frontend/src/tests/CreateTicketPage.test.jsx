import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter } from 'react-router-dom'
import ticketsReducer from '../features/tickets/ticketsSlice'
import CreateTicketPage from '../pages/CreateTicketPage'

function renderPage() {
  const store = configureStore({ reducer: { tickets: ticketsReducer } })
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CreateTicketPage />
      </MemoryRouter>
    </Provider>
  )
}

describe('CreateTicketPage', () => {
  it('shows a validation error when title is too short', () => {
    renderPage()
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'ab' } })
    fireEvent.click(screen.getByRole('button', { name: /create ticket/i }))
    expect(screen.getByText(/title lenght must be greater than 3/i)).toBeInTheDocument()
  })
})
