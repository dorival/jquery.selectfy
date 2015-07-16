/*!
 * jQuery Selectfy - 1.0.0 - Simplified User Selection Framework
 * (c) 2015 Dorival Neto
 * MIT Licensed.
 *
 * http://github.com/dorival/jquery.selectfy
 */

(function (root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(root.jQuery);
    }
})(this, function ($) {

    'use strict';

    /**
     * The plugin name
     * @type {String}
     */
    var pluginName = 'selectfy';

    /**
     * Default Options
     * @type {Object}
     */
    var defaults = {
        shiftSelect: true,
        ctrlSelect: true,
        selectable: '[data-selectable]',
        selectedClass: 'selected',
        highlightClass: 'highlighted'
    };

    // Constructor, initialize everything you need here
    /**
     * The Plugin
     * @type {String}
     */
    var Plugin = function (element, options) {

        this.element = element;
        this.options = options;

        // Initialize
        this.pivot = null;
        this.last = null;
        this.init();
    };

    /**
     * Private Functions
     */

    function applyHighlight(el, plugin) {
        plugin.element.find('.' + plugin.options.highlightClass).removeClass(plugin.options.highlightClass);
        $(el).addClass(plugin.options.highlightClass);
        plugin.last = el;
    }
    
    function addSelectedElement(el, plugin) {
        var element = $(el);
        if (!element.hasClass(plugin.options.selectedClass)) {
            element.addClass(plugin.options.selectedClass);
            applyHighlight(el, plugin);
            return true;
        }
        return false;
    }

    function removeSelectedElement(el, plugin) {
        var element = $(el);
        if (element.hasClass(plugin.options.selectedClass)) {
            element.removeClass(plugin.options.selectedClass);
            return true;
        }
        return false;
    }

    function toggleSelectedElement(el, plugin) {
        if ($(el).hasClass(plugin.options.selectedClass)) {
            removeSelectedElement(el, plugin);
        } else {
            addSelectedElement(el, plugin);
        }
    }

    function triggerOnChange(el, plugin) {
        var selectedElements = $(plugin.element).find('.' + plugin.options.selectedClass);
        $(el).trigger('change.' + pluginName, {
            selectedCount: selectedElements.length,
            selected: selectedElements
        });
    }
    
    // Plugin methods and shared properties
    Plugin.prototype = {

        /**
         * Reset constructor - http://goo.gl/EcWdiy
         */
        constructor: Plugin,

        /**
         * Unselect all elements in the scope of this plugin. Always returns true
         *
         * @example
         * $('#element').selectfy('unselectAll');
         *  
         * @return {bool}
         */
        unselectAll: function () {
            var self = this;
            this.element.find(this.options.selectable).each(function () {
                removeSelectedElement(this, self);
            });
            triggerOnChange(this.element, this);
            return true;
        },

        /**
         * Select all elements in the scope of this plugin. Always returns true
         *
         * @example
         * $('#element').selectfy('selectAll');
         *  
         * @return {bool}
         */
        selectAll: function () {
            var self = this;
            this.element.find(this.options.selectable).each(function () {
                addSelectedElement(this, self);
            });
            triggerOnChange(this.element, this);
            return true;
        },

        /**
         * Get all selected elements in jQuery objects
         *
         * @example
         * $('#element').selectfy('getSelected');
         *  
         * @return {[type]}
         */
        getSelected: function () {
            return this.element.find('.' + this.options.selectedClass);
        },

        /**
         * Get the count of selected elements
         *
         * @example
         * $('#element').selectfy('getCount');
         *  
         * @return {[int]}
         */
        getCount: function () {
            return this.element.find('.' + this.options.selectedClass).length;
        },

        /**
         * Initializator
         */
        init: function () {
            var plugin = this;
            this.element.find(this.options.selectable).on('click', function (e) {
                e.stopPropagation();

                var ctrl = e.ctrlKey && plugin.options.ctrlSelect,
                    shift = e.shiftKey && plugin.options.shiftSelect;

                // If is just a regular selection, unselect everything else and select new item
                if (!ctrl && !shift) {
                    // ensure nothing else is selected
                    plugin.element.find('.' + plugin.options.selectedClass).each(function () {
                        removeSelectedElement(this, plugin);
                    });

                    plugin.pivot = this;
                    addSelectedElement(this, plugin);
                    applyHighlight(this, plugin);
                    triggerOnChange(this, plugin);
                    return;
                }

                // If ctrl AND shift, there is no selection, just Highlight, even if not selected
                if (ctrl && shift) {
                    applyHighlight(this, plugin);
                    return;
                }

                // Manage CTRL hotkey
                if (ctrl) {
                    plugin.pivot = this;
                    toggleSelectedElement(this, plugin);
                    applyHighlight(this, plugin);

                    // if nothing is selected, pivot should be unassigned
                    if (plugin.element.find('.' + plugin.options.selectedClass).count === 0) {
                        plugin.pivot = null;
                    }
                    triggerOnChange(this, plugin);
                }

                // Manage SHIFT hotkey
                if (shift) {
                    // Determine pivot
                    if (plugin.pivot === null) {
                        // tries to find the highlighted
                        var high = plugin.element.find('.' + plugin.options.highlightClass);
                        if (high.count >= 1) {
                            plugin.pivot = high.first();
                        } else {
                            plugin.pivot = plugin.element.find(plugin.options.selectable).first();
                        }
                    }

                    // Calculate range
                    var from = $(plugin.pivot).index(),
                        to = $(this).index();

                    // Swap if range is reverse (using XOR)
                    if (to < from) {
                        from = from ^ to;
                        to = from ^ to;
                        from = from ^ to;
                    }

                    // Apply select classes
                    plugin.element.find(plugin.options.selectable).each(function (index) {
                        var $this = $(this);
                        if (index >= from && index <= to) {
                            $this.addClass(plugin.options.selectedClass);
                        } else {
                            $this.removeClass(plugin.options.selectedClass);
                        }
                    });
                    // Trigger event
                    triggerOnChange(this, plugin);
                    // Highlight the last one, do not change pivot
                    applyHighlight(this, plugin);
                }
            });
        }
    };

    // Create the jQuery plugin
    $.fn[pluginName] = function (options) {
        var args = arguments, pl = 'plugin_';

        if (options === undefined || typeof options === 'object') {

            // Do a deep copy of the options - http://goo.gl/gOSSrg
            options = $.extend(true, {}, defaults, options);

            // Create a new instance for each element in the matched jQuery set
            return this.each(function () {
                if (!$.data(this, pl + pluginName)) {
                    $.data(this, pl + pluginName, new Plugin($(this), options));
                }
            });
        } else if (typeof options === 'string' && options !== 'init') {
            // Call a public pluguin method for each selected element.
            if (Array.prototype.slice.call(args, 1).length === 0) {
                // If the user does not pass any arguments, the method work as a getter,
                // then break the chainability so we can return a value instead the element reference.
                var instance = $.data(this[0], pl + pluginName);
                return instance[options].apply(instance, Array.prototype.slice.call(args, 1));
            } else {
                // Invoke the speficied method on each selected element
                return this.each(function () {
                    var instance = $.data(this, pl + pluginName);
                    if (instance instanceof Plugin && typeof instance[options] === 'function') {
                        instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                    }
                });
            }
        }
        return -1;
    };

    // Expose defaults and Constructor (allowing overriding of prototype methods for example)
    $.fn[pluginName].defaults = defaults;
    $.fn[pluginName].Plugin = Plugin;
});