import embed, {Mode, VisualizationSpec} from 'vega-embed';

import {Drawable, VisOptions} from '../types';

import {getDrawArea} from './render_utils';

/**
 * Renders a scatter plot
 * @param data Data in the following format, (an array of objects)
 *              [ {index: number, value: number, series: string} ... ]
 * @param container An HTMLElement in which to draw the histogram
 * @param opts optional parameters
 * @param opts.width width of chart in px
 * @param opts.height height of chart in px
 * @param opts.xLabel label for x axis
 * @param opts.yLabel label for y axis
 */
export async function renderScatterplot(
    data: Array<{index: number; value: number; series: string;}>,
    container: Drawable, opts: VisOptions = {}): Promise<void> {
  const values = data;
  const drawArea = getDrawArea(container);
  const options = Object.assign({}, defaultOpts, opts);

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
    'mark': {'type': 'point'},
    'encoding': {
      'x': {
        'field': 'index',
        'type': options.xType,
        'title': options.xLabel,
      },
      'y': {
        'field': 'value',
        'type': options.yType,
        'title': options.yLabel,
      },
      'color': {
        'field': 'series',
        'type': 'nominal',
      },
      'shape': {
        'field': 'series',
        'type': 'nominal',
      },
      // TODO revisit when https://github.com/vega/vega-embed/issues/96 is
      // resolved
      'tooltip': {'field': 'value', 'type': options.yType}
    },
  };

  await embed(drawArea, spec, embedOpts);
  return Promise.resolve();
}

const defaultOpts = {
  xLabel: 'Index',
  yLabel: 'Value',
  xType: 'quantitative',
  yType: 'quantitative',
};
