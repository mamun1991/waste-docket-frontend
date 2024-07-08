import {useContext, useEffect, useState} from 'react';
import {MODAL_TYPES} from 'constants/context/modals';
import useTranslation from 'next-translate/useTranslation';
import FleetsPage from './fleetsPage';
import {UserContext} from '@/context/user';

const FleetsScreen = () => {
  const userObject = useContext(UserContext);
  const {t} = useTranslation();
  const [FleetsData, setFleetsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userObject?.user?.fleets && !userObject?.loadingUser) {
      const fleetData: any = userObject?.user?.fleets;
      /* eslint-disable-next-line */
      let parsedTableData: any =
        Array.isArray(fleetData) &&
        fleetData?.map(el => {
          let allowedWaste = [];
          if (el?.allowedWaste.length > 0) {
            // Removes __typename from allowedWaste array
            allowedWaste = el?.allowedWaste.map(({__typename, ...rest}) => rest);
          }
          return {
            id: el?._id,
            CardHeading: el?.name,
            CardData: [
              {key: 'VAT', value: el?.VAT, icon: '/assets/images/vat.svg'},
              {
                key: 'permitNumber',
                value: el?.permitNumber,
                icon: '/assets/images/permit_number.svg',
              },
              {key: 'email', value: el?.ownerEmail, icon: '/assets/images/user-email.svg'},
            ],
            name: el?.name,
            VAT: el?.VAT,
            permitHolderName: el?.permitHolderName,
            permitNumber: el?.permitNumber,
            permitHolderAddress: el?.permitHolderAddress,
            termsAndConditions: el?.termsAndConditions,
            permitHolderContactDetails: el?.permitHolderContactDetails,
            permitHolderEmail: el?.permitHolderEmail,
            permitHolderLogo: el?.permitHolderLogo,
            prefix: el?.prefix,
            docketNumber: el?.docketNumber,
            createdAt: el?.createdAt,
            ownerEmail: el?.ownerEmail,
            allowedWaste: allowedWaste,
          };
        });
      if (parsedTableData) {
        parsedTableData = parsedTableData.sort((a, b) =>
          a.name.localeCompare(b.name, undefined, {sensitivity: 'accent'})
        );
        setFleetsData(parsedTableData);
      }
    }
    setTimeout(() => {
      setLoading(false);
    }, 2500);
  }, [userObject]);

  return (
    <>
      {(!FleetsData || FleetsData?.length === 0) && !loading && !userObject?.loadingUser ? (
        <p className='text-base text-red-500'>{t('page:no_buisness')}</p>
      ) : (
        <FleetsPage
          CardData={FleetsData}
          addButtonModal={MODAL_TYPES.ADD_EDIT_FLEET}
          loading={loading}
        />
      )}
    </>
  );
};

export default FleetsScreen;
