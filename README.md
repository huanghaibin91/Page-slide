# page-slide

jQuery页面滑动插件，可简单实现全屏滚动和轮播图效果，觉得不错可以[star](https://github.com/huanghaibin91/Page-slide)一下

----------
- 插件默认参数

		direction: 'vertical', // 滑动方向，参数vertical,horizontal
        fullPage: true, // 是否是全屏滑动
        width: 500, // 全屏滑动设置为false，不是全屏滚动时，设置滑动宽度
        height: 500, // 全屏滑动设置为false，不是全屏滚动时，设置滑动高度
        autoSlide: false, // 是否自动滚动,自动滑动时鼠标放到页面上会停止滑动，移开会重新滑动
        loop: true, // 是否循环滚动，循环滚动时在最后一张会回滚到第一张
        delay: 3000, // 自动滚动间隔时间
        duration: 1000, // 滚动持续时间
        navigation: true, // 是否显示定位分页，分页导航样式可在CSS中设置，当前导航会获得类名`active`，导航样式请在CSS中设置
        navigationEvent: 'click', // 定位分页触发事件，如mouseover、click
        callback: function () {}, // 回调函数，默认传入参数index，方便判断当前页

- 页面结构
		
		<!-- 目标div结构 -->
		<div>
			<div>
				<div>Page One</div>
				<div>Page Two</div>
				<div>Page Three</div>
			</div>

			<!-- 设置navigation设置为true，将会自动生成导航元素
			<ul>
				<li> 1 </li>
				<li> 2 </li>
				<li> 3 </li>
			</ul>
			-->
		<div>

- demo演示

全屏滚动演示： [https://huanghaibin91.github.io/Page-slide/demo/demo-fullpage](https://huanghaibin91.github.io/Page-slide/demo/demo-fullpage "全屏滚动")

轮播图演示： [https://huanghaibin91.github.io/Page-slide/demo/demo-carousel](https://huanghaibin91.github.io/Page-slide/demo/demo-carousel "轮播图")

回调函数演示： [https://huanghaibin91.github.io/Page-slide/demo/demo-callback](https://huanghaibin91.github.io/Page-slide/demo/demo-callback "回调函数")