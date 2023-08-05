import { describe, expect, it, assert } from "vitest";
import {
  decimalToPercentage,
  editDate,
  getDaysDifferenceBetweenDates,
  formatAddress,
} from "./index";

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
