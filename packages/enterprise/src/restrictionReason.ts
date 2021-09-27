/*
 * These are the possible reasons why a member may be restricted
 * from joining an enterprise.
 *
 * These will eventually be included in the GraphQL schema whenever
 * they're needed there, at which point they may be able to be removed from here.
 *
 * Should match the RestrictionReason defined in orgInviteRestrictHelper.js
 * in server.
 */
export enum RestrictionReason {
  DeactivatedInEnterprise = 'deactivatedInEnterprise',
  RestrictedToManagedMembers = 'restrictedToManagedMembers',
  RestrictedToManagedOrDomainMembers = 'restrictedToManagedOrDomainMembers',
  RestrictedToDomainMembers = 'restrictedToDomainMembers',
}
