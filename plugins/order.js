/// <reference path="../../400003/js/jquery-1.8.3.min.js" />
function buyer_details_load() {
    operation.setupVisitorChangeCategory();//改变游客类别
    operation.deleteVisitorList();
    operation.addVisitorList();
    operation.setupVisitorPrice();
    operation.setupImportVisitor()
}
function seller_details_load() {
    operation.setupVisitorChangeCategory();//改变游客类别
    operation.deleteVisitorList();
    operation.addVisitorList();
    operation.setupVisitorPrice();
    operation.setupImportVisitor();
}

var operation = {
    //删除游客列表名单
    deleteVisitorList: function () {
        var index = 0;
        $(".visitors-list").on("click", ".ico-del", function () {
            if ($(this).closest("table").find("tbody tr").size() <= 1) {
                layer.msg("不允许删除最后的游客信息"); return;
            }
            var id=$(this).attr("data-id");
            var c = $(this).attr("category");
            if (id) {
                var input = $("<input>", { "type": "hidden", "value": c, name: "delinfo[" + id + "]" });
                $(".visitors-list").after(input);
            }
            
            $(this).closest("tr").remove();
            operation.refreshVisitorSort();
            operation.refreshViewStatus();//刷新价格
        });
    },
    //新增游客列表名单
    addVisitorList: function () {
        $(".visitors-list").on("click", ".ico-add", function () {
            if (config.status) { layer.msg("不能添加人数"); return; }
            var adult = $(".adult-visitor-box tr").size();
            var children = $(".children-visitor-box tr").size();
            if (config.person_quantity_limit <= adult + children) { layer.msg("已经客满"); return; }
           
            var type = parseInt($(this).closest("tr").find(".category").val()) || 0;
            var params = { categoryid: type };
            $(this).closest("tr").after(operation.createVisitorRow(params));
            operation.refreshVisitorSort();
            operation.refreshViewStatus();//刷新价格
        });
    },
    //创建游客列表
    createVisitorRow: function (params) {
        var opts = {
            name: "",
            gender: 0,
            categoryid: 0,
            mobile: "",
            idcard: "",
            isroom: false,
            remark: ""
        };
        var result = $.extend({}, opts, params || {});
        return $("#list").tmpl(result);
    },
    //刷新游客列表名单的索引
    refreshVisitorItemIndex: function () {
        $(".visitors-list tr").each(function (index, el) {
            $(this).find("td").eq(0).html(index);
        });
    },
    refreshViewStatus: function () {
        $(".adult-visitor-box,.children-visitor-box,.baby-visitor-box").each(function () { $(this).find("tr").size() == 0 ? $(this).hide() : $(this).show() });
        var adult = $(".adult-visitor-box tr").size();
        var children = $(".children-visitor-box tr").size();
        var surplus = config.person_quantity_limit - adult - children;
        if (surplus < 0) surplus = 0;
        $(".surplus").text(surplus);

        //TODO 计算价格
    },
    setupVisitorChangeCategory: function () {
        $(".visitors-list").on("keyup change", ".category", function () {
            operation.refreshVisitorSort();
            operation.refreshViewStatus();
        });
    },
    setupVisitorPrice: function () {
        operation.refreshVisitorSort();
        operation.refreshViewStatus();//刷新价格
        operation.refreshVisitorItemIndex();
    },
    refreshVisitorSort: function () {
        var $adult = $(".adult-visitor-box");
        var $children = $(".children-visitor-box");
        var $baby = $(".baby-visitor-box");
        $adult.find(".category").each(function () { if ($(this).val() == "1") { $(this).closest("tr").appendTo($children) } if ($(this).val() == "2") { $(this).closest("tr").appendTo($baby) } })
        $children.find(".category").each(function () { if ($(this).val() == "0") { $(this).closest("tr").appendTo($adult) } if ($(this).val() == "2") { $(this).closest("tr").appendTo($baby) } })
        $baby.find(".category").each(function () { if ($(this).val() == "0") { $(this).closest("tr").appendTo($adult) } if ($(this).val() == "1") { $(this).closest("tr").appendTo($children) } })
        operation.refreshVisitorItemIndex();
    },
     setupImportVisitor: function () {
        $(".batch-import-button").mousemove(function (e) {
            var j = $(this).closest("div.upload-file-box").position();
            var o = $(this).closest("div.upload-file-box").offset();
            var top = o.top - j.top;
            var left = o.left - j.left;
            var x = e.pageX;
            var y = e.pageY;
            var l = 0, t = 0;
            if ($.browser.msie && (window.navigator.userProfile + '') == 'null') {//360
                l = 20; t = 25;
            } else {
                l = 20; t = 8;
            }
            $(".list-batch-import").css({ "top": y - top - t, "left": x - left - l });
        });

    }
}