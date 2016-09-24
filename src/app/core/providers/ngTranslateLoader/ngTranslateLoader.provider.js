export default class AppNgTranslateLoaderProvider {
  constructor() {
    this.cached = {};
  }

  $get($q, $http, $timeout) {
    'ngInject';
    let $this = this;
    let request, translations, deferred;
    return (options) => {
      if (request) {
        $timeout.cancel(request);
        deferred.reject();
      }
      deferred = $q.defer();
      translations = $this.cached[options.key];
      if (!translations) {
        request = $timeout(()=> {
          $http.get(`/assets/languages/${options.key}.json`)
            .success((resp)=> {
              $this.cached[options.key] = translations = resp;
              deferred.resolve(translations);
            }, ()=> {
              deferred.reject();
            });
        }, 100);
      } else {
        deferred.resolve(translations);
      }
      return deferred.promise;
    };
  }
}
