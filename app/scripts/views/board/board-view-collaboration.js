const { Controller } = require('app/scripts/controller');
const React = require('react');
const ReactDOM = require('@trello/react-dom-wrapper');
const { Feature } = require('app/scripts/debug/constants');
const { sendErrorEvent } = require('@trello/error-reporting');

const {
  WorkspacesPreambleBoardHeaderButton,
} = require('app/src/components/WorkspacesPreamble');
const {
  WorkspacesAutoNameAlert,
} = require('app/src/components/WorkspacesAutoNameAlert');
const { renderComponent } = require('app/src/components/ComponentWrapper');

module.exports.unmountWorkspacesAutoNameAlert = function () {
  if (this.workspacesAutoNameAlertTarget) {
    ReactDOM.unmountComponentAtNode(this.workspacesAutoNameAlertTarget);
    this.workspacesAutoNameAlertTarget = null;
  }
};

module.exports.renderWorkspacesAutoNameAlert = function () {
  if (!this.workspacesAutoNameAlertTarget) {
    this.workspacesAutoNameAlertTarget = this.$(
      '#workspaces-auto-name-alert',
    )[0];

    if (this.workspacesAutoNameAlertTarget) {
      try {
        renderComponent(
          <WorkspacesAutoNameAlert orgId={this.model.get('idOrganization')} />,
          this.workspacesAutoNameAlertTarget,
        );
      } catch (err) {
        sendErrorEvent(err, {
          tags: {
            ownershipArea: 'trello-bizteam',
            feature: Feature.WorkspacesAutoNameAlert,
          },
          extraData: {
            component: 'board-view-collaboration',
          },
        });
      }
    }
  }
};

module.exports.unmountWorkspacesPreambleBoardHeaderButton = function () {
  if (this.workspacesPreambleBoardHeaderButtonTarget) {
    ReactDOM.unmountComponentAtNode(
      this.workspacesPreambleBoardHeaderButtonTarget,
    );
    this.workspacesPreambleBoardHeaderButtonTarget = null;
  }
};

module.exports.onWorkspacesPreambleCreateTeamSuccess = function (orgName) {
  if (orgName) {
    return Controller.organizationBoardsView(orgName, {
      shouldShowTeamfulCollaborationPrompt: true,
    }).then(() => this.unmountWorkspacesPreambleBoardHeaderButton());
  }
};

module.exports.renderWorkspacesPreambleBoardHeaderButton = function () {
  this.unmountWorkspacesPreambleBoardHeaderButton();
  this.workspacesPreambleBoardHeaderButtonTarget = this.$(
    '#workspaces-preamble-board-header-button',
  )[0];

  if (this.workspacesPreambleBoardHeaderButtonTarget) {
    renderComponent(
      <WorkspacesPreambleBoardHeaderButton
        boardId={this.model.id}
        canAutoShow={!this.workspacesPreamblePromptHasBeenSeen}
        // eslint-disable-next-line react/jsx-no-bind
        onCreateTeamSuccess={(orgName) =>
          this.onWorkspacesPreambleCreateTeamSuccess(orgName)
        }
        // eslint-disable-next-line react/jsx-no-bind
        onSelectTeamSuccess={(orgId) => this.model.set('idOrganization', orgId)}
      />,
      this.workspacesPreambleBoardHeaderButtonTarget,
    );
    this.workspacesPreamblePromptHasBeenSeen = true;
  }
};
