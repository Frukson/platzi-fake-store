import { beforeAll, afterEach, afterAll } from 'vitest'
import { server } from './msw-server'
import '@testing-library/jest-dom'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

afterEach(() => server.resetHandlers())

afterAll(() => server.close())