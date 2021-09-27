import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"LoadBoard"}}
export type LoadBoardQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type LoadBoardQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'closed' | 'creationMethod' | 'dateLastActivity' | 'dateLastView' | 'datePluginDisable' | 'desc' | 'descData' | 'enterpriseOwned' | 'id' | 'idOrganization' | 'idTags' | 'name' | 'premiumFeatures' | 'shortLink' | 'shortUrl' | 'subscribed' | 'url'>
    & { actions: Array<(
      { __typename: 'Action' }
      & Pick<Types.Action, 'data' | 'date' | 'id' | 'idMemberCreator' | 'type'>
      & { display: (
        { __typename: 'Action_Display' }
        & Pick<Types.Action_Display, 'entities' | 'translationKey'>
      ), memberCreator: (
        { __typename: 'Member' }
        & Pick<Types.Member, 'activityBlocked' | 'avatarUrl' | 'fullName' | 'id' | 'idMemberReferrer' | 'initials' | 'nonPublicAvailable' | 'username'>
        & { nonPublic?: Types.Maybe<(
          { __typename: 'Member_NonPublic' }
          & Pick<Types.Member_NonPublic, 'avatarUrl' | 'initials' | 'fullName'>
        )> }
      ) }
    )>, cards: Array<(
      { __typename: 'Card' }
      & Pick<Types.Card, 'closed' | 'desc' | 'id' | 'idAttachmentCover' | 'idBoard' | 'idList' | 'idMembers' | 'idShort' | 'isTemplate' | 'name' | 'pos' | 'shortLink' | 'start' | 'url'>
      & { attachments: Array<(
        { __typename: 'Attachment' }
        & Pick<Types.Attachment, 'bytes' | 'date' | 'edgeColor' | 'fileName' | 'id' | 'idMember' | 'isUpload' | 'mimeType' | 'name' | 'pos' | 'url'>
        & { previews?: Types.Maybe<Array<(
          { __typename: 'Attachment_Preview' }
          & Pick<Types.Attachment_Preview, 'bytes' | 'height' | 'id' | 'scaled' | 'url' | 'width'>
        )>> }
      )>, badges: (
        { __typename: 'Card_Badges' }
        & Pick<Types.Card_Badges, 'attachments' | 'checkItems' | 'checkItemsChecked' | 'comments' | 'description' | 'due' | 'dueComplete' | 'start' | 'subscribed' | 'viewingMemberVoted' | 'votes' | 'checkItemsEarliestDue'>
        & { attachmentsByType: (
          { __typename: 'Card_Badges_AttachmentsByType' }
          & { trello: (
            { __typename: 'Card_Badges_AttachmentsByType_Trello' }
            & Pick<Types.Card_Badges_AttachmentsByType_Trello, 'board' | 'card'>
          ) }
        ) }
      ) }
    )>, labelNames: (
      { __typename: 'Board_LabelNames' }
      & Pick<Types.Board_LabelNames, 'black' | 'blue' | 'green' | 'lime' | 'orange' | 'pink' | 'purple' | 'red' | 'sky' | 'yellow'>
    ), labels: Array<(
      { __typename: 'Label' }
      & Pick<Types.Label, 'color' | 'id' | 'idBoard' | 'name'>
    )>, limits: (
      { __typename: 'Board_Limits' }
      & { attachments: (
        { __typename: 'Board_Limits_Attachments' }
        & { perBoard: (
          { __typename: 'Limit' }
          & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
        ), perCard: (
          { __typename: 'Limit' }
          & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
        ) }
      ), boards: (
        { __typename: 'Board_Limits_Boards' }
        & { totalMembersPerBoard: (
          { __typename: 'Limit' }
          & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
        ) }
      ), cards: (
        { __typename: 'Board_Limits_Cards' }
        & { openPerBoard: (
          { __typename: 'Limit' }
          & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
        ), openPerList: (
          { __typename: 'Limit' }
          & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
        ), totalPerBoard: (
          { __typename: 'Limit' }
          & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
        ), totalPerList: (
          { __typename: 'Limit' }
          & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
        ) }
      ), checkItems: (
        { __typename: 'Board_Limits_CheckItems' }
        & { perChecklist: (
          { __typename: 'Limit' }
          & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
        ) }
      ), checklists: (
        { __typename: 'Board_Limits_Checklists' }
        & { perBoard: (
          { __typename: 'Limit' }
          & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
        ), perCard: (
          { __typename: 'Limit' }
          & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
        ) }
      ), customFieldOptions: (
        { __typename: 'Board_Limits_CustomFieldOptions' }
        & { perField: (
          { __typename: 'Limit' }
          & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
        ) }
      ), customFields: (
        { __typename: 'Board_Limits_CustomFields' }
        & { perBoard: (
          { __typename: 'Limit' }
          & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
        ) }
      ), labels: (
        { __typename: 'Board_Limits_Labels' }
        & { perBoard: (
          { __typename: 'Limit' }
          & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
        ) }
      ), lists: (
        { __typename: 'Board_Limits_Lists' }
        & { openPerBoard: (
          { __typename: 'Limit' }
          & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
        ), totalPerBoard: (
          { __typename: 'Limit' }
          & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
        ) }
      ), reactions: (
        { __typename: 'Board_Limits_Reactions' }
        & { perAction: (
          { __typename: 'Limit' }
          & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
        ), uniquePerAction: (
          { __typename: 'Limit' }
          & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
        ) }
      ), stickers: (
        { __typename: 'Board_Limits_Stickers' }
        & { perCard: (
          { __typename: 'Limit' }
          & Pick<Types.Limit, 'disableAt' | 'status' | 'warnAt'>
        ) }
      ) }
    ), lists: Array<(
      { __typename: 'List' }
      & Pick<Types.List, 'closed' | 'id' | 'idBoard' | 'name' | 'pos' | 'softLimit' | 'subscribed'>
    )>, members: Array<(
      { __typename: 'Member' }
      & Pick<Types.Member, 'activityBlocked' | 'avatarUrl' | 'confirmed' | 'fullName' | 'id' | 'initials' | 'memberType' | 'nonPublicAvailable' | 'username'>
      & { nonPublic?: Types.Maybe<(
        { __typename: 'Member_NonPublic' }
        & Pick<Types.Member_NonPublic, 'avatarUrl' | 'initials' | 'fullName'>
      )> }
    )>, memberships: Array<(
      { __typename: 'Board_Membership' }
      & Pick<Types.Board_Membership, 'deactivated' | 'id' | 'idMember' | 'memberType' | 'unconfirmed'>
    )>, organization?: Types.Maybe<(
      { __typename: 'Organization' }
      & Pick<Types.Organization, 'displayName' | 'id' | 'name'>
      & { memberships: Array<(
        { __typename: 'Organization_Membership' }
        & Pick<Types.Organization_Membership, 'deactivated' | 'id' | 'idMember' | 'memberType' | 'unconfirmed'>
      )> }
    )>, prefs?: Types.Maybe<(
      { __typename: 'Board_Prefs' }
      & Pick<Types.Board_Prefs, 'background' | 'backgroundBottomColor' | 'backgroundBrightness' | 'backgroundImage' | 'backgroundTile' | 'backgroundTopColor' | 'calendarFeedEnabled' | 'canBeEnterprise' | 'canBeOrg' | 'canBePrivate' | 'canBePublic' | 'canInvite' | 'cardAging' | 'cardCovers' | 'comments' | 'hideVotes' | 'invitations' | 'isTemplate' | 'permissionLevel' | 'selfJoin' | 'voting'>
      & { backgroundImageScaled?: Types.Maybe<Array<(
        { __typename: 'Board_Prefs_BackgroundImageScaled' }
        & Pick<Types.Board_Prefs_BackgroundImageScaled, 'height' | 'url' | 'width'>
      )>> }
    )> }
  )> }
);


export const LoadBoardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LoadBoard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"addAttachmentToCard"},{"kind":"EnumValue","value":"addChecklistToCard"},{"kind":"EnumValue","value":"addMemberToBoard"},{"kind":"EnumValue","value":"addMemberToCard"},{"kind":"EnumValue","value":"addToOrganizationBoard"},{"kind":"EnumValue","value":"commentCard"},{"kind":"EnumValue","value":"convertToCardFromCheckItem"},{"kind":"EnumValue","value":"copyBoard"},{"kind":"EnumValue","value":"copyCard"},{"kind":"EnumValue","value":"copyCommentCard"},{"kind":"EnumValue","value":"createBoard"},{"kind":"EnumValue","value":"createCard"},{"kind":"EnumValue","value":"createList"},{"kind":"EnumValue","value":"deleteAttachmentFromCard"},{"kind":"EnumValue","value":"deleteCard"},{"kind":"EnumValue","value":"disablePlugin"},{"kind":"EnumValue","value":"disablePowerUp"},{"kind":"EnumValue","value":"emailCard"},{"kind":"EnumValue","value":"enablePlugin"},{"kind":"EnumValue","value":"enablePowerUp"},{"kind":"EnumValue","value":"makeAdminOfBoard"},{"kind":"EnumValue","value":"makeNormalMemberOfBoard"},{"kind":"EnumValue","value":"makeObserverOfBoard"},{"kind":"EnumValue","value":"moveCardFromBoard"},{"kind":"EnumValue","value":"moveCardToBoard"},{"kind":"EnumValue","value":"moveListFromBoard"},{"kind":"EnumValue","value":"moveListToBoard"},{"kind":"EnumValue","value":"removeChecklistFromCard"},{"kind":"EnumValue","value":"removeFromOrganizationBoard"},{"kind":"EnumValue","value":"removeMemberFromCard"},{"kind":"EnumValue","value":"unconfirmedBoardInvitation"},{"kind":"EnumValue","value":"unconfirmedOrganizationInvitation"},{"kind":"EnumValue","value":"updateBoard"},{"kind":"EnumValue","value":"updateCard"},{"kind":"EnumValue","value":"updateCheckItemStateOnCard"},{"kind":"EnumValue","value":"updateList"}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"50"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"display"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entities"}},{"kind":"Field","name":{"kind":"Name","value":"translationKey"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idMemberCreator"}},{"kind":"Field","name":{"kind":"Name","value":"memberCreator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activityBlocked"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idMemberReferrer"}},{"kind":"Field","name":{"kind":"Name","value":"initials"}},{"kind":"Field","name":{"kind":"Name","value":"nonPublic"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"initials"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nonPublicAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"visible"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bytes"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"edgeColor"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"isUpload"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}},{"kind":"Field","name":{"kind":"Name","value":"previews"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bytes"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"scaled"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"badges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attachments"}},{"kind":"Field","name":{"kind":"Name","value":"attachmentsByType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trello"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"}},{"kind":"Field","name":{"kind":"Name","value":"card"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"checkItems"}},{"kind":"Field","name":{"kind":"Name","value":"checkItemsChecked"}},{"kind":"Field","name":{"kind":"Name","value":"comments"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"due"}},{"kind":"Field","name":{"kind":"Name","value":"dueComplete"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"subscribed"}},{"kind":"Field","name":{"kind":"Name","value":"viewingMemberVoted"}},{"kind":"Field","name":{"kind":"Name","value":"votes"}},{"kind":"Field","name":{"kind":"Name","value":"checkItemsEarliestDue"}}]}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"desc"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idAttachmentCover"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"idList"}},{"kind":"Field","name":{"kind":"Name","value":"idMembers"}},{"kind":"Field","name":{"kind":"Name","value":"idShort"}},{"kind":"Field","name":{"kind":"Name","value":"isTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}},{"kind":"Field","name":{"kind":"Name","value":"shortLink"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"creationMethod"}},{"kind":"Field","name":{"kind":"Name","value":"dateLastActivity"}},{"kind":"Field","name":{"kind":"Name","value":"dateLastView"}},{"kind":"Field","name":{"kind":"Name","value":"datePluginDisable"}},{"kind":"Field","name":{"kind":"Name","value":"desc"}},{"kind":"Field","name":{"kind":"Name","value":"descData"}},{"kind":"Field","name":{"kind":"Name","value":"enterpriseOwned"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}},{"kind":"Field","name":{"kind":"Name","value":"idTags"}},{"kind":"Field","name":{"kind":"Name","value":"labelNames"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"black"}},{"kind":"Field","name":{"kind":"Name","value":"blue"}},{"kind":"Field","name":{"kind":"Name","value":"green"}},{"kind":"Field","name":{"kind":"Name","value":"lime"}},{"kind":"Field","name":{"kind":"Name","value":"orange"}},{"kind":"Field","name":{"kind":"Name","value":"pink"}},{"kind":"Field","name":{"kind":"Name","value":"purple"}},{"kind":"Field","name":{"kind":"Name","value":"red"}},{"kind":"Field","name":{"kind":"Name","value":"sky"}},{"kind":"Field","name":{"kind":"Name","value":"yellow"}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1000"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"limits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"perBoard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"perCard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"boards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalMembersPerBoard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"cards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"openPerBoard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"openPerList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalPerBoard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalPerList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"checkItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"perChecklist"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"checklists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"perBoard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"perCard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"customFieldOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"perField"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"customFields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"perBoard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"perBoard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"lists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"openPerBoard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalPerBoard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"reactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"perAction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"uniquePerAction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"stickers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"perCard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"lists"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"open"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}},{"kind":"Field","name":{"kind":"Name","value":"softLimit"}},{"kind":"Field","name":{"kind":"Name","value":"subscribed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activityBlocked"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"confirmed"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"initials"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"nonPublic"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"initials"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nonPublicAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deactivated"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"unconfirmed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deactivated"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"unconfirmed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundBottomColor"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundBrightness"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImage"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImageScaled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"backgroundTile"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundTopColor"}},{"kind":"Field","name":{"kind":"Name","value":"calendarFeedEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"canBeEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"canBeOrg"}},{"kind":"Field","name":{"kind":"Name","value":"canBePrivate"}},{"kind":"Field","name":{"kind":"Name","value":"canBePublic"}},{"kind":"Field","name":{"kind":"Name","value":"canInvite"}},{"kind":"Field","name":{"kind":"Name","value":"cardAging"}},{"kind":"Field","name":{"kind":"Name","value":"cardCovers"}},{"kind":"Field","name":{"kind":"Name","value":"comments"}},{"kind":"Field","name":{"kind":"Name","value":"hideVotes"}},{"kind":"Field","name":{"kind":"Name","value":"invitations"}},{"kind":"Field","name":{"kind":"Name","value":"isTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"permissionLevel"}},{"kind":"Field","name":{"kind":"Name","value":"selfJoin"}},{"kind":"Field","name":{"kind":"Name","value":"voting"}}]}},{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}},{"kind":"Field","name":{"kind":"Name","value":"shortLink"}},{"kind":"Field","name":{"kind":"Name","value":"shortUrl"}},{"kind":"Field","name":{"kind":"Name","value":"subscribed"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useLoadBoardQuery__
 *
 * To run a query within a React component, call `useLoadBoardQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoadBoardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoadBoardQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useLoadBoardQuery(baseOptions: Apollo.QueryHookOptions<LoadBoardQuery, LoadBoardQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LoadBoardQuery, LoadBoardQueryVariables>(LoadBoardDocument, options);
      }
export function useLoadBoardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LoadBoardQuery, LoadBoardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LoadBoardQuery, LoadBoardQueryVariables>(LoadBoardDocument, options);
        }
export type LoadBoardQueryHookResult = ReturnType<typeof useLoadBoardQuery>;
export type LoadBoardLazyQueryHookResult = ReturnType<typeof useLoadBoardLazyQuery>;
export type LoadBoardQueryResult = Apollo.QueryResult<LoadBoardQuery, LoadBoardQueryVariables>;