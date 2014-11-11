<?php
/**
 * Class performance
 * @author char
 */
//error_reporting(E_ALL);
class Performance {
    public $starttime = 0;
    public $lefttime   = 0;
    public $sqllist   = array();
    public static $_instance = null;

    private $_levellist      = array();
    private $_levelcolor     = array();

    public function __construct() {
        $this->_initLevelData();
        $this->_initLevelColor();

    }

    public static function getInstance() {
        if(self::$_instance == null) {
            self::$_instance = new Performance();
        }

        return self::$_instance;
    }

    /**
     * 打印页面执行效率
     */
    public function outputPerLevel() {
        if(!$this->_isStart()) return;
        $timelevel = $this->_getTimeLevel();
        $sqltotallevel  = $this->_getSqlTotalLevel();
        $sqlexeclevel = $this->_getPerSqlTimeLevel();

        $string =  '<style type="text/css">#performance{margin:0 0 0 145px;border:1px solid #999;font-size:14px;font-family:verdana;}#performance div{border:1px solid #777;padding:6px 12px;}</style>';
        $string .= '<div id="performance"><div style="margin:5px 0;background:';
        $string .= $this->_levelcolor[$timelevel] .'">page exec ['. $this->lefttime .']  s</div>';
        $string .= '<div style="background:' . $this->_levelcolor[$sqltotallevel] . ';margin:5px 0;">page have [' . sizeof($this->sqllist) . '] per Sql</div>';
        $string .= '<div style="border:1px solid #ccc;"><p>单条sql执行时间：</p></div><div style="padding: 0 8px 8px 8px;background:#888;">';
        foreach($sqlexeclevel as $k=>$v) {
            $k++;
            $string .= '<div style="background:' . $this->_levelcolor[$v['level']] . '"><span stlye="color:#ddd;margin:0 12px 0 0;">
                        '.$k.'.  执行时间：'. $v['exectime'] .'</span>  &nbsp;&nbsp;&nbsp;&nbsp;执行语句：'. $v['sql'] .'</div>';
        }
        $string .= '<div></div>';

        echo $string;
    }

    /**
     * 添加一条sql语句
     */
    public function addSql($sql) {
        if(!$this->_isStart()) return;
        $this->sqllist[]['sql'] = $sql;
    }

    /**
     * 设置当前sql开始时间
     */
    public function setSqlSTime() {
        if(!$this->_isStart()) return;
        $currkey = count($this->sqllist) - 1;
        $this->sqllist[$currkey]['st'] = microtime(true);
    }

    /**
     * 设置sql结束时间
     */
    public function setSqlETime() {
        if(!$this->_isStart()) return;
        $currkey = count($this->sqllist) - 1;
        $this->sqllist[$currkey]['et'] = microtime(true);
    }

    /**
     * 页面等级配置参数
     */
    private function _initLevelData() {
        $this->_levellist = array(
            'time'=>array(
                array('range'=>0, 'level'=>1),  //0-2
                array('range'=>0.5, 'level'=>2),  //2-5
                array('range'=>1, 'level'=>3),  //5-10
                array('range'=>2, 'level'=>4),  //10-
            ),
            'sql'=>array(
                array('range'=>0, 'level'=>1),
                array('range'=>10, 'level'=>2),
                array('range'=>20, 'level'=>3),
                array('range'=>30, 'level'=>4)
            ),
            'sqlexec'=>array(
                array('range'=>0.001, 'level'=>1),
                array('range'=>0.005, 'level'=>2),
                array('range'=>0.01, 'level'=>3)
            )
        );
    }

    /**
     * 页面等级显示色彩
     */
    private function _initLevelColor() {
        $this->_levelcolor = array(
            1=>'#ccc',
            2=>'#666',
            3=>'red',
            4=>'red'
        );
    }

    /**
     * 获取执行等级
     */
    private function _getTimeLevel() {
        $level = 1;

        if($this->starttime != 0) {
            $endtime = microtime(true);
            $this->lefttime = $endtime - $this->starttime;

            $level = $this->_getLevel($this->lefttime);
        }

        return $level;
    }

    /**
     * 获取单条sql执行效率
     */
    private function _getPerSqlTimeLevel() {
        if(!empty($this->sqllist)) {
            foreach($this->sqllist as $k=>$v) {
                $this->sqllist[$k]['exectime'] = $v['et'] - $v['st'];
                $this->sqllist[$k]['level'] = $this->_getLevel($this->sqllist[$k]['exectime'], 'sqlexec');
            }
        }

        return $this->sqllist;
    }

    /**
     * ͳ获取数值等级
     */
    private function _getLevel($val, $type='time') {
        $level = 1;

        $levellist = $this->_levellist[$type];
        foreach($levellist as $v) {
            if($val >= $v['range']) {
                $level = $v['level'];
            }
        }

        return $level;
    }

    /**
     * 获取sql条数等级
     */
    private function _getSqlTotalLevel() {
        $sqlcount = sizeof($this->sqllist);

        $level = $this->_getLevel($sqlcount, 'sql');

        return $level;
    }

    /**
     * 是否开启调试
     */
    private function _isStart() {
        $start = false;
        if(defined('APP_DEBUG') && APP_DEBUG) {
            $start = true;
        }

        return $start;
    }
}
