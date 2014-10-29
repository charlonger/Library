/// <reference path="../js/jquery-1.10.2.min.js" />
/*
说明：基于swfupload的扩展
功能：图片上传的卡片模式上传
*/

function PictureListProgress(file, targetElement) {
    if (!$(targetElement).length) return;
	this.fileProgressID = file.id;

	this.opacity = 100;
	this.height = 0;
	this.fileProgressWrapper = $(targetElement).find("#" + this.fileProgressID);
	if (!this.fileProgressWrapper.length) {
	    this.fileProgressWrapper = $("<div>", { "class": "progressWrapper", "id": this.fileProgressID });
	    this.fileProgressElement = $("<div>", { "class": "progressContainer" });

	    this.progressCancel = $("<a>", { "class": "progressCancel", "href": "javascript:;" }).hide().text("\u53d6\u6d88");//取消按钮

	    this.progressDelete = $("<a>", { "class": "progressDelete", "href": "javascript:;" }).text("删除");//删除按钮

	    this.progressText = $("<div>", { "class": "progressName", text: file.name });//文件名

	    this.progressBar = $("<div>", { "class": "progressBarInProgress" });//进度条

	    this.progressStatus = $("<div>", { "class": "progressBarStatus" });//进度文本

	    this.progressTotalBar = $("<div>", { "class": "progressTotalBar" });//总进度背景

	    this.progressImage = $("<img>", { "class": "progressImage" }).hide();//背景图片

	    this.progressImageBox = $("<div>", { "class": "progressImageBox" });//背景图片的BOX

	    this.progressChangeNameBox = $("<div>", { "class": "progressChangeNameBox" });//名称输入

	    this.progressChangeTitle = $("<label>", { "class": "progressChangeTitle", text: "名称：" });

	    this.progressChangeText = $("<input>", { "class": "progressChangeText", "type": "text", name: "picturename[]", value: file.name });

	    this.progressSetCoverBox = $("<label>", { "class": "progressSetCoverBox", text: "设为封面：" });//设置封面

	    this.progressIsCover = $("<input>", { "type": "radio", "name": "cover", "class": "progressIsCover"});//设置为封面radio

	    this.progressSetCoverBox.append(this.progressIsCover);

	    this.progressImageBox.text("上传中...").append(this.progressImage);

	    this.progressTotalBar.append(this.progressBar, this.progressStatus);

	    this.progressChangeNameBox.append(this.progressChangeTitle, this.progressChangeText);

	    this.fileProgressElement.append(this.progressCancel);
	    this.fileProgressElement.append(this.progressDelete);//删除暂时停用
	    this.fileProgressElement.append(this.progressText);
	    this.fileProgressElement.append(this.progressTotalBar);
	    this.fileProgressElement.append(this.progressImageBox);
	    this.fileProgressElement.append(this.progressChangeNameBox);
	    this.fileProgressElement.append(this.progressSetCoverBox);

	    this.fileProgressWrapper.append(this.fileProgressElement);

	    $(targetElement).show().append(this.fileProgressWrapper);
	}
	else {
	    var box = $(targetElement).find("#" + this.fileProgressID);
	    this.fileProgressWrapper = box;
	    this.fileProgressElement = box.find(".progressContainer");
	    this.progressCancel = box.find(".progressCancel");
	    this.progressDelete = box.find(".progressDelete");
	    this.progressText = box.find(".progressText");
	    this.progressBar = box.find(".progressBar");
	    this.progressStatus = box.find(".progressStatus");
	    this.progressTotalBar = box.find(".progressTotalBar");
	    this.progressImage = box.find(".progressImage");
	    this.progressImageBox = box.find(".progressImageBox");
	    this.progressChangeNameBox = box.find(".progressChangeNameBox");
	    this.progressChangeTitle = box.find(".progressChangeTitle");
	    this.progressChangeText = box.find(".progressChangeText");
	    this.progressSetCoverBox = box.find(".progressSetCoverBox");
	    this.progressIsCover = box.find(".progressIsCover");
	}
}


PictureListProgress.prototype.reset = function () {
    this.fileProgressElement.attr("class", "progressContainer");

    this.progressStatus.html(" ");
    this.progressStatus.attr("class", "progressBarStatus");

    this.progressBar.attr("class", "progressBarInProgress");
    this.progressBar.width("0%");

    this.appear();
};
PictureListProgress.prototype.setProgress = function (percentage) {
    this.fileProgressElement.attr("class", "progressContainer green");
    this.progressBar.attr("class", "progressBarInProgress");
    this.progressBar.width(percentage + "%");

    this.appear();
};

PictureListProgress.prototype.setStatus = function (status) {
    this.progressStatus.html(status);
};

// Show/Hide the cancel button
PictureListProgress.prototype.toggleCancel = function (show, swfUploadInstance) {
    var $this=this;
    if (show) {
        this.progressTotalBar.show();
        this.progressCancel.show();
        this.progressDelete.hide();
    } else
    {
        this.progressTotalBar.hide();
        this.progressCancel.hide();
        this.progressDelete.show()
    }
    if (swfUploadInstance) {
        var fileID = this.fileProgressID;
        this.progressCancel.click(function () {
            swfUploadInstance.cancelUpload(fileID);
            $(this).fadeOut(200);
            $this.fileProgressWrapper.fadeOut(800, function () { $(this).remove()});
            return false;
        }) 
    }
};

PictureListProgress.prototype.appear = function () {
    if (this.fileProgressWrapper.get(0).filters) {
        try {
            this.fileProgressWrapper.get(0).filters.item("DXImageTransform.Microsoft.Alpha").opacity = 100;
        } catch (e) {
            // If it is not set initially, the browser will throw an error.  This will set it if it is not set yet.
            this.fileProgressWrapper.get(0).style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity=100)";
        }
    } else {
        this.fileProgressWrapper.get(0).style.opacity = 1;
    }

    this.fileProgressWrapper.get(0).style.height = "";

    this.height = this.fileProgressWrapper.get(0).offsetHeight;
    this.opacity = 100;
    this.fileProgressWrapper.get(0).style.display = "";

};

PictureListProgress.prototype.SetPicture = function (url) {
    this.progressImage.attr("src", url).show();
}