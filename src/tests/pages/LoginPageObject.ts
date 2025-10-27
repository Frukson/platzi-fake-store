import userEvent from "@testing-library/user-event"
import { CorePageObject } from "./CorePage"
import {screen} from '@testing-library/react';

export const LoginPageObjectTexts = {
  WELCOME: 'Welcome Back',
  EMAIL_ERROR: 'Email is required',
  PASSWORD_ERROR: 'Password is required',
} as const


export class LoginPageObject extends CorePageObject {
  private loginUser = userEvent.setup()

  get emailInput() {
    return screen.getByLabelText(/email address/i)
  }

  get passwordInput() {
    return screen.getByLabelText(/password/i)
  }

  get signInButton() {
    return screen.getByRole('button', { name: /sign in/i })
  }

  async submit() {
    await this.loginUser.click(this.signInButton)
  }
}