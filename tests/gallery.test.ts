import { describe, expect, it } from "vitest";
import { galleryMosaicHref } from "../src/lib/gallery";

describe("gallery mosaic links", () => {
	it("returns locale-independent project paths for the view to localize", () => {
		expect(galleryMosaicHref("widow-support")).toBe("/projects/widow-support");
	});

	it("uses the locale-independent gallery path when no project is linked", () => {
		expect(galleryMosaicHref()).toBe("/gallery");
	});
});
