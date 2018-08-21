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

import embed, {Mode, VisualizationSpec} from 'vega-embed';

import {ConfusionMatrixData, Drawable, VisOptions} from '../types';
import {getDrawArea} from './render_utils';

/**
 * Renders a confusion matrix
 *
 * @param data Data in the following format. An object with a key for each
 * class, the value for that key will be an object with a key for each class and
 * a value that is the count of that class.
 * e.g.
 * {
 *   "dog": {
 *     "cat": 23,
 *     "dog": 80,
 *   },
 *   "cat": {
 *     "cat": 94,
 *     "dog": 56,
 *   },
 * }
 *
 *
 * @param container An `HTMLElement` or `Surface` in which to draw the chart
 * @param opts optional parameters
 * @param opts.shadeDiagonal boolean that controls whether or not to color cells
 * on the diagonal. Defaults to false
 * @param opts.width width of chart in px
 * @param opts.height height of chart in px
 */
export async function renderConfusionMatrix(
    data: ConfusionMatrixData, container: Drawable,
    opts: VisOptions&{shadeDiagonal?: boolean} = {}) {
  const options = Object.assign({}, defaultOpts, opts);
  const drawArea = getDrawArea(container);

  // Format data for vega spec. WHich is an array of objects for each cell
  // in the matrix.
  const values = [];
  for (const label in data) {
    const preds = data[label];
    for (const prediction in preds) {
      const count = data[label][prediction];
      if (label === prediction) {
        // Experiment with not shading the diagonal
        let diagVal;
        if (options.shadeDiagonal) {
          diagVal = {label, prediction, count};
        } else {
          // We do not set the 'count' so that the cell doesn't get shaded
          // Hoever we add in a diagCount var so that a count can be rendered.
          diagVal = {label, prediction, diagCount: count};
        }
        values.push(diagVal);
      } else {
        values.push({
          label,
          prediction,
          count,
        });
      }
    }
  }

  const embedOpts = {
    actions: false,
    mode: 'vega-lite' as Mode,
  };

  const spec: VisualizationSpec = {
    'width': options.width || drawArea.clientWidth,
    'height': options.height || drawArea.clientHeight,
    'padding': 5,
    'autosize': {
      'type': 'fit',
      'contains': 'padding',
      'resize': true,
    },
    'data': {'values': values},
    'encoding': {
      'x': {'field': 'prediction', 'type': 'nominal'},
      'y': {'field': 'label', 'type': 'nominal'},
    },
    'layer': [
      {
        // The matrix
        'mark': 'rect',
        'encoding': {
          'color': {
            'field': 'count',
            'type': 'quantitative',
            'scale': {'scheme': 'blues'},
          },
          'tooltip': {'field': 'count', 'type': 'quantitative'},
        }
      },
      {
        // The text labels
        'mark': {'type': 'text', 'baseline': 'middle'},
        'encoding': {
          'text': {'field': 'count', 'type': 'nominal'},
          'opacity': {
            // Hide the text if count is null
            'condition': {
              'test': 'datum["count"] == null',
              'value': 0,
            },
            'value': 1
          }
        }
      },
      {
        // Draw text labels for diagonal if they are not shaded
        // and thus don't have a count
        'mark': {'type': 'text', 'baseline': 'middle'},
        'encoding': {
          'text': {
            'field': 'diagCount',
            'type': 'nominal',
          },
          'opacity': {
            'condition': {
              'test': 'datum["diagCount"] == null',
              'value': 0,
            },
            'value': 1
          }
        }
      }
    ]
  };

  await embed(drawArea, spec, embedOpts);
  return Promise.resolve();
}

const defaultOpts = {
  xLabel: null,
  yLabel: null,
  xType: 'nominal',
  yType: 'nominal',
  shadeDiagonal: false,
};
