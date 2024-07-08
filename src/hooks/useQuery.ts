import {useSearchParams} from 'next/navigation';

const useQuery = (): URLSearchParams => {
  return new URLSearchParams(useSearchParams());
};

export default useQuery;
