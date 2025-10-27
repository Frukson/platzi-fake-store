import { screen, within } from '@testing-library/react'
import { CorePageObject } from './CorePage'
import { expect } from 'vitest'

export const ProductsPageTestIds = {
  // Buttons
  CREATE_PRODUCT_BUTTON: 'create-product-button',
  
  // Filters
  FILTER_SEARCH_INPUT: 'filter-search-input',
  FILTER_CATEGORY_SELECT: 'filter-category-select',
  FILTER_MIN_PRICE_INPUT: 'filter-min-price-input',
  FILTER_MAX_PRICE_INPUT: 'filter-max-price-input',
  FILTER_SORT_BY_SELECT: 'filter-sort-by-select',
  FILTER_RESET_BUTTON: 'filter-reset-button',
  
  // Products
  PRODUCT_CARD: 'product-card',
  PRODUCT_IMAGE: 'product-image',
  PRODUCT_PRICE: 'product-price',
  PRODUCT_CATEGORY_BADGE: 'product-category-badge',
  PRODUCT_TITLE: 'product-title',
  PRODUCT_VIEW_LINK: 'product-view-link',
  PRODUCT_EDIT_LINK: 'product-edit-link',
  PRODUCT_DELETE_BUTTON: 'product-delete-button',
  
  // Pagination
  PAGINATION: 'pagination',
  PAGINATION_PREVIOUS_BUTTON: 'pagination-previous-button',
  PAGINATION_PAGE_INFO: 'pagination-page-info',
  PAGINATION_NEXT_BUTTON: 'pagination-next-button',
  
  // Modal
  DELETE_PRODUCT_MODAL: 'delete-product-modal',
} as const

const cardElements = [
    'PRODUCT_IMAGE',
    'PRODUCT_PRICE',
    'PRODUCT_CATEGORY_BADGE',
    'PRODUCT_TITLE',
    'PRODUCT_VIEW_LINK',
    'PRODUCT_EDIT_LINK',
    'PRODUCT_DELETE_BUTTON',
] as const

export const DeleteModalTexts = {
  DELETE_PRODUCT: 'Delete Product',
  DELETE_CONFIRMATION: (productName: string) => 
    `Are you sure you want to delete "${productName}"?`,
  DELETE_WARNING: 'This action cannot be undone',
} as const

export type ProductsPageElement = keyof typeof ProductsPageTestIds

export class ProductsPageObject extends CorePageObject {
  getElement(elementName: ProductsPageElement) {
    return this.getByTestId(ProductsPageTestIds[elementName])
  }

  getAllElements(elementName: ProductsPageElement) {
    return this.getAllByTestId(ProductsPageTestIds[elementName])
  }

  queryElement(elementName: ProductsPageElement) {
    return this.queryByTestId(ProductsPageTestIds[elementName])
  }

  // Specific getters for commonly used elements
  get createProductButton() {
    return this.getElement('CREATE_PRODUCT_BUTTON')
  }

  get categorySelect() {
    return this.getElement('FILTER_CATEGORY_SELECT') as HTMLSelectElement
  }

  get resetButton() {
    return this.getElement('FILTER_RESET_BUTTON')
  }

  get deleteModal() {
    return this.getElement('DELETE_PRODUCT_MODAL')
  }

  get productCards() {
    return this.getAllElements('PRODUCT_CARD')
  }

  // Actions
  async selectCategory(categoryId: string) {
    await this.selectOption(this.categorySelect, categoryId)
  }

  async clickResetFilters() {
    await this.click(this.resetButton)
  }

  async clickDeleteOnProduct(productIndex: number = 0) {
    const cards = this.productCards
    const card = cards[productIndex]
    const deleteButton = within(card).getByTestId(
      ProductsPageTestIds.PRODUCT_DELETE_BUTTON
    )
    await this.click(deleteButton)
  }

  getProductTitle(productIndex: number = 0): string | null {
    const cards = this.productCards
    const card = cards[productIndex]
    return within(card).getByTestId(ProductsPageTestIds.PRODUCT_TITLE).textContent
  }

  // Assertions
  expectPageElementsVisible() {
    this.expectElementByTestId(ProductsPageTestIds.CREATE_PRODUCT_BUTTON)
    this.expectElementByTestId(ProductsPageTestIds.FILTER_SEARCH_INPUT)
    this.expectElementByTestId(ProductsPageTestIds.FILTER_CATEGORY_SELECT)
    this.expectElementByTestId(ProductsPageTestIds.FILTER_MIN_PRICE_INPUT)
    this.expectElementByTestId(ProductsPageTestIds.FILTER_MAX_PRICE_INPUT)
    this.expectElementByTestId(ProductsPageTestIds.FILTER_SORT_BY_SELECT)
    this.expectElementByTestId(ProductsPageTestIds.FILTER_RESET_BUTTON)
  }

  expectProductCardStructure(cardIndex: number = 0) {
    const card = this.productCards[cardIndex]

    cardElements.forEach((elementName) => {
      expect(
        within(card).getByTestId(ProductsPageTestIds[elementName])
      ).toBeInTheDocument()
    })
  }

  expectPaginationVisible() {
    this.expectElementByTestId(ProductsPageTestIds.PAGINATION)
    this.expectElementByTestId(ProductsPageTestIds.PAGINATION_PREVIOUS_BUTTON)
    this.expectElementByTestId(ProductsPageTestIds.PAGINATION_PAGE_INFO)
    this.expectElementByTestId(ProductsPageTestIds.PAGINATION_NEXT_BUTTON)
  }

  expectDeleteModalNotVisible() {
    this.expectElementNotInDocument(ProductsPageTestIds.DELETE_PRODUCT_MODAL)
  }

  expectDeleteModalVisible() {
    this.expectElementByTestId(ProductsPageTestIds.DELETE_PRODUCT_MODAL)
  }

  expectDeleteModalContainsProductName(productName: string) {
    const modal = this.deleteModal
    expect(modal).toHaveTextContent(DeleteModalTexts.DELETE_PRODUCT)
    expect(modal).toHaveTextContent(
      DeleteModalTexts.DELETE_CONFIRMATION(productName)
    )
    expect(modal).toHaveTextContent(DeleteModalTexts.DELETE_WARNING)
  }

  expectCategoryValue(value: string) {
    expect(this.categorySelect.value).toBe(value)
  }

  async waitForProducts() {
    await this.waitFor(() => {
      const cards = this.getAllByTestId(ProductsPageTestIds.PRODUCT_CARD)
      expect(cards.length).toBeGreaterThan(0)
    })
  }

  async waitForCategoryOption(optionName: string) {
    await screen.findByRole('option', { name: optionName })
  }
}
