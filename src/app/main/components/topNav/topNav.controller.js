import * as _ from 'lodash';

export default class Controller {
  /*@ngInject*/
  constructor($scope, TopNavService, $translate, AppSettings, $cookies) {
    let $this = this;
    this.topNavService = TopNavService;
    this._$translate = $translate;
    this.pageTitle = $this.topNavService.pageTitle();
    $scope.$on('TopNav.PageTitleChanged', ()=> {
      $this.pageTitle = $this.topNavService.pageTitle();
    });
    this.languages = AppSettings.languages;
    let storedKey = $cookies.get('NG_TRANSLATE_LANG_KEY').replace(/"/g, '');
    if (storedKey) {
      this.currentLanguage = _.find(this.languages, (v)=>v.key === storedKey);
    } else {
      this.currentLanguage = this.languages[0];
    }
  }

  changeLanguage(lang) {
    this._$translate.use(lang.key)
      .then(function () {
        this.currentLanguage = lang;
      }.bind(this));
  }
}
