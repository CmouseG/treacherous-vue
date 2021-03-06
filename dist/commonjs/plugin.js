"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var treacherous_1 = require("treacherous");
var treacherous_view_1 = require("treacherous-view");
var ValidationSubKey = "validation-subscriptions";
var SummarySubKey = "summary-subscriptions";
var mixins = {
    created: function () {
        if (!this.$options.ruleset) {
            return;
        }
        var context = this;
        var ruleset = context.$options.ruleset;
        var validationGroup = treacherous_1.createGroup().asReactiveGroup().build(context, ruleset);
        context.validationGroup = validationGroup;
        var metadata = {};
        context._validationMetadata = metadata;
        metadata[ValidationSubKey] = {};
        metadata[SummarySubKey] = [];
    },
    beforeDestroy: function () {
        if (!this.$options.ruleset) {
            return;
        }
        var context = this;
        context.validationGroup.release();
    }
};
var showErrorDirective = {
    bind: function (element, binding, vnode) {
        var context = vnode.context;
        var validationGroup = context.validationGroup;
        if (!validationGroup) {
            return;
        }
        var metadata = context._validationMetadata;
        var propertyRoute = treacherous_view_1.ElementHelper.getPropertyRouteFrom(element);
        if (!propertyRoute) {
            return;
        }
        var strategyName = treacherous_view_1.ElementHelper.getViewStrategyFrom(element);
        var viewStrategy = treacherous_view_1.viewStrategyRegistry.getStrategyNamed(strategyName || "inline");
        if (!viewStrategy) {
            return;
        }
        var validationState = treacherous_view_1.ValidationState.unknown;
        var viewOptions = treacherous_view_1.ElementHelper.getViewOptionsFrom(element) || {};
        var handlePossibleError = function (error) {
            if (!error) {
                viewStrategy.propertyBecomeValid(element, propertyRoute, validationState, viewOptions);
                validationState = treacherous_view_1.ValidationState.valid;
            }
            else {
                viewStrategy.propertyBecomeInvalid(element, error, propertyRoute, validationState, viewOptions);
                validationState = treacherous_view_1.ValidationState.invalid;
            }
        };
        var handlePropertyStateChange = function (args) {
            handlePossibleError(args.error);
        };
        var propertyPredicate = function (args) {
            return args.property == propertyRoute;
        };
        var sub = validationGroup.propertyStateChangedEvent.subscribe(handlePropertyStateChange, propertyPredicate);
        metadata[ValidationSubKey][propertyRoute] = sub;
    },
    unbind: function (element, binding, vnode) {
        var context = vnode.context;
        var propertyRoute = treacherous_view_1.ElementHelper.getPropertyRouteFrom(element);
        if (!propertyRoute) {
            return;
        }
        var metadata = context._validationMetadata;
        var outstandingSub = metadata[ValidationSubKey][propertyRoute];
        if (outstandingSub) {
            outstandingSub();
        }
    }
};
var summaryDirective = {
    bind: function (element, binding, vnode) {
        var context = vnode.context;
        if (!context._validationMetadata) {
            context._validationMetadata = {};
            context._validationMetadata[SummarySubKey] = [];
        }
        var metadata = context._validationMetadata;
        var validationGroups = null;
        if (binding.value != null) {
            validationGroups = binding.value;
        }
        else {
            validationGroups = context.validationGroup;
        }
        if (!validationGroups) {
            return;
        }
        var isArray = Array.isArray(validationGroups);
        var getDisplayName = function (propertyRoute) {
            if (!isArray) {
                return validationGroups.getPropertyDisplayName(propertyRoute);
            }
            var finalName = propertyRoute;
            validationGroups.forEach(function (validationGroup) {
                var returnedName = validationGroup.getPropertyDisplayName(propertyRoute);
                if (returnedName != propertyRoute) {
                    finalName = returnedName;
                }
            });
            return finalName;
        };
        var strategyName = treacherous_view_1.ElementHelper.getSummaryStrategyFrom(element);
        var summaryStrategy = treacherous_view_1.viewSummaryRegistry.getSummaryNamed(strategyName || "default");
        if (!summaryStrategy) {
            return;
        }
        var viewOptions = treacherous_view_1.ElementHelper.getSummaryOptionsFrom(element) || {};
        summaryStrategy.setupContainer(element, viewOptions);
        var handleStateChange = function (eventArgs) {
            var displayName = getDisplayName(eventArgs.property);
            if (eventArgs.isValid) {
                summaryStrategy.propertyBecomeValid(element, displayName, viewOptions);
            }
            else {
                summaryStrategy.propertyBecomeInvalid(element, eventArgs.error, displayName, viewOptions);
            }
        };
        if (isArray) {
            validationGroups.forEach(function (validationGroup) {
                var sub = validationGroup.propertyStateChangedEvent.subscribe(handleStateChange);
                metadata[SummarySubKey].push(sub);
            });
        }
        else {
            var sub = validationGroups.propertyStateChangedEvent.subscribe(handleStateChange);
            metadata[SummarySubKey].push(sub);
        }
    },
    unbind: function (element, binding, vnode) {
        var context = vnode.context;
        var metadata = context._validationMetadata;
        metadata[SummarySubKey].foreach(function (x) { return x(); });
    }
};
var install = function (Vue, options) {
    Vue.mixin(mixins);
    Vue.directive('show-error', showErrorDirective);
    Vue.directive('validation-summary', summaryDirective);
};
var treacherous_view_2 = require("treacherous-view");
exports.viewStrategyRegistry = treacherous_view_2.viewStrategyRegistry;
var treacherous_2 = require("treacherous");
exports.createRuleset = treacherous_2.createRuleset;
exports.ruleRegistry = treacherous_2.ruleRegistry;
exports.default = {
    install: install
};
