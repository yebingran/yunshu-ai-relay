/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import i18next from 'i18next'
import { afterEach, describe, expect, it } from 'vitest'

import zh from '@/i18n/locales/zh.json'

import { GatewayLanding } from '../gateway-landing'

async function renderLanding(isAuthenticated: boolean) {
  const route = createRootRoute({
    component: () => <GatewayLanding isAuthenticated={isAuthenticated} />,
  })
  const router = createRouter({
    routeTree: route,
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })
  render(<RouterProvider router={router} />)
  await screen.findByRole('heading', { level: 1 })
}

afterEach(async () => {
  await i18next.changeLanguage('en')
})

describe('Gateway landing actions', () => {
  it('sends visitors to registration and preserves access to model pricing', async () => {
    await renderLanding(false)
    for (const link of screen.getAllByRole('link', {
      name: /Start building/,
    })) {
      expect(link).toHaveAttribute('href', '/sign-up')
    }
    expect(
      screen.getByRole('link', { name: /Explore models/ })
    ).toHaveAttribute('href', '/pricing')
    expect(
      screen.getByRole('link', { name: /Discover what you can build/ })
    ).toHaveAttribute('href', '#gateway-models')
  })

  it('sends signed-in users directly to the dashboard', async () => {
    await renderLanding(true)
    expect(
      screen.getByRole('link', { name: /Go to Dashboard/ })
    ).toHaveAttribute('href', '/dashboard')
    expect(
      screen.getByRole('link', { name: /Start building/ })
    ).toHaveAttribute('href', '/dashboard')
  })

  it('copies the displayed quickstart using the keyboard', async () => {
    const user = userEvent.setup()
    await renderLanding(false)
    const copy = screen.getByRole('button', { name: 'Copy quickstart code' })
    copy.focus()
    await user.keyboard('{Enter}')
    expect(await navigator.clipboard.readText()).toContain(
      'base_url="https://YOUR_DOMAIN/v1"'
    )
    expect(screen.getByRole('button', { name: 'Copied' })).toBeVisible()
  })

  it('updates visible content and accessible names when switching to Chinese', async () => {
    i18next.addResourceBundle('zh', 'translation', zh.translation, true, true)
    await i18next.changeLanguage('zh')
    await renderLanding(false)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      '万千模型，一站连接。'
    )
    expect(screen.getByRole('button', { name: '复制接入示例' })).toBeVisible()
  })
})
