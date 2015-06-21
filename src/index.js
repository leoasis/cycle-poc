import {run, h, makeDOMDriver} from 'cyclejs';
import makeAPIDriver from './makeAPIDriver';

function main(drivers) {
  const apiUp = drivers.API.countUp();
  const apiDown = drivers.API.countDown();
  const countUpRequests = drivers.DOM.get('.up', 'click')
    .map(apiUp.request());
  const countDownRequests = drivers.DOM.get('.down', 'click')
    .map(apiDown.request());

  const API = countUpRequests.merge(countDownRequests);

  const countUpResponses = apiUp.response().map(r => r.response.value);
  const countDownResponses = apiDown.response().map(r => r.response.value);
  const counter = countUpResponses.merge(countDownResponses)
    .scan((count, val) => count + val)
    .startWith(0);

  const DOM = counter.map(view);

  return { DOM, API };
}

function view(counter) {
  return h('div', [
    h('h1', 'Counter Example'),
    h('button.up', '+'),
    h('span', counter.toString()),
    h('button.down', '-'),
  ]);
}

function api(request) {
  return {
    countUp() {
      return request({method: 'GET', url: '/api/up.json', responseType: 'json'});
    },
    countDown() {
      return request({method: 'GET', url: '/api/down.json', responseType: 'json'});
    }
  }
}

run(main, {
  DOM: makeDOMDriver('#app'),
  API: makeAPIDriver(api)
});
