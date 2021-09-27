export enum PaidAccountErrorExtensions {
  // server/app/helper/billing/errors.js
  BILLING_UNCONFIRMED = 'BILLING_UNCONFIRMED',
  BILLING_ACCOUNT_ALREADY_EXISTS = 'BILLING_ACCOUNT_ALREADY_EXISTS',
  BILLING_ACCOUNT_NOT_CANCELLED = 'BILLING_ACCOUNT_NOT_CANCELLED',
  BILLING_ACCOUNT_NOT_FOUND = 'BILLING_ACCOUNT_NOT_FOUND',
  BILLING_FREE_TRIAL_NOT_APPLICABLE = 'BILLING_FREE_TRIAL_NOT_APPLICABLE',
  BILLING_INVALID_PRODUCT = 'BILLING_INVALID_PRODUCT',
  BILLING_INVALID_NAME = 'BILLING_INVALID_NAME',
  BILLING_INVALID_EMAIL = 'BILLING_INVALID_EMAIL',
  BILLING_INVALID_TOS = 'BILLING_INVALID_TOS',
  BILLING_INVALID_CARD_NUMBER = 'BILLING_INVALID_CARD_NUMBER',
  BILLING_INVALID_COUNTRY = 'BILLING_INVALID_COUNTRY',
  BILLING_INVALID_ZIP_CODE = 'BILLING_INVALID_ZIP_CODE',
  BILLING_INVALID_TAX_ID = 'BILLING_INVALID_TAX_ID',
  BILLING_INVALID_STATE_TAX_ID = 'BILLING_INVALID_STATE_TAX_ID',
  BILLING_INVALID_BILLING_PERIOD = 'BILLING_INVALID_BILLING_PERIOD',
  BILLING_UNSUPPORTED_CARD_TYPE = 'BILLING_UNSUPPORTED_CARD_TYPE',
  BILLING_CARD_DECLINED = 'BILLING_CARD_DECLINED',
  BILLING_SERVICE_UNAVAILABLE = 'BILLING_SERVICE_UNAVAILABLE',
  BILLING_INVALID_MEMBERS = 'BILLING_INVALID_MEMBERS',
  BILLING_INVALID_DISCOUNT = 'BILLING_INVALID_DISCOUNT',
}
