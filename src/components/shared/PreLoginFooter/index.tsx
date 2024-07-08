import useTranslation from 'next-translate/useTranslation';

const PreLoginFooter = () => {
  const {t} = useTranslation();

  return (
    <div className='w-full relative'>
      <div className='absolute w-full bg-white sm:bg-[#00733b] text-white py-2 px-4 mt-0 sm:-mt-10'>
        <div className='max-w-7xl m-auto flex justify-between flex-wrap'>
          <ul className='float-left list-none inline-block mx-auto sm:mx-0 px-3 sm:py-0 py-4 text-center'>
            <li className='inline-block'>
              <a href='/about' className='text-white font-semibold mr-6'>
                {t('common:about')}
              </a>
            </li>
            <li className='inline-block'>
              <a href='/helpcenter' className='text-white font-semibold mr-6'>
                {t('common:help_center')}
              </a>
            </li>
            <li className='inline-block'>
              <a href='/tos' className='text-white font-semibold mr-6'>
                {t('common:term_of_service')}
              </a>
            </li>
            <li className='inline-block'>
              <a href='/privacyPolicy' className='text-white font-semibold'>
                {t('common:privacy_policy')}
              </a>
            </li>
          </ul>
          <div className='mx-auto sm:mx-0 sm:px-0 px-3'>
            <p className=' font-semibold'>
              <span className='text-white'>© 2024 Waste Docket</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PreLoginFooter;
