import Loader from '@/components/shared/Loader/Loader';
import queries from '@/constants/GraphQL/Fleet/queries';
import {useQuery} from '@apollo/client';
import {useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import React, {useEffect, useState} from 'react';

const DocketImagePage = ({docketID}) => {
  const {t} = useTranslation();
  const {data: session} = useSession();
  const [DocketData, setDocketData] = useState<any>();
  const {data: GetDocketById, loading: GetDocketByIdLoading} = useQuery(queries.getDocketById, {
    variables: {
      docketId: docketID,
    },
    context: {
      headers: {
        Authorization: session?.accessToken,
      },
    },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    let docketData;

    if (GetDocketById?.getDocketById?.docketData) {
      docketData = GetDocketById?.getDocketById?.docketData;
    }

    setDocketData(docketData);
  }, [GetDocketById]);

  if (GetDocketByIdLoading) return <Loader />;
  console.log(DocketData);
  return (
    <>
      {DocketData && (
        <div className='flex flex-col w-full p-8 pr-2 space-y-4'>
          <div className='flex flex-col w-full p-8 pr-2 space-y-4'>
            {DocketData && DocketData.docketData.isWaste ? (
              <>
                {DocketData.docketData.wastes &&
                  DocketData.docketData.wastes.map((waste, index) => (
                    <div className='flex flex-col p-4 my-3 border rounded-md gap-y-3' key={index}>
                      <h3 className='text-lg font-semibold'>Waste #{index + 1}</h3>
                      <p className='text-lg font-medium'>
                        {t('common:wasteDescription')}: {waste.wasteDescription}
                      </p>
                      <p className='text-lg font-medium'>
                        {t('common:wasteLoWCode')}: {waste.wasteLoWCode}
                      </p>
                      <p className='text-lg font-medium'>
                        {t('common:isHazardous')}:{' '}
                        {waste.isHazardous ? t('common:yes') : t('common:no')}
                      </p>
                      <p className='text-lg font-medium'>
                        {t('common:localAuthorityOfOrigin')}: {waste.localAuthorityOfOrigin}
                      </p>
                      <p className='text-lg font-medium'>
                        {t('common:wasteQuantity')}:{' '}
                        {`${waste.wasteQuantity.amount} ${waste.wasteQuantity.unit}`}
                      </p>
                      {waste.wasteLoadPicture && (
                        <div className='flex flex-row items-center'>
                          <p className='mr-4 text-lg font-medium'>{t('common:Picture')}:</p>
                          <img
                            className='w-[250px] h-[250px] object-contain'
                            src={waste.wasteLoadPicture}
                            alt='WasteImg'
                          />
                        </div>
                      )}
                    </div>
                  ))}
                <p className='text-lg font-medium'>
                  {t('common:collectedFromWasteFacility')}:{' '}
                  {DocketData.collectedFromWasteFacility ? t('common:yes') : t('common:no')}
                </p>
                <p className='text-lg font-medium'>
                  {t('common:collectionPointName')}: {DocketData.collectionPointName}
                </p>
                <p className='text-lg font-medium'>
                  {t('common:collectionPointAddress')}:{' '}
                  {DocketData.docketData.collectionPointAddress}
                </p>
                <p className='text-lg font-medium'>
                  {t('common:collectionPointStreet')}: {DocketData.docketData.collectionPointStreet}
                </p>
                <p className='text-lg font-medium'>
                  {t('common:collectionPointCity')}: {DocketData.docketData.collectionPointCity}
                </p>
                <p className='text-lg font-medium'>
                  {t('common:collectionPointCounty')}: {DocketData.docketData.collectionPointCounty}
                </p>
                <p className='text-lg font-medium'>
                  {t('common:collectionPointEircode')}:{' '}
                  {DocketData.docketData.collectionPointEircode}
                </p>
                <p className='text-lg font-medium'>
                  {t('common:collectionPointCountry')}:{' '}
                  {DocketData.docketData.collectionPointCountry}
                </p>
                <p className='text-lg font-medium'>
                  {t('common:collectionPointlongitude')}: {DocketData.docketData.longitude}
                </p>
                <p className='text-lg font-medium'>
                  {t('common:collectionPointLatitude')}: {t('common:collectionPointLatitude')}:{' '}
                  {DocketData.docketData.latitude}
                </p>
                <p className='text-lg font-medium'>
                  {t('common:destinationFacilityName')}:{' '}
                  {DocketData.destinationFacility?.destinationFacilityData.destinationFacilityName}
                </p>
                <p className='text-lg font-medium'>
                  {t('common:destinationFacilityAuthorisationNumber')}:{' '}
                  {
                    DocketData.destinationFacility?.destinationFacilityData
                      .destinationFacilityAuthorisationNumber
                  }
                </p>
                <p className='text-lg font-medium'>
                  {t('common:destinationFacilityAddress')}:{' '}
                  {
                    DocketData.destinationFacility?.destinationFacilityData
                      .destinationFacilityAddress
                  }
                </p>
                <p className='text-lg font-medium'>
                  {t('common:destinationFacilityStreet')}:{' '}
                  {
                    DocketData.destinationFacility?.destinationFacilityData
                      .destinationFacilityStreet
                  }
                </p>
                <p className='text-lg font-medium'>
                  {t('common:destinationFacilityCity')}:{' '}
                  {DocketData.destinationFacility?.destinationFacilityData.destinationFacilityCity}
                </p>
                <p className='text-lg font-medium'>
                  {t('common:destinationFacilityCounty')}:{' '}
                  {
                    DocketData.destinationFacility?.destinationFacilityData
                      .destinationFacilityCounty
                  }
                </p>
                <p className='text-lg font-medium'>
                  {t('common:destinationFacilityEircode')}:{' '}
                  {
                    DocketData.destinationFacility?.destinationFacilityData
                      .destinationFacilityEircode
                  }
                </p>
                <p className='text-lg font-medium'>
                  {t('common:destinationFacilityCountry')}:{' '}
                  {
                    DocketData.destinationFacility?.destinationFacilityData
                      .destinationFacilityCountry
                  }
                </p>
                <p className='text-lg font-medium'>
                  {t('common:destinationFacilityLongitude')}:{' '}
                  {
                    DocketData.destinationFacility?.destinationFacilityData
                      .destinationFacilityLongitude
                  }
                </p>
                <p className='text-lg font-medium'>
                  {t('common:destinationFacilityLatitude')}:{' '}
                  {
                    DocketData.destinationFacility?.destinationFacilityData
                      .destinationFacilityLatitude
                  }
                </p>
              </>
            ) : (
              DocketData?.docketData?.nonWasteLoadPictures &&
              DocketData?.docketData?.nonWasteLoadPictures?.length > 0 && (
                <>
                  <p className='font-bold text-lg'>{t('common:nonWasteLoadPictures')}: </p>
                  {DocketData.docketData.nonWasteLoadPictures && (
                    <div className='flex flex-wrap p-4 my-3 border rounded-md gap-3'>
                      {DocketData.docketData.nonWasteLoadPictures.map((item, index) => (
                        <div className='flex flex-row items-center' key={index}>
                          {item && (
                            <img
                              className='w-[250px] h-[250px] object-contain'
                              src={item}
                              alt='NonWasteImg'
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <p className='text-lg font-medium'>
                    {t('common:generalPickupDescription')}:{' '}
                    {DocketData?.docketData?.generalPickupDescription}
                  </p>
                  <p className='text-lg font-medium'>
                    {t('common:collectedFromWasteFacility')}:{' '}
                    {DocketData.collectedFromWasteFacility ? t('common:yes') : t('common:no')}
                  </p>
                  <p className='text-lg font-medium'>
                    {t('common:collectionPointName')}: {DocketData.collectionPointName}
                  </p>
                  <p className='text-lg font-medium'>
                    {t('common:collectionPointAddress')}:{' '}
                    {DocketData.docketData.collectionPointAddress}
                  </p>
                  <p className='text-lg font-medium'>
                    {t('common:collectionPointStreet')}:{' '}
                    {DocketData.docketData.collectionPointStreet}
                  </p>
                  <p className='text-lg font-medium'>
                    {t('common:collectionPointCity')}: {DocketData.docketData.collectionPointCity}
                  </p>
                  <p className='text-lg font-medium'>
                    {t('common:collectionPointCounty')}:{' '}
                    {DocketData.docketData.collectionPointCounty}
                  </p>
                  <p className='text-lg font-medium'>
                    {t('common:collectionPointEircode')}:{' '}
                    {DocketData.docketData.collectionPointEircode}
                  </p>
                  <p className='text-lg font-medium'>
                    {t('common:collectionPointCountry')}:{' '}
                    {DocketData.docketData.collectionPointCountry}
                  </p>
                  <p className='text-lg font-medium'>
                    {t('common:collectionPointlongitude')}: {DocketData.docketData.longitude}
                  </p>
                  <p className='text-lg font-medium'>
                    {t('common:collectionPointLatitude')}: {t('common:collectionPointLatitude')}:{' '}
                    {DocketData.docketData.latitude}
                  </p>
                  <p className='text-lg font-medium'>
                    {t('common:destinationFacilityName')}:{' '}
                    {
                      DocketData.destinationFacility?.destinationFacilityData
                        .destinationFacilityName
                    }
                  </p>
                  <p className='text-lg font-medium'>
                    {t('common:destinationFacilityAuthorisationNumber')}:{' '}
                    {
                      DocketData.destinationFacility?.destinationFacilityData
                        .destinationFacilityAuthorisationNumber
                    }
                  </p>
                  <p className='text-lg font-medium'>
                    {t('common:destinationFacilityAddress')}:{' '}
                    {
                      DocketData.destinationFacility?.destinationFacilityData
                        .destinationFacilityAddress
                    }
                  </p>
                  <p className='text-lg font-medium'>
                    {t('common:destinationFacilityStreet')}:{' '}
                    {
                      DocketData.destinationFacility?.destinationFacilityData
                        .destinationFacilityStreet
                    }
                  </p>
                  <p className='text-lg font-medium'>
                    {t('common:destinationFacilityCity')}:{' '}
                    {
                      DocketData.destinationFacility?.destinationFacilityData
                        .destinationFacilityCity
                    }
                  </p>
                  <p className='text-lg font-medium'>
                    {t('common:destinationFacilityCounty')}:{' '}
                    {
                      DocketData.destinationFacility?.destinationFacilityData
                        .destinationFacilityCounty
                    }
                  </p>
                  <p className='text-lg font-medium'>
                    {t('common:destinationFacilityEircode')}:{' '}
                    {
                      DocketData.destinationFacility?.destinationFacilityData
                        .destinationFacilityEircode
                    }
                  </p>
                  <p className='text-lg font-medium'>
                    {t('common:destinationFacilityCountry')}:{' '}
                    {
                      DocketData.destinationFacility?.destinationFacilityData
                        .destinationFacilityCountry
                    }
                  </p>
                  <p className='text-lg font-medium'>
                    {t('common:destinationFacilityLongitude')}:{' '}
                    {
                      DocketData.destinationFacility?.destinationFacilityData
                        .destinationFacilityLongitude
                    }
                  </p>
                  <p className='text-lg font-medium'>
                    {t('common:destinationFacilityLatitude')}:{' '}
                    {
                      DocketData.destinationFacility?.destinationFacilityData
                        .destinationFacilityLatitude
                    }
                  </p>
                </>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DocketImagePage;
