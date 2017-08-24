"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var show_error_1 = require("./directives/show-error");
var validation_summary_1 = require("./directives/validation-summary");
var validation_mixin_1 = require("./mixins/validation-mixin");
var install = function (Vue, options) {
    Vue.mixin(validation_mixin_1.validationMixin);
    Vue.directive('show-error', show_error_1.showErrorDirective);
    Vue.directive('validation-summary', validation_summary_1.summaryDirective);
};
var treacherous_view_1 = require("treacherous-view");
exports.viewStrategyRegistry = treacherous_view_1.viewStrategyRegistry;
var treacherous_1 = require("treacherous");
exports.createRuleset = treacherous_1.createRuleset;
exports.ruleRegistry = treacherous_1.ruleRegistry;
exports.default = {
    install: install
};