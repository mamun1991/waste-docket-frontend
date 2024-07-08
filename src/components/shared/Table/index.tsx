import {useState, useEffect, useContext} from 'react';
import useTranslation from 'next-translate/useTranslation';
import {MultiSelect} from 'react-multi-select-component';
import {ACCOUNT_TYPES, SORT_TYPE} from '@/constants/enums';
import {UserContext} from '@/context/user';
import {ModalContextProvider} from '@/store/Modal/Modal.context';
import classNames from 'classnames';
import {ChevronUpIcon, ChevronDownIcon, ChevronRightIcon} from '@heroicons/react/outline';
import {Menu, Transition} from '@headlessui/react';
import Loader from 'components/shared/Loader/Loader';
import Button from '../Button';

const Table = ({
  TableHeader,
  TableData,
  addButtonText,
  addButtonModal,
  deleteButtonModal,
  SearchOptions,
  setSearchQuery,
  selectedPage,
  rowsPerPage,
  setRowsPerPage,
  loading,
  pageNumberList,
}) => {
  const {user} = useContext(UserContext);
  const {showModal} = ModalContextProvider();
  const {t} = useTranslation();
  const [isPlainText, setIsPlainText] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortingInput, setSortedInput] = useState<{columnName: string; sortType: string}>({
    columnName: '',
    sortType: '',
  });
  const [selectedOption, setSelectedOption] = useState<{value: string; label: string}[]>([]);

  const radioHandler = event => {
    setIsPlainText(event.target.value === 'true');
  };

  const handleSort = (fieldName: string) => {
    setSortField(fieldName);
    fieldName !== sortField &&
      setSortedInput({
        columnName: fieldName,
        sortType: SORT_TYPE.ASCENDING,
      });
    fieldName === sortField &&
      setSortedInput({
        columnName: fieldName,
        sortType: SORT_TYPE.DESCENDING,
      });
    fieldName === sortField &&
      sortingInput.sortType === SORT_TYPE.DESCENDING &&
      setSortedInput({
        columnName: fieldName,
        sortType: SORT_TYPE.ASCENDING,
      });
  };

  const showAction = () => user?.accountType === ACCOUNT_TYPES.ADMIN;

  const handleSearch = () => {
    const filteredFields = selectedOption.map(value => value.value);
    const searchQueryBuild = {
      searchText,
      isPlainText,
      filteredFields,
      sortingInput,
      paginationArgs: {
        pageNumber: selectedPage,
        itemsPerPage: rowsPerPage,
      },
    };
    setSearchQuery(searchQueryBuild);
  };

  useEffect(() => {
    handleSearch();
  }, [sortingInput]);
  useEffect(() => {
    handleSearch();
  }, [selectedPage]);

  return (
    <>
      <div className='container mx-auto'>
        <div className='flex flex-col-reverse md:flex-row items-between justify-between  md:mt-3 lg:mt-5 my-3'>
          <div className='flex flex-col md:flex-wrap md:flex-row gap-y-4 items-center justify-start md:mt-3 lg:mt-5 my-3'>
            <input
              type='text'
              id='filter'
              name='filter'
              onChange={event => {
                setSearchText(event.target.value);
              }}
              className=' md:w-auto rounded-md border-gray-300 w-full text-gray-500 text-sm '
              placeholder={t('common:search')}
            />

            <MultiSelect
              className='w-full  md:w-1/3 md:ml-4 float-left'
              options={SearchOptions}
              value={selectedOption}
              onChange={option => setSelectedOption(option)}
              labelledBy='Select'
            />
            <div className={'order-10 min-w-full'}>
              <input
                key={'Plaintext'}
                type='checkbox'
                value='true'
                name='textType'
                className='rounded text-primary'
                checked={isPlainText}
                onChange={radioHandler}
              />{' '}
              {t('common:plaintext')}
              <input
                key={'regex'}
                type='checkbox'
                value='false'
                name='textType'
                className='ml-4  rounded text-primary'
                checked={!isPlainText}
                onChange={radioHandler}
              />{' '}
              {t('common:regex')}
            </div>
            <Button
              type='button'
              className=' w-40 sm:text-white rounded-lg shadow-sm text-md font-medium ml-5 focus:outline-none px-4 py-2 text-md bg-primary text-white '
              onClick={handleSearch}
            >
              {t('common:search')}
            </Button>
          </div>
          <div className='flex items-start mt-6'>
            {addButtonText && (
              <Button
                className='bg-primary px-8'
                onClick={() => {
                  showModal(addButtonModal);
                }}
              >
                <p>{t(addButtonText)}</p>
              </Button>
            )}
          </div>
        </div>
        {pageNumberList?.length !== 0 && (
          <div className='ml-auto'>
            <select
              name='language'
              className='max-w-md w-fit block  pl-3 pr-10 py-2 overflow-hidden border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm md:text-base rounded-md'
              onChange={event => setRowsPerPage(Number(event.target.value))}
            >
              <option value='25'>25</option>
              <option value='50'>50</option>
              <option value='100'>100</option>
            </select>
          </div>
        )}

        <div>
          <div className='overflow-x-auto sm:-mx-6 lg:-mx-8 pb-16'>
            <div className='inline-block min-w-full sm:px-6 lg:px-8'>
              <div className=''>
                <table className={`min-w-full lg:w-full text-center table-fixed`}>
                  <thead className='border-b bg-gray-300'>
                    <tr>
                      {TableHeader?.map(el => {
                        const columnName = el.split(':')[1];

                        return (
                          <th
                            key={el}
                            scope='col'
                            className='min-w-[20%] w-[20%] max-w-[20%] text-sm font-bold text-black px-2 py-2 '
                          >
                            <div className='flex items-center justify-between w-full font-bold '>
                              <span className='w-[100%] md:w-[100%]  text-left'>{t(el)}</span>
                              {sortingInput.columnName === columnName &&
                                sortingInput.sortType === SORT_TYPE.ASCENDING && (
                                  <ChevronUpIcon
                                    width={20}
                                    onClick={() => {
                                      handleSort(columnName);
                                    }}
                                  />
                                )}
                              {sortingInput.columnName === columnName &&
                                sortingInput.sortType === SORT_TYPE.DESCENDING && (
                                  <ChevronDownIcon
                                    width={20}
                                    onClick={() => {
                                      handleSort(columnName);
                                    }}
                                  />
                                )}
                              {sortingInput.columnName !== columnName && (
                                <ChevronRightIcon
                                  width={20}
                                  onClick={() => {
                                    handleSort(columnName);
                                  }}
                                />
                              )}
                            </div>
                          </th>
                        );
                      })}
                      {showAction() && <th>{t('common:action')}</th>}
                    </tr>
                  </thead>
                  {loading ? (
                    <Loader />
                  ) : (
                    <tbody className='overflow-y-scroll h-full'>
                      {TableData?.map(el => (
                        <tr key={el.id} className='bg-white border-b w-20 h-full'>
                          {Object?.values(el)
                            .slice(1)
                            .map((e: any) => (
                              <td
                                key={e?.toString()}
                                className='min-w-[20%] w-[20%] max-w-[20%] text-sm text-black px-2 py-2 text-left'
                              >
                                <p className='break-all'>{e}</p>
                              </td>
                            ))}
                          {showAction() && (
                            <td className={'flex h-full w-full justify-center'}>
                              <Menu as='div' className={'relative my-auto'}>
                                <Menu.Button
                                  className={classNames([
                                    'm-auto border border-gray-300 rounded-lg w-7 h-7 hover:bg-gray-200 hover:bg-opacity-60 shadow-md z-10 ',
                                  ])}
                                >
                                  <ChevronDownIcon
                                    className={classNames(['w-6 h-6 text-gray-400 duration-300'])}
                                  />
                                </Menu.Button>
                                <Transition
                                  enter='transition ease-out duration-100'
                                  enterFrom='transform opacity-0 scale-95'
                                  enterTo='transform opacity-100 scale-100'
                                  leave='transition ease-in duration-75'
                                  leaveFrom='transform opacity-100 scale-100'
                                  leaveTo='transform opacity-0 scale-95'
                                  className={'absolute right-0 bg-white z-50'}
                                >
                                  <Menu.Items className='flex flex-col z-50 gap-2'>
                                    <Menu.Item>
                                      <Menu.Button
                                        onClick={() => showModal(addButtonModal, el)}
                                        className='p-1 px-4 border border-primary shadow-sm text-sm font-medium rounded-md active:opacity-75'
                                      >
                                        {t('common:edit')}
                                      </Menu.Button>
                                    </Menu.Item>

                                    <Menu.Item>
                                      <Menu.Button
                                        onClick={() => showModal(deleteButtonModal, el)}
                                        className='p-1 px-4 border border-red-400 shadow-sm text-sm font-medium rounded-md active:opacity-75'
                                      >
                                        {t('common:delete')}
                                      </Menu.Button>
                                    </Menu.Item>
                                  </Menu.Items>
                                </Transition>
                              </Menu>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  )}
                </table>
              </div>
            </div>
          </div>
          <div className='text-black flex items-center justify-center space-x-2 mt-12'>
            <div className='space-x-2'></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Table;
