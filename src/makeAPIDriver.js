import Rx from 'rx-dom';

export default function makeAPIDriver(api) {
  return function API(request$) {
    request$.subscribe(request => {
      if (request) {
        request();
      }
    });

    function makeApiCall(urlOrSettings) {
      const response$ = new Rx.Subject();
      return {
        request() {
          return () => {
            Rx.DOM.ajax(urlOrSettings).subscribe(response => {
              response$.onNext(response);
            }, response => {
              response$.onError(response);
            });
          };
        },
        response() {
          return response$;
        }
      };
    }

    return api(makeApiCall);
  }
}
