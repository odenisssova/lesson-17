import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/login-page'
import { faker } from '@faker-js/faker/locale/ar'
import { PASSWORD, USERNAME } from '../../config/env-data'

let authPage: LoginPage

test.beforeEach(async ({ page }) => {
  authPage = new LoginPage(page)
  await authPage.open()
})

test('TL-17-3 signIn button disabled when incorrect data inserted', async ({}) => {
  await authPage.usernameField.fill(faker.lorem.word(2))
  await authPage.passwordField.fill(faker.lorem.word(7))
  await expect(authPage.signInButton).toBeDisabled()
})

test('TL-17-4 error message displayed when incorrect credentials used', async ({}) => {
  await authPage.usernameField.fill(faker.internet.username())
  await authPage.passwordField.fill(faker.internet.password())
  await authPage.signInButton.click();
  await expect(authPage.page.getByText('Incorrect credentials')).toBeVisible();

})

test('TL-17-5 login with correct credentials and verify order creation page', async ({}) => {
  const orderCreationPage = await authPage.signIn(USERNAME, PASSWORD)
  await expect(orderCreationPage.statusButton).toBeVisible()
  await orderCreationPage.checkInnerComponentsVisible()

})

test('TL-17-6 login and create order', async ({}) => {
  const orderCreationPage = await authPage.signIn(USERNAME, PASSWORD)
  await orderCreationPage.nameField.fill('test')
  await orderCreationPage.phoneField.fill('test1234')
  await orderCreationPage.commentField.fill('1231234')
  await orderCreationPage.createOrderButton.click()
  await orderCreationPage.checkCreationPopupVisible(true)
})

test('TL-17-7 logout', async ({}) => {
  const orderCreationPage = await authPage.signIn(USERNAME, PASSWORD)
  await expect(orderCreationPage.logoutButton).toBeVisible()
  await orderCreationPage.logoutButton.click()
  await expect(authPage.signInButton).toBeVisible()
})