/*@ngInject*/
export default ($stateProvider) => {
  $stateProvider
    .state('app.main', {
      url: '/main',
      abstract: true,
      template: '<main-master></main-master>',
      resolve: {
        // Lazy load component
        // http://embed.plnkr.co/gLFtn6/
        components: ($q, $ocLazyLoad)=> {
          'ngInject';
          let deferred = $q.defer();

          // Lazy load child components of main layout
          // e.g: TopNav, SideBar
          require.ensure([
            'app/main/components/topNav',
            'app/main/components/sideBar',
            'app/core/directives/appClass',
            'app/core/directives/toggleClass'
          ], (require) => {
            let topNavModule = require('app/main/components/topNav');
            let sideBarModule = require('app/main/components/sideBar');
            let appClassDirectiveModule = require('app/core/directives/appClass');
            let toggleClassDirectiveModule = require('app/core/directives/toggleClass');
            $ocLazyLoad.load([
              {name: appClassDirectiveModule.default.name},
              {name: toggleClassDirectiveModule.default.name},
              {name: topNavModule.default.name},
              {name: sideBarModule.default.name}
            ]);
            deferred.resolve();
          });

          return deferred.promise;
        }
      }
    });
};
