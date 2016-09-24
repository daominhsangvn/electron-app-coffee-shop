
import Component from './topNav.component';
import TopNavService from './topNav.service';

let AppTopNavComponent = angular.module('app.components.topNav', [])
  .service('TopNavService', TopNavService)
  .component('topNav', Component);

export default AppTopNavComponent;
