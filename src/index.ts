/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
  readonly VITE_BASE_URL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

const API_Key: ImportMeta = import.meta.env.VITE_API_KEY;
const BASE_URL: ImportMeta = import.meta.env.VITE_BASE_URL;

export interface DisplayResult {
  ADDRESS: string;
  UPRN: string;
  POST_TOWN: string;
  POSTCODE: string;
  COUNTRY: string;
  LAST_UPDATE_DATE: string;
  ENTRY_DATE: string;
  DIFFERENCE_BETWEEN_LASTUPDATE_AND_ENTRYDATE: number;
  MATCH?: string;
}

export interface AddressInfo {
  DPA: DisplayResult;
}

export interface Data {
  header: Object;
  results: AddressInfo[];
}

export async function getAddressByPostCode(
  postCode: string
): Promise<DisplayResult[]> {
  try {
    const response = await fetch(
      `${BASE_URL}postcode?postcode=${postCode}&lr=EN&key=${API_Key}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }
    const data: Data = await response.json();
    const infoWithMatch = fetchAddressInfo(data);

    // Remove the MATCH property from each item
    for (let item of infoWithMatch) {
      delete item.MATCH;
    }

    return infoWithMatch;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export async function getAddressByQuery(
  query: string
): Promise<DisplayResult[]> {
  try {
    const response = await fetch(
      `${BASE_URL}find?query=${query}&lr=EN&key=${API_Key}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }
    const data: Data = await response.json();
    return fetchAddressInfo(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export function fetchAddressInfo(data: Data): DisplayResult[] {
  const DPAinfo = data.results;
  const infoList: DisplayResult[] = [];
  DPAinfo.forEach((info: AddressInfo) => {
    const addressDetails: DisplayResult = {
      ADDRESS: formatAddress(
        info.DPA.ADDRESS,
        info.DPA.POSTCODE,
        info.DPA.POST_TOWN
      ),
      UPRN: info.DPA.UPRN,
      POST_TOWN: info.DPA.POST_TOWN,
      POSTCODE: info.DPA.POSTCODE,
      COUNTRY: "England",
      LAST_UPDATE_DATE: editDate(info.DPA.LAST_UPDATE_DATE),
      ENTRY_DATE: editDate(info.DPA.ENTRY_DATE),
      DIFFERENCE_BETWEEN_LASTUPDATE_AND_ENTRYDATE:
        getDaysDifferenceBetweenDates(
          info.DPA.ENTRY_DATE,
          info.DPA.LAST_UPDATE_DATE
        ),
      MATCH: decimalToPercentage(info.DPA.MATCH as string),
    };
    infoList.push(addressDetails);
  });
  return infoList;
}

export function formatAddress(
  address: string,
  POSTCODE: string,
  POST_TOWN: string
): string {
  let addressDetails = address.split(",");

  //Remove postcode from address
  addressDetails.forEach((detail) => {
    if (detail.trim() === POSTCODE.trim()) {
      const index = addressDetails.indexOf(detail);
      addressDetails.splice(index, 1);
    }
  });

  //Remove Country from address
  addressDetails.forEach((detail) => {
    if (detail.trim() === POST_TOWN.trim()) {
      const index = addressDetails.indexOf(detail);
      addressDetails.splice(index, 1);
    }
  });

  const refinedResult = addressDetails.join(",");
  return refinedResult
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function decimalToPercentage(decimal: string): string {
  const changeTonumber = +decimal;
  if (changeTonumber >= 0 && changeTonumber <= 1) {
    const percentage = changeTonumber * 100;
    return `${percentage.toFixed(2)}%`;
  } else {
    throw new Error("Decimal must be between 0 and 1.");
  }
}

export function editDate(date: string): string {
  let newDate = date.split("/");
  const editedDate = newDate.reverse().join("-");
  return editedDate;
}

export function getDaysDifferenceBetweenDates(
  startDate: string,
  endDate: string
): number {
  function isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  function daysInMonth(year: number, month: number): number {
    const monthLengths = [
      31,
      isLeapYear(year) ? 29 : 28,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31,
    ];
    return monthLengths[month - 1];
  }

  function parseDate(dateStr: string): {
    day: number;
    month: number;
    year: number;
  } {
    const [day, month, year] = dateStr.split("/").map(Number);
    return { day, month, year };
  }

  const startDateObj = parseDate(startDate);
  const endDateObj = parseDate(endDate);

  let daysDifference = 0;

  for (let year = startDateObj.year; year <= endDateObj.year; year++) {
    const startMonth = year === startDateObj.year ? startDateObj.month : 1;
    const endMonth = year === endDateObj.year ? endDateObj.month : 12;

    for (let month = startMonth; month <= endMonth; month++) {
      const startDay =
        year === startDateObj.year && month === startDateObj.month
          ? startDateObj.day
          : 1;
      const endDay =
        year === endDateObj.year && month === endDateObj.month
          ? endDateObj.day
          : daysInMonth(year, month);

      daysDifference += endDay - startDay + 1;
    }
  }

  return daysDifference;
}
