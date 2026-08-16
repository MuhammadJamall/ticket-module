import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter } from 'react-router-dom'
import authReducer from '../features/auth/authSlice'
import LoginPage from '../pages/LoginPage'

describe('LoginPage', () => {
  it('displays the auth error message from the store', () => {
    const store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: {
        auth: {
          token: null,
          role: null,
          email: null,
          isAuthenticated: false,
          loading: false,
          error: 'Invalid credentials',
        },
      },
    })

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
  })
})
