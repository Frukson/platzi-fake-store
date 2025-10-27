import { http, HttpResponse } from 'msw'
import { mockCategories } from '../fixtures/categories.fixutres'


export const categoriesHandlers = [
  http.get('https://api.escuelajs.co/api/v1/categories', () => {
    return HttpResponse.json(mockCategories)
  }),

  http.get('https://api.escuelajs.co/api/v1/categories/:id', ({ params }) => {
    const category = mockCategories.find(c => c.id === parseInt(params.id as string))
    
    if (!category) {
      return new HttpResponse(null, { status: 404 })
    }
    
    return HttpResponse.json(category)
  }),
]