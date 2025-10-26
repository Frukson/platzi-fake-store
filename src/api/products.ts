import apiClient from '@/lib/axios'
import type {
  Product,
  ProductsQueryParams,
  CreateProductRequest,
  UpdateProductRequest,
  Category,
} from '@/types/product.types'

const PRODUCTS_ENDPOINTS = {
  PRODUCTS: '/products',
  PRODUCT: (id: number) => `/products/${id}`,
  CATEGORIES: '/categories',
}

// GET all products with filters
export const getProducts = async (
  params?: ProductsQueryParams
): Promise<Product[]> => {
  const { data } = await apiClient.get<Product[]>(
    PRODUCTS_ENDPOINTS.PRODUCTS,
    { params }
  )
  return data
}

// GET single product
export const getProduct = async (id: number): Promise<Product> => {
  const { data } = await apiClient.get<Product>(
    PRODUCTS_ENDPOINTS.PRODUCT(id)
  )
  return data
}

// CREATE product
export const createProduct = async (
  product: CreateProductRequest
): Promise<Product> => {
  const { data } = await apiClient.post<Product>(
    PRODUCTS_ENDPOINTS.PRODUCTS,
    product
  )
  return data
}

// UPDATE product
export const updateProduct = async (
  id: number,
  product: UpdateProductRequest
): Promise<Product> => {
  const { data } = await apiClient.put<Product>(
    PRODUCTS_ENDPOINTS.PRODUCT(id),
    product
  )
  return data
}

// DELETE product
export const deleteProduct = async (id: number): Promise<boolean> => {
  const { data } = await apiClient.delete<boolean>(
    PRODUCTS_ENDPOINTS.PRODUCT(id)
  )
  return data
}

// GET all categories (dla filtrów)
export const getCategories = async (): Promise<Category[]> => {
  const { data } = await apiClient.get<Category[]>(
    PRODUCTS_ENDPOINTS.CATEGORIES
  )
  return data
}
