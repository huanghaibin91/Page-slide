# page-slide
jQuery页面滑动插件，可简单实现全屏滚动和轮播图效果

----------
- 插件默认参数

		direction: 'vertical', // 滑动方向，参数vertical,horizontal
        fullPage: true, // 是否是全屏滑动
        width: 500, // 不是全屏滚动时，设置滑动宽度
        height: 500, // 不是全屏滚动时，设置滑动高度
        autoSlide: false, // 是否自动滚动
        loop: true, // 是否循环滚动，循环滚动时在最后一张会回滚到第一张
        delay: 3000, // 自动滚动间隔时间
        duration: 1000, // 滚动持续时间
        navigation: true, // 是否显示定位分页，分页导航样式可在CSS中设置，当前导航会获得类名`active`
        navigationPosition: 'bottom', // 定位分页位置，参数bottom,right
        navigationEvent: 'click', // 定位分页触发事件，如mouseover、click
        callback: function () {}, // 回调函数
