import { CorePageObject } from './CorePage'
import { expect } from 'vitest'

export const ProductCardTestIds = {
  CARD: 'product-card',
  IMAGE: 'product-image',
  IMAGE_LINK: 'product-image-link',
  PRICE: 'product-price',
  CATEGORY_BADGE: 'product-category-badge',
  TITLE: 'product-title',
  DESCRIPTION: 'product-description',
  VIEW_LINK: 'product-view-link',
  EDIT_LINK: 'product-edit-link',
  DELETE_BUTTON: 'product-delete-button',
} as const

export class ProductCardPageObject extends CorePageObject {
  // Getters
  get card() {
    return this.getByTestId(ProductCardTestIds.CARD)
  }

  get image() {
    return this.getByTestId(ProductCardTestIds.IMAGE)
  }

  get price() {
    return this.getByTestId(ProductCardTestIds.PRICE)
  }

  get categoryBadge() {
    return this.getByTestId(ProductCardTestIds.CATEGORY_BADGE)
  }

  get title() {
    return this.getByTestId(ProductCardTestIds.TITLE)
  }

  get description() {
    return this.getByTestId(ProductCardTestIds.DESCRIPTION)
  }

  get viewLink() {
    return this.getByTestId(ProductCardTestIds.VIEW_LINK) as HTMLAnchorElement
  }

  get editLink() {
    return this.getByTestId(ProductCardTestIds.EDIT_LINK) as HTMLAnchorElement
  }

  get deleteButton() {
    return this.getByTestId(ProductCardTestIds.DELETE_BUTTON)
  }

  // Actions
  async clickDelete() {
    await this.click(this.deleteButton)
  }

  // Assertions
  expectProductInfo(product: any) {
    expect(this.title).toHaveTextContent(product.title)
    expect(this.description).toHaveTextContent(product.description)
    expect(this.price).toHaveTextContent(`$${product.price}`)
    expect(this.categoryBadge).toHaveTextContent(product.category.name)
  }

  expectCorrectLinks(productId: number) {
    expect(this.viewLink.href).toContain(`/products/${productId}`)
    expect(this.editLink.href).toContain(`/products/${productId}/edit`)
  }

  expectAllElementsVisible() {
    expect(this.image).toBeInTheDocument()
    expect(this.price).toBeInTheDocument()
    expect(this.categoryBadge).toBeInTheDocument()
    expect(this.title).toBeInTheDocument()
    expect(this.description).toBeInTheDocument()
    expect(this.viewLink).toBeInTheDocument()
    expect(this.editLink).toBeInTheDocument()
    expect(this.deleteButton).toBeInTheDocument()
  }
}
