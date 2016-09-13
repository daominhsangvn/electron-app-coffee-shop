import ngFileUpload from 'ng-file-upload';
import UploadService from './upload.service';

let AppUploadService = angular.module('app.core.services.upload', [
  ngFileUpload
])
  .service('UploadService', UploadService);

export default AppUploadService;
