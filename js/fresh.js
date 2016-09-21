;
(function($, window){

	function Fresh(config, selector) {

		var defaults = {
			top: true,
			bottom: true,
			url: false,
			ajaxSetup: null,
			html: false
		};
		this.$selector = selector;
		this.config = $.extend(defaults, config);
		this.init();
		this.event();
	};

	Fresh.prototype.init = function() {
		var self = this;
		self.wrapItems();
	};

	Fresh.prototype.wrapItems = function() {
		var self = this;
		var $selector = self.$selector;
		var config = self.config;
		var bottomHtml = $("<div/>",{
			"class": "dropdown none",
			"role": "freshBottom",
			"html": "<i class=\"fresh-tip\">上拉加载更多</i><div class=\"loading\"><div></div></div>"
		});
		var topHtml = $("<div/>",{
			"class": "droptop",
			"role": "freshTop",
			"html": "<i class=\"fresh-tip\">下拉刷新页面</i><div class=\"loading\"><div></div></div>"
		});
		$selector.children().wrapAll("<div class=\"slide-item\" role=\"freshList\"></div>");
		if(config.bottom === true) {
			$selector.append(bottomHtml);
		}
		if(config.top === true) {
			$selector.prepend(topHtml);
		}
	};

	Fresh.prototype.getTouches = function(event) {
		if(event.touches !== undefined) {
			return {
				x: event.touches[0].pageX,
				y: event.touches[0].pageY
			};
		}
		if(event.touches === undefined) {
			if(event.pageX !== undefined) {
				return {
					x: event.pageX,
					y: event.pageY
				};
			}
			if(event.pageX === undefined) {
				return {
					x: event.clientX,
					y: event.clientY
				};
			}
		}
	};

	Fresh.prototype.addCssSpeed = function (speed) {
		return {
			"-webkit-transition": "all " + speed + "ms ease",
			"-moz-transition": "all " + speed + "ms ease",
			"-o-transition": "all " + speed + "ms ease",
			"transition": "all " + speed + "ms ease"
		};
	};

	Fresh.prototype.removeTransition = function() {
		return {
			"-webkit-transition": "",
			"-moz-transition": "",
			"-o-transition": "",
			"transition": ""
		};
	};

	Fresh.prototype.doTranslate = function(pixels) {
		return {
            "-webkit-transform": "translate3d(0px," + pixels + "px, 0px)",
            "-moz-transform": "translate3d(0px," + pixels + "px, 0px)",
            "-o-transform": "translate3d(0px," + pixels + "px, 0px)",
            "-ms-transform": "translate3d(0px," + pixels + "px, 0px)",
            "transform": "translate3d(0px," + pixels + "px, 0px)"
        };
	};

	Fresh.prototype.transition3d = function(value) {
		var self = this;
		var $selector = self.$selector;
		$selector.css(self.doTranslate(value));
	};

	Fresh.prototype.freshBottom = function(startY, endY) {
		var self = this;
		var $selector = self.$selector;
		var $tip = $selector.find(".fresh-tip");
		var moveY = endY - startY;
		var st = $("body").scrollTop();
		var height = $(window).height();
		var childrenHeight = $selector.children("[role=\"freshList\"]").height();
		if(endY > startY) {
			self.lockBottom = 0;
		}
		if(endY < startY && st + height >= childrenHeight) {
			$(".dropdown").removeClass("none");
			self.transition3d(Math.round(moveY * 0.25));
			if(!self.lockBottom) {
				self.lockBottom = 1;
			}
			if(moveY < 0) {
				$tip.text("上拉加载更多");
				if(moveY < -60) {
					$tip.text("释放加载更多");
				}
			}
		}
	};

	Fresh.prototype.freshTop = function(startY, endY) {
		var self = this;
		var $selector = self.$selector;
		var $tip = $selector.find(".fresh-tip");
		var moveY = endY - startY;
		var st = $("body").scrollTop();
		if(endY < startY) {
			self.lockTop = 0;
		}
		if(endY > startY && st <= 0) {
			self.transition3d(Math.round(moveY * 0.25));
			if(!self.lockTop) {
				self.lockTop = 1;
			}
			if(moveY > 0) {
				$tip.text("下拉刷新页面");
				if(moveY > 60) {
					$tip.text("释放刷新页面");
				}
			}
		}
	};

	Fresh.prototype.afterFresh = function(url) {
		var self = this;
		var config = self.config;
		var $selector = self.$selector;
		var $item = $selector.children(".slide-item");
		if(url === false && config.html === false) {
			console.log("没有任何事情做..");
		}
		if(url !== false) {
			$.ajax($.extend({
				url: url,
				type: "GET",
				dataType: "html"
			}, config.ajaxSetup)).then(function(res){
				console.log("success");
				$(".dropdown").removeClass("current");
			}, function(err){
				console.log(err);
			});
		}
		if(config.html !== false) {
			$item.append(config.html);
			$(".dropdown").removeClass("current");
		}
	};

	Fresh.prototype.event = function() {
		var self = this;
		var config = self.config;
		var $selector = self.$selector;
		var locals = {
			startY: 0,
			endY: 0
		};

		// 绑定、解绑document
		function swapEvents(type) {
			if (type === "on") {
				$(document).on("touchmove.fresh mousemove.fresh", dragMove);
				$(document).on("touchend.fresh touchcancel.fresh mouseup.fresh", dragEnd);
			} else if (type === "off") {
				$(document).off("touchmove.fresh mousemove.fresh");
				$(document).off("touchend.fresh touchcancel.fresh mouseup.fresh");
			}
		}

		function dragStart(event) {
			var ev = event.originalEvent || event || window.event;
			position = $selector.position();
			locals.startY = self.getTouches(ev).y;
			$selector.css(self.removeTransition());
			$(".dropdown").removeClass("current");
			swapEvents("on");
		};

		function dragMove(event) {
			var ev = event.originalEvent || event || window.event;
			locals.endY = self.getTouches(ev).y;
			if(config.bottom === true) {
				self.freshBottom(locals.startY, locals.endY);
			}
			if(config.top === true) {
				self.freshTop(locals.startY, locals.endY);
			}
		};

		function dragEnd(event) {
			$selector.css(self.addCssSpeed(200));
			self.transition3d(0);
			if(self.lockBottom) {
				$(".dropdown").addClass("none");
				$(".dropdown").addClass("current");
				self.afterFresh(config.url);
			}
			if(self.lockTop) {
				window.location.href = window.location.href;
			}
			swapEvents("off");
		};

		$selector.on("touchstart.fresh mousedown.fresh", ".slide-item", dragStart);
	};

	$.fn.Fresh = function(config) {
		return new Fresh(config, this);
	};

})(jQuery, window);