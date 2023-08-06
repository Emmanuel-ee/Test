import { describe, expect, it, assert } from "vitest";
import {
  decimalToPercentage,
  editDate,
  getDaysDifferenceBetweenDates,
  formatAddress,
  fetchAddressInfo,
  getCountry,
  Data,
  DisplayResult,
} from "./index";

describe("test functions", () => {
  const data: Data = {
    header: {},
    results: [
      {
        DPA: {
          ADDRESS:
            "COPSEWOOD MEDICAL CENTRE, 95, MOMUS BOULEVARD, COVENTRY, CV2 5NB",
          COUNTRY_CODE: "E",
          ENTRY_DATE: "25/04/2002",
          LAST_UPDATE_DATE: "13/06/2022",
          MATCH: "1",
          POSTCODE: "CV2 5NB",
          POST_TOWN: "COVENTRY",
          UPRN: "100071366645",
        },
      },
      {
        DPA: {
          ADDRESS: "97, MOMUS BOULEVARD, COVENTRY, CV2 5NB",
          COUNTRY_CODE: "E",
          ENTRY_DATE: "25/04/2002",
          LAST_UPDATE_DATE: "13/06/2022",
          MATCH: "1",
          POSTCODE: "CV2 5NB",
          POST_TOWN: "COVENTRY",
          UPRN: "100070680186",
        },
      },
    ],
  };

  describe("decimalToPercentage should convert decimal to percentage", () => {
    it("should convert decimal to percentage", () => {
      const decimal = "0.2";
      expect(decimalToPercentage(decimal)).toBe("20.00%");
    });

    it("should throw an error for invalid decimals", () => {
      const invalidDecimals = "-0.5";

      assert.throws(
        () => decimalToPercentage(invalidDecimals),
        "Decimal must be between 0 and 1."
      );
    });
  });

  it("should edit the date format", () => {
    const date = "01/05/1995";
    expect(editDate(date)).toBe("1995-05-01");
  });

  it("should get the difference in days between two dates", () => {
    const oldDate = "01/05/1995";
    const newDate = "05/08/2023";
    expect(getDaysDifferenceBetweenDates(oldDate, newDate)).toBe(10324);
  });

  it("should remove the postcode and posttown from an address and present address in title case", () => {
    const address = "129, MOMUS BOULEVARD, COVENTRY, CV2 5NB";
    const postCode = "CV2 5NB";
    const posttown = "COVENTRY";
    expect(formatAddress(address, postCode, posttown)).toBe(
      "129, Momus Boulevard"
    );
  });

  it("should return the country from the country code", () => {
    const countryCode = "W";
    expect(getCountry(countryCode)).toBe("Wales");
  });

  describe("fetchAddressInfo", () => {
    it("should process data correctly", () => {
      const expected: DisplayResult[] = [
        {
          ADDRESS: "Copsewood Medical Centre, 95, Momus Boulevard",
          COUNTRY: "England",
          COUNTRY_CODE: "E",
          DIFFERENCE_BETWEEN_LASTUPDATE_AND_ENTRYDATE: 7355,
          ENTRY_DATE: "2002-04-25",
          LAST_UPDATE_DATE: "2022-06-13",
          MATCH: "100.00%",
          POSTCODE: "CV2 5NB",
          POST_TOWN: "COVENTRY",
          UPRN: "100071366645",
        },
        {
          ADDRESS: "97, Momus Boulevard",
          COUNTRY: "England",
          COUNTRY_CODE: "E",
          DIFFERENCE_BETWEEN_LASTUPDATE_AND_ENTRYDATE: 7355,
          ENTRY_DATE: "2002-04-25",
          LAST_UPDATE_DATE: "2022-06-13",
          MATCH: "100.00%",
          POSTCODE: "CV2 5NB",
          POST_TOWN: "COVENTRY",
          UPRN: "100070680186",
        },
      ];

      const result = fetchAddressInfo(data);
      expect(result).toEqual(expected);
    });
  });
});
