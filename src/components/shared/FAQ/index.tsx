import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';

import 'react-accessible-accordion/dist/fancy-example.css';

const FAQ = () => (
  <div className='min-h-full pt-0 pb-12 flex flex-col bg-white h-screen overflow-y-auto'>
    <div className='px-12 py-4'>
      <Accordion allowZeroExpanded={true}>
        <AccordionItem>
          <AccordionItemHeading>
            <AccordionItemButton>How to add a driver?</AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <p className='pt-2'>
              Adding a driver to your fleet is a straightforward process. To get started, navigate
              to the home dashboard. From there, locate and click on the &apos;Add Driver&apos;
              option. This action will trigger a popup window to appear, prompting you to choose the
              relevant fleet if you happen to have more than one. Next, provide the email address of
              the driver you wish to add.
            </p>
            <p className='pt-2'>
              Upon entering the driver&apos;s email address, an invitation email will be
              automatically sent to them. Once the driver receives this email and logs in, they will
              have the option to accept your invitation. Once the driver accepts, they will become a
              part of your fleet.
            </p>
            <p className='pt-2'>
              With this access, the driver will be able to add dockets for your business. These
              dockets will be viewable within your business account, allowing you to seamlessly
              manage and keep track of your operations.
            </p>
            <div className='flex flex-row w-full gap-4 pt-2'>
              <img src='/assets/images/FAQ_AddDriver_1.png' alt='' className='w-1/2' />
              <img src='/assets/images/FAQ_AddDriver_2.png' alt='' className='w-1/2' />
            </div>
          </AccordionItemPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionItemHeading>
            <AccordionItemButton>How to add a customer?</AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <p className='pt-2'>
              To add a new customer to your records, follow these simple steps: Begin by accessing
              the home dashboard. Once there, look for the &apos;Add Customer&apos; option and give
              it a click. This action will trigger a popup window to appear, guiding you through the
              process.
            </p>
            <p className='pt-2'>
              In the popup, you&apos;ll be prompted to choose the appropriate fleet if you&apos;re
              managing multiple fleets. Next, provide the essential details for the new customer,
              including their name, email, and address. Fill in this information accurately to
              ensure precise record keeping.
            </p>
            <p className='pt-2'>
              Once the customer details are filled out, you can finalize the addition by clicking
              the appropriate button to add the customer. Should you wish to import a larger list of
              customers, a separate FAQ explains how to do just that. Be sure to check out the
              corresponding FAQ for guidance on importing customer lists efficiently.
            </p>
            <div className='flex flex-row w-full gap-4 pt-2'>
              <img src='/assets/images/FAQ_AddCustomer_1.png' alt='' className='w-1/2' />
              <img src='/assets/images/FAQ_AddCustomer_2.png' alt='' className='w-1/2' />
            </div>
          </AccordionItemPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionItemHeading>
            <AccordionItemButton>How to import customers from a CSV file?</AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <p className='pt-2'>
              Absolutely, you can streamline the process of adding multiple customers by importing
              them in bulk. Here&apos;s how:
            </p>
            <ol className='list-decimal pl-8'>
              <li className='pt-2'>
                Begin by navigating to the top header bar on your dashboard. Locate the
                &apos;Customers&apos; option and click on it. This action will lead you to a new
                page dedicated to managing customers.
              </li>
              <li className='pt-2'>
                On this page, you&apos;ll find a button labeled &apos;Import Customers.&apos; Give
                this button a click to initiate the import process.
              </li>
              <li className='pt-2'>
                Prepare a CSV (Comma-Separated Values) file that contains the customer information
                you want to import. Each line in the CSV file should represent a customer, with the
                necessary details separated by commas.
              </li>
              <li className='pt-2'>
                Within the import popup, there will be an option to download a sample CSV file. This
                sample file will provide a template that ensures your customer data is structured
                correctly for successful import. Your customer CSV file must adhere to this template
                in terms of formatting and column order to ensure a smooth import process.
              </li>
              <li className='pt-2'>
                Once your CSV file is ready and formatted correctly, you can proceed to upload it
                through the import popup. The system will then process the file and add the listed
                customers to your records.
              </li>
              <li className='pt-2'>
                Remember, maintaining the correct CSV format is crucial for a successful import.
                Following these steps and adhering to the provided template will help you
                efficiently add a substantial number of customers to your system in one go.
              </li>
            </ol>
            <div className='flex flex-row w-full gap-4 pt-2'>
              <img src='/assets/images/FAQ_ImportCustomers_1.png' alt='' className='w-1/2' />
              <img src='/assets/images/FAQ_ImportCustomers_2.png' alt='' className='w-1/2' />
            </div>
          </AccordionItemPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionItemHeading>
            <AccordionItemButton>How to edit a fleet address?</AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <p>
              Updating the address of a fleet is a straightforward process. Here&apos;s how you can
              do it:
            </p>
            <ol className='list-decimal pl-8'>
              <li className='pt-2'>
                Begin by accessing the top header bar on your dashboard. Look for the
                &apos;Fleets&apos; option and click on it. This action will lead you to a new page
                specifically designed for managing your fleets.
              </li>
              <li className='pt-2'>
                On this page, you will find a list of all your fleets. You can choose to add a new
                fleet or edit an existing one. To edit, simply locate the fleet you wish to modify
                and click on the &apos;Edit&apos; button associated with it.
              </li>
              <li className='pt-2'>
                Clicking on the &apos;Edit&apos; button will take you to a page where you can view
                and modify various information fields related to the selected fleet.
              </li>
              <li className='pt-2'>
                Among these fields, you&apos;ll be able to locate and update the fleet&apos;s
                address. Carefully make the necessary changes to the address field to ensure its
                accuracy.
              </li>
              <li className='pt-2'>
                Once you have made the desired changes, remember to save your modifications by using
                the provided &apos;Submit&apos; button. After saving, you can close the editing
                interface.
              </li>
            </ol>
            <p className='pt-2'>
              By following these steps, you&apos;ll successfully update the address of the fleet.
              This process allows you to keep your fleet information accurate and up to date for
              efficient record keeping and management.
            </p>
            <div className='flex flex-row w-full gap-4 pt-2'>
              <img src='/assets/images/FAQ_EditFleetAddress_1.png' alt='' className='w-1/2' />
              <img src='/assets/images/FAQ_EditFleetAddress_2.png' alt='' className='w-1/2' />
            </div>
          </AccordionItemPanel>
        </AccordionItem>
      </Accordion>
    </div>
  </div>
);
export default FAQ;
