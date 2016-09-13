/*@ngInject*/
export default ($stateProvider) => {
  $stateProvider
    .state('app.auth.signIn', {
      url: '/sign-in',
      template: `
        <div class="session">
          <div class="session-content">
            <div class="card card-block form-layout">
              <sign-in></sign-in>
            </div>
          </div>
          <footer class="text-xs-center p-y-1"><p><a ui-sref="app.auth.forgotPassword">Forgot password? </a>&nbsp;&nbsp;·&nbsp;&nbsp;
            <a ui-sref="app.auth.signUp">Create an account</a></p></footer>
        </div>
      `,
      resolve: {
        // Lazy load component
        // http://embed.plnkr.co/gLFtn6/
        components: ($q, $ocLazyLoad)=> {
          'ngInject';
          let deferred = $q.defer();

          // Lazy load child components of main layout
          // e.g: TopNav, SideBar
          require.ensure([
            'angular-promise-buttons'
          ], (require) => {
            let ngPromisesButton = require('exports?"angularPromiseButtons"!angular-promise-buttons');
            $ocLazyLoad.load([
              {name: ngPromisesButton},
            ]);
            deferred.resolve();
          });

          return deferred.promise;
        }
      }
    });
};
