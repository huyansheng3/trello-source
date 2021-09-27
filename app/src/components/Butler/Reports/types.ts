/* eslint-disable @trello/disallow-filenames */

import type {
  CertainDaysTrigger,
  CreateReportAction,
  SendEmailAction,
  TriggeredCommand,
} from '@atlassian/butler-command-parser';

export type ReportTemplate =
  | 'board-snapshot'
  | 'due-soon'
  | 'overdue-cards'
  | 'my-cards';

export enum ButlerBoardButtonPopoverScreen {
  ButlerPopover,
  ReportsTemplatePopover,
}

export type ButlerBoardButtonPopoverDestination =
  | 'rules'
  | 'buttons'
  | 'butlerReport';

export interface ButlerPopoverLinkProps {
  id: ButlerBoardButtonPopoverDestination;
  idBoard: string;
  push: (screen: ButlerBoardButtonPopoverScreen) => void;
}

export interface AutomaticReportsViewProps {
  idBoard: string;
  idOrganization: string;
  boardName: string | undefined;
  reportType: ReportTemplate;
  closeView: () => void;
}

export interface ButlerReportCommand extends TriggeredCommand {
  TRIGGER: {
    type: 'EVERY';
    EVERY: CertainDaysTrigger;
  };
  ACTION: [CreateReportAction, SendEmailAction];
}
