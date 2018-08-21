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

import {renderConfusionMatrix} from './confusion_matrix';

describe('renderConfusionMatrix', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="container"></div>';
  });

  it('renders a chart', async () => {
    const data = {
      'cheese': {
        'cheese': 4,
        'pig': 2,
        'font': 8,
      },
      'pig': {
        'cheese': 8,
        'pig': 3,
        'font': 4,
      },
      'font': {
        'cheese': 2,
        'pig': 2,
        'font': 10,
      }
    };

    const container = document.getElementById('container') as HTMLElement;
    await renderConfusionMatrix(data, container);

    expect(document.querySelectorAll('.vega-embed').length).toBe(1);
  });

  it('renders a chart with shaded diagonal', async () => {
    const data = {
      'cheese': {
        'cheese': 4,
        'pig': 2,
        'font': 8,
      },
      'pig': {
        'cheese': 8,
        'pig': 3,
        'font': 4,
      },
      'font': {
        'cheese': 2,
        'pig': 2,
        'font': 10,
      }
    };

    const container = document.getElementById('container') as HTMLElement;
    await renderConfusionMatrix(data, container, {shadeDiagonal: true});

    expect(document.querySelectorAll('.vega-embed').length).toBe(1);
  });

  it('re-renders the chart', async () => {
    const data = {
      'cheese': {
        'cheese': 4,
        'pig': 2,
        'font': 8,
      },
      'pig': {
        'cheese': 8,
        'pig': 3,
        'font': 4,
      },
      'font': {
        'cheese': 2,
        'pig': 2,
        'font': 10,
      }
    };

    const container = document.getElementById('container') as HTMLElement;

    await renderConfusionMatrix(data, container);
    expect(document.querySelectorAll('.vega-embed').length).toBe(1);

    await renderConfusionMatrix(data, container);
    expect(document.querySelectorAll('.vega-embed').length).toBe(1);
  });

  it('updates the chart', async () => {
    let data = {
      'cheese': {
        'cheese': 4,
        'pig': 2,
        'font': 8,
      },
      'pig': {
        'cheese': 8,
        'pig': 3,
        'font': 4,
      },
      'font': {
        'cheese': 2,
        'pig': 2,
        'font': 10,
      }
    };

    const container = document.getElementById('container') as HTMLElement;

    await renderConfusionMatrix(data, container);
    expect(document.querySelectorAll('.vega-embed').length).toBe(1);

    data = {
      'cheese': {
        'cheese': 4,
        'pig': 22,
        'font': 38,
      },
      'pig': {
        'cheese': 48,
        'pig': 0,
        'font': 24,
      },
      'font': {
        'cheese': 12,
        'pig': 32,
        'font': 10,
      }
    };

    await renderConfusionMatrix(data, container);
    expect(document.querySelectorAll('.vega-embed').length).toBe(1);
  });

  it('sets width of chart', async () => {
    const data = {
      'cheese': {
        'cheese': 4,
        'pig': 2,
        'font': 8,
      },
      'pig': {
        'cheese': 8,
        'pig': 3,
        'font': 4,
      },
      'font': {
        'cheese': 2,
        'pig': 2,
        'font': 10,
      }
    };

    const container = document.getElementById('container') as HTMLElement;
    await renderConfusionMatrix(data, container, {width: 400});

    expect(document.querySelectorAll('.vega-embed').length).toBe(1);
    expect(document.querySelectorAll('canvas').length).toBe(1);
    expect(document.querySelector('canvas')!.style.width).toBe('400px');
  });

  it('sets height of chart', async () => {
    const data = {
      'cheese': {
        'cheese': 4,
        'pig': 2,
        'font': 8,
      },
      'pig': {
        'cheese': 8,
        'pig': 3,
        'font': 4,
      },
      'font': {
        'cheese': 2,
        'pig': 2,
        'font': 10,
      }
    };

    const container = document.getElementById('container') as HTMLElement;
    await renderConfusionMatrix(data, container, {height: 200});

    expect(document.querySelectorAll('.vega-embed').length).toBe(1);
    expect(document.querySelectorAll('canvas').length).toBe(1);
    expect(document.querySelector('canvas')!.style.height).toBe('200px');
  });
});
