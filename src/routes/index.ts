import {
  ChartBarIcon,
  HomeIcon,
  OfficeBuildingIcon,
  InformationCircleIcon,
  MenuAlt2Icon,
  UserIcon,
} from '@heroicons/react/solid';

import DocketsIcon from '@/components/shared/Icons/DocketsIcon';
import FleetsIcon from '@/components/shared/Icons/FleetsIcon';
import DestinationFacilityIcon from '@/components/shared/Icons/DestinationFacilityIcon';
import FleetMemberIcon from '@/components/shared/Icons/FleetMemberIcon';
import SubscriptionPlanIcon from '@/components/shared/Icons/SubscriptionPlanIcon';
import SuggestionsIcon from '@/components/shared/Icons/SuggestionIcon';

const userRoutes = [
  {name: 'Dashboard', href: '/dashboard', icon: HomeIcon},
  {name: 'Dockets', href: '/dockets', icon: DocketsIcon},
  {name: 'Business', href: '/fleets', icon: FleetsIcon},
  {name: 'Facility', href: '/destinationFacility', icon: DestinationFacilityIcon},
  {name: 'Customers', href: `/allFleetCustomers`, icon: OfficeBuildingIcon},
  {name: 'Account', href: '/userProfile', icon: UserIcon},
  {name: 'Help', href: '/faq', icon: InformationCircleIcon},
];

const businessRoutes = [
  {name: 'Dashboard', href: '/dashboard', icon: HomeIcon},
  {name: 'Dockets', href: '/dockets', icon: DocketsIcon},
  {name: 'Business', href: '/fleets', icon: FleetsIcon},
  {name: 'Facility', href: '/destinationFacility', icon: DestinationFacilityIcon},
  {name: 'Customers', href: `/allFleetCustomers`, icon: OfficeBuildingIcon},
  {name: 'Drivers', href: '/allFleetMembers', icon: FleetMemberIcon},
  {name: 'Account', href: '/userProfile', icon: UserIcon},
  {name: 'Plans', href: '/pricing', icon: SubscriptionPlanIcon},
  {name: 'Suggestions', href: '/allFleetSuggestions', icon: SuggestionsIcon},
  {name: 'Help', href: '/faq', icon: InformationCircleIcon},
];

const adminRoutes = [
  {name: 'Dashboard', href: '/dashboard', icon: HomeIcon},
  {name: 'Dockets', href: '/dockets', icon: DocketsIcon},
  {name: 'Business', href: '/fleets', icon: FleetsIcon},
  {name: 'Facility', href: '/destinationFacility', icon: DestinationFacilityIcon},
  {name: 'Customers', href: `/allFleetCustomers`, icon: OfficeBuildingIcon},
  {name: 'Drivers', href: '/allFleetMembers', icon: FleetMemberIcon},
  {name: 'Account', href: '/userProfile', icon: UserIcon},
  {name: 'Plans', href: '/pricing', icon: SubscriptionPlanIcon},
  {name: 'Suggestions', href: '/allFleetSuggestions', icon: SuggestionsIcon},
  {name: 'Admin', href: '/admin', icon: MenuAlt2Icon},
  {name: 'All Logs', href: '/logs', icon: ChartBarIcon},
  {name: 'Help', href: '/faq', icon: InformationCircleIcon},
];

export {userRoutes, adminRoutes, businessRoutes};
