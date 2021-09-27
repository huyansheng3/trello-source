// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { LabelState } = require('app/scripts/view-models/label-state');
const { Analytics } = require('@trello/atlassian-analytics');

module.exports.labelClick = function (e) {
  if (e && (e.ctrlKey || e.metaKey || e.shiftKey)) {
    return;
  }
  const wasShowingLabelText = LabelState.getShowText();
  Analytics.sendTrackEvent({
    action: 'toggled',
    actionSubject: 'labelText',
    source: 'cardView',
    containers: this?.model?.getAnalyticsContainers(),
    attributes: {
      visibility: wasShowingLabelText ? 'hide' : 'show',
    },
  });
  e.preventDefault();
  e.stopPropagation();

  return LabelState.toggleText();
};

module.exports.labelMouseEnter = function (e) {
  return this.$el.addClass('card-labels-hover');
};

module.exports.labelMouseLeave = function (e) {
  return this.$el.removeClass('card-labels-hover');
};
