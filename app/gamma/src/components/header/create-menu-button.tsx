import { HeaderTestIds } from '@trello/test-ids';
import React, {
  Suspense,
  FunctionComponent,
  useCallback,
  useState,
} from 'react';
import { AddIcon } from '@trello/nachos/icons/add';
import HeaderButton from './button';
import { usePopover, Popover, PopoverScreen } from '@trello/nachos/popover';
import { forNamespace, forTemplate } from '@trello/i18n';
import classnames from 'classnames';
import { TeamType } from 'app/gamma/src/modules/state/models/teams';
import { useLazyComponent } from '@trello/use-lazy-component';
import { Analytics, getScreenFromUrl } from '@trello/atlassian-analytics';
import { Auth } from 'app/scripts/db/auth';
import styles from './create-menu-button.less';
import { ScreenBreakpoints } from 'app/src/components/Responsive';
import Media from 'react-media';

const viewTitle = forNamespace('view title');
const formatHeaderUser = forTemplate('header_user');

enum Screen {
  Menu,
  CreateEnterpriseTeam,
  SelectTemplate,
  CreateBoardFromTemplate,
}

const screenAnalyticsNames: {
  [key: string]: 'createFromTemplateInlineDialog' | 'useTemplateInlineDialog';
} = {
  [Screen.SelectTemplate]: 'createFromTemplateInlineDialog',
  [Screen.CreateBoardFromTemplate]: 'useTemplateInlineDialog',
};

interface CreateMenuButtonProps {
  redesign?: boolean;
}

