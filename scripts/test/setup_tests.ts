// Via https://github.com/airbnb/enzyme/blob/master/docs/guides/jsdom.md

import {JSDOM} from 'jsdom';

// Set up jsdom for UI tests
const jsdom = new JSDOM(
    '<!doctype html><html><body><div id="container"></div></body></html>',
    {pretendToBeVisual: true});
const {window} = jsdom;

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
                    .filter(prop => typeof target[prop] === 'undefined')
                    .reduce(
                        (result, prop) => ({
                          ...result,
                          [prop]: Object.getOwnPropertyDescriptor(src, prop),
                        }),
                        {});
  Object.defineProperties(target, props);
}

global['window'] = window;
global['document'] = window.document;
global['navigator'] = {
  userAgent: 'node.js',
};
copyProps(window, global);
