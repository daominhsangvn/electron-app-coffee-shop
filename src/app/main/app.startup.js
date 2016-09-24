/*@ngInject*/
export default (UserContext, $rootScope, $location, $templateCache) => {

  /* eslint-disable */
  // Authentication Guard
  $rootScope.$on('$stateChangeStart', function (event, toState) {
    let auth = UserContext.auth();
    if ((!auth || !auth.isAuth) && toState.authorization !== false ) {
      UserContext.clearInfo();
      $location.path('/auth/sign-in');
    }
  });
  /* eslint-enable */

  // Load user info from local storage
  UserContext.loadFromLocal();

  // Bootstrap 4 hacks
  $templateCache.put("uib/template/progressbar/progressbar.html",`
    <div>
      <div class="text-xs-center" id="example-caption-3" ng-transclude></div>
      <progress class="progress progress-striped" ng-class="type && 'progress-' + type" value="{{value}}" max="{{max}}"></progress>
    </div>
  `);
};
