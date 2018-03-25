import { removeLeadingDays, yearDownloadsToWeaks } from "../npmApiHelpers";
import lastMonth from "./react-downloads-api-last-month.fixtures.json";

const originalDownloads = lastMonth.downloads;

describe("/utils/npmApiHelpers", () => {
  describe("removeLeadingDays", () => {
    it(`should return an array of ${52 * 7} items`, () => {
      expect(removeLeadingDays(originalDownloads)).toHaveLength(52 * 7);
    });
    it(`last item should stay unchanged`, () => {
      expect(
        removeLeadingDays(originalDownloads)[originalDownloads.length - 1]
      ).toEqual(originalDownloads[length - 1]);
    });
    it(`first item should should have switched`, () => {
      expect(removeLeadingDays(originalDownloads)[0]).toEqual(
        originalDownloads[1]
      );
    });
  });
  describe("yearDownloadsToWeaks", () => {
    it("should return an array of 52 items", () => {
      const result = yearDownloadsToWeaks(originalDownloads);
      expect(result).toHaveLength(52);
    });
    it("last date should equal to original last date", () => {
      const result = yearDownloadsToWeaks(originalDownloads);
      expect(result[result.length - 1].from).toEqual(
        originalDownloads[originalDownloads.length - 7].day
      );
      expect(result[result.length - 1].to).toEqual(
        originalDownloads[originalDownloads.length - 1].day
      );
    });
    it("first date should equal to cropped original last date", () => {
      const result = yearDownloadsToWeaks(originalDownloads);
      expect(result[0].from).toEqual(originalDownloads[1].day);
      expect(result[0].to).toEqual(originalDownloads[7].day);
    });
    it("sum of downloads by week should be correct", () => {
      const expectedSum = removeLeadingDays(originalDownloads).reduce(
        (acc, cur) => acc + cur.downloads,
        0
      );
      const receivedSum = yearDownloadsToWeaks(originalDownloads).reduce(
        (acc, cur) => acc + cur.value,
        0
      );
      expect(receivedSum).toEqual(expectedSum);
    });
  });
});
