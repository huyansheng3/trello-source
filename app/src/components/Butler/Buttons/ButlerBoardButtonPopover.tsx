import React, { useMemo } from 'react';
import { useFeatureFlag } from '@trello/feature-flag-client';
import { Popover, PopoverProps, PopoverScreen } from '@trello/nachos/popover';
import { forNamespace } from '@trello/i18n';
import { useLazyComponent } from '@trello/use-lazy-component';
import {
  FeatureId,
  NewPill,
  useNewFeature,
} from 'app/src/components/NewFeature';
import {
  ReportTemplate,
  ButlerBoardButtonPopoverScreen,
  ButlerBoardButtonPopoverDestination,
} from '../Reports/types';
import { showButlerDirectory, ButlerTab } from '../showButlerDirectory';

import styles from './ButlerBoardButtonPopover.less';

import { Controller } from 'app/scripts/controller';

const format = forNamespace(['butler', 'butler board button popover']);
const formatButler = forNamespace('butler');

interface Props {
  idBoard: string;
  popoverProps: PopoverProps<HTMLButtonElement, HTMLElement>;
  push: (screen: ButlerBoardButtonPopoverScreen) => void;
  pop: (depth?: number) => void;
  hide: () => void;
}

const reportOptions: ReportTemplate[] = [
  'board-snapshot',
  'due-soon',
  'overdue-cards',
  'my-cards',
];

export const ButlerBoardButtonPopover: React.FunctionComponent<Props> = ({
  idBoard,
  push,
  hide,
  popoverProps,
}) => {
  const showAutomaticReports = useFeatureFlag(
    'workflowers.show-automatic-reports',
    false,
  );

  const { acknowledgeNewFeature } = useNewFeature(FeatureId.AutomaticReports);

  const showReports = async (reportType: string): Promise<void> => {
    hide();
    acknowledgeNewFeature({
      explicit: true,
      source: 'automaticReportsInlineDialog',
    });
    Controller.getCurrentBoardView().navigateToAutomaticReports(reportType);
  };

  const reportsTemplateTitle = (
    <>
      {format('butlerReport')}
      <span className={styles.newPill}>
        <NewPill
          featureId={FeatureId.AutomaticReports}
          source="automaticReportsInlineDialog"
        />
      </span>
    </>
  );

  const butlerPopoverOptions: ButlerBoardButtonPopoverDestination[] = useMemo(() => {
    const options: ButlerBoardButtonPopoverDestination[] = ['rules', 'buttons'];
    if (showAutomaticReports) {
      options.push('butlerReport');
    }
    return options;
  }, [showAutomaticReports]);
  const ButlerPopoverLink = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "butler-popover-link" */ './ButlerPopoverLink'
      ),
    { namedImport: 'ButlerPopoverLink' },
  );

  return (
    <Popover {...popoverProps}>
      <PopoverScreen
        id={ButlerBoardButtonPopoverScreen.ButlerPopover}
        title={formatButler('automation')}
      >
        <ul className="pop-over-list">
          {butlerPopoverOptions.map((tabId) => {
            return (
              <ButlerPopoverLink
                key={tabId}
                id={tabId}
                idBoard={idBoard}
                push={push}
              />
            );
          })}
        </ul>
      </PopoverScreen>
      <PopoverScreen
        id={ButlerBoardButtonPopoverScreen.ReportsTemplatePopover}
        title={reportsTemplateTitle}
      >
        <ul className={'pop-over-list'}>
          {reportOptions.map((template) => {
            const reportTemplate = format(template);
            const description = format(`${template}-description`);
            return (
              <li key={`reports-${template}`}>
                <a
                  // eslint-disable-next-line react/jsx-no-bind
                  onClick={() => {
                    showReports(template);
                  }}
                  role="button"
                >
                  <span>{reportTemplate}</span>
                  <p className={styles.description}>{description}</p>
                </a>
              </li>
            );
          })}
          <li key="myAutomaticReports">
            <hr className={styles.lineSeparator} />
            <a
              // eslint-disable-next-line react/jsx-no-bind
              onClick={() => {
                showButlerDirectory(idBoard, ButlerTab.Schedule);
              }}
              role="button"
            >
              <span>{format('view my email reports')}</span>
            </a>
          </li>
        </ul>
      </PopoverScreen>
    </Popover>
  );
};
