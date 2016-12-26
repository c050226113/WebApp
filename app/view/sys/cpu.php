<html>
<head>
    <meta charset="UTF-8" />
    <title></title>
    <script src="http://code.highcharts.com/highcharts.js"></script>
</head>
<body>
<div id="container" style="width: 1000px; height: 600px; margin: 0 auto"></div>
<script language="JavaScript">
    $(document).ready(function() {
        //title
        var title = {
            text: '主机-<?=$serverName?>'
        };
        //fu title
        <?php foreach($computer as $k => $v){
            $date = date("Y-m-d",$k);
            break;
        } ?>
        var subtitle = {
            text: 'cpu status - <?=$date?>'
        };

        //x and y
        var categoriesArr = [];
        var allArr = [];
        var phpArr = [];
        var nginxArr = [];
        var mongoArr = [];
        <?php foreach($computer as $k => $v){$time=date("H:i:s",$k);?>
        categoriesArr.push('<?=$time?>');
        allArr.push(<?=$v["all"]?>);
        phpArr.push(<?=$v["php"]?>);
        nginxArr.push(<?=$v["nginx"]?>);
        mongoArr.push(<?=$v["mongod"]?>);
        <?php } ?>
        var xAxis = {
            categories: categoriesArr
        };

        var yAxis = {
            title: {
                text: 'cpu (%)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        };

        var tooltip = {
            valueSuffix: '%'
        };

        var legend = {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        };

        var series =  [
            {
                name: 'all',
                data: allArr
            },
            {
                name: 'php',
                data: phpArr
            },
            {
                name: 'nginx',
                data: nginxArr
            },
            {
                name: 'mongo',
                data: mongoArr
            }
        ];

        var json = {};

        json.title = title;
        json.subtitle = subtitle;
        json.xAxis = xAxis;
        json.yAxis = yAxis;
        json.tooltip = tooltip;
        json.legend = legend;
        json.series = series;

        $('#container').highcharts(json);
    });
</script>
</body>
</html>