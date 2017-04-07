(function($, fnName){
	var debounce = function (func, threshold, execAsap) {
		var timeout;

		return function debounced () {
			var obj = this, args = arguments;
			function delayed () {
				if (!execAsap)
				func.apply(obj, args);
				timeout = null;
			};

			if (timeout)
				clearTimeout(timeout);
			else if (execAsap)
				func.apply(obj, args);

			timeout = setTimeout(delayed, threshold || 250);
		};
	}
	// smartresize
	jQuery.fn[fnName] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(fnName); };
})(jQuery, 'smartresize');

;(function($, window, document, undefined) {
	'use strict';

	var pluginName = 'listGrid',
		defaults = {
			'propertyName': 'value'
		};

	function Plugin (element, options) {
		var that = this;
		this.element = element;
		this.$element = $(element);
		this.body = $('body');

		this.list = this.$element.find('ul.list-grid-ul');

		var toggleContainer = $('<p />', {
			'class': 'clearfix'
		}).insertBefore(this.$element);

		this.toggle = $('<a />', {
			'class': 'btn btn-default btn-sm pull-right',
			'html': '<i class="fa fa-th" aria-hidden="true"></i>',
			'click': function() {
				that.list.toggleClass('grid');
				that.recomputeHeight = true;
				that.render();
			}
		}).appendTo(toggleContainer);

		this.margin = 10; // top and left margins
		this.height = 0; // global height in grid mode

		this.elems = [];

		this.settings = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	$.extend(Plugin.prototype, {
		'init': function() {
			var that = this;
			this.render();
			$(window).smartresize(function() { that.render(); });
		},

		'render': function() {
			this.measure();

			if (this.list.hasClass('grid')) {
				this.doGrid();
			} else {
				this.doList();
			}
		},

		'doList': function() {
			var that = this;

			var top = 0;
			$.each(this.elems, function(current) {
				if (current > 0) {
					top += that.elems[current - 1].height + that.margin;
				}

				this.li.css({
					'position': 'absolute',
					'top': top + 'px',
					'left': 0 + 'px',
					'width': this.width + 'px',
					'height': this.height + 'px'
				});
			});

			this.toggle.html('<i class="fa fa-th" aria-hidden="true"></i>');
		},

		'doGrid': function() {
			var that = this;

			var width = this.$element.outerWidth();
			var top = 0;
			var left = 0;

			$.each(this.elems, function(current) {
				if (current > 0) {
					var newLeft = left + that.elems[current - 1].width + that.margin;
					if ((newLeft + this.width) > width) {
						left = 0;
						top += that.height + that.margin;
					} else {
						left = newLeft;
					}
				}

				this.li.css({
					'position': 'absolute',
					'top': top + 'px',
					'left': left + 'px',
					'width': this.width + 'px',
					'height': that.height + 'px'
				});
			});

			this.toggle.html('<i class="fa fa-list" aria-hidden="true"></i>');
		},

		'measure': function() {
			var that = this;

			this.elems = [];
			this.height = 0;

			var parentClass = this.$element.attr('class');
			var listClass = this.list.attr('class');

			this.list.find('li').each(function() {
				var parent = $('<div />', {
					'class': parentClass,
					'css': {
						'position': 'absolute',
						'top': '0px',
						'left': '-10000px',
						'opacity': 0
					}
				}).appendTo(that.body);

				var ul = $('<ul />', {
					'class': listClass,
				}).appendTo(parent);

				var li = $(this).clone(false).removeAttr('style');
				li.appendTo(ul);

				var width;
				if (that.list.hasClass('grid')) {
					width = li.find('.thumb').outerWidth() +
						parseInt(li.css('padding-left').replace(/px/, '')) +
						parseInt(li.css('padding-right').replace(/px/, '')) +
						parseInt(li.css("border-left-width")) +
						parseInt(li.css("border-right-width"));
				} else {
					width = that.$element.outerWidth() -
						parseInt(that.$element.css('padding-left').replace(/px/, '')) -
						parseInt(that.$element.css('padding-right').replace(/px/, '')) -
						parseInt(that.$element.css("border-left-width")) +
						parseInt(that.$element.css("border-right-width"));
				}

				parent.css('width', width + 'px');
				var height = li.outerHeight();

				that.elems.push({
					'li': $(this),
					'width': width,
					'height': height // used for list mode
				});

				that.height = (height > that.height) ? height : that.height; // used for grid mode

				parent.remove();
				parent = null;
			});
		}
	});

	$.fn[ pluginName ] = function(options) {
		return this.each(function() {
			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName, new Plugin(this, options));
			}
		});
	};

})(jQuery, window, document);
