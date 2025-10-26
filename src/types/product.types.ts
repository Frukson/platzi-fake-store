export interface Product {
  id: number
  title: string
  price: number
  description: string
  images: string[]
  category: Category
  creationAt: string
  updatedAt: string
}

export interface Category {
  id: number
  name: string
  image: string
  creationAt: string
  updatedAt: string
}

// Query params dla filtrowania i paginacji
export interface ProductsQueryParams {
  title?: string
  price?: number
  price_min?: number
  price_max?: number
  categoryId?: number
  offset?: number
  limit?: number
}

// Create/Update product types
export interface CreateProductRequest {
  title: string
  price: number
  description: string
  categoryId: number
  images: string[]
}

export interface UpdateProductRequest {
  title?: string
  price?: number
  description?: string
  categoryId?: number
  images?: string[]
}