import * as _ from 'lodash';

/**
 * How to use
 * UploadProgressService.upload(UploadService.upload, file [, another upload method params])
 */

/*@ngInject*/
export default class UploadProgressService {
  constructor($rootScope, $q) {
    this._$rootScope = $rootScope;
    this._$q = $q;
    this.files = [];
  }

  /**
   * Indicating if the target is file
   * @param file
   * @returns {boolean}
   * @private
   */
  _isFile(file) {
    return angular.isDefined(file.name) && angular.isDefined(file.size) && angular.isDefined(file.type);
  }

  /**
   * Add file to queue and set default values
   * @param files
   * @returns {*}
   */
  add(files) {
    let queue = [];
    let $this = this;
    _.each(files, function (file) {
      $this.files.push({
        file: file,
        percentage: 0,
        isUploading: true,
        isCompleted: false,
        isProgressing: false,
        isDone: false,
        isFailed: false,
        /**
         * File uploading progress callback
         * @param evt
         */
        progress: function (evt) {
          let percentage = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
          this.percentage = percentage;
          if (percentage === 100) {
            this.isUploading = false;
            this.isCompleted = true;
            this.isProgressing = true;
          }
        },
        /**
         * Make the file as done
         */
        done: function () {
          this.isDone = true;
          $this._$rootScope.$broadcast('uploadProgress.done');
        },
        /**
         * Make the file upload as failed
         */
        fail: function () {
          this.isFailed = true;
          $this._$rootScope.$broadcast('uploadProgress.done');
        }
      });

      queue.push($this.files[$this.files.length - 1]);
    });
    $this._$rootScope.$broadcast('uploadProgress.show');

    return queue;
  };

  /**
   * Chain upload
   * @returns {*}
   */
  upload() {
    let $this = this;
    let deferred = $this._$q.defer();

    // Make sure the first argument is upload method
    if (!_.isObject(arguments[0])) {
      console.error('uploadProgressFactory.upload must be a upload service context');
      deferred.reject();
      return;
    }

    if (!_.isString(arguments[1])) {
      console.error('uploadProgressFactory.upload second argument must be a string that present upload method name');
      deferred.reject();
      return;
    }

    // In case the second argument is a list of file with single upload
    if (_.isArray(arguments[2]) && !arguments[2].length) {
      deferred.reject();
      return;
    }
    // Make sure the array contains file object
    else if (_.isArray(arguments[2]) && !$this._isFile(arguments[2][1])) {
      console.error('uploadProgressFactory.upload second argument must be a list of files');
      deferred.reject();
      return;
    }

    // Make sure the second argument is file object
    if (!_.isArray(arguments[2]) && (!_.isObject(arguments[2]) || !$this._isFile(arguments[2]))) {
      console.error('uploadProgressFactory.upload second argument must a file');
      deferred.reject();
      return;
    }

    let uploadMethodName = arguments[1];
    let uploadMethodContext = arguments[0];
    // use splice to get all the arguments after upload method (first argument)
    let args = Array.prototype.splice.call(arguments, 2);
    let files = _.isArray(args[0]) ? args[0] : [args[0]];
    let $files = this.add(files);

    // make the call itself to upload method with parameter
    uploadMethodContext[uploadMethodName].apply(uploadMethodContext, args)
      .xhr(function (xhr) {
        _.each($files, function ($file) {
          /**
           * abort file request
           */
          $file.abort = function () {
            xhr.abort();
          };
        });
      })
      .then(function (resp) {
        _.each($files, function ($file) {
          $file.done();
        });
        deferred.resolve(resp.data);
      }, function (err) {
        _.each($files, function ($file) {
          $file.fail();
        });
        deferred.reject(err.data);
      }, function (evt) {
        _.each($files, function ($file) {
          $file.progress(evt);
        });
      });

    return deferred.promise;
  };

  /**
   * clear queue
   */

  clear() {
    this._$rootScope.$broadcast('uploadProgress.clear');
  };

  /**
   * show upload modal
   */
  show() {
    this._$rootScope.$broadcast('uploadProgress.show');
  };

  /**
   * hide upload modal
   */
  hide() {
    this._$rootScope.$broadcast('uploadProgress.hide');
  };
}
