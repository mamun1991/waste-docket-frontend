import useTranslation from 'next-translate/useTranslation';

export default function Pagination({setSelectedPage, selectedPage, pageNumberList}) {
  const {t} = useTranslation();
  return (
    <div className='mx-auto left-2/12 w-fit md:w-fit absolute md:static inset-x-0 whitespace-nowrap pr-4'>
      {pageNumberList?.length !== 0 && (
        <button
          onClick={() =>
            selectedPage !== pageNumberList[0] ? setSelectedPage(selectedPage - 1) : null
          }
        >
          <span className='sm:block flex hover:bg-blue-700 hover:text-white bg-gray-200 text-gray-500 text-base leading-tight font-bold cursor-pointer shadow transition duration-150 ease-in-out mx-1 rounded px-3 py-2 focus:outline-none'>
            {t('common:prev')}
          </span>
        </button>
      )}
      {pageNumberList?.map(pageNumber => {
        let pageButtonStyle;
        if (pageNumber !== selectedPage) {
          pageButtonStyle =
            'inline w-10 text-primary hover:bg-blue-700 hover:text-white bg-gray-200 text-base leading-tight font-bold cursor-pointer shadow transition duration-150  ease-in-out mx-1 rounded px-1.5 py-2 focus:outline-none';
        } else {
          pageButtonStyle =
            'inline w-10 bg-primary text-white text-base leading-tight font-bold cursor-pointer shadow transition duration-150 ease-in-out mx-1 rounded px-1.5 py-2 focus:outline-none';
        }

        return (
          <button
            key={pageNumber}
            className={pageButtonStyle}
            onClick={() => {
              setSelectedPage(pageNumber);
            }}
          >
            {pageNumber}
          </button>
        );
      })}
      {pageNumberList?.length !== 0 && (
        <button
          disabled={pageNumberList ? selectedPage === pageNumberList[-1] : true}
          onClick={() =>
            selectedPage !== pageNumberList.at(-1) ? setSelectedPage(selectedPage + 1) : null
          }
        >
          <span className='sm:block flex hover:bg-blue-700 hover:text-white bg-gray-200 text-gray-500 text-base leading-tight font-bold cursor-pointer shadow transition duration-150 ease-in-out mx-1 rounded px-3 py-2 focus:outline-none'>
            {t('common:next')}
          </span>
        </button>
      )}
    </div>
  );
}
