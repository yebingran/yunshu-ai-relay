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
import {
  ArrowDown,
  ArrowRight,
  Braces,
  Check,
  Code2,
  Globe2,
  Layers3,
  Route,
  ShieldCheck,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { CopyButton } from '@/components/copy-button'
import { Button } from '@/components/ui/button'

const providers = [
  'OpenAI',
  'Anthropic',
  'Google Gemini',
  'DeepSeek',
  'Qwen',
  'Azure AI',
]
const capabilities = [
  {
    icon: Route,
    title: 'One endpoint. More possibilities.',
    text: 'Connect your providers through one consistent API. Switch models without rebuilding your application.',
  },
  {
    icon: ShieldCheck,
    title: 'Your access. Your rules.',
    text: 'Keep model access, API keys and team permissions together in your own workspace.',
  },
  {
    icon: Layers3,
    title: 'Every request, in focus.',
    text: 'Understand usage and costs with a unified console built for everyday operations.',
  },
]
const code = `from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://YOUR_DOMAIN/v1"
)

response = client.chat.completions.create(
    model="YOUR_MODEL",
    messages=[
        {"role": "user", "content": "Hello, New API!"}
    ]
)

print(response.choices[0].message.content)`

export function GatewayLanding(props: { isAuthenticated: boolean }) {
  const { t } = useTranslation()
  return (
    <main className='gateway-main'>
      <section className='gateway-hero' aria-labelledby='gateway-title'>
        <div className='gateway-orbit' aria-hidden='true'>
          <div />
          <div />
          <div />
        </div>
        <div className='gateway-container gateway-hero-grid'>
          <div className='gateway-intro'>
            <a
              className='gateway-announcement'
              href='https://github.com/QuantumNous/new-api'
              target='_blank'
              rel='noreferrer'
            >
              <span className='gateway-dot' />
              {t('Open source. Open possibilities.')}
              <ArrowRight size={14} aria-hidden='true' />
            </a>
            <p className='gateway-eyebrow'>
              {t('THE GATEWAY TO INTELLIGENCE')}
            </p>
            <h1 id='gateway-title'>
              {t('All your AI.')}
              <br />
              <span>{t('One beautiful API.')}</span>
            </h1>
            <p className='gateway-description'>
              {t(
                'Bring the world’s AI models into one workspace. Build, connect and create with a gateway that puts you in control.'
              )}
            </p>
            <div className='gateway-actions'>
              <Button
                role='link'
                className='gateway-primary'
                size='lg'
                render={
                  <Link
                    to={props.isAuthenticated ? '/dashboard' : '/sign-up'}
                  />
                }
              >
                {props.isAuthenticated
                  ? t('Go to Dashboard')
                  : t('Start building')}
                <ArrowRight aria-hidden='true' />
              </Button>
              <Button
                role='link'
                className='gateway-secondary'
                variant='outline'
                size='lg'
                render={<Link to='/pricing' />}
              >
                {t('Explore models')}
                <Braces aria-hidden='true' />
              </Button>
            </div>
            <div className='gateway-promises'>
              <span>
                <Check size={14} aria-hidden='true' />
                {t('Self-hosted')}
              </span>
              <span>
                <Check size={14} aria-hidden='true' />
                {t('OpenAI compatible')}
              </span>
              <span>
                <Check size={14} aria-hidden='true' />
                {t('Built for your team')}
              </span>
            </div>
          </div>
          <div
            className='gateway-visual'
            aria-label={t('API routing illustration')}
          >
            <div className='gateway-window'>
              <div className='gateway-window-bar'>
                <div className='gateway-window-dots'>
                  <i />
                  <i />
                  <i />
                </div>
                <span>new-api / gateway</span>
                <span className='gateway-preview-label'>
                  {t('Illustration')}
                </span>
              </div>
              <div className='gateway-window-content'>
                <div className='gateway-request'>
                  <span>
                    <Terminal size={16} aria-hidden='true' />
                    {t('Your next big idea')}
                  </span>
                  <code>POST /v1/chat/completions</code>
                </div>
                <div className='gateway-flow-line' aria-hidden='true' />
                <div className='gateway-hub'>
                  <div className='gateway-hub-icon'>
                    <Zap size={26} fill='currentColor' aria-hidden='true' />
                  </div>
                  <div>
                    <strong>New API</strong>
                    <span>{t('One unified gateway')}</span>
                  </div>
                  <span className='gateway-hub-spark'>✳</span>
                </div>
                <div className='gateway-branches' aria-hidden='true'>
                  <span />
                  <span />
                  <span />
                </div>
                <div className='gateway-model-nodes'>
                  <div>
                    <Sparkles aria-hidden='true' />
                    <strong>OpenAI</strong>
                    <small>Chat / Responses</small>
                  </div>
                  <div>
                    <span className='gateway-claude-mark' aria-hidden='true'>
                      ✳
                    </span>
                    <strong>Anthropic</strong>
                    <small>Messages</small>
                  </div>
                  <div>
                    <Globe2 aria-hidden='true' />
                    <strong>Gemini</strong>
                    <small>Generate Content</small>
                  </div>
                </div>
                <div className='gateway-payload'>
                  <span className='gateway-dot' />
                  <code>{'{ "possibilities": "endless" }'}</code>
                  <Check size={15} aria-hidden='true' />
                </div>
              </div>
            </div>
            <div className='gateway-float'>
              <div>
                <Code2 size={18} aria-hidden='true' />
              </div>
              <span>
                {t('Less integration.')}
                <strong>{t('More creation.')}</strong>
              </span>
              <ArrowRight size={18} aria-hidden='true' />
            </div>
          </div>
        </div>
        <a href='#gateway-models' className='gateway-scroll'>
          {t('Discover what you can build')}
          <ArrowDown size={14} aria-hidden='true' />
        </a>
      </section>
      <section
        id='gateway-models'
        className='gateway-provider-section gateway-container'
        aria-labelledby='providers-heading'
      >
        <p id='providers-heading' className='gateway-eyebrow'>
          {t('ONE CONNECTION. A WORLD OF MODELS.')}
        </p>
        <div className='gateway-providers'>
          {providers.map((provider) => (
            <span key={provider}>{provider}</span>
          ))}
        </div>
        <p className='gateway-provider-note'>
          {t(
            'Connect supported providers with your own authorized upstream access. Model availability depends on your configuration.'
          )}
        </p>
      </section>
      <section
        className='gateway-container gateway-features'
        aria-labelledby='features-heading'
      >
        <div className='gateway-section-heading'>
          <p className='gateway-eyebrow'>{t('BUILT FOR THE WAY YOU BUILD')}</p>
          <h2 id='features-heading'>
            {t('Less complexity.')} <span>{t('More possibility.')}</span>
          </h2>
          <p>{t('A thoughtful foundation for your next AI application.')}</p>
        </div>
        <div className='gateway-feature-grid'>
          {capabilities.map((item, index) => (
            <article className='gateway-feature-card' key={item.title}>
              <span className='gateway-feature-number'>0{index + 1}</span>
              <item.icon size={24} aria-hidden='true' />
              <h3>{t(item.title)}</h3>
              <p>{t(item.text)}</p>
            </article>
          ))}
        </div>
      </section>
      <section
        className='gateway-container gateway-developer'
        aria-labelledby='developer-heading'
      >
        <div>
          <p className='gateway-eyebrow'>
            {t('FAMILIAR CODE. NEW POSSIBILITIES.')}
          </p>
          <h2 id='developer-heading'>
            {t('Your stack.')}
            <br />
            <span>{t('Already connected.')}</span>
          </h2>
          <p>
            {t(
              'Keep the SDK you already know. Set your gateway URL, choose a configured model, and make your first request.'
            )}
          </p>
          <a
            className='gateway-text-link'
            href='https://docs.newapi.ai/'
            target='_blank'
            rel='noreferrer'
          >
            {t('Read the documentation')}
            <ArrowRight size={16} aria-hidden='true' />
          </a>
          <div className='gateway-sdk-tags'>
            <span>Python</span>
            <span>Node.js</span>
            <span>cURL</span>
            <span>OpenAI SDK</span>
          </div>
        </div>
        <div className='gateway-code'>
          <div className='gateway-code-header'>
            <span>
              <span className='gateway-dot' />
              quickstart.py
            </span>
            <CopyButton value={code} aria-label={t('Copy quickstart code')} />
          </div>
          <pre>
            <code>{code}</code>
          </pre>
          <div className='gateway-code-footer'>
            <Terminal size={14} aria-hidden='true' />
            {t('Replace the placeholders with your gateway settings.')}
          </div>
        </div>
      </section>
      <section className='gateway-container gateway-bottom-cta'>
        <Sparkles size={24} aria-hidden='true' />
        <p className='gateway-eyebrow'>{t('YOUR NEXT CHAPTER STARTS HERE')}</p>
        <h2>{t('Make room for your next big idea.')}</h2>
        <p>{t('One gateway between inspiration and what comes next.')}</p>
        <Button
          role='link'
          className='gateway-primary'
          size='lg'
          render={
            <Link to={props.isAuthenticated ? '/dashboard' : '/sign-up'} />
          }
        >
          {t('Start building')}
          <ArrowRight aria-hidden='true' />
        </Button>
      </section>
    </main>
  )
}
