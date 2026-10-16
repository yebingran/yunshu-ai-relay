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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it } from 'vitest'

import { PublicHeader } from '../public-header'

it('exposes menu state and keeps closed mobile navigation inert', async () => {
  const user = userEvent.setup()
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  client.setQueryData(['status'], {})
  client.setQueryData(['notice'], { success: true, data: '' })
  const route = createRootRoute({
    component: () => (
      <PublicHeader
        showThemeSwitch={false}
        showLanguageSwitcher={false}
        showNotifications={false}
        showAuthButtons={false}
        brand={
          <img
            src='/yunsuguan-logo.png'
            alt='Yunsuguan'
            width={180}
            height={53}
          />
        }
      />
    ),
  })
  const router = createRouter({
    routeTree: route,
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })
  render(
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
  const toggle = await screen.findByRole('button', {
    name: 'Toggle navigation menu',
  })
  const menu = document.querySelector(
    `[id="${toggle.getAttribute('aria-controls')}"]`
  )
  expect(toggle).toHaveAttribute('aria-expanded', 'false')
  expect(menu).toHaveAttribute('inert')
  expect(screen.getByRole('img', { name: 'Yunsuguan' })).toBeVisible()
  toggle.focus()
  await user.keyboard('{Enter}')
  expect(toggle).toHaveAttribute('aria-expanded', 'true')
  expect(menu).not.toHaveAttribute('inert')
  await user.keyboard('{Enter}')
  expect(toggle).toHaveAttribute('aria-expanded', 'false')
  expect(menu).toHaveAttribute('inert')
  client.clear()
})
