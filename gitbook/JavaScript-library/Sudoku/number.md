<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,user-scalable=no" />
    <title>数独游戏</title>
    <link rel="Stylesheet" type="text/css" href="number.css" />
</head>

<body>
    <div id="cc">
    </div>
    <div class="btn-group">
        <button onclick="sd.checkRes();">完成</button>
        <button onclick="sd.reset();">重置</button>
        <button onclick="sd.again();">重玩本局</button>
    </div>
    <span style="font-size:12px;">
        11 &nbsp;21 &nbsp;31 &nbsp; &nbsp; &nbsp;41 &nbsp;51 &nbsp;61 &nbsp; &nbsp; &nbsp;71&nbsp;81 &nbsp;91<br>
        12 &nbsp;22 &nbsp;32 &nbsp; &nbsp; &nbsp;42 &nbsp;52 &nbsp;62 &nbsp; &nbsp; &nbsp;72 &nbsp;82 &nbsp;92<br>
        13 &nbsp;23 &nbsp;33 &nbsp; &nbsp; &nbsp;43 &nbsp;53 &nbsp;63 &nbsp; &nbsp; &nbsp;73 &nbsp;83 &nbsp;93<br><br>
        14 &nbsp;24 &nbsp;34 &nbsp; &nbsp; &nbsp;44 &nbsp;54 &nbsp;64 &nbsp; &nbsp; &nbsp;74 &nbsp;84 &nbsp;94
        &nbsp;<br>
        15 &nbsp;25 &nbsp;35 &nbsp; &nbsp; &nbsp;45 &nbsp;55 &nbsp;65 &nbsp; &nbsp; &nbsp;75 &nbsp;85 &nbsp;95
        &nbsp;<br>
        16 &nbsp;26 &nbsp;36 &nbsp; &nbsp; &nbsp;46 &nbsp;56 &nbsp;66 &nbsp; &nbsp; &nbsp;76 &nbsp;86 &nbsp;96<br><br>
        17 &nbsp;27 &nbsp;37 &nbsp; &nbsp; &nbsp;47 &nbsp;57 &nbsp;67 &nbsp; &nbsp; &nbsp;77 &nbsp;87 &nbsp;97
        &nbsp;<br>
        18 &nbsp;28 &nbsp;38 &nbsp; &nbsp; &nbsp;48 &nbsp;58 &nbsp;68 &nbsp; &nbsp; &nbsp;78 &nbsp;88 &nbsp;98
        &nbsp;<br>
        19 &nbsp;29 &nbsp;39 &nbsp; &nbsp; &nbsp;49 &nbsp;59 &nbsp;69 &nbsp; &nbsp; &nbsp;79 &nbsp;89 &nbsp;99
        &nbsp;</span>
    <script src="http://apps.bdimg.com/libs/jquery/1.8.1/jquery.min.js"></script>
    <script src="number.js"></script>
    <script>
        var sd = new SD;
        sd.init(30);
    </script>
</body>

</html>