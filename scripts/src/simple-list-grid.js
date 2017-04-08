;(function($, fnName){
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

(function($, window, document, undefined) {
	'use strict';

	var pluginName = 'simpleListGrid',
		defaults = {
			'state': 'list',
			'margin': 10,
			'delay': 50
		};

	function Plugin (element, options) {
		var that = this;
		this.element = element;
		this.$element = $(element);

		this.settings = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;

		this.initialized = false;
		this.body = $('body');
		this.list = this.$element.find('ul.list-grid-ul');

		this.disabled = true; // initializes as disabled; will be set to false once the init render runs
		this.state = this.settings.state;
		this.delay = this.settings.delay; // milliseconds between animations
		this.margin = this.settings.margin; // top and left margins
		this.height = 0; // global height in grid mode

		this.elems = [];

		var toggleContainer = $('<p />', {
			'class': 'clearfix'
		}).insertBefore(this.$element);

		this.toggle = $('<a />', {
			'class': 'btn btn-default btn-sm pull-right',
			'html': '<i class="fa fa-th" aria-hidden="true"></i>',
			'click': function() {
				if (that.disabled === false) {
					that.disabled = true;
					that.state = (that.state === 'list') ? 'grid' : 'list';
					that.render();
				}
			}
		}).appendTo(toggleContainer);

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

			if (this.state === 'grid') {
				this.doGrid();
			} else {
				this.doList();
			}

			if (this.initialized === false) { this.initialized = true; }
		},

		'animate': function(data, top, left, width, height, delay) {
			window.setTimeout(function() {
				data.li.css({
					'position': 'absolute',
					'top': top + 'px',
					'left': left + 'px',
					'width': width + 'px',
					'height': height + 'px',
					'opacity': 1
				});
			}, delay);
		},

		'doList': function() {
			var that = this;

			var top = 0;
			var delay = 0;

			$.each(this.elems, function(current) {
				if (current > 0) {
					top += that.elems[current - 1].height + that.margin;
				}

				that.animate(this, top, 0, this.width, this.height, delay);
				if (that.initialized === true) { delay += that.delay; }
			});

			window.setTimeout(function() {
				that.$element.css('height', top + that.elems[that.elems.length - 1].height + 'px');
				that.toggle.html('<i class="fa fa-th" aria-hidden="true"></i>');
				that.disabled = false;
			}, delay);
		},

		'doGrid': function() {
			var that = this;

			var width = this.$element.outerWidth();
			var top = 0;
			var left = 0;
			var delay = this.delay;

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

				that.animate(this, top, left, this.width, that.height, delay);
				if (that.initialized === true) { delay += that.delay; }
			});

			window.setTimeout(function() {
				that.$element.css('height', top + that.height + 'px');
				that.toggle.html('<i class="fa fa-list" aria-hidden="true"></i>');
				that.disabled = false;
			}, delay);
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
				if (that.state === 'grid') {
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
