/// <reference path="../../Scripts/jquery-1.8.2.js" />
//rar,*.zip,*.7z,*.doc,*.docx,*.xlsx,*.xls,*.jpg,*.png,*.gif
(function ($) {
    $.fn.swfupload = function (params) {
        var opts =
				{
				    flash_url: "",
				    upload_url: '',//请求路径
				    post_params: {},//自定义参数
				    file_size_limit: '20MB',//上传文件最大限制
				    file_types: "*.rar;*.zip;*.7z;*.doc;*.docx;*.xlsx;*.xls;*.jpg;*.png;*.gif;*.bmp",//允许上传的文件格式
				    file_types_description: "所有文件",//文件提示说明
				    file_upload_limit: 0,//限定用户一次性最多上传多少个文件
				    file_queue_limit: 0,//上传队列数量限制，该项通常不需设置，会根据file_upload_limit自动赋值
				    file_post_name:'',
				    post_params: {},//自定义参数
				    button_action: SWFUpload.BUTTON_ACTION.SELECT_FILES,//模式，SWFUpload.BUTTON_ACTION.SELECT_FILE 单文件
				    button_width: "62",//按钮宽度
				    button_height: "22",//按钮高度
				    button_image_url: "",//上传按钮
				    button_text: "",
				    button_text_left_padding: 0,
				    button_text_top_padding: 0,
				    uploadStart: function () { },//开始上传
				    uploadSuccess: function () { },//成功
				    uploadProgress: uploadProgress,
				    custom_settings: {}
				}
        var swfuploadinit = function () {
            var loadSettings = this.params = $.extend({}, opts, params || {});
            var settings = {
                flash_url: loadSettings.flash_url,
                file_size_limit: loadSettings.file_size_limit,
                file_types: loadSettings.file_types,//限制上传格式
                file_types_description: loadSettings.file_types_description,
                file_upload_limit: loadSettings.file_upload_limit,
                file_queue_limit: loadSettings.file_queue_limit,
                file_dialog_complete_handler: fileDialogComplete,
                file_queue_error_handler: fileQueueError,
                file_post_name: loadSettings.file_post_name,
                post_params: loadSettings.post_params,//自定义参数
                debug: false,
                button_action: loadSettings.button_action,
                button_width: loadSettings.button_width,
                button_height: loadSettings.button_height,
                button_placeholder: this[0],
                button_image_url: loadSettings.button_image_url,
                button_text: "<span class='swf_button'>" + loadSettings.button_text + "</span>",
                button_text_left_padding: loadSettings.button_text_left_padding,
                button_text_top_padding: loadSettings.button_text_top_padding,
                upload_url: loadSettings.upload_url,
                upload_progress_handler: loadSettings.uploadProgress,
                upload_start_handler: loadSettings.uploadStart,
                button_text_style: '.swf_button{font-size: 12px;color:#666;text-align: center;line;height:20px}',
                upload_error_handler: uploadError,
                upload_success_handler: function (file, data) {
                    var result = loadSettings.uploadSuccess.call(this, file, data);
                    if (result != null && isPicture(file)) {
                        var picture = modeCard.call(this, file, 100);
                        if (picture != null) {
                            picture.SetPicture(result.Url);
                        }
                    }
                },
                upload_complete_handler: uploadComplete,
                custom_settings: loadSettings.custom_settings,
                file_queued_handler: function (file) {
                    modeList.call(this, file);
                    modeCard.call(this, file);
                }
            };
            return new SWFUpload(settings);
        }

        $.each(this, function () {
            return swfuploadinit.call($(this));
        });
    }

    function uploadProgress(file, bytesLoaded, bytesTotal) {
        try {
            var percent = Math.ceil((bytesLoaded / bytesTotal) * 100);
            modeList.call(this, file, percent);
            modeCard.call(this, file, percent);

        } catch (ex) {
            this.debug(ex);
        }
    }

    function fileDialogComplete(numFilesSelected, numFilesQueued) {
        try {
            if (numFilesQueued > 0) {
                this.startUpload();
            }
        } catch (ex) {
            this.debug(ex);
        }
    }
    function fileQueueError(file, errorCode, message) {
        try {
            var errorMsg = "";
            switch (errorCode) {
                case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
                    if (message > 0) {
                        errorMsg = "您只能上传" + message + "个文件!";
                    } else {
                        errorMsg = "您不可继续上传文件!";
                    }
                    break;
                case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
                    errorMsg = "您不可上传0字节的文件";
                    break;
                case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
                    errorMsg = "文件不可大于" + this.settings.file_size_limit;
                    break;
                case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
                case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
                default:
                    alert(message);
                    break;
            }
            if (errorMsg !== "") {
                alert(errorMsg);
                return;
            }
        } catch (ex) {
            this.debug(ex);
        }
    }
    function uploadError(file, errorCode, message) {
        try {
            var progress;
            if (typeof FileProgress == "function") {
                var progress = new FileProgress(file, this.customSettings.listTarget);
                progress.setError();
                progress.toggleCancel(false);
            }
            var progress1;
            if (typeof PictureListProgress == "function") {
                progress1 = new PictureListProgress(file, this.customSettings.listTarget);
                progress1.setError();
                progress1.toggleCancel(false);
            }

            switch (errorCode) {
                case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
                    progress.setStatus("Upload Error: " + message);
                    progress1.setStatus("Upload Error: " + message);
                    this.debug("Error Code: HTTP Error, File name: " + file.name + ", Message: " + message);
                    break;
                case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
                    progress.setStatus("Upload Failed.");
                    progress1.setStatus("Upload Failed.");
                    this.debug("Error Code: Upload Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                    break;
                case SWFUpload.UPLOAD_ERROR.IO_ERROR:
                    progress.setStatus("Server (IO) Error");
                    progress1.setStatus("Server (IO) Error");
                    this.debug("Error Code: IO Error, File name: " + file.name + ", Message: " + message);
                    break;
                case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
                    progress.setStatus("Security Error");
                    progress1.setStatus("Security Error");
                    this.debug("Error Code: Security Error, File name: " + file.name + ", Message: " + message);
                    break;
                case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
                    progress.setStatus("Upload limit exceeded.");
                    progress1.setStatus("Upload limit exceeded.");
                    this.debug("Error Code: Upload Limit Exceeded, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                    break;
                case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
                    progress.setStatus("Failed Validation.  Upload skipped.");
                    progress1.setStatus("Failed Validation.  Upload skipped.");
                    this.debug("Error Code: File Validation Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                    break;
                case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
                    // If there aren't any files left (they were all cancelled) disable the cancel button
                    if (this.getStats().files_queued === 0) {
                        document.getElementById(this.customSettings.cancelButtonId).disabled = true;
                    }
                    progress.setStatus("Cancelled");
                    progress1.setStatus("Cancelled");
                    progress.setCancelled();
                    break;
                case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
                    progress.setStatus("Stopped");
                    progress1.setStatus("Stopped");
                    break;
                default:
                    progress.setStatus("Unhandled Error: " + errorCode);
                    progress1.setStatus("Unhandled Error: " + errorCode);
                    this.debug("Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                    break;
            }
        } catch (ex) {
            this.debug(ex);
        }
    }
    function uploadComplete(file) {
        try {
            if (this.getStats().files_queued > 0) {
                this.startUpload();
            } else {

            }
        } catch (ex) {
            this.debug(ex);
        }
    }

    function modeList(file, percent) {
        if (typeof FileProgress != "function") return null;
        if (percent == null) { percent = 0; }
        var progress = new FileProgress(file, this.customSettings.listTarget);//列表进度
        if (percent === 100) {
            progress.toggleCancel(false, this);

        } else {
            progress.toggleCancel(true, this);

        }
        progress.setProgress(percent);
        progress.setStatus(percent + "%");
        return progress;
    }

    function modeCard(file, percent) {
        if (typeof PictureListProgress != "function") return null;
        if (percent == null) { percent = 0; }
        if (isPicture(file)) {
            var pictrue = new PictureListProgress(file, this.customSettings.cardTarget);//卡片进度
            if (percent === 100) {
                pictrue.toggleCancel(false, this);
            }
            else {
                pictrue.toggleCancel(true, this);
            }
            pictrue.setProgress(percent);
            pictrue.setStatus(percent + "%");
            return pictrue;
        }
    }
    function isPicture(file) {
        var type = [".jpg", ".png", ".gif", ".bmp"];
        return $.inArray(file.type.toLowerCase(), type) >= 0;
    }
})(jQuery)