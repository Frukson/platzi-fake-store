import { expect } from 'vitest'
import { screen, within, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

export class CorePageObject {
  protected user = userEvent.setup()

  async fillInput(element: HTMLElement, value: string) {
    await this.user.clear(element)
    await this.user.type(element, value)
  }

  async click(element: HTMLElement) {
    await this.user.click(element)
  }

  async selectOption(element: HTMLElement, value: string) {
    await this.user.selectOptions(element, value)
  }

  async expectTextVisible(text: string | RegExp) {
    return await screen.findByText(text)
  }

  expectTextNotVisible(text: string | RegExp) {
    expect(screen.queryByText(text)).not.toBeInTheDocument()
  }

  expectTextInDocument(text: string | RegExp) {
    expect(screen.getByText(text)).toBeInTheDocument()
  }

  expectElementByTestId(testId: string) {
    expect(screen.getByTestId(testId)).toBeInTheDocument()
  }

  expectElementNotInDocument(testId: string) {
    expect(screen.queryByTestId(testId)).not.toBeInTheDocument()
  }

  getByTestId(testId: string) {
    return screen.getByTestId(testId)
  }

  getAllByTestId(testId: string) {
    return screen.getAllByTestId(testId)
  }

  queryByTestId(testId: string) {
    return screen.queryByTestId(testId)
  }

  async waitForElement(testId: string) {
    return await waitFor(() => {
      expect(screen.getByTestId(testId)).toBeInTheDocument()
    })
  }

  async waitFor(callback: () => void) {
    return await waitFor(callback)
  }

  withinElement(element: HTMLElement) {
    return within(element)
  }
}
