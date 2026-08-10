import { describe, expect, it } from "vitest";
import {
  buildBlogPosting,
  buildFaqPage,
  DONATION_FAQS_EN,
  DONATION_FAQS_FR,
  SPONSOR_FAQS_EN,
  SPONSOR_FAQS_FR,
  toSchemaDate,
} from "../src/lib/structured-data";

describe("structured-data helpers", () => {
  it("normalizes publish dates to ISO", () => {
    expect(toSchemaDate("2024-06-15")).toBe("2024-06-15T00:00:00.000Z");
    expect(toSchemaDate("not-a-date")).toBeUndefined();
    expect(toSchemaDate(undefined)).toBeUndefined();
  });

  it("builds BlogPosting with publisher and dates", () => {
    const schema = buildBlogPosting({
      title: "Mama Patience",
      description: "A widow rebuilds her livelihood.",
      url: "https://apotidev.org/stories/why-we-focus-on-widows",
      imageUrl: "https://cdn.example.com/photo.jpg",
      datePublished: "2024-03-01T12:00:00.000Z",
      category: "story",
      inLanguage: "en",
    });

    expect(schema["@type"]).toBe("BlogPosting");
    expect(schema.headline).toBe("Mama Patience");
    expect(schema.datePublished).toBe("2024-03-01T12:00:00.000Z");
    expect(schema.publisher).toMatchObject({
      "@type": "Organization",
      name: "Apoti Development Association",
    });
    expect(schema.image).toEqual(["https://cdn.example.com/photo.jpg"]);
    expect(schema.isPartOf.url).toBe("https://apotidev.org/stories");
  });

  it("points French posts at the FR blog index", () => {
    const schema = buildBlogPosting({
      title: "Histoire",
      description: "Résumé",
      url: "https://apotidev.org/fr/stories/example",
      inLanguage: "fr",
    });
    expect(schema.isPartOf.url).toBe("https://apotidev.org/fr/stories");
  });

  it("builds FAQPage matching visible Q&A text", () => {
    const schema = buildFaqPage(
      DONATION_FAQS_EN,
      "https://apotidev.org/donate",
    );
    expect(schema["@type"]).toBe("FAQPage");
    expect(schema.mainEntity).toHaveLength(DONATION_FAQS_EN.length);
    expect(schema.mainEntity[0]).toMatchObject({
      "@type": "Question",
      name: DONATION_FAQS_EN[0].question,
      acceptedAnswer: {
        "@type": "Answer",
        text: DONATION_FAQS_EN[0].answer,
      },
    });
  });

  it("keeps donation and sponsor FAQ sets non-empty and bilingual", () => {
    expect(DONATION_FAQS_EN.length).toBeGreaterThanOrEqual(5);
    expect(DONATION_FAQS_FR.length).toBe(DONATION_FAQS_EN.length);
    expect(SPONSOR_FAQS_EN.length).toBeGreaterThanOrEqual(5);
    expect(SPONSOR_FAQS_FR.length).toBe(SPONSOR_FAQS_EN.length);
    expect(DONATION_FAQS_EN[0].question.toLowerCase()).toContain("tax");
    expect(DONATION_FAQS_FR[0].question.toLowerCase()).toContain("impôt");
    expect(SPONSOR_FAQS_EN.some((f) => /80%/.test(f.answer))).toBe(true);
  });
});
