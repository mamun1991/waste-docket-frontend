import {Switch} from '@headlessui/react';
import Flex from '../Flex';
import Text from '../Text';

interface IProps {
  checked: boolean;
  text: string;
  onChange?: () => void;
  name?: string | undefined;
  value?: string | undefined;
}

export default function Index({checked, onChange, text, ...rest}: IProps) {
  return (
    <Flex flex='row' justify='between' items='center' gap='6' className='h-18 border-y p-2 md:p-4'>
      <Text variant='small' font='medium'>
        {text}
      </Text>
      <Switch
        onChange={() => onChange && onChange()}
        checked={checked}
        className={`${
          checked ? 'bg-mainBlue' : 'bg-gray-200'
        }  inline-flex h-6 w-12 items-center rounded-full`}
        {...rest}
      >
        <span
          className={`${
            checked ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-5 w-5 transform rounded-full bg-white`}
        />
      </Switch>
    </Flex>
  );
}
