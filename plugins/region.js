(function($){
    $.cachedScript = function( url, options ) {
      options = $.extend( options || {}, {
        dataType: "script",
        cache: options.cache,
        url: url
      });
      return $.ajax( options );
    };

    $.fn.region = function(options) {
        var obj = this;
        var config = $.extend({}, $.fn.region.defaults, options);
        $.cachedScript(config.script, options).done(function(){
            createRegion(
                obj.selector,
                config.values,
                config.callback,
                config.depth,
                config.names,
                config.attrs,
                config.filters,
                config.hidenames,
                config.datatype,
                config.usetext
            );

            if(config.loaded !== null) {
                config.loaded();
            }
        });

        return obj;
    };

    $.fn.region.defaults = {
        script : '/citis.js.html?parentid=100001', // 地区数据js文件
        values : [], // 默认选中值，数组，如： [123,456]
        depth : 3, // 3 表示三级联动，默认2级
        callback: null, // 回调函数
        names : ['provinceid', 'cityid', 'areaid', 'zoneid'], // 各select name ，默认['provinceid', 'cityid', 'areaid', 'zoneid']
        attrs : [], // 各 select 的属性，如: [{datatype:'*'}]
        filters : [], // 各 select 白名单过滤，如：['浙江,江苏,', '杭州,南京'] , 如果 usetext 不为true,这里用id
        datatype: null, // 验证数据类型
        usetext: true, // 使用文字而非id
        loaded: null,
        cache:true
    };
})(jQuery);

function createRegion(container, vals, cb, depth, names, attrs, filters, hidenames, datatype, usetext, data, target, select, options, deftext, defopt, disab, depthcopy, callee, index, i) {
    deftext='请选择',disab='disabled',defopt="<option value=''>"+deftext+"</option>",callee=arguments.callee;
    if (container) {
        if(!data) data = ALLREGIONS;
        names = names.splice(0, depth);
        attrs = attrs.splice(0, depth);
        filters = filters.splice(0, depth);
    }
    index = names.length - depth;
    select = $("<select>");
    select.attr($.extend({}, attrs[index], {
        name : names[index],
        depth : depth
    }));

    if ($.inArray(names[names.length - depth], hidenames) > -1) { select.hide() }
    depthcopy = depth--;
    options = select.prop("options");
    select.bind("change", function(e,t) {
        t = e.target;
        $(t).nextUntil().attr("name","").attr("class",disab).html(defopt).attr(disab, true);
        var curvalue = usetext ? $(t).find(':selected').data('id') : t.value;
        if(curvalue && $(t).attr("depth")>1) {
            for(i=0; i<data.length && data[i][0] != curvalue; i++);
            if(typeof data[i][2] !== "undefined") {
                $(t).parent().find("select:last").remove();
                callee(0, vals.splice(1, 4), cb, depth, names, attrs, filters, hidenames, datatype, usetext, data[i][2], t);
            }
        }
        if(typeof cb=="function") cb.call(null, e);
    });
    options[0] = new Option(deftext, '');
    var filterstr = filters[index] ? ','+filters[index]+',' : false;
    if(usetext){
        for(i=0; i<data.length; i++){
            if (! filterstr || filterstr.indexOf(data[i][1]) !== -1) select.append('<option data-id="'+data[i][0]+'" value="'+data[i][1]+'">'+data[i][1]+'</option>');
        }
    } else {
        for(i=0; i<data.length; i++){
            if (! filterstr || filterstr.indexOf(','+data[i][0]+',') !== -1)options[options.length] = new Option(data[i][1], data[i][0]);
        }
    }
    target ? select.insertAfter(target) : select.appendTo(container);
    setTimeout(function(){
         if(vals.length) select.val(vals[0]).trigger("change");
    }, 10);
    if(container) while(--depthcopy)$("<select>").attr("class",disab).html(defopt).attr(disab, true).appendTo(container);
}
