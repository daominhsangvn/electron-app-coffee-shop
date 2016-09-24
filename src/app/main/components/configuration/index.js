import Component from './configuration.component';
import ConfigurationService from './configuration.service';

let AppConfigurationComponent = angular.module('app.components.configuration', [])
  .service('ConfigurationService', ConfigurationService)
  .component('configuration', Component);

export default AppConfigurationComponent;
