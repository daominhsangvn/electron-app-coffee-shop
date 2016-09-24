
import Component from './searchHeader.component';
import SearchHeaderService from './searchHeader.service';

let AppSearchHeaderComponent = angular.module('app.components.searchHeader', [])
  .service('SearchHeaderService', SearchHeaderService)
  .component('searchHeader', Component);

export default AppSearchHeaderComponent;
