;
(function($, window){

	function Fresh(config, selector) {

		var defaults = {};
		this.$selector = selector;
		this.config = $.extend(defaults, config);
		this.init();

	};

	Fresh.prototype.init = function() {

	};

	$.fn.Fresh = function(config) {
		return new Fresh(config, this);
	};

})(jQuery, window);