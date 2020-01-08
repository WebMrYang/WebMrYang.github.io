# 留言板

使用gitalk来进行留言

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.css">
<script src="https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js"></script>
<div id="gitalk-container"></div>
<script>
var gitalk = new Gitalk({
    "clientID": "8c2f22bd64d1ea012ac5",
    "clientSecret": "992cdea444e1503ceac91bfd74907b37e590a159",
    "repo": "webmryang.github.io",
    "owner": "WebMrYang",
    "admin": ["WebMrYang"],
    "id": location.pathname,      
    "distractionFreeMode": false  
});
gitalk.render("gitalk-container");
</script>



