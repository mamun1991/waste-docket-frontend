import * as XLSX from 'xlsx';

export default function createWorkBook(sheetDataArray) {
  const workbook = XLSX.utils.book_new();
  sheetDataArray.forEach((sheetData, index) => {
    const sheetName = `Tab ${index + 1}`;
    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  });
  return workbook;
}
