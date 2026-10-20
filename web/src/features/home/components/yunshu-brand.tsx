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
import { useTranslation } from 'react-i18next'

/** Product signature shared by the public header and landing-page footer. */
export function YunshuBrand() {
  const { t } = useTranslation()
  return (
    <span className='cloud-brand'>
      <span className='cloud-brand-mark' aria-hidden='true'>
        枢
      </span>
      <span className='cloud-brand-copy'>
        <span className='cloud-brand-name'>{t('Yunshu AI')}</span>{' '}
        <span className='cloud-brand-affiliation'>
          {t('An AI platform by Yunsuguan')}
        </span>
      </span>
    </span>
  )
}
