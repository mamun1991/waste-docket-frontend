import Modal from '../Modal';

const FleetDetails = fleet => (
  <Modal title={'Company Information'} medium>
    <div className='grid w-full gap-3 mt-8 divide-y divide-gray-200'>
      <div className=''>
        <span className='font-semibold'>Company Name: </span>
        <span>{fleet.name}</span>
      </div>
      <div className='pt-2'>
        <span className='font-semibold'>Company Owner E-mail: </span>
        <span>{fleet.ownerEmail}</span>
      </div>
      <div className='pt-2'>
        <span className='font-semibold'>VAT: </span>
        <span>{fleet.VAT}</span>
      </div>
      <div className='pt-2'>
        <span className='font-semibold'>Permit Number:</span>
        <span>{fleet.permitNumber}</span>
      </div>
      <div className='pt-2'>
        <span className='font-semibold'>Permit Holder Name:</span>
        <span>{fleet.permitHolderName}</span>
      </div>
      <div className='pt-2'>
        <span className='font-semibold'>Permit Holder Contact Details: </span>
        <span>{fleet.permitHolderContactDetails}</span>
      </div>
      <div className='pt-2'>
        <span className='font-semibold'>Permit Holder Contact Address: </span>
        <span>{fleet.permitHolderAddress}</span>
      </div>
      <div className='pt-2'>
        <span className='font-semibold'>Prefix: </span>
        <span>{fleet.prefix}</span>
      </div>
    </div>

    {fleet.permitHolderLogo && (
      <div className='relative'>
        <div className='mt-8'>
          <div className='relative flex max-w-lg overflow-hidden h-44'>
            <img
              src={fleet?.permitHolderLogo}
              alt='Permit Holder Logo'
              className={'block w-full h-auto object-contain'}
            />
          </div>
        </div>
      </div>
    )}
  </Modal>
);
export default FleetDetails;