export const CreateMenuButton: FunctionComponent<CreateMenuButtonProps> = ({
  redesign,
}) => {
  const {
    triggerRef,
    toggle,
    hide,
    popoverProps,
    push,
    pop,
  } = usePopover<HTMLButtonElement>({
    initialScreen: Screen.Menu,
  });

  const { isVisible: popOverIsVisible } = popoverProps;

  const [selectedTemplate, setSelectedTemplate] = useState({
    id: '',
    name: '',
  });

  const onClick = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'createMenuHeaderButton',
      source: getScreenFromUrl(),
    });

    toggle();
  }, [toggle]);

  const onHide = useCallback(() => {
    if (
      popoverProps.currentScreen &&
      screenAnalyticsNames[popoverProps.currentScreen]
    ) {
      Analytics.sendClosedComponentEvent({
        componentType: 'inlineDialog',
        componentName: screenAnalyticsNames[popoverProps.currentScreen],
        source: 'createMenuScreen',
      });
    }

    hide();
  }, [popoverProps, hide]);

  const onBack = useCallback(() => {
    if (
      popoverProps.currentScreen &&
      screenAnalyticsNames[popoverProps.currentScreen]
    ) {
      Analytics.sendClickedButtonEvent({
        buttonName: 'inlineDialogBackButton',
        source: screenAnalyticsNames[popoverProps.currentScreen],
      });
    }

    if (popoverProps.onBack) {
      popoverProps.onBack();
    } else {
      pop();
    }
  }, [popoverProps, pop]);

  const HeaderCreateMenuPopover = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "create-menu-popover" */ 'app/src/components/HeaderCreateMenuPopover'
      ),
    { namedImport: 'HeaderCreateMenuPopover' },
  );

  const CreateBoardFromTemplatePopover = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "create-board-from-template-popover" */ 'app/src/components/CreateBoardFromTemplate'
      ),
    {
      preload: popoverProps.isVisible,
      namedImport: 'CreateBoardFromTemplatePopover',
    },
  );

  const CreateBoardPopover = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "create-board-popover" */ 'app/src/components/CreateBoardFromTemplate'
      ),
    {
      preload: popoverProps.isVisible,
      namedImport: 'CreateBoardPopover',
    },
  );

  const CreateTeamPopover = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "create-team-popover" */ 'app/src/components/CreateTeamPopover'
      ),
    {
      preload: popoverProps.isVisible,
      namedImport: 'CreateTeamPopover',
    },
  );

  const CreateBoardOverlay = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "create-board-overlay" */ 'app/src/components/CreateBoardOverlay'
      ),

    {
      preload: false,
      namedImport: 'CreateBoardOverlay',
    },
  );

  const PlanSelectionOverlay = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "plan-selection-overlay" */ 'app/src/components/FreeTrial/PlanSelectionOverlay'
      ),

    {
      preload: false,
      namedImport: 'PlanSelectionOverlay',
    },
  );

  const [showCreateBoardOverlay, setShowCreateBoardOverlay] = useState(false);
  const [showPlanSelectionOverlay, setShowPlanSelectionOverlay] = useState(
    false,
  );
  const [selectedOrgId, setSelectedOrgId] = useState('');

  const openPlanSelectionOverlay = useCallback(() => {
    setShowPlanSelectionOverlay(true);
  }, [setShowPlanSelectionOverlay]);

  const closePlanSelectionOverlay = useCallback(() => {
    setShowPlanSelectionOverlay(false);
  }, [setShowPlanSelectionOverlay]);

  const closeCreateBoardOverlay = useCallback(() => {
    setShowCreateBoardOverlay(false);
  }, [setShowCreateBoardOverlay]);

  const openCreateBoardOverlay = useCallback(() => {
    setShowCreateBoardOverlay(true);
  }, [setShowCreateBoardOverlay]);

  const CreateWorkspaceOverlay = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "create-team-overlay" */ 'app/src/components/CreateTeamOverlay'
      ),

    {
      preload: false,
      namedImport: 'CreateTeamOverlay',
    },
  );

  const [showCreateWorkspaceOverlay, setShowCreateWorkspaceOverlay] = useState(
    false,
  );

  const [createTeamType, setCreateTeamType] = useState<TeamType>(
    TeamType.Default,
  );

  const closeOverlay = useCallback(() => {
    setShowCreateWorkspaceOverlay(false);
  }, [setShowCreateWorkspaceOverlay]);

  const onClickCreateTeam = useCallback(
    (teamType: TeamType) => {
      setCreateTeamType(teamType);
      setShowCreateWorkspaceOverlay(true);
    },
    [setShowCreateWorkspaceOverlay],
  );

  return (
    <>
      <Media query={ScreenBreakpoints.MediumLargeMin}>
        {(matches: boolean) => {
          return (
            <>
              <div className={styles.createMenuWrapperRedesign}>
                <HeaderButton
                  icon={matches ? undefined : <AddIcon color="light" />}
                  onClick={onClick}
                  ref={triggerRef}
                  testId={HeaderTestIds.CreateMenuButton}
                  ariaLabel={formatHeaderUser('create-board-or-team')}
                  className={classnames(redesign && styles.createMenuRedesign, {
                    [styles.createMenuActive]: popOverIsVisible,
                  })}
                >
                  {matches && (
                    <p className={styles.buttonText}>
                      {formatHeaderUser('create-menu')}
                    </p>
                  )}
                </HeaderButton>
              </div>
              <Popover
                {...popoverProps}
                title={viewTitle('create')}
                testId={HeaderTestIds.CreateMenuPopover}
                onHide={onHide}
                onBack={onBack}
              >
                <Suspense fallback={null}>
                  <PopoverScreen id={Screen.Menu} noHorizontalPadding>
                    <HeaderCreateMenuPopover
                      // eslint-disable-next-line react/jsx-no-bind
                      onClickCreateEnterpriseTeam={() =>
                        push(Screen.CreateEnterpriseTeam)
                      }
                      // eslint-disable-next-line react/jsx-no-bind
                      onClickCreateBoardFromTemplate={() => {
                        !Auth.me().isDismissed('start-with-a-template') &&
                          Auth.me().dismiss('start-with-a-template');

                        push(Screen.SelectTemplate);
                      }}
                      // eslint-disable-next-line react/jsx-no-bind
                      onCreateTeamOverlayShown={(teamType: TeamType) => {
                        if (teamType === TeamType.Business) {
                          Analytics.sendUIEvent({
                            action: 'clicked',
                            actionSubject: 'menuItem',
                            actionSubjectId: 'createBCTeamMenuItem',
                            source: 'createMenuInlineDialog',
                          });
                        }
                        if (teamType === TeamType.Default) {
                          Analytics.sendUIEvent({
                            action: 'clicked',
                            actionSubject: 'menuItem',
                            actionSubjectId: 'createFreeTeamMenuItem',
                            source: 'createMenuInlineDialog',
                          });
                        }
                        hide();
                        onClickCreateTeam(teamType);
                      }}
                      // eslint-disable-next-line react/jsx-no-bind
                      onCreateBoardOverlayShown={() => {
                        Analytics.sendUIEvent({
                          action: 'clicked',
                          actionSubject: 'menuItem',
                          actionSubjectId: 'createBoardMenuItem',
                          source: 'createMenuInlineDialog',
                        });
                        hide();
                        openCreateBoardOverlay();
                      }}
                    />
                  </PopoverScreen>
                  <PopoverScreen
                    id={Screen.SelectTemplate}
                    title={viewTitle('create-from-template')}
                  >
                    <CreateBoardFromTemplatePopover
                      // eslint-disable-next-line react/jsx-no-bind
                      hide={() => hide()}
                      // eslint-disable-next-line react/jsx-no-bind
                      onSelectTemplate={({
                        id,
                        name,
                      }: {
                        id: string;
                        name: string;
                      }) => {
                        Analytics.sendUIEvent({
                          action: 'clicked',
                          actionSubject: 'menuItem',
                          actionSubjectId: 'createFromTemplateMenuItem',
                          source: 'createFromTemplateInlineDialog',
                          containers: {
                            board: {
                              id,
                            },
                          },
                        });
                        setSelectedTemplate({
                          id,
                          name,
                        });
                        push(Screen.CreateBoardFromTemplate);
                      }}
                    />
                  </PopoverScreen>
                  <PopoverScreen
                    id={Screen.CreateBoardFromTemplate}
                    title={selectedTemplate.name}
                  >
                    <CreateBoardPopover
                      boardId={selectedTemplate.id}
                      hideOverlay={onHide}
                      setSelectedOrgId={setSelectedOrgId}
                      openPlanSelectionOverlay={openPlanSelectionOverlay}
                    />
                  </PopoverScreen>
                  <PopoverScreen
                    id={Screen.CreateEnterpriseTeam}
                    title={viewTitle('create organization')}
                  >
                    <CreateTeamPopover teamType={TeamType.Enterprise} />
                  </PopoverScreen>
                </Suspense>
              </Popover>
              {showCreateWorkspaceOverlay && (
                <Suspense fallback={null}>
                  <CreateWorkspaceOverlay
                    teamType={createTeamType}
                    onClose={closeOverlay}
                  />
                </Suspense>
              )}
              {showCreateBoardOverlay && (
                <Suspense fallback={null}>
                  <CreateBoardOverlay onClose={closeCreateBoardOverlay} />
                </Suspense>
              )}
              {/* support opening free trial modal */}
              {showPlanSelectionOverlay && (
                <Suspense fallback={null}>
                  <PlanSelectionOverlay
                    orgId={selectedOrgId}
                    onClose={closePlanSelectionOverlay}
                  />
                </Suspense>
              )}
            </>
          );
        }}
      </Media>
    </>
  );
};
