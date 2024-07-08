export type User = {
  personalDetails: PersonalDetails;
  accountType: String;
  operatorId: String;
  createdAt: String;
  fleets: Fleet;
  subscription: Subscription;
  selectedFleet: Fleet;
};

export type PersonalDetails = {
  email: String;
  phone: String;
  name: String;
  description: String;
};

export type Subscription = {
  _id: String;
  plan: String;
  oldPlan: String;
  status: String;
  trialEndsAt: String;
  startAt: String;
  endsAt: String;
  stripeSubscriptionId: String;
  stripeCustomerId: String;
  stripeProductId: String;
  stripePriceId: String;
  createdAt: String;
  updatedAt: String;
  maxLimit: String;
  limit: String;
};

export type Fleet = {
  _id: String;
  isIndividual: Boolean;
  name: String;
  VAT: String;
  permitHolderName: String;
  permitHolderAddress: String;
  termsAndConditions: String;
  permitHolderContactDetails: String;
  permitHolderEmail: String;
  permitHolderLogo: String;
  prefix: String;
  ownerEmail: String;
  membersEmails: String[];
  permitNumber: String;
  docketNumber: String;
  individualDocketNumber: String;
  createdAt: String;
  allowedWaste: AllowedWaste;
};

export type AllowedWaste = {
  label: String;
  value: String;
};
