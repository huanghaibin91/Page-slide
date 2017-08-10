;
(function ($, window, document, undefined) {
    "use strict";
    
    var PageSlide = function (ele, opt) {
        this.ele = ele,
        this.child = this.ele.find('>div'),
        this.descendant = this.child.find('>div'),
        this.index = 1,
        // 默认参数
        this.defaults = {
            direction: 'vertical', // 滑动方向，参数vertical,horizontal
            fullPage: true, // 是否是全屏滑动
            width: 500, // 不是全屏滚动时，设置滑动宽度
            height: 500, // 不是全屏滚动时，设置滑动高度
            autoSlide: false, // 是否自动滚动
            loop: true, // 是否循环滚动
            delay: 3000, // 自动滚动间隔时间，单位ms
            duration: 1000, // 滚动持续时间，单位ms
            navigation: true, // 是否显示定位分页
            navigationEvent: 'click', // 定位分页触发事件，如mouseover、click
            callback: function () {}, // 回调函数
        },

        this.options = $.extend(true, {}, this.defaults, opt || {}),
        this.directionFlag = this.options.direction === "vertical" ? true : false, // 滚动方向判断
        this.offset = 0,
        this.pagesCount = this.descendant.length, // 页面数量
        this.slideFlag = true, // 判断页面是否可以滑动
        this.timer = null // 定时器
    }
    // 添加方法
    PageSlide.prototype = {
        // 初始化
        init: function () {
            this.initLayout();
            this.setNavigation();
            this.initEvent();
        },
        // 初始化事件
        initEvent: function () {
            var that = this;
            // 自动滑动
            if (that.options.autoSlide) {
                that.autoPlay();
                that.ele.on('mouseover', function () {
                    that.pausePlay();
                });
                that.ele.on('mouseout', function () {
                    that.autoPlay();
                });
            } else {
                // 全屏状态下绑定鼠标滚轮事件
                if (that.options.fullPage) {
                    that.ele.on("mousewheel DOMMouseScroll", function (e) {
                        e.preventDefault();
                        that.pausePlay();
                        var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
                        if (that.slideFlag) {
                            if (delta > 0) {
                                that.prevSlide();
                            } else if (delta < 0) {
                                that.nextSlide();
                            }
                        }
                    });
                }
            }
            // 绑定导航事件
            that.ele.find('>ul').on(that.options.navigationEvent, function (e) {
                var target = e.target;
                that.pausePlay();
                if (target.tagName.toUpperCase() === 'LI') {
                    var currIndex = that.ele.find('>ul').find('li').index($(target));
                    if (that.slideFlag) {
                        var offset = that.offset * (that.index - currIndex - 1);
                        that.sliding(offset);
                        that.index = currIndex + 1;
                        that.activeNavigation();
                    }
                }
                if (that.options.autoSlide) {
                    that.autoPlay();
                }
            });
            // 全屏滑动状态，页面大小改变后改变元素大小
            var resizeTimer = null;
            $(window).resize(function () {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function () {
                    that.ele.css({
                        'height': $(window).height(),
                        'width': $(window).width()
                    });
                    that.descendant.css({
                        'height': $(window).height(),
                        'width': $(window).width()
                    });
                    if (that.directionFlag) {
                        that.child.css({
                            'height': $(window).height() * that.pagesCount,
                            'width': $(window).width()
                        });
                    } else {
                        that.child.css({
                            'height': $(window).height(),
                            'width': $(window).width() * that.pagesCount
                        });
                    }
                    that.offset = that.directionFlag ? that.descendant.height() : that.descendant.width(); // 根据滚动方向确定偏移距离
                    var offsetPostion = that.directionFlag ? that.child.position().top : that.child.position().left;
                    var remainder = offsetPostion % that.offset;
                    var animateCss = that.directionFlag ? {
                        top: offsetPostion - remainder
                    } : {
                        left: offsetPostion - remainder
                    }
                    that.child.animate(animateCss, 500);
                    that.index = parseInt(-offsetPostion / that.offset);
                    that.activeNavigation();
                }, 500);
            });
        },
        // 初始化页面布局
        initLayout: function () {
            var that = this;
            that.child.prepend(that.descendant.last().clone());
            that.child.append(that.descendant.first().clone());
            that.descendant = that.child.find('>div');
            that.pagesCount = that.descendant.length;
            // 以是否全屏布局
            if (that.options.fullPage) {
                $('html, body').css({
                    'overflow': 'hidden',
                    'height': '100%'
                });
                that.ele.css({
                    'width': $(window).width(),
                    'height': $(window).height(),
                    'overflow': 'hidden'
                });
                that.descendant.css({
                    'width': $(window).width(),
                    'height': $(window).height()
                });
            } else {
                that.ele.css({
                    'width': that.options.width + 'px',
                    'height': that.options.height + 'px',
                    'overflow': 'hidden'
                });
                that.descendant.css({
                    'width': that.options.width + 'px',
                    'height': that.options.height + 'px'
                });
            }
            // 以滑动方向布局
            if (that.directionFlag) {
                that.child.css({
                    'width': that.descendant.width() + 'px',
                    'height': that.descendant.height() * that.pagesCount + 'px',
                    'position': 'relative',
                });
            } else {
                that.descendant.css({
                    'float': 'left'
                });
                that.child.css({
                    'width': that.descendant.width() * that.pagesCount + 'px',
                    'height': that.descendant.height() + 'px',
                    'position': 'relative',
                });
            }
            that.offset = that.directionFlag ? that.descendant.height() : that.descendant.width(); // 根据滚动方向确定偏移距离
            // 元素初始位置偏移
            var transform = that.directionFlag ? {
                top: -that.offset
            } : {
                left: -that.offset
            };
            that.child.css(transform);
        },
        // 创建定位导航
        setNavigation: function () {
            var that = this;
            if (that.options.navigation) {
                var navigationHtml = '';
                for (var i = 0; i < that.pagesCount - 2; i++) {
                    navigationHtml += '<li></li>';
                }
                navigationHtml = '<ul>' + navigationHtml + '</ul>';
                that.ele.append(navigationHtml);
                that.ele.find('ul>li').eq(0).addClass('active');
            }
        },
        // 自动滑动
        autoPlay: function () {
            var that = this;
            that.timer = setInterval(function () {
                that.nextSlide();
            }, that.options.delay);
        },
        // 停止滑动
        pausePlay: function () {
            clearInterval(this.timer);
        },
        // 向前一页滑动
        prevSlide: function () {
            if (this.index > 1) {
                this.index--;
                this.sliding(this.offset);
                this.activeNavigation();
            } else if (this.options.loop) {
                this.index = this.pagesCount - 2;
                this.sliding(this.offset);
                this.activeNavigation();
            }
        },
        // 向后一页滑动
        nextSlide: function () {
            if (this.index < this.pagesCount - 2) {
                this.index++;
                this.sliding(-this.offset);
                this.activeNavigation();
            } else if (this.options.loop) {
                this.index = 1;
                this.sliding(-this.offset);
                this.activeNavigation();
            }
        },
        // 页面滑动
        sliding: function (offset) {
            var that = this;
            if (that.slideFlag) {
                that.slideFlag = false;
                var offsetPostion = that.directionFlag ? that.child.position().top : that.child.position().left;
                var animateCss = that.directionFlag ? {
                    'top': offsetPostion + offset
                } : {
                    'left': offsetPostion + offset
                };
                that.child.animate(animateCss, that.options.duration, function () {
                    that.slideFlag = true;
                    if (that.options.callback && $.type(that.options.callback) === "function") {
                        var index = that.index;
                        that.options.callback(index);
                    }
                    // 无缝滚动
                    var offsetPostion = that.directionFlag ? that.child.position().top : that.child.position().left;
                    var startPosition = that.directionFlag ? {
                        'top': -that.offset
                    } : {
                        'left': -that.offset
                    };
                    var endPosition = that.directionFlag ? {
                        'top': -that.offset * (that.pagesCount - 2)
                    } : {
                        'left': -that.offset * (that.pagesCount - 2)
                    };
                    if (offsetPostion < -that.offset * (that.pagesCount - 2)) {
                        that.child.css(startPosition);
                    }
                    if (offsetPostion > -that.offset) {
                        that.child.css(endPosition);
                    }
                });
            }
        },
        // 活动导航
        activeNavigation: function () {
            if (this.options.navigation) {
                $('ul li').removeClass('active');
                $('ul li').eq(this.index - 1).addClass('active');
            }
        }
    }
    // 设置插件
    $.fn.pageSlide = function (options) {
        return this.each(function () {
            var $this = $(this);
            var pageSlide = new PageSlide($this, options);
            pageSlide.init();
        });
    };
}(jQuery, window, document));