import { setupServer } from 'msw/node'
import { authHandlers } from '../mocks/handlers/auth.handlers'
import { productsHandlers } from '../mocks/handlers/products.handlers'
import { categoriesHandlers } from '../mocks/handlers/categories.handlers'

export const handlers = [
  ...authHandlers,
  ...productsHandlers,
  ...categoriesHandlers,
]

export const server = setupServer(...handlers)