export type OperatorDataType = {
  id: string;
  name: string;
  address: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  parentOperator: string;
};

export type UserDataType = {
  id: string;
  accountType: string;
  name: string;
  operator: string;
};

export type SiteDataType = {
  id: string;
  name: string;
  address: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  operator: string;
  active_devices: number;
};

export type FloorsDataType = {
  id: string;
  name: string;
  address: string;
  site: string;
  last_online: string;
  online_offline: string;
  registration_date: string;
  current_version: string;
  last_update_successful: string;
};
