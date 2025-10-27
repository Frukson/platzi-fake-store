import { http, HttpResponse } from 'msw'
import { mockProducts } from '../fixtures/products.fixtures'

export const productsHandlers = [
  http.get('https://api.escuelajs.co/api/v1/products', ({ request }) => {
    const url = new URL(request.url)
    const categoryId = url.searchParams.get('categoryId')
    const title = url.searchParams.get('title')
    
    let filteredProducts = [...mockProducts]
    
    // Możesz dodać logikę filtrowania
    if (categoryId && categoryId !== '0') {
      filteredProducts = filteredProducts.filter(
        p => p.category.id === parseInt(categoryId)
      )
    }
    
    if (title) {
      filteredProducts = filteredProducts.filter(
        p => p.title.toLowerCase().includes(title.toLowerCase())
      )
    }
    
    return HttpResponse.json(filteredProducts)
  }),

  http.get('https://api.escuelajs.co/api/v1/products/:id', ({ params }) => {
    const product = mockProducts.find(p => p.id === parseInt(params.id as string))
    
    if (!product) {
      return new HttpResponse(null, { status: 404 })
    }
    
    return HttpResponse.json(product)
  }),

  http.post('https://api.escuelajs.co/api/v1/products', async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({
      id: 999,
      ...body,
      creationAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }),
]