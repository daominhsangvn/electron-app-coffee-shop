import AppAppSettingsProvider from './appSetting';
import AppAppNgTranslateLoaderProvider from './ngTranslateLoader';
let AppProviders = angular.module('app.providers', [
  AppAppSettingsProvider.name,
  AppAppNgTranslateLoaderProvider.name
]);

export default AppProviders;

