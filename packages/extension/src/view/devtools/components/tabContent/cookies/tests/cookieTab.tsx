/*
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * External dependencies.
 */
import React from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { type Cookie as ParsedCookie } from 'simple-cookie';
import SinonChrome from 'sinon-chrome';

/**
 * Internal dependencies.
 */
import CookieTab from '..';
import type { CookieStoreContext } from '../../../../stateProviders/syncCookieStore';
import { emptyAnalytics } from '../../../../../../worker/findAnalyticsMatch';
import { CookieDetails } from '../components';

const emptyCookie = {
  name: '',
  value: '',
  domain: '',
  samesite: '',
  secure: false,
  httponly: false,
  path: '',
  expires: '',
};

const uncategorised1pCookie: ParsedCookie = {
  ...emptyCookie,
  name: '_cb',
  value: 'uncategorised1pCookie',
  domain: '.cnn.com',
};

const uncategorised3pCookie: ParsedCookie = {
  ...emptyCookie,
  name: 'pubsyncexp',
  value: 'uncategorised3pCookie',
  domain: '.ads.pubmatic.com',
};

const known1pCookie: ParsedCookie = {
  ...emptyCookie,
  name: '__qca',
  value: 'known1pCookie',
  domain: '.cnn.com',
};

const known3pCookie: ParsedCookie = {
  ...emptyCookie,
  name: 'KRTBCOOKIE_290',
  value: 'known3pCookie',
  domain: '.pubmatic.com',
};

const mockResponse: {
  tabCookies: NonNullable<CookieStoreContext['state']['tabCookies']>;
  tabUrl: NonNullable<CookieStoreContext['state']['tabUrl']>;
} = {
  tabCookies: {
    [uncategorised1pCookie.name]: {
      parsedCookie: uncategorised1pCookie,
      analytics: { ...emptyAnalytics },
      url: 'https://edition.cnn.com/whatever/api',
      headerType: 'response',
    },
    [uncategorised3pCookie.name]: {
      parsedCookie: uncategorised3pCookie,
      analytics: { ...emptyAnalytics },
      url: 'https://api.pubmatic.com/whatever/api',
      headerType: 'response',
    },
    [known1pCookie.name]: {
      parsedCookie: known1pCookie,
      analytics: {
        platform: 'Quantcast',
        category: 'Marketing',
        name: '__qca',
        domain: "Advertiser's website domain",
        description:
          'This cookie is set by Quantcast, who present targeted advertising. Stores browser and HTTP request information.',
        retention: '1 year',
        dataController: 'Quantcast',
        gdprUrl: 'https://www.quantcast.com/privacy/',
        wildcard: '0',
      },
      url: 'https://edition.cnn.com/whatever/api',
      headerType: 'response',
    },
    [known3pCookie.name]: {
      parsedCookie: known3pCookie,
      analytics: {
        platform: 'PubMatic',
        category: 'Marketing',
        name: 'KRTBCOOKIE_*',
        domain: 'pubmatic.com',
        description:
          "Registers a unique ID that identifies the user's device during return visits across websites that use the same ad network. The ID is used to allow targeted ads.",
        retention: '29 days',
        dataController: 'Pubmatic',
        gdprUrl: 'N/A',
        wildcard: '1',
      },
      url: 'https://api.pubmatic.com/whatever/api',
      headerType: 'response',
    },
  },
  tabUrl: 'https://edition.cnn.com/',
};

jest.mock('../../../../stateProviders/syncCookieStore', () => {
  return {
    useCookieStore: () => {
      return { cookies: mockResponse.tabCookies, tabUrl: mockResponse.tabUrl };
    },
  };
});

jest.mock('../../../../stateProviders/contentPanelStore', () => {
  return {
    useContentPanelStore: () => {
      return {
        selectedCookie:
          mockResponse.tabCookies[Object.keys(mockResponse.tabCookies)[0]],
        tableContainerRef: { current: null },
        tableColumnSize: 100,
        setTableColumnSize: jest.fn(),
      };
    },
  };
});

describe('CookieTab', () => {
  beforeAll(() => {
    globalThis.chrome = SinonChrome as unknown as typeof chrome;
  });

  it('should render a list of cookies with analytics', async () => {
    render(<CookieTab />);

    expect((await screen.findAllByTestId('body-row')).length).toBe(4);

    expect((await screen.findAllByText('Uncategorised')).length).toBe(2);
    expect((await screen.findAllByText('Marketing')).length).toBe(2);
  });

  it('should show a cookie card with the information on first cookie in the list', async () => {
    const firstCookie =
      mockResponse.tabCookies[Object.keys(mockResponse.tabCookies)[0]];

    render(<CookieDetails />);
    const card = await screen.findByTestId('cookie-card');

    expect(card).toBeInTheDocument();

    expect(
      within(card).getByText(firstCookie.parsedCookie.value)
    ).toBeInTheDocument();
  });
});
