
import Component from './sideBar.component';
import SideBarService from './sideBar.service';

let AppSideBarComponent = angular.module('app.components.sideBar', [])
  .service('SideBarService', SideBarService)
  .component('sideBar', Component);

export default AppSideBarComponent;
