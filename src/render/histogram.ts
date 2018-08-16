import {format as d3Format} from 'd3-format';
import {stat} from 'fs';
import embed, {Mode, VisualizationSpec} from 'vega-embed';

import {HistogramOpts, HistogramStats} from '../types';
import {subSurface} from '../util/dom';
import {arrayStats} from '../util/math';

import {renderTable} from './table';

const defaultOpts = {
  maxBins: 12,
};

/**
 * Renders a histogram of values
 *
 * @param data Data in the following format, (an array of objects)
 *              [ {value: number}, ... ]
 * @param container An HTMLElement|Surface in which to draw the histogram
 * @param opts optional parameters
 * @param opts.width width of chart in px
 * @param opts.height height of chart in px
 * @param opts.maxBins maximimum number of bins to use in histogram
 * @param opts.stats summary statistics to show. These will be computed
 *                   internally if no stats are passed. Pass `false` to not
 *                   compute any stats. Callers are allowed to pass in their
 *                   own stats as in some cases they may be able to compute
 *                   them more efficiently.
 *
 *                   Stats should have the following format
 *                   {
 *                     numVals?: number,
 *                     min?: number,
 *                     max?: number,
 *                     numZeros?: number,
 *                     numNans?: number
 *                   }
 */
export async function renderHistogram(
    data: Array<{value: number}>, container: HTMLElement,
    opts: HistogramOpts = {}) {
  const values = data;

  const options = Object.assign({}, defaultOpts, opts);

  const embedOpts = {
    actions: false,
    mode: 'vega-lite' as Mode,
  };

  const histogramContainer = subSurface(container, 'histogram');
  if (opts.stats !== false) {
    const statsContainer = subSurface(container, 'stats', {
      prepend: true,
    });
    let stats: HistogramStats;

    if (opts.stats) {
      stats = opts.stats;
    } else {
      stats = arrayStats(data.map(x => x.value));
    }
    renderStats(stats, statsContainer);
  }

  const histogramSpec: VisualizationSpec = {

    'width': options.width || histogramContainer.clientWidth,
    'height': options.height || histogramContainer.clientHeight,
    'padding': 5,
    'autosize': {
      'type': 'fit',
      'contains': 'padding',
      'resize': true,
    },
    'data': {'values': values},
    'mark': 'bar',
    'encoding': {
      'x': {
        'bin': {'maxbins': options.maxBins},
        'field': 'value',
        'type': 'quantitative',
      },
      'y': {
        'aggregate': 'count',
        'type': 'quantitative',
      },
      'color': {
        // TODO extract to theme?
        'value': '#001B44',
      }
    }
  };

  return embed(histogramContainer, histogramSpec, embedOpts);
}

function renderStats(stats: HistogramStats, container: HTMLElement) {
  const format = d3Format(',.4~f');
  const pctFormat = d3Format('.4~p');

  const headers: string[] = [];
  const vals: string[] = [];

  if (stats.numVals != null) {
    headers.push('Num Vals');
    vals.push(format(stats.numVals));
  }

  if (stats.min != null) {
    headers.push('Min');
    vals.push(format(stats.min));
  }

  if (stats.max != null) {
    headers.push('Max');
    vals.push(format(stats.max));
  }

  if (stats.numZeros != null) {
    headers.push('Zero Count');
    let zeroPct = '';
    if (stats.numVals) {
      zeroPct = stats.numZeros > 0 ?
          `(${pctFormat(stats.numZeros / stats.numVals)})` :
          '';
    }

    vals.push(`${format(stats.numZeros)} ${zeroPct}`);
  }

  if (stats.numNans != null) {
    headers.push('NaN Count');
    let nanPct = '';
    if (stats.numVals) {
      nanPct = stats.numNans > 0 ?
          `(${pctFormat(stats.numNans / stats.numVals)})` :
          '';
    }

    vals.push(`${format(stats.numNans)} ${nanPct}`);
  }

  renderTable({headers, values: [vals]}, container);
}
