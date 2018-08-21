import embed, {Mode, VisualizationSpec} from 'vega-embed';

import {Drawable, VisOptions} from '../types';
import {getDrawArea} from './render_utils';

/**
 * Renders a line chart
 * @param data Data in the following format, (an array of objects)
 *              [ {index: number, value: number, series: string} ... ]
 * @param container An HTMLElement in which to draw the histogram
 * @param opts optional parameters
 * @param opts.width width of chart in px
 * @param opts.height height of chart in px
 * @param opts.xLabel label for x axis
 * @param opts.yLabel label for y axis
 */
export async function renderLinechart(
    data: Array<{index: number; value: number; series: string;}>,
    container: Drawable, opts: VisOptions = {}): Promise<void> {
  const values = data;
  const drawArea = getDrawArea(container);
  const options = Object.assign({}, defaultOpts, opts);

  const embedOpts = {
    actions: false,
    mode: 'vega-lite' as Mode,
  };

  const encodings: {} = {
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
    'layer': [
      {
        // Render the main line chart
        'mark': {'type': 'line'},
        'encoding': encodings,
      },
      {
        'selection': {
          'nearestPoint': {
            'type': 'single',
            'on': 'mouseover',
            'nearest': true,
            'empty': 'none',
            'encodings': ['x']
          },
        },
        // Draw a point where the selection is
        'mark': {'type': 'point'},
        'encoding': Object.assign({}, encodings, {
          'opacity': {
            'value': 0,
            'condition': {
              'selection': 'nearestPoint',
              'value': 1,
            },
          }
        }),
      },
      {
        // Draw a vertical line where the selection is
        'transform': [{'filter': {'selection': 'nearestPoint'}}],
        'mark': {'type': 'rule', 'color': 'gray'},
        'encoding': {
          'x': {
            'type': options.xType,
            'field': 'index',
          }
        }
      },
      {
        // Render a tooltip where the selection is
        'transform': [{'filter': {'selection': 'nearestPoint'}}],
        'mark': {
          'type': 'text',
          'align': 'left',
          'dx': 5,
          'dy': -5,
          'color': 'black',
        },
        'encoding': Object.assign({}, encodings, {
          'text': {
            'type': options.xType,
            'field': 'value',
            'format': '.6f',
          },
          // TODO reconsider text color
          // 'color': undefined,
        }),
      },

    ],
  };

  requestAnimationFrame(() => {
    embed(drawArea, spec, embedOpts);
  });
}

const defaultOpts = {
  xLabel: 'Index',
  yLabel: 'Value',
  xType: 'quantitative',
  yType: 'quantitative',
};
