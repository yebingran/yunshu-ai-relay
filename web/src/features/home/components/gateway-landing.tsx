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
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { CopyButton } from '@/components/copy-button'
import { Button } from '@/components/ui/button'

import { ModelDirectory } from './model-directory'
import { YunshuBrand } from './yunshu-brand'

const code = `from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://YOUR_DOMAIN/v1"
)

response = client.chat.completions.create(
    model="YOUR_MODEL",
    messages=[{"role": "user", "content": "Hello!"}]
)

print(response.choices[0].message.content)`

export function GatewayLanding(props: { isAuthenticated: boolean }) {
  const { t } = useTranslation()
  return (
    <>
      <a href='#cloud-main' className='cloud-skip'>
        {t('Skip to main content')}
      </a>
      <main id='cloud-main' tabIndex={-1} className='cloud-main'>
        <section
          className='cloud-hero cloud-container'
          aria-labelledby='cloud-title'
        >
          <div className='cloud-intro'>
            <p className='cloud-affiliation'>
              {t('An AI platform by Yunsuguan')}
            </p>
            <h1 id='cloud-title'>{t('Yunshu AI')}</h1>
            <p className='cloud-tagline'>
              {t('AI that fits')}
              <br />
              {t('the way you work.')}
            </p>
            <p className='cloud-description'>
              {t(
                'Connect models, manage access and understand costs. Yunshu AI brings your AI services into one place, so your team can get on with the work.'
              )}
            </p>
            <div className='cloud-actions'>
              <Button
                role='link'
                className='cloud-primary'
                size='lg'
                render={
                  <Link
                    to={props.isAuthenticated ? '/dashboard' : '/sign-up'}
                  />
                }
              >
                {props.isAuthenticated
                  ? t('Go to Dashboard')
                  : t('Create an account')}
              </Button>
              <Button
                role='link'
                className='cloud-secondary'
                size='lg'
                variant='outline'
                render={<Link to='/pricing' />}
              >
                {t('Explore models')}
              </Button>
            </div>
            <div className='cloud-hero-footnote'>
              <span>API</span>
              <p>{t('Use the OpenAI SDK you already know.')}</p>
            </div>
          </div>
          <ModelDirectory />
        </section>
        <section
          className='cloud-service-band'
          aria-label={t('Platform services')}
        >
          <div className='cloud-container cloud-services'>
            <p>{t('From one model to your whole team.')}</p>
            <ul>
              <li>{t('Model access')}</li>
              <li>{t('Team permissions')}</li>
              <li>{t('Usage and costs')}</li>
            </ul>
          </div>
        </section>
        <section
          className='cloud-container cloud-workspace'
          aria-labelledby='workspace-title'
        >
          <div className='cloud-section-heading'>
            <h2 id='workspace-title'>{t('A place for the everyday work.')}</h2>
            <p>{t('Choose what you need. Manage it in one console.')}</p>
          </div>
          <div className='cloud-workspace-grid'>
            <div className='cloud-workspace-note'>
              <p>{t('For developers and the teams behind them.')}</p>
              <a
                href='https://www.yunsuguan.com/'
                target='_blank'
                rel='noopener noreferrer'
              >
                {t('Visit Yunsuguan')}
              </a>
            </div>
            <dl className='cloud-service-list'>
              <div>
                <dt>{t('Model access')}</dt>
                <dd>
                  {t(
                    'Connect authorized providers and switch between configured models through a consistent interface.'
                  )}
                </dd>
              </div>
              <div>
                <dt>{t('Team permissions')}</dt>
                <dd>
                  {t(
                    'Organize API keys, groups and access permissions around how your team works.'
                  )}
                </dd>
              </div>
              <div>
                <dt>{t('Usage and costs')}</dt>
                <dd>
                  {t(
                    'Review request logs and usage together, with costs that are easier to follow.'
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </section>
        <section
          className='cloud-developer-section'
          aria-labelledby='developer-heading'
        >
          <div className='cloud-container cloud-developer'>
            <div>
              <h2 id='developer-heading'>
                {t('Keep your SDK.')}
                <br />
                {t('Connect your workspace.')}
              </h2>
              <p>
                {t(
                  'Set your gateway URL and API key, choose a configured model, and send your first request.'
                )}
              </p>
              <a
                href='https://docs.newapi.ai/'
                target='_blank'
                rel='noopener noreferrer'
              >
                {t('Read the documentation')}
              </a>
              <p className='cloud-code-note'>
                {t('Replace the placeholders with your gateway settings.')}
              </p>
            </div>
            <div className='cloud-code'>
              <div className='cloud-code-toolbar'>
                <span translate='no'>Python / OpenAI SDK</span>
                <CopyButton
                  value={code}
                  aria-label={t('Copy quickstart code')}
                />
              </div>
              <pre tabIndex={0} aria-label={t('Python quickstart example')}>
                <code translate='no'>{code}</code>
              </pre>
            </div>
          </div>
        </section>
        <section
          className='cloud-container cloud-closing'
          aria-labelledby='closing-heading'
        >
          <div>
            <h2 id='closing-heading'>
              {t('Build your next project with Yunshu AI.')}
            </h2>
            <p>{t('An AI platform by Yunsuguan')}</p>
          </div>
          <Button
            role='link'
            className='cloud-primary'
            size='lg'
            render={
              <Link to={props.isAuthenticated ? '/dashboard' : '/sign-up'} />
            }
          >
            {props.isAuthenticated
              ? t('Go to Dashboard')
              : t('Create an account')}
          </Button>
        </section>
      </main>
      <footer className='cloud-footer'>
        <div className='cloud-container'>
          <div className='cloud-footer-brand'>
            <Link to='/'>
              <YunshuBrand />
            </Link>
            <a href='https://www.yunsuguan.com/' className='cloud-parent-logo'>
              <img
                src='/yunsuguan-logo.png'
                alt={t('Yunsuguan')}
                width={180}
                height={53}
                loading='lazy'
              />
            </a>
            <div className='cloud-footer-links'>
              <Link to='/pricing'>{t('Explore models')}</Link>
              <a href='https://www.yunsuguan.com/'>{t('Visit Yunsuguan')}</a>
            </div>
          </div>
          <p className='cloud-attribution'>
            Frontend design and development by{' '}
            <a
              href='https://github.com/QuantumNous/new-api'
              target='_blank'
              rel='noopener noreferrer'
            >
              New API contributors.
            </a>
          </p>
        </div>
      </footer>
    </>
  )
}
