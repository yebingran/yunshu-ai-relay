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
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const categories = [
  { value: 'all', label: 'All models' },
  { value: 'text', label: 'Text' },
  { value: 'multimodal', label: 'Multimodal' },
] as const
const providers = [
  {
    name: 'GPT',
    vendor: 'OpenAI',
    mark: 'O',
    tone: 'openai',
    type: 'multimodal',
    task: 'Writing, code and visual understanding',
  },
  {
    name: 'Claude',
    vendor: 'Anthropic',
    mark: 'A',
    tone: 'anthropic',
    type: 'multimodal',
    task: 'Documents, reasoning and code',
  },
  {
    name: 'Gemini',
    vendor: 'Google',
    mark: 'G',
    tone: 'google',
    type: 'multimodal',
    task: 'Text, images and multimodal tasks',
  },
  {
    name: 'DeepSeek',
    vendor: 'DeepSeek',
    mark: 'D',
    tone: 'deepseek',
    type: 'text',
    task: 'Reasoning and text generation',
  },
  {
    name: 'Qwen',
    vendor: 'Alibaba',
    mark: 'Q',
    tone: 'qwen',
    type: 'text',
    task: 'Language and coding tasks',
  },
]

export function ModelDirectory() {
  const { t } = useTranslation()
  const [category, setCategory] = useState('all')
  return (
    <section
      id='gateway-models'
      className='cloud-directory'
      aria-labelledby='directory-title'
    >
      <div className='cloud-directory-heading'>
        <div>
          <span className='cloud-directory-symbol' aria-hidden='true'>
            云
          </span>
          <h2 id='directory-title'>{t('Find your model')}</h2>
        </div>
        <span className='cloud-directory-label'>AI</span>
      </div>
      <Tabs
        value={category}
        onValueChange={(value) => setCategory(String(value))}
      >
        <TabsList
          variant='line'
          className='cloud-model-tabs'
          aria-label={t('Model categories')}
        >
          {categories.map((item) => (
            <TabsTrigger key={item.value} value={item.value}>
              {t(item.label)}
            </TabsTrigger>
          ))}
        </TabsList>
        {categories.map((item) => (
          <TabsContent
            key={item.value}
            value={item.value}
            className='cloud-model-panel'
          >
            <ul className='cloud-model-list'>
              {providers
                .filter(
                  (provider) =>
                    item.value === 'all' || provider.type === item.value
                )
                .map((provider) => (
                  <li key={provider.name}>
                    <span
                      className={`cloud-provider-mark cloud-provider-${provider.tone}`}
                      aria-hidden='true'
                    >
                      {provider.mark}
                    </span>
                    <div>
                      <h3 translate='no'>
                        {provider.name} <span>{provider.vendor}</span>
                      </h3>
                      <p>{t(provider.task)}</p>
                    </div>
                  </li>
                ))}
            </ul>
          </TabsContent>
        ))}
      </Tabs>
      <p className='cloud-directory-note'>
        {t(
          'Model families shown for reference. Availability depends on your provider configuration.'
        )}
      </p>
    </section>
  )
}
