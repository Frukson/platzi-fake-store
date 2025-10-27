import { http, HttpResponse } from 'msw'
import { mockUserProfile } from '../fixtures/auth.fixtures'

export const authHandlers = [
  http.get('https://api.escuelajs.co/api/v1/auth/profile', () => {
    return HttpResponse.json(mockUserProfile)
  }),

  http.post('https://api.escuelajs.co/api/v1/auth/login', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      access_token: 'mock-token',
      refresh_token: 'mock-refresh-token',
    })
  }),
]