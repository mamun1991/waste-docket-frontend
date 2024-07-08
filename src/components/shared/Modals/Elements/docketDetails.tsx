import useTranslation from 'next-translate/useTranslation';
import Modal from '../Modal';

const DeleteModal = docketData => {
  const {t} = useTranslation();
  const {
    customerId,
    customerName,
    customerPhone,
    customerAddress,
    customerEmail,
    customerStreet,
    customerCity,
    customerCounty,
    customerEircode,
    customerCountry,
    jobId,
    prefix,
    docketNumber,
    longitude,
    latitude,
    date,
    time,
    vehicleRegistration,
    generalPickupDescription,
    isWaste,
    wastes,
    collectedFromWasteFacility,
    collectionPointName,
    collectionPointAddress,
    collectionPointStreet,
    collectionPointCity,
    collectionPointCounty,
    collectionPointEircode,
    collectionPointCountry,
    destinationFacilityLongitude,
    destinationFacilityLatitude,
    destinationFacilityName,
    destinationFacilityAuthorisationNumber,
    destinationFacilityAddress,
    destinationFacilityStreet,
    destinationFacilityCity,
    destinationFacilityCounty,
    destinationFacilityEircode,
    destinationFacilityCountry,
    driverSignature,
    wasteFacilityRepSignature,
    customerSignature,
    isLoadForExport,
    portOfExport,
    countryOfDestination,
    facilityAtDestination,
    tfsReferenceNumber,
    additionalInformation,
    fleetId,
    termsAndConditions,
  } = docketData;

  return (
    <Modal title={`${t('common:docket_details')}`} large>
      {termsAndConditions && (
        <div className='flex justify-between mr-8'>
          <div />
          <a
            target='_blank'
            rel='noreferrer'
            className='w-full text-right text-blue-500 underline'
            href={`/fleetTermsAndConditions/${fleetId}?docketNumber=${docketNumber}`}
          >
            View Terms & Conditions
          </a>
        </div>
      )}
      <div className='bg-white flex flex-col rounded-lg p-8 space-y-4 max-h-[400px] xl:max-h-[500px] overflow-y-auto w-full pr-2'>
        <p className='text-lg font-medium'>
          {t('common:customerId')}: {customerId}
        </p>
        <p className='text-lg font-medium'>
          {t('common:customerName')}: {customerName}
        </p>
        <p className='text-lg font-medium'>
          {t('common:customerEmail')}: {customerEmail}
        </p>
        <p className='text-lg font-medium'>
          {t('common:customerPhone')}: {customerPhone}
        </p>
        <p className='text-lg font-medium'>
          {t('common:jobId')}: {jobId}
        </p>
        <p className='text-lg font-medium'>
          {t('common:customerAddress')}: {customerAddress}
        </p>
        <p className='text-lg font-medium'>
          {t('common:customerStreet')}: {customerStreet}
        </p>
        <p className='text-lg font-medium'>
          {t('common:city')}: {customerCity}
        </p>
        <p className='text-lg font-medium'>
          {t('common:county')}: {customerCounty}
        </p>
        <p className='text-lg font-medium'>
          {t('common:eircode')}: {customerEircode}
        </p>
        <p className='text-lg font-medium'>
          {t('common:Country')}: {customerCountry}
        </p>

        <p className='text-lg font-medium'>
          {t('common:docketNumber')}: {`${prefix}${docketNumber}`}
        </p>
        <p className='text-lg font-medium'>
          {t('common:date')}: {date}
        </p>
        <p className='text-lg font-medium'>
          {t('common:time')}: {time}
        </p>
        <p className='text-lg font-medium'>
          {t('common:vehicleRegistration')}: {vehicleRegistration}
        </p>

        <p className='text-lg font-medium'>
          {t('common:isWaste')}: {isWaste ? t('common:yes') : t('common:no')}
        </p>
        {isWaste ? (
          <>
            {wastes &&
              wastes.map((w, index) => (
                <div className='flex flex-col p-4 my-3 border rounded-md gap-y-3' key={index}>
                  <h3 className='text-lg font-semibold'>Waste #{index + 1}</h3>
                  <p className='text-lg font-medium'>
                    {t('common:wasteDescription')}: {w.wasteDescription}
                  </p>
                  <p className='text-lg font-medium'>
                    {t('common:wasteLoWCode')}: {w.wasteLoWCode}
                  </p>
                  <p className='text-lg font-medium'>
                    {t('common:isHazardous')}: {w.isHazardous ? t('common:yes') : t('common:no')}
                  </p>
                  <p className='text-lg font-medium'>
                    {t('common:localAuthorityOfOrigin')}: {w.localAuthorityOfOrigin}
                  </p>
                  <p className='text-lg font-medium'>
                    {t('common:wasteQuantity')}:{' '}
                    {`${w.wasteQuantity.amount} ${w.wasteQuantity.unit}`}
                  </p>
                </div>
              ))}
            <>
              <p className='text-lg font-medium'>
                {t('common:collectedFromWasteFacility')}:{' '}
                {collectedFromWasteFacility ? t('common:yes') : t('common:no')}
              </p>
              <p className='text-lg font-medium'>
                {t('common:collectionPointName')}: {collectionPointName}
              </p>
              <p className='text-lg font-medium'>
                {t('common:collectionPointAddress')}: {collectionPointAddress}
              </p>
              <p className='text-lg font-medium'>
                {t('common:collectionPointStreet')}: {collectionPointStreet}
              </p>
              <p className='text-lg font-medium'>
                {t('common:collectionPointCity')}: {collectionPointCity}
              </p>
              <p className='text-lg font-medium'>
                {t('common:collectionPointCounty')}: {collectionPointCounty}
              </p>
              <p className='text-lg font-medium'>
                {t('common:collectionPointEircode')}: {collectionPointEircode}
              </p>
              <p className='text-lg font-medium'>
                {t('common:collectionPointCountry')}: {collectionPointCountry}
              </p>
              <p className='text-lg font-medium'>
                {t('common:collectionPointlongitude')}: {longitude}
              </p>
              <p className='text-lg font-medium'>
                {t('common:collectionPointLatitude')}: {latitude}
              </p>
              <p className='text-lg font-medium'>
                {t('common:destinationFacilityName')}: {destinationFacilityName}
              </p>
              <p className='text-lg font-medium'>
                {t('common:destinationFacilityAuthorisationNumber')}:{' '}
                {destinationFacilityAuthorisationNumber}
              </p>
              <p className='text-lg font-medium'>
                {t('common:destinationFacilityAddress')}: {destinationFacilityAddress}
              </p>
              <p className='text-lg font-medium'>
                {t('common:destinationFacilityStreet')}: {destinationFacilityStreet}
              </p>
              <p className='text-lg font-medium'>
                {t('common:destinationFacilityCity')}: {destinationFacilityCity}
              </p>
              <p className='text-lg font-medium'>
                {t('common:destinationFacilityCounty')}: {destinationFacilityCounty}
              </p>
              <p className='text-lg font-medium'>
                {t('common:destinationFacilityEircode')}: {destinationFacilityEircode}
              </p>
              <p className='text-lg font-medium'>
                {t('common:destinationFacilityCountry')}: {destinationFacilityCountry}
              </p>
              <p className='text-lg font-medium'>
                {t('common:destinationFacilityLongitude')}: {destinationFacilityLongitude}
              </p>
              <p className='text-lg font-medium'>
                {t('common:destinationFacilityLatitude')}: {destinationFacilityLatitude}
              </p>
            </>
          </>
        ) : (
          <p className='text-lg font-medium'>
            {t('common:generalPickupDescription')}: {generalPickupDescription}
          </p>
        )}
        <div className='flex flex-row items-center'>
          <p className='text-lg font-medium'>{t('common:customerSignature')}: </p>
          {customerSignature && (
            <img
              src={customerSignature}
              alt='customerSignature'
              className='object-contain h-16 w-44'
            />
          )}
        </div>
        {driverSignature?.slice(0, 4) === 'data' ? (
          <div className='flex flex-row items-center'>
            <p className='text-lg font-medium'>{t('common:driverSignature')}: </p>
            <img src={driverSignature} alt='driverSignature' className='object-contain h-16 w-44' />
          </div>
        ) : (
          driverSignature?.length < 50 && (
            <p className='text-lg font-medium'>
              {t('common:driverSignature')}: {driverSignature}
            </p>
          )
        )}
        {wasteFacilityRepSignature?.slice(0, 4) === 'data' ? (
          <div className='flex flex-row items-center'>
            <p className='text-lg font-medium'>{t('common:wasteFacilityRepSignature')}: </p>
            <img
              src={wasteFacilityRepSignature}
              alt='wasteFacilityRepSignature'
              className='object-contain h-16 w-44'
            />
          </div>
        ) : (
          wasteFacilityRepSignature?.length < 50 && (
            <p className='text-lg font-medium'>
              {t('common:wasteFacilityRepSignature')}: {wasteFacilityRepSignature}
            </p>
          )
        )}
        <p className='text-lg font-medium'>
          {t('common:isLoadForExport')}: {isLoadForExport ? t('common:yes') : t('common:no')}
        </p>
        {isLoadForExport && (
          <>
            <p className='text-lg font-medium'>
              {t('common:portOfExport')}: {portOfExport}
            </p>
            <p className='text-lg font-medium'>
              {t('common:countryOfDestination')}: {countryOfDestination}
            </p>
            <p className='text-lg font-medium'>
              {t('common:facilityAtDestination')}: {facilityAtDestination}
            </p>
            <p className='text-lg font-medium'>
              {t('common:tfsReferenceNumber')}: {tfsReferenceNumber}
            </p>
          </>
        )}
        {additionalInformation && (
          <p className='text-lg font-medium'>
            {t('common:additionalInformation')}: {additionalInformation}
          </p>
        )}
      </div>
    </Modal>
  );
};
export default DeleteModal;
