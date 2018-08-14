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

// import {View} from 'vega';
import embed, {Mode, Result as EmbedRes, VisualizationSpec} from 'vega-embed';
import {Drawable, VisOptions} from '../types';
import {getDrawArea} from './render_utils';

interface Datum {
  index: number;
  value: number;
}

const defaultOpts = {
  xLabel: '',
  yLabel: '',
  xType: 'ordinal',
  yType: 'quantitative',
};

// const instances: Map<HTMLElement, View> = new Map<HTMLElement, View>();

/**
 * Renders a barchart
 * @param data — Data in the following format, (an array of objects)
 *              [ {index: number, value: number} ... ]
 * @param container — An HTMLElement in which to draw the histogram
 * @param opts - optional parameters
 * @param opts.width — width of chart in px
 * @param opts.height — height of chart in px
 * @param opts.xLabel — label for x-axis, set to null to hide the
 * @param opts.yLabel — label for y-axis, set to null to hide the
 */
export function renderBarchart(
    data: Datum[], container: Drawable, opts: VisOptions = {}) {
  const drawArea = getDrawArea(container);
  const values = data;

  // if (instances.has(drawArea)) {
  // const view = instances.get(drawArea) as View;
  // view.update(values);
  // }

  const options = Object.assign({}, defaultOpts, opts);

  const {xLabel, yLabel, xType, yType} = options;

  let xAxis: {}|null = null;
  if (xLabel != null) {
    xAxis = {title: xLabel};
  }

  let yAxis: {}|null = null;
  if (yLabel != null) {
    yAxis = {title: yLabel};
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
    'mark': 'bar',
    'encoding': {
      'x': {'field': 'index', 'type': xType, 'axis': xAxis},
      'y': {'field': 'value', 'type': yType, 'axis': yAxis}
    }
  };

  return new Promise((resolve, reject) => {
    new Promise(r => requestAnimationFrame(r))
        .then(() => embed(drawArea, spec, embedOpts))
        .then((res: EmbedRes) => {
          // TODO save and re-use res.view
          console.log('done rendering', res.view !== undefined);
          // instances.set(drawArea, res.view);
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
  });
}
