"use strict";

//无限循环轮播
function loopScroll(opt) {
    var defaultOpt = {
        "ele": "",
        "showPicNum": "4",
        "fineTuning": "10",
        "autoTime": 4000,
        "aniTime": 500

    };
    $.extend(this, defaultOpt, opt);
    this.$ele = $("#" + this.ele);
    this.$ul = this.$ele.find(".slide-list");
    this.$li = this.$ul.children();
    this.$prev = this.$ele.find(".prev");
    this.$next = this.$ele.find(".next");
    this.width = 0;
    this.distance = 0;
    this.len = 0;
};
loopScroll.prototype = {
    initialize: function initialize() {
        var self = this;
        self.obtainWidth();
        self.copy();
        $(window).on("resize", $.proxy(this.obtainWidth, this));
        self.prev();
        self.next();
    },
    copy: function copy() {
        var self = this;
        self.$ul.append(self.$ul.html()).css({ 'left': -self.len * self.width / 2 - self.fineTuning });
        self.$ul.children().eq(self.len / 2).addClass("tag");
    },
    obtainWidth: function obtainWidth() {
        var self = this;
        self.width = self.$li.width();
        self.len = self.$li.length * 2;
        self.$ul.css({ 'width': self.len * self.width });
        if (self.$ul.find(".tag").length) {
            self.$ul.css({ 'left': -self.$ul.find(".tag").position().left - self.fineTuning });
        }
    },
    prev: function prev() {
        var self = this;
        self.$prev.on("click", function () {
            self.distance = parseInt(self.$ul.css("left")) + self.width;
            self.showPics(self.distance);
        });
    },
    next: function next() {
        var self = this;
        self.$next.on("click", function () {
            self.distance = parseInt(self.$ul.css("left")) - self.width;
            self.showPics(self.distance);
        });
    },
    showPics: function showPics(distance, callback) {
        var self = this;
        if (self.$ul.is(":animated")) {
            return;
        }
        self.$ul.animate({ "left": distance }, self.aniTime, function () {
            if (distance >= 0) {
                self.$ul.css("left", -self.len * self.width / 2);
            } else if (distance <= (self.showPicNum - self.len) * self.width) {
                self.$ul.css('left', (self.showPicNum - self.len / 2) * self.width);
            };
            var index = Math.abs(parseInt(parseInt(self.$ul.css("left")) / self.width));
            self.$ul.children().eq(index).addClass("tag").siblings().removeClass("tag");
            if (self.$ele.find("#num_box").length) {
                var numIndex = self.$ele.find(".tag").index() - self.len / 2;
                self.$ele.find("#num_box").find("span").eq(numIndex).addClass("on").siblings().removeClass("on");
            }
            callback && callback();
        });
    },
    num: function num() {
        var self = this;
        var $numBox = self.$ele.find("#num_box");
        var btn = "";
        for (var i = 0; i < self.len / 2; i++) {
            btn += "<span></span>";
        }
        $numBox.append(btn).find("span").on("click", function () {
            self.distance = -parseInt(($(this).index() + self.len / 2) * self.width);
            self.showPics(self.distance);
        }).eq(0).trigger("click");
    },
    autoPlay: function autoPlay() {
        var picTimer;
        var self = this;
        self.$ele.on("mouseover", function () {
            clearInterval(picTimer);
        }).on("mouseout", function () {
            picTimer = setInterval(function () {
                self.$next.trigger("click");
            }, self.autoTime); //此4000代表自动播放的间隔，单位：毫秒
        }).trigger("mouseout");
    }

};