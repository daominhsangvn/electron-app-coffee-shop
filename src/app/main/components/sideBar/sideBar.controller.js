class Controller {
  /*@ngInject*/
  constructor(UserContext, $state) {
    this.info = UserContext.get();
    this._userContext = UserContext;
    this._$state = $state;
  }

  logOut(){
    let $this = this;
    this._userContext.clearInfo();
    $this._$state.go('app.auth.signIn');
  }
}

export default Controller;
