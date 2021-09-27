/* eslint-disable @trello/export-matches-filename */

export const CONNECTED_TO = 'Connected to';
export const SLACK = 'Slack';
export const SLACK_DISCONNECT_WARNING =
  'Your Trello and Slack workspaces are connected. You can search for Slack users and invite them to Trello.';
export const OR = 'OR';
export const FIND_TEAMMATES_ON_SLACK = 'Find teammates on Slack';
export const HIDE_SLACK_USERS = 'Hide Slack users';
export const FLAG_SLACK_WORKSPACE_CONNECTION_TITLE_SUCCESS =
  'Slack workspace connected';
export const FLAG_SLACK_WORKSPACE_CONNECTION_DESCRIPTION_SUCCESS =
  "You can now search through your Slack workspace's list of contacts";
export const FLAG_SLACK_WORKSPACE_CONNECTION_TITLE_DISABLED =
  'Slack users hidden';
export const FLAG_SLACK_WORKSPACE_CONNECTION_DESCRIPTION_DISABLED =
  "Slack users won't be visible in Trello";

export const FOUND_IN_SLACK = 'Found in Slack';

export enum Source {
  SLACK = 'slack',
  TRELLO = 'trello',
}
