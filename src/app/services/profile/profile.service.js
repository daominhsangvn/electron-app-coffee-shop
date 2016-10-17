/*@ngInject*/
export default class ProfileService {
  constructor($http, $q, UserContext, AppConstant) {
    this._$http = $http;
    this._$q = $q;
    this._userContext = UserContext;
    this._appConstant = AppConstant;
  }

  get() {
    return this._$http.get(this._appConstant.domain + '/api/profile');
  }

  updateData() {
    return this.get()
      .success((userInfo) => {
        // save user info to localstorage
        this._userContext.fillInfo(userInfo, true);
      });
  }

  changePassword() {

  }

  update() {

  }
}
