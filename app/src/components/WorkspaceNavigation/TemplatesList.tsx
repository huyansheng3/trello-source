import React, { useCallback } from 'react';
import { useFeatureFlag } from '@trello/feature-flag-client';
import { useTemplatePickerContainerGalleryQuery } from 'app/src/components/CreateBoardFromTemplate/TemplatePickerContainerGalleryQuery.generated';
import { TemplateBoardCreate } from 'app/src/components/Templates/types';
import { TemplateBoardCreateTemplatePicker } from 'app/src/components/CreateBoardFromTemplate/types';
import { languageParts, currentLocale } from '@trello/locale';
import { Spinner } from '@trello/nachos/spinner';
import { forTemplate } from '@trello/i18n';
import { BoardsListItem } from './BoardsListItem';
import { Button } from '@trello/nachos/button';
import { ShortcutTooltip } from 'app/src/components/ShortcutTooltip/ShortcutTooltip';
import { Analytics } from '@trello/atlassian-analytics';
import { WorkspaceNavigationTestIds } from '@trello/test-ids';
import RouterLink from 'app/src/components/RouterLink/RouterLink';
import styles from './TemplatesList.less';
const DoubleChevronCloseSVG = require('resources/images/workspace-navigation/double-chevron-close.svg');
const TrelloLogoSVG = require('resources/images/workspace-navigation/trello-icon-gradient-blue.svg');

const format = forTemplate('workspace_navigation');

interface TemplatesListProps {
  toggleVisibility: () => void;
}

export const TemplatesList: React.FunctionComponent<TemplatesListProps> = ({
  toggleVisibility,
}) => {
  const topTemplates: { [key: string]: string[] } = useFeatureFlag(
    'teamplates.web.create-flow-top-templates',
    {},
  );

  const language = languageParts(currentLocale).language;

  let topTemplatesList: string[] = [];
  if (topTemplates[currentLocale]) {
    topTemplatesList = topTemplates[currentLocale];
  } else if (topTemplates[language]) {
    topTemplatesList = topTemplates[language];
  } else {
    topTemplatesList = topTemplates['en'];
  }

  const {
    data: galleryTemplatesData,
    error: galleryTemplatesError,
    loading: galleryTemplatesLoading,
  } = useTemplatePickerContainerGalleryQuery({
    variables: {
      boardIds: topTemplatesList,
    },
  });
  const normalizeTemplates = (
    template: TemplateBoardCreateTemplatePicker,
  ): TemplateBoardCreate => ({
    id: template.id,
    name: template.name || '',
    prefs: {
      backgroundColor:
        (template.prefs && template.prefs.backgroundColor) || undefined,
      backgroundImage:
        (template.prefs && template.prefs.backgroundImage) || undefined,
    },
  });

  const loadingSpinner = (
    <span className={styles.spinner}>
      <Spinner />
    </span>
  );

  const handleSeeTemplateGallery = useCallback(() => {
    Analytics.sendClickedLinkEvent({
      linkName: 'templateGalleryLink',
      source: 'topTemplatesSidebar',
    });
  }, []);

  const sortTemplates = (a: TemplateBoardCreate, b: TemplateBoardCreate) => {
    if (a.name.toUpperCase() < b.name.toUpperCase()) {
      return -1;
    } else if (a.name.toUpperCase() > b.name.toUpperCase()) {
      return 1;
    } else {
      return 0;
    }
  };

  const galleryTemplates = (galleryTemplatesData?.boards || [])
    .map(normalizeTemplates)
    .sort(sortTemplates);

  if (galleryTemplatesLoading) {
    return loadingSpinner;
  } else if (galleryTemplatesError) {
    return <p>{format('error-loading-sidebar')}</p>;
  }

  return (
    <>
      <div className={styles.trelloTemplateGalleryContainer}>
        <RouterLink
          className={styles.galleryLink}
          href={'/templates'}
          testId={WorkspaceNavigationTestIds.TopTemplatesList}
        >
          <img
            className={styles.templateLogo}
            src={TrelloLogoSVG}
            alt={format('trello-logo')}
          />
        </RouterLink>
        <div className={styles.templateGalleryInfo}>
          <span className={styles.templateGalleryContainer}>
            <RouterLink className={styles.galleryLink} href={'/templates'}>
              <p className={styles.trelloTemplateGalleryText}>
                {format('trello-template-gallery')}
              </p>
            </RouterLink>
          </span>
        </div>
        <ShortcutTooltip
          shortcutText={format('collapse-sidebar')}
          shortcutKey="["
          className={styles.tooltipShortcut}
        >
          <Button
            className={styles.workspaceNavToggleButton}
            onClick={toggleVisibility}
          >
            <img
              className={styles.chevronImg}
              src={DoubleChevronCloseSVG}
              alt={format('team-nav-collapse-icon')}
            />
          </Button>
        </ShortcutTooltip>
      </div>
      <p className={styles.topTemplateText}>{format('top-templates')}</p>
      <ul className={styles.templateList}>
        {galleryTemplates.map((template) => (
          <BoardsListItem
            key={template.id}
            id={template.id}
            name={template.name}
            backgroundColor={template.prefs.backgroundColor}
            backgroundUrl={template.prefs.backgroundImage}
            href={`/b/${template.id}`}
          />
        ))}
      </ul>
      <RouterLink
        href={'/templates'}
        onClick={handleSeeTemplateGallery}
        className={styles.linkSeeTemplateGallery}
      >
        <p className={styles.linkSeeTemplateGalleryText}>
          {format('see-template-gallery')}
        </p>
      </RouterLink>
    </>
  );
};
