/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import {renderScatterplot} from './scatterplot';

describe('renderScatterplot', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="container"></div>';
  });

  it('renders a scatterplot', async () => {
    const data = [
      {index: 0, value: 20, series: 'first'},
      {index: 1, value: 30, series: 'first'},
      {index: 2, value: 40, series: 'first'},
    ];

    const container = document.getElementById('container') as HTMLElement;
    await renderScatterplot(data, container);

    expect(document.querySelectorAll('.vega-embed').length).toBe(1);
  });

  it('re-renders the chart', async () => {
    const data = [
      {index: 0, value: 20, series: 'first'},
      {index: 1, value: 30, series: 'first'},
      {index: 2, value: 40, series: 'first'},
    ];

    const container = document.getElementById('container') as HTMLElement;

    await renderScatterplot(data, container);
    expect(document.querySelectorAll('.vega-embed').length).toBe(1);

    await renderScatterplot(data, container);
    expect(document.querySelectorAll('.vega-embed').length).toBe(1);
  });

  it('updates the chart', async () => {
    let data = [
      {index: 0, value: 20, series: 'first'},
      {index: 1, value: 30, series: 'first'},
      {index: 2, value: 40, series: 'first'},
    ];

    const container = document.getElementById('container') as HTMLElement;

    await renderScatterplot(data, container);
    expect(document.querySelectorAll('.vega-embed').length).toBe(1);

    data = [
      {index: 0, value: 120, series: 'first'},
      {index: 1, value: 130, series: 'first'},
      {index: 2, value: 140, series: 'first'},
    ];

    await renderScatterplot(data, container);
    expect(document.querySelectorAll('.vega-embed').length).toBe(1);
  });

  it('sets width of chart', async () => {
    const data = [
      {index: 0, value: 20, series: 'first'},
      {index: 1, value: 30, series: 'first'},
      {index: 2, value: 40, series: 'first'},
    ];

    const container = document.getElementById('container') as HTMLElement;
    await renderScatterplot(data, container, {width: 400});

    expect(document.querySelectorAll('.vega-embed').length).toBe(1);
    expect(document.querySelectorAll('canvas').length).toBe(1);
    expect(document.querySelector('canvas')!.style.width).toBe('400px');
  });

  it('sets height of chart', async () => {
    const data = [
      {index: 0, value: 20, series: 'first'},
      {index: 1, value: 30, series: 'first'},
      {index: 2, value: 40, series: 'first'},
    ];

    const container = document.getElementById('container') as HTMLElement;
    await renderScatterplot(data, container, {height: 200});

    expect(document.querySelectorAll('.vega-embed').length).toBe(1);
    expect(document.querySelectorAll('canvas').length).toBe(1);
    expect(document.querySelector('canvas')!.style.height).toBe('200px');
  });
});
