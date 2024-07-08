import ExcelJS from 'exceljs';

function triggerDownload(buffer, filename) {
  console.log('(creating xlsx file) ==> downloadAction is being done');
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function processRow(row, maxWastes) {
  console.log('(creating xlsx file) ==> creating some headers that needs to be concatenated');
  const newRow = {dateAndTime: `${row.date} ${row.time}`, ...row};

  newRow.Origin = [
    row.collectionPointAddress,
    row.collectionPointStreet,
    row.collectionPointCity,
    row.collectionPointCounty,
    row.collectionPointEircode,
    row.collectionPointCountry,
  ]
    .filter(Boolean)
    .join(', ');

  newRow.DestinationAddress = [
    row.destinationFacilityAddress,
    row.destinationFacilityStreet,
    row.destinationFacilityCity,
    row.destinationFacilityCounty,
    row.destinationFacilityEircode,
    row.destinationFacilityCountry,
  ]
    .filter(Boolean)
    .join(', ');

  newRow.CustomerAddress = [
    row.customerAddress,
    row.customerStreet,
    row.customerCity,
    row.customerCounty,
    row.customerEircode,
    row.customerCountry,
  ]
    .filter(Boolean)
    .join(', ');
  for (let i = 0; i < maxWastes; i++) {
    const waste = newRow.wastes[i] || {};
    newRow[`wasteDescription${i + 1}`] = waste.wasteDescription || '';
    newRow[`wasteLoWCode${i + 1}`] = waste.wasteLoWCode || '';
    newRow[`wasteQuantityUnit${i + 1}`] = waste.wasteQuantity?.unit || '';
    newRow[`wasteQuantityAmount${i + 1}`] = waste.wasteQuantity?.amount || '';
  }

  delete newRow.date;
  delete newRow.time;
  delete newRow.collectionPointAddress;
  delete newRow.collectionPointStreet;
  delete newRow.collectionPointCity;
  delete newRow.collectionPointCounty;
  delete newRow.collectionPointEircode;
  delete newRow.collectionPointCountry;
  delete newRow.destinationFacilityAddress;
  delete newRow.destinationFacilityStreet;
  delete newRow.destinationFacilityCity;
  delete newRow.destinationFacilityCounty;
  delete newRow.destinationFacilityEircode;
  delete newRow.destinationFacilityCountry;
  delete newRow.customerAddress;
  delete newRow.customerStreet;
  delete newRow.customerCity;
  delete newRow.customerCounty;
  delete newRow.customerEircode;
  delete newRow.customerCountry;

  return newRow;
}

export default async function createWorksheet(data) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Dockets');

  const maxWastes = Math.max(...data.map(d => d.wastes.length));
  console.log('(creating xlsx file) ==> maxWastes:', maxWastes);
  let headers = [
    {header: 'Date & Time', key: 'dateAndTime', width: 20},
    {header: 'Docket', width: 15, key: 'docketNumber'},
    {header: 'Vehicle Reg', width: 25, key: 'vehicleRegistration'},
    {header: 'Customer Name', width: 25, key: 'customerName'},
    {header: 'Customer Address', width: 80, key: 'CustomerAddress'},
    {header: 'Job ID', width: 20, key: 'jobId'},
    {header: 'Origin', width: 80, key: 'Origin'},
    {header: 'Destination', width: 25, key: 'destinationFacilityName'},
    {
      header: 'Destination Facility Authorisation Number',
      width: 46,
      key: 'destinationFacilityAuthorisationNumber',
    },
    {header: 'Destination Facility Address', width: 80, key: 'DestinationAddress'},
  ];

  for (let i = 0; i < maxWastes; i++) {
    console.log('(creating xlsx file) ==> headers are being created');
    headers.push({
      header: `Waste Description ${i + 1}`,
      key: `wasteDescription${i + 1}`,
      width: 28,
    });
    headers.push({header: `Waste LoW Code ${i + 1}`, key: `wasteLoWCode${i + 1}`, width: 28});
    headers.push({
      header: `Waste Quantity Unit ${i + 1}`,
      key: `wasteQuantityUnit${i + 1}`,
      width: 28,
    });
    headers.push({
      header: `Waste Quantity Amount ${i + 1}`,
      key: `wasteQuantityAmount${i + 1}`,
      width: 28,
    });
  }

  headers = headers.concat([
    {header: 'Driver Email', width: 28, key: 'driverEmail'},
    {header: 'Customer Email', width: 28, key: 'customerEmail'},
    {header: 'Port Of Export', key: 'portOfExport', width: 28},
    {header: 'Country of Destination', key: 'countryOfDestination', width: 28},
    {header: 'Facility At Destination', key: 'facilityAtDestination', width: 28},
    {header: 'Additional Information', key: 'additionalInformation', width: 80},
  ]);

  worksheet.columns = headers;

  const headerRow = worksheet.getRow(1);
  console.log('(creating xlsx file) ==> headers for xlsx file');
  headers.forEach((header, index) => {
    headerRow.getCell(index + 1).value = header.header;
    headerRow.getCell(index + 1).alignment = {vertical: 'middle', horizontal: 'center'};
    headerRow.getCell(index + 1).font = {bold: true};
    headerRow.getCell(index + 1).border = {bottom: {style: 'thin'}, right: {style: 'thin'}};
    headerRow.getCell(index + 1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FFFFFF00'},
    };
  });
  console.log('(creating xlsx file) ==> data is being created');
  data.forEach((d, i) => {
    const row = processRow(d, maxWastes);
    const dataRow = worksheet.getRow(i + 3);
    headers.forEach((header, index) => {
      dataRow.getCell(index + 1).value = row[header.key];
      dataRow.getCell(index + 1).alignment = {vertical: 'middle', horizontal: 'center'};
    });
  });
  console.log('(creating xlsx file) ==> xlsx file is being created');
  const buffer = await workbook.xlsx.writeBuffer();

  triggerDownload(buffer, 'DocketsData.xlsx');
}
