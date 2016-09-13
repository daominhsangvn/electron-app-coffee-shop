// define(function (require) {
//   'use strict';
//   var angular = require('angular');
//
//   var module = angular.module('common.services.file', []);
//
//   module.factory('fileFactory', [
//     'Upload',
//     'appConstant',
//     '$rootScope',
//     '$http',
//     'utilFactory',
//     function (Upload,
//               constant,
//               $rootScope,
//               $http,
//               utilFactory) {
//       var service = {};
//
//
//       /**
//        * Export file
//        * @param data
//        * @param headers
//        * @param url
//        */
//       function exportFiles(data, headers, url) {
//         var octetStreamMime = 'application/octet-stream';
//         var success = false;
//         var blob;
//         // Get the headers
//         headers = headers();
//         var filename = headers['content-disposition'].substring(21, headers['content-disposition'].length).replace(/"/g, '');
//         // Determine the content type from the header or default to "application/octet-stream"
//         var contentType = headers['content-type'] || octetStreamMime;
//
//         try {
//           // Try using msSaveBlob if supported
//           blob = new Blob([data], {
//             type: contentType
//           });
//           if (navigator.msSaveBlob) {
//             navigator.msSaveBlob(blob, filename);
//           }
//           else {
//             // Try using other saveBlob implementations, if available
//             var saveBlob = navigator.webkitSaveBlob || navigator.mozSaveBlob || navigator.saveBlob;
//             if (saveBlob === undefined) {
//               throw "Not supported";
//             }
//             saveBlob(blob, filename);
//           }
//           success = true;
//         } catch (ex) {
//         }
//         if (!success) {
//           // Get the blob url creator
//           var urlCreator = window.URL || window.webkitURL || window.mozURL || window.msURL;
//           if (urlCreator) {
//             // Try to use a download link
//             var link = document.createElement('a');
//             if ('download' in link) {
//               // Try to simulate a click
//               try {
//                 // Prepare a blob URL
//                 blob = new Blob([data], {
//                   type: contentType
//                 });
//                 url = urlCreator.createObjectURL(blob);
//                 link.setAttribute('href', url);
//
//                 // Set the download attribute (Supported in Chrome 14+ / Firefox 20+)
//                 link.setAttribute("download", filename);
//
//                 // Simulate clicking the download link
//                 var event = document.createEvent('MouseEvents');
//                 event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
//                 link.dispatchEvent(event);
//                 success = true;
//
//               } catch (ex) {
//               }
//             }
//
//             if (!success) {
//               // Fallback to window.location method
//               try {
//                 // Prepare a blob URL
//                 // Use application/octet-stream when using window.location to force download
//                 blob = new Blob([data], {
//                   type: octetStreamMime
//                 });
//                 //url = urlCreator.createObjectURL(blob);
//                 window.location = url;
//                 //saveAs(blob, filename);
//                 success = true;
//               } catch (ex) {
//               }
//             }
//           }
//         }
//       }
//
//       /**
//        * Upload file
//        * @param file
//        * @param ignoreLoadingBar
//        * @returns {*}
//        */
//       function upload(file, ignoreLoadingBar) {
//         return Upload.upload({
//           url: constant.domain + '/api/'+constant.apiVersion+'/upload/file',
//           file: file,
//           headers: {
//             'Authorization': false
//           },
//           ignoreLoadingBar: ignoreLoadingBar
//         });
//       }
//
//       /**
//        * Upload table
//        * @param file
//        * @param type
//        * @returns {*}
//        */
//       function uploadSpreadSheet(file, type) {
//         return Upload.upload({
//           url: constant.domain + '/api/'+constant.apiVersion+'/wizard/upload',
//           file: file,
//           headers: {
//             'Authorization': false
//           },
//           data: {
//             'type': type
//           }
//         });
//       }
//
//       /**
//        * Convert excel to json
//        * @param file
//        * @returns {*}
//        */
//       function parseSpreadSheet(file, requiredColumns) {
//         return Upload.upload({
//           url: constant.domain + '/api/'+constant.apiVersion+'/upload/spreadsheet',
//           file: file,
//           headers: {
//             'Authorization': false
//           },
//           data: {
//             'requiredColumns': requiredColumns
//           }
//         });
//       }
//
//       /**
//        * Upload new table
//        * @param file
//        * @param type
//        * @param tempLibraryid
//        * @param oldTempId
//        * @returns {*}
//        */
//       function uploadSpreadSheetNew(file, type, tempLibraryid, oldTempId) {
//         return Upload.upload({
//           url: constant.domain + '/api/'+constant.apiVersion+'/wizard/uploadNew',
//           file: file,
//           headers: {
//             'Authorization': false
//           },
//           data: {
//             'type': type,
//             'libraryid': tempLibraryid,
//             'oldTempId': oldTempId
//           },
//           autoAlert: false,
//           ignoreLoadingBar: true
//         });
//       }
//
//       /**
//        * Upload BTS table
//        * @param file
//        * @param type
//        * @returns {*}
//        */
//       function uploadUpdateBTSData(file, type) {
//         var libraryId = $rootScope.userLibrary.id;
//         return Upload.upload({
//           url: constant.domain + '/api/'+constant.apiVersion+'/wizard/bts/bylibrary/upload',
//           file: file,
//           headers: {
//             'Authorization': false
//           },
//           data: {
//             'type': type,
//             'libraryId': libraryId
//           },
//           ignoreLoadingBar: true
//         });
//       }
//
//       /**
//        * Upload table site
//        * @param file
//        * @returns {*}
//        */
//       function uploadNewSite(file) {
//         var libraryId = $rootScope.userLibrary.id;
//         return Upload.upload({
//           url: constant.domain + '/api/'+constant.apiVersion+'/wizard/sites/bylibrary/import',
//           file: file,
//           headers: {
//             'Authorization': false
//           },
//           data: {
//             'libraryId': libraryId
//           },
//           ignoreLoadingBar: true
//         });
//       }
//
//       /**
//        * Upload append site for tempId
//        * @param file
//        * @param type
//        * @param tempId
//        * @returns {*}
//        */
//       function uploadUpdateSiteByTempId(file, type, tempId, libraryId) {
//         return Upload.upload({
//           url: constant.domain + '/api/'+constant.apiVersion+'/wizard/sites/bytemp/upload',
//           file: file,
//           headers: {
//             'Authorization': false
//           },
//           data: {
//             'type': type,
//             'tempId': tempId,
//             'libraryId': libraryId
//           },
//           ignoreLoadingBar: true
//         });
//       }
//
//       function uploadMijiUtiFile(file, forceUpload, ignoreLoadingBar) {
//         var libraryId = $rootScope.userLibrary.id;
//         return Upload.upload({
//           url: constant.domain + '/api/'+constant.apiVersion+'/map/import',
//           file: file,
//           headers: {
//             'Authorization': false
//           },
//           data: {
//             libraryId: libraryId,
//             isAllowImported: +forceUpload
//           },
//           ignoreLoadingBar: ignoreLoadingBar,
//           config: {
//             message: 'Import Data Successful',
//           }
//         });
//       }
//
//       function uploadMijiFile(file, timezone, ignoreLoadingBar) {
//         var libraryId = $rootScope.userLibrary.id;
//
//         return Upload.upload({
//           url: constant.domain + '/api/'+constant.apiVersion+'/Miji/' + libraryId + '/import',
//           data: utilFactory.timeInDecimal2TimeInfo(timezone),
//           file: file,
//           headers: {
//             'Authorization': false
//           },
//           ignoreLoadingBar: ignoreLoadingBar,
//           config: {
//             message: 'Import Miji Successful'
//           }
//         });
//       }
//
//       function uploadConnectionsFile(file, ignoreLoadingBar) {
//         var libraryId = $rootScope.userLibrary.id;
//         return Upload.upload({
//           url: constant.domain + '/api/'+constant.apiVersion+'/Miji/' + libraryId + '/connection/import',
//           file: file,
//           headers: {
//             'Authorization': false
//           },
//           ignoreLoadingBar: ignoreLoadingBar,
//           config: {
//             message: 'Import Connections Successful'
//           }
//         });
//       }
//
//       function uploadUtiFile(file, timezone, ignoreLoadingBar) {
//         var libraryId = $rootScope.userLibrary.id;
//         return Upload.upload({
//           url: constant.domain + '/api/'+constant.apiVersion+'/Uti/' + libraryId + '/import',
//           data: utilFactory.timeInDecimal2TimeInfo(timezone),
//           file: file,
//           headers: {
//             'Authorization': false
//           },
//           ignoreLoadingBar: ignoreLoadingBar,
//           config: {
//             message: 'Import Uti Successful'
//           }
//         });
//       }
//
//       service.upload = upload;
//       service.uploadSpreadSheet = uploadSpreadSheet;
//       service.uploadSpreadSheetNew = uploadSpreadSheetNew;
//       service.uploadUpdateBTSData = uploadUpdateBTSData;
//       service.uploadNewSite = uploadNewSite;
//       service.uploadUpdateSiteByTempId = uploadUpdateSiteByTempId;
//       service.exportFiles = exportFiles;
//       service.uploadMijiUtiFile = uploadMijiUtiFile;
//       service.uploadMijiFile = uploadMijiFile;
//       service.uploadUtiFile = uploadUtiFile;
//       service.uploadConnectionsFile = uploadConnectionsFile;
//       service.parseSpreadSheet = parseSpreadSheet;
//
//       return service;
//     }
//   ]);
//   return module.name;
// });

/*@ngInject*/
export default class UploadService {
  constructor($http, $q, AppConstant, Upload) {
    this._$http = $http;
    this._$q = $q;
    this._upload = Upload;
    this._appConstant = AppConstant;
  }

  /**
   * Upload file
   * @param file
   * @returns {*}
   */
  upload(file) {
    return this._upload.upload({
      url: this._appConstant.domain + '/api/' + this._appConstant.version + '/upload/file',
      file: file,
      headers: {
        'Authorization': false
      }
    });
  }
}
