(function ($) {
    $.fn.upload = function (params) {
        var opts =
                {
                    flash_url: params.upload_skinpath + "js/swfupload/swfupload.swf",
                    file_types: "*.rar;*.zip;*.7z;*.doc;*.docx;*.xlsx;*.xls;*.jpg;*.png;*.gif",
                    file_upload_limit: 0,//限定用户一次性最多上传多少个文件
                    file_queue_limit: 0,//上传队列数量限制，该项通常不需设置，会根据file_upload_limit自动赋值
                    file_types_description: "所有文件",//文件提示说明
                    file_size_limit: "2000MB",
                    button_action: SWFUpload.BUTTON_ACTION.SELECT_FILES,//模式，SWFUpload.BUTTON_ACTION.SELECT_FILE 单文件
                    button_image_url: params.upload_skinpath + "js/swfupload/images/swfupload_uploadbtn.png",
                    button_text: "上 传",
                    button_width: "60",//按钮宽度
                    button_height: "22",//按钮高度
                    upload_url: "common.upload.html",
                    uploadSuccess: uploadSuccess,
                    custom_settings: { listTarget: ".attachment-list", cardTarget: ".attachment-card" },//上传完之后列表框，listTarget为列表，cardTarget为卡片（相册）
                    button_text_left_padding: 0,
                    button_text_top_padding: 0,
                    upload_images_url:'',
                    upload_end_close: false,//上次成功是否关闭列表
                    upload_end_callback: function () { }
                }
        var self = $.extend({}, opts, params || {});
        $(this).swfupload(self);

        //成功
        function uploadSuccess(file, serverData) {
            if (file.filestatus != "-4") return;
            var uploadfile = self.upload_images_url+ serverData;
    
            if (typeof FileProgress == "function") {
                var el = $(this.customSettings.listTarget).find("#" + file.id);
                el.attr("data-url", uploadfile).find(".progressName").attr("rel", uploadfile);
                //加载文件格式小图标
                var extension = getFileCategoryClasses(file.type);
                $(this.customSettings.listTarget).find("#" + file.id).addClass(extension);
                //弹窗提示
                tips(el.find(".progressName"));
            }
            if (typeof PictureListProgress == "function") {
                var el = $(this.customSettings.cardTarget).find("#" + file.id);
                el.attr({ "data-url": uploadfile }).find(".progressName").attr({ "rel": serverData });
            }

            if (self.upload_end_close) { el.end().fadeOut(1000); }
            self.upload_end_callback.call(this, file,serverData);
            return { file: file, Url: uploadfile }
        }

        //上传文件类别的图标
        function getFileCategoryClasses(extension) {
            var categoryClass = { "word": "file-word", "execl": "file-execl", "zip": "file-zip", "picture": "file-picture" };
            var categoryGroup = { "word": ["doc", "docx"], "execl": ["xlsx"], "zip": ["zip", "7z", "rar"], "picture": ["jpg", "png", "gif"] };
            var ext = extension.replace(".", "").toLowerCase();
            var temp = "";
            $.each(categoryGroup, function (name, value) {
                if ($.inArray(ext, this) >= 0) {
                    return temp = categoryClass[name];
                }
            });
            return temp;
        }

        //上次提示
        function tips(el) {
            el.each(function () {
                var src = $(this).attr('rel') || $(this).attr('src');
                $(this).qtip({
                    id: false,
                    overwrite: true,
                    suppress: true,
                    content: {
                        text: '<img class="throbber" width="200" src="' + src + '" alt="Loading..." />'
                    },
                    position: {
                        my: 'top left',
                        target: $(this),
                        viewport: $(window), // Keep it on-screen at all times if possible
                        adjust: {
                            x: 0, y: 0
                        }
                    },
                    hide: {
                        fixed: true,
                        delay: 200
                    },
                    style: {
                        classes: 'qtip-shadow qtip-optimize qtip-optimize-home'
                    },
                    show: {
                        delay: 200,
                        solo: false
                    }
                });
            });
        }
    }
})(jQuery)
