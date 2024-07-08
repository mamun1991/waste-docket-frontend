/* eslint-disable @typescript-eslint/naming-convention */
export enum PAGES {
  USERS = 'USERS',
  FLEETS = 'FLEETS',
}

export enum ACCOUNT_TYPES {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum AccountSubTypes {
  BUSINESS_ADMIN = 'BUSINESS_ADMIN',
  DRIVER = 'DRIVER',
}

export enum INVIATION_STATUS {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export enum SORT_TYPE {
  ASCENDING = 'ASCENDING',
  DESCENDING = 'DESCENDING',
}

export enum S3_BUCKET_FILENAME {
  CUSTOMER_LOGO_UPLOAD = 'CUSTOMER_LOGO_UPLOAD',
  WASTE_LOAD_PICTURE_UPLOAD = 'WASTE_LOAD_PICTURE_UPLOAD',
}
