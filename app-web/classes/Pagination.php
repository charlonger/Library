<?php
class Pagination {
    // 分页配置
    public static $pageSize = 3;
    public static $currentPage = 15;
    public static $total = 100;
    public static $pageMoreSize = 2;
    public static $borderSize = 2;
    public static $pageName = 'p';

    // 分页状态
    public static $pageTotal = 1;
    public static $isFirst = false;
    public static $isLast  = false;
    public static $leftMore = false;
    public static $rightMore = false;

    public static function init() {
        self::$currentPage = max(1, $_GET['p']);  // 外部设置当前页的值

        self::$pageTotal = ceil(self::$total / self::$pageSize);

        if((self::$currentPage - self::$pageMoreSize) > self::$borderSize) {
            self::$leftMore = true;
        }

        if((self::$currentPage + self::$pageMoreSize) < (self::$pageTotal - self::$borderSize)) {
            self::$rightMore = true;
        }

        if(self::$currentPage == 1) {
            self::$isFirst = true;
        }

        if(self::$currentPage == self::$pageTotal) {
            self::$isLast = true;
        }
    }

    /**
     * 获取分页列表数据
     * @return array
     */
    public static function getPageList() {

        if(self::$leftMore) {
            $pageList = range(1, self::$borderSize);
            $pageList[] = '...';
            $pageList = array_merge($pageList, range((self::$currentPage - self::$pageMoreSize), self::$currentPage));
        } else {
            $pageList = range(1, self::$currentPage);
        }

        if(self::$rightMore) {
            $pageList = array_merge($pageList, range(self::$currentPage + 1, (self::$currentPage + self::$pageMoreSize)));
            $pageList[] = '...';
            $pageList = array_merge($pageList, range((self::$pageTotal - self::$pageMoreSize), self::$pageTotal));
        } elseif(self::$currentPage != self::$pageTotal) {
            $pageList = array_merge($pageList, range((self::$currentPage + 1), self::$pageTotal));
        }

        return $pageList;
    }


    public static function show() {
        self::init();
        $pageList = self::getPageList();
        $pageHtml = "<div class='page'><ul>";

        if(self::$isFirst) {
            $pageHtml .= "<li class='active'><span class='disabled home'>&nbsp;</span></li>";
            $pageHtml .= "<li class='active'><span class='disabled prev'>&nbsp;</span></li>";
        } else {
            $pageHtml .= "<li><a href='". self::makeHref(1) ."' class='page-link home'>&nbsp;</a></li>";
            $pageHtml .= "<li><a href='". self::makeHref(max((self::$currentPage-1), 1)) ."' class='page-link prev'>&nbsp;</a></li>";
        }

        foreach($pageList as $v) {
            if(is_numeric($v)) {
                if($v == self::$currentPage) {
                    $pageHtml .= "<li class='active'><span class='current'>{$v}</span></li>";
                } else {
                    $pageHtml .= "<li><a href='". self::makeHref($v) ."'>{$v}</a></li>";
                }
            } else {
                $pageHtml .= "<li class='disabled'><span class='ellipse'>{$v}</span></li>";
            }
        }

        if(self::$isLast) {
            $pageHtml .= "<li class='active'><span class='disabled next'>&nbsp;</span></li>";
            $pageHtml .= "<li class='active'><span class='disabled end'>&nbsp;</span></li>";
        } else {
            $pageHtml .= "<li><a href='". self::makeHref(min(self::$currentPage+1, self::$pageTotal)) ."' class='page-link next'>&nbsp;</a></li>";
            $pageHtml .= "<li><a href='". self::makeHref(self::$pageTotal) ."' class='page-link end'>&nbsp;</a></li>";
        }
        $pageHtml .= "</ul></div>";
        echo self::getStyle();
        echo $pageHtml;die();
    }

    public static function makeHref($p, $link='') {
        $link = ($link == '') ? $_SERVER['PATH_INFO'] : $link;
        $params = $_GET;
        $params[self::$pageName] = $p;
        $query = "";

        foreach($params as $k=>$v) {
            $query .= "{$k}={$v}&";
        }

        $query = trim($query, '&');
        $link .= '?'.$query;
        return $link;
    }

    public static function getStyle() {
        return "<style type='text/css'>
a {
text-decoration: none;
color: #333;
}
ul, ol, li, ul, dd, dt {
list-style: none;
list-style-image: none;
}
.page { height: 26px; line-height: 26px; text-align: right;}
.page li { display: inline-block; height: 26px; line-height: 26px; zoom: 1; *float:left;
}
.page span, .page a { display: inline-block; height: 26px; line-height: 26px; padding: 0 8px; border: 1px solid #d8dee3; background-color: #fff; margin-left: 6px; font-size: 12px; zoom: 1; color:#8d94a0; }
.page span b { color: #308fd4; }
.page .disabled { background-color: #fff; filter: gray alpha(opacity=30); opacity: .3; margin-left: 5px; }
.page .ellipse { border: none; background: none; }
.page .current { border-color: #308fd4; background-color: #308fd4; color: #fff; margin-left: 5px; }
.page .info { background-color: transparent; }
.page .home, .page .end, .page .prev, .page .next { width: 7px; background-image: url(http://i.tripb2b.com/skin/manager.v1/images/ico.png); background-repeat: no-repeat; }
.page .home { background-position: -114px -154px; }
.page .end { background-position: -234px -154px; }
.page .prev { background-position: -153px -154px; }
.page .next { background-position: -191px -154px; }
.page a:hover { border-color: #308fd4; background-color: #308fd4; color: #fff; background-position-y: -194px; }
        </style>";
    }
}