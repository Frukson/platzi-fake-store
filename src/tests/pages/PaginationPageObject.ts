import { CorePageObject } from './CorePage'
import { expect } from 'vitest'

export const PaginationTestIds = {
  PAGINATION: 'pagination',
  PREVIOUS_BUTTON: 'pagination-previous-button',
  NEXT_BUTTON: 'pagination-next-button',
  PAGE_INFO: 'pagination-page-info',
} as const

export const PaginationTexts = {
  PREVIOUS: '← Previous',
  NEXT: 'Next →',
  PAGE_INFO: (page: number) => `Page ${page}`,
} as const

export class PaginationPageObject extends CorePageObject {
  // Getters
  get paginationContainer() {
    return this.getByTestId(PaginationTestIds.PAGINATION)
  }

  get previousButton() {
    return this.getByTestId(PaginationTestIds.PREVIOUS_BUTTON)
  }

  get nextButton() {
    return this.getByTestId(PaginationTestIds.NEXT_BUTTON)
  }

  get pageInfo() {
    return this.getByTestId(PaginationTestIds.PAGE_INFO)
  }

  // Actions
  async clickPrevious() {
    await this.click(this.previousButton)
  }

  async clickNext() {
    await this.click(this.nextButton)
  }

  // Assertions
  expectPaginationVisible() {
    this.expectElementByTestId(PaginationTestIds.PAGINATION)
  }

  expectCurrentPage(page: number) {
    expect(this.pageInfo).toHaveTextContent(PaginationTexts.PAGE_INFO(page))
  }

  expectPreviousButtonDisabled() {
    expect(this.previousButton).toBeDisabled()
  }

  expectPreviousButtonEnabled() {
    expect(this.previousButton).not.toBeDisabled()
  }

  expectNextButtonDisabled() {
    expect(this.nextButton).toBeDisabled()
  }

  expectNextButtonEnabled() {
    expect(this.nextButton).not.toBeDisabled()
  }

  expectBothButtonsEnabled() {
    this.expectPreviousButtonEnabled()
    this.expectNextButtonEnabled()
  }
}
