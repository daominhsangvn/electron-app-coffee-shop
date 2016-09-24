
import Component from './uploadProgress.component';
import UploadProgressService from './uploadProgress.service';

let UploadProgressComponent = angular.module('app.components.uploadProgress', [])
  .service('UploadProgressService', UploadProgressService)
  .component('uploadProgress', Component);

export default UploadProgressComponent;
