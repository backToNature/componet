/**
 * Created by wenshui on 14/12/23.
 */

var componet = {
		/**
		 * @description 把json数据转化为string类型
		 */
		json2str : function (o) {
			var arr = [];
            var fmt = function(s) {
                if (typeof s == 'object' && s != null) return json2str(s);
                return /^(string|number)$/.test(typeof s) ?
                    "'" + s + "'" : s;
            };
            for (var i in o) arr.push("'" + i + "':" + fmt(o[i]));
            return '{' + arr.join(',') + '}';
		},
		/**
		 * @description 获取窗口可视宽高度，显示屏高度,浏览器最大可提供的高度，浏览器外部高度,滚动条顶部距离浏览器顶部的像素
		 */
  		getWin : function () {
            // 窗口可视高度
            var eyesHeight = window.innerHeight || document.documentElement.clientHeight;
            // 显示屏高度
            var screenHeight = window.screen.height;
            // 浏览器最大可提供的高度
            var browerScreenHeight = window.screen.availHeight;
            // 浏览器外部高度
            var browerOuterHeight = window.outerHeight;
            // 滚动条顶部距离浏览器顶部的像素
            var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
            var test = document.getElementById('test');

            var winInfo = {
                eyesHeight: eyesHeight,
                screenHeight: screenHeight,
                browerScreenHeight: browerScreenHeight,
                browerOuterHeight: browerOuterHeight,
                scrollTop: scrollTop
            };
            return winInfo;
		},
		/**
		 * @description 动态加载script,并提供加载后回调函数
		 */
		loadJs : function (src, fun) {
            var head = document.getElementsByTagName('head')[0] || document.head || document.documentElement;

            var script = document.createElement('script');
            script.setAttribute('type', 'text/javascript');
            script.setAttribute('charset', 'UTF-8');
            script.setAttribute('src', src);

            if (typeof fun === 'function') {
                if (window.attachEvent) {
                    script.onreadystatechange = function () {
                        var r = script.readyState;
                        if (r === 'loaded' || r === 'complete') {
                            script.onreadystatechange = null;
                            fun();
                        }
                    };
                } else {
                    script.onload = fun;
                }
            }

            head.appendChild(script);
        }
};

