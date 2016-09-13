import Template from './uploadProgress.template.html';
import * as _ from "lodash";

export default class Controller {
  /*@ngInject*/
  constructor($scope, $uibModal, UploadProgressService) {
    let $this = this;
    this.modalInstance = null;
    this._$scope = $scope;
    this._$uibModal = $uibModal;
    $scope.files = UploadProgressService.files;

    $scope.$on('uploadProgress.show', () => {
      $this.showModal();
    });

    $scope.$on('uploadProgress.clear', () => {
      $this.clearFiles();
    });
  }

  /**
   * clear queue
   */
  clearFiles() {
    this._$scope.files.splice(0, this._$scope.files.length);
  }

  /**
   * Show modal
   */
  showModal() {
    let $this = this;
    this.modalInstance = this._$uibModal.open({
      animation: true,
      template: Template,
      keyboard: false, // stop ESC to close
      backdrop: 'static', // stop click to close
      controller: ($scope,
                   UploadProgressService,
                   $uibModalInstance) => {
        'ngInject';

        /**
         * Stop all requests
         */
        let stopRequests = () => {
          _.forEach($scope.files, (file) => {
            if (file.abort) {
              file.abort();
            }
          });
        };

        /**
         * close modal
         * @param force
         */
        let close = (force) => {
          // Check if still have file under uploading
          var flag = _.filter($scope.files, {done: false}).length > 0;
          if (force === true) {
            stopRequests();
            $uibModalInstance.close(null);
            return;
          }
          if (!flag) {
            $uibModalInstance.close(null);
          }
        };

        $scope.files = UploadProgressService.files;
        $scope.close = close;

        $scope.$on('uploadProgress.done', () => {
          close();
        });
      },
      size: 'md'
    });

    this.modalInstance.result.then(() => {
      $this.clearFiles();
    }, () => {
      $this.clearFiles();
    });
  }
}
