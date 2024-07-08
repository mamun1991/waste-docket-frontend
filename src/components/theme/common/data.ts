import {StaticImageData} from 'next/image';
import {PlanItem, PricingCard} from './types';

//images
import avatar1 from '../../../../public/assets/images/avatars/img-1.jpg';
import avatar2 from '../../../../public/assets/images/avatars/img-2.jpg';

type Testimonials = {
  name: string;
  position: string;
  description: string;
  image: StaticImageData;
};

type AccordionData = {
  title: string;
  description: string;
};

const testimonials: Testimonials[] = [
  {
    name: 'John Stark',
    position: 'Engineering Director',
    description:
      'Have been working with CSS for over ten years and Tailwind just makes my life easier. It is still CSS and you use flex, grid, etc. but just quicker to write and maintain.',
    image: avatar1,
  },
  {
    name: 'Cersei Lannister',
    position: 'Senior Project Manager',
    description:
      'I was bad at front-end until I discovered with Tailwind CSS. I have learnt a lot more about design and CSS itself after I started working with Tailwind. Creating web pages is 5x faster now.',
    image: avatar2,
  },
  {
    name: 'John Stark',
    position: 'Engineering Director',
    description:
      'Have been working with CSS for over ten years and Tailwind just makes my life easier. It is still CSS and you use flex, grid, etc. but just quicker to write and maintain.',
    image: avatar1,
  },
  {
    name: 'Cersei Lannister',
    position: 'Senior Project Manager',
    description:
      'I was bad at front-end until I discovered with Tailwind CSS. I have learnt a lot more about design and CSS itself after I started working with Tailwind. Creating web pages is 5x faster now.',
    image: avatar2,
  },
];

const FAQContent: AccordionData[] = [
  {
    title: ' Can I use this template for my client?',
    description:
      ' Yup, the marketplace license allows you to use this theme in any end products. For more information on licenses, please refere license terms on marketplace. ',
  },
  {
    title: ' Can this theme work with WordPress?',
    description:
      " No. This is a HTML template. It won't directly with WordPress, though you can convert this into WordPress compatible theme. ",
  },
  {
    title: ' How do I get help with the theme?',
    description:
      ' Use our dedicated support email (support@coderthemes.com) to send your issues or feedback. We are here to help anytime. ',
  },
  {
    title: ' Will you regularly give updates of Prompt ?',
    description:
      ' Yes, We will update the Prompt regularly. All the future updates would be available without any cost. ',
  },
];

const plans: PlanItem[] = [
  {
    id: 1,
    name: 'Starter',
    price: '89€ + VAT',
    duration: '/ month',
    features: [
      'Up to one driver',
      'Monthly billing cycle',
      'Onboarding training included',
      'Technical support via email',
    ],
    isRecommended: false,
  },
  {
    id: 2,
    name: 'Professional',
    price: '149€ + VAT',
    duration: '/ month',
    features: [
      'Up to one driver',
      'Monthly billing cycle',
      'Onboarding training included',
      'Technical support via email',
    ],
    isPopular: true,
    isRecommended: true,
  },
  {
    id: 3,
    name: 'Enterprise',
    price: '499€ + VAT',
    duration: '/ month',
    features: [
      'Unlimited drivers',
      'Use for personal or a commercial client',
      'Add Unlimited attendees',
      '24x7 Technical support via phone',
      'Technical support via email',
    ],
    isRecommended: false,
  },
];

const pricingCards: PricingCard = {
  Basic: {
    duration: 500,
    price: '89 + VAT',
    features: [
      'Up to one driver',
      'Monthly billing cycle',
      'Onboarding training included',
      'Technical support via email',
    ],
  },
  Standard: {
    duration: 700,
    price: '149 + VAT',
    features: [
      'Up to five (5) drivers',
      'Monthly billing cycle',
      'Onboarding training included',
      'Technical support via email',
    ],
  },
  Premium: {
    duration: 900,
    price: '199 + VAT',
    features: [
      'Up to fifteen (15) drivers',
      'Monthly billing cycle',
      'Onboarding training included',
      'Technical support via email',
    ],
  },
  Enterprise: {
    duration: 900,
    price: '499 + VAT',
    features: [
      'Unlimited drivers',
      'Monthly billing cycle',
      'Onboarding training included',
      'Technical support via email',
      'Technical support via phone',
    ],
  },
};

const footerLinks = {
  company: {
    links: [
      {text: 'Privacy Policy', url: '/privacyPolicy'},
      {text: 'Terms of Service', url: '/tos'},
      {text: 'About us', url: '/about'},
    ],
  },
};

export {testimonials, plans, FAQContent, footerLinks, pricingCards};
