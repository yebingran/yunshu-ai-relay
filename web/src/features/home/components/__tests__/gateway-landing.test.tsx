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
      name: /Create an account/,
    })) {
      expect(link).toHaveAttribute('href', '/sign-up')
    }
    expect(
      screen.getAllByRole('link', { name: /Explore models/ })[0]
    ).toHaveAttribute('href', '/pricing')
    expect(
      screen.getByRole('link', { name: 'Skip to main content' })
    ).toHaveAttribute('href', '#cloud-main')
  })

  it('sends signed-in users directly to the dashboard', async () => {
    await renderLanding(true)
    expect(
      screen.getAllByRole('link', { name: /Go to Dashboard/ })[0]
    ).toHaveAttribute('href', '/dashboard')
    for (const link of screen.getAllByRole('link', {
      name: /Go to Dashboard/,
    })) {
      expect(link).toHaveAttribute('href', '/dashboard')
    }
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
      '让 AI 融入你的日常工作。'
    )
    expect(screen.getByRole('button', { name: '复制接入示例' })).toBeVisible()
  })
  it('filters model families with keyboard-accessible tabs and restores the full list', async () => {
    const user = userEvent.setup()
    await renderLanding(false)
    const all = screen.getByRole('tab', { name: 'All models' })
    all.focus()
    await user.keyboard('{ArrowRight}{Enter}')
    expect(screen.getByRole('tab', { name: 'Text' })).toHaveAttribute(
      'aria-selected',
      'true'
    )
    expect(
      screen.queryByRole('heading', { name: /GPT OpenAI/ })
    ).not.toBeInTheDocument()
    expect(
      await screen.findByRole('heading', { name: /DeepSeek/ })
    ).toBeVisible()
    await user.keyboard('{ArrowRight}{Enter}')
    expect(screen.getByRole('tab', { name: 'Multimodal' })).toHaveAttribute(
      'aria-selected',
      'true'
    )
    expect(
      await screen.findByRole('heading', { name: /GPT OpenAI/ })
    ).toBeVisible()
    expect(
      screen.queryByRole('heading', { name: /DeepSeek/ })
    ).not.toBeInTheDocument()
    await user.click(all)
    expect(
      await screen.findByRole('heading', { name: /GPT OpenAI/ })
    ).toBeVisible()
    expect(
      await screen.findByRole('heading', { name: /DeepSeek/ })
    ).toBeVisible()
  })

  it('uses Yunsuguan branding and confines the required upstream attribution to the footer', async () => {
    await renderLanding(false)
    expect(screen.getAllByText('An AI platform by Yunsuguan')).toHaveLength(3)
    expect(screen.getByRole('main')).not.toHaveTextContent(/New API/i)
    expect(screen.getByRole('contentinfo')).toHaveTextContent(
      'Frontend design and development by New API contributors.'
    )
    expect(screen.getByRole('img', { name: 'Yunsuguan' })).toHaveAttribute(
      'src',
      '/yunsuguan-logo.png'
    )
  })
})
