import { describe, expect, it } from "vitest";

import { amountInWords } from "./amount-words";

describe("amountInWords", () => {
  it("writes lakh amounts the Pakistani way", () => {
    expect(amountInWords(125400)).toBe("Rupees One Lakh Twenty Five Thousand Four Hundred Only");
  });

  it("writes crore amounts", () => {
    expect(amountInWords(20_050_000)).toBe("Rupees Two Crore Fifty Thousand Only");
  });

  it("rounds to whole rupees", () => {
    expect(amountInWords(930.6)).toBe("Rupees Nine Hundred Thirty One Only");
  });

  it("handles zero", () => {
    expect(amountInWords(0)).toBe("Rupees Zero Only");
  });
});
