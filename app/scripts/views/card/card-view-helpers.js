// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const CardMemberMenuView = require('app/scripts/views/member-menu-profile/card-member-menu-view');
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const template = require('app/scripts/views/templates/member_on_card');
const React = require('react');
const { LazyProfileCard } = require('app/src/components/ProfileCard');
const { LazyCardProfileCard } = require('app/src/components/ProfileCard');
const { featureFlagClient } = require('@trello/feature-flag-client');
const { Analytics, tracingCallback } = require('@trello/atlassian-analytics');

const removeMemberFromCardFunction = (card, member) => {
  const source = 'cardMemberMenuInlineDialog';
  const traceId = Analytics.startTask({
    taskName: 'edit-card/idMembers',
    source,
  });

  card.removeMemberWithTracing(
    member.id,
    traceId,
    tracingCallback(
      {
        taskName: 'edit-card/idMembers',
        traceId,
        source,
      },
      () => {
        Analytics.sendUpdatedCardFieldEvent({
          field: 'idMembers',
          source,
          containers: {
            card: { id: card.id },
            board: { id: card.get('idBoard') },
            list: { id: card.get('idList') },
          },
          attributes: {
            taskId: traceId,
            changeType: 'remove member',
          },
        });
      },
    ),
  );
};

const CardViewHelpers = {
  openMemberOnCardMenu(e) {
    Util.stop(e);

    const elem = this.$(e.target).closest('.member');
    const idMem = elem.attr('data-idmem');
    const member = this.modelCache.get('Member', idMem);
    const card = this.model;
    const board = this.model.getBoard();

    PopOver.toggle({
      elem,
      ...(featureFlagClient.get('btg.atlaskit-profile-card', false)
        ? {
            reactElement: (
              <LazyCardProfileCard
                key="profile"
                // eslint-disable-next-line react/jsx-no-bind
                onClose={() => PopOver.hide()}
                memberId={member.id}
                cardId={card.id}
                // eslint-disable-next-line react/jsx-no-bind
                removeMemberFromCardOverride={() =>
                  removeMemberFromCardFunction(card, member)
                }
              />
            ),
            hideHeader: true,
          }
        : {
            view: CardMemberMenuView,
            options: {
              model: member,
              modelCache: this.modelCache,
              card,
              board,
            },
          }),
    });
  },

  openMemberOnAtMention(e) {
    Util.stop(e);
    const board = this.model.getBoard();
    // Get member from DOM
    const elem = this.$(e.target).closest('.atMention');
    const idMem = elem?.text()?.substring(1);
    const member = this.modelCache.findOne('Member', 'username', idMem);

    Analytics.sendUIEvent({
      action: 'clicked',
      actionSubject: 'mention',
      actionSubjectId: 'memberMention',
      source: 'cardDetailScreen',
      containers: {
        workspace: {
          id: board?.getOrganization()?.id,
        },
        board: {
          id: board?.id,
        },
        card: {
          id: this.model.id,
        },
      },
      attributes: {
        mentionedMemberId: member?.id,
      },
    });

    if (featureFlagClient.get('btg.atlaskit-profile-card', false)) {
      PopOver.toggle({
        elem,
        reactElement: (
          <LazyProfileCard
            key="profile"
            // eslint-disable-next-line react/jsx-no-bind
            onClose={() => PopOver.hide()}
            memberId={member.id}
          />
        ),
        hideHeader: true,
      });
    }
  },

  getMemberOnCardHtml(member) {
    const data = member.toJSON();

    const board = this.model.getBoard();
    data.isVirtual =
      board?.getOrganization()?.isVirtual(member) || board?.isVirtual(member);
    data.isDeactivated = board?.isDeactivated(member);

    return template(data);
  },
};

module.exports = CardViewHelpers;
