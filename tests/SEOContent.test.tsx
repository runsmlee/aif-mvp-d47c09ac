import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Read the index.html file to verify SEO content is present
// in the initial HTML payload (not hidden behind noscript or JS)
const indexHtml = readFileSync(resolve(__dirname, '..', 'index.html'), 'utf-8');

// Extract only the content outside <noscript> tags
const withoutNoscript = indexHtml.replace(/<noscript>[\s\S]*?<\/noscript>/gi, '');

describe('SEO Content in index.html', () => {
  it('renders all three H2 headings in visible HTML', () => {
    expect(withoutNoscript).toContain('<h2');
    expect(withoutNoscript).toMatch(/Viral Coefficient Calculator/i);
    expect(withoutNoscript).toMatch(/Referral Program Break-Even Analysis/i);
    expect(withoutNoscript).toMatch(/K-Factor Formula Explained/i);
  });

  it('renders H3 subheadings for proper heading hierarchy', () => {
    expect(withoutNoscript).toMatch(/The K-Factor Formula: K = i/i);
    expect(withoutNoscript).toMatch(/CAC vs LTV: The Referral Economics Framework/i);
    expect(withoutNoscript).toMatch(/Step-by-Step: Using This Calculator/i);
  });

  it('includes SEO-critical keywords in visible content', () => {
    expect(withoutNoscript.toLowerCase()).toContain('viral coefficient calculator');
    expect(withoutNoscript.toLowerCase()).toContain('k-factor formula');
    expect(withoutNoscript.toLowerCase()).toContain('referral program break');
    expect(withoutNoscript.toLowerCase()).toContain('referral program roi');
    expect(withoutNoscript.toLowerCase()).toContain('cac');
    expect(withoutNoscript.toLowerCase()).toContain('ltv');
  });

  it('uses semantic HTML with article elements for each section', () => {
    const articleCount = (withoutNoscript.match(/<article/gi) || []).length;
    expect(articleCount).toBeGreaterThanOrEqual(3);
  });

  it('wraps content in a section with accessible label', () => {
    expect(withoutNoscript).toMatch(/aria-label="Learn more about referral economics"/i);
  });

  it('each article section contains at least 100 words of substantive text', () => {
    // Extract text content from each article
    const articleRegex = /<article[\s\S]*?<\/article>/gi;
    const articles = withoutNoscript.match(articleRegex) || [];
    expect(articles.length).toBeGreaterThanOrEqual(3);
    articles.forEach((article) => {
      // Strip HTML tags to count words
      const text = article.replace(/<[^>]+>/g, ' ').trim();
      const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length;
      expect(wordCount).toBeGreaterThanOrEqual(100);
    });
  });

  it('content is NOT hidden inside noscript tags', () => {
    // The H2 headings should appear OUTSIDE noscript
    const h2Matches = withoutNoscript.match(/<h2/gi);
    expect(h2Matches).not.toBeNull();
    expect(h2Matches!.length).toBeGreaterThanOrEqual(3);
  });

  describe('FAQPage structured data (JSON-LD)', () => {
    it('includes a JSON-LD script tag in <head>', () => {
      const headMatch = indexHtml.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
      expect(headMatch).not.toBeNull();
      const headContent = headMatch![1];
      expect(headContent).toMatch(/<script[^>]*type="application\/ld\+json"[^>]*>/i);
    });

    it('declares FAQPage schema type', () => {
      const ldMatch = indexHtml.match(
        /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i
      );
      expect(ldMatch).not.toBeNull();
      const json = JSON.parse(ldMatch![1].trim());
      expect(json['@type']).toBe('FAQPage');
      expect(json['@context']).toBe('https://schema.org');
    });

    it('contains at least 3 Question entities with acceptedAnswer', () => {
      const ldMatch = indexHtml.match(
        /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i
      );
      expect(ldMatch).not.toBeNull();
      const json = JSON.parse(ldMatch![1].trim());
      expect(json.mainEntity).toBeInstanceOf(Array);
      expect(json.mainEntity.length).toBeGreaterThanOrEqual(3);
      json.mainEntity.forEach((entity: { '@type': string; name: string; acceptedAnswer: { '@type': string; text: string } }) => {
        expect(entity['@type']).toBe('Question');
        expect(entity.name).toBeTruthy();
        expect(entity.acceptedAnswer).toBeDefined();
        expect(entity.acceptedAnswer['@type']).toBe('Answer');
        expect(entity.acceptedAnswer.text.length).toBeGreaterThan(50);
      });
    });

    it('includes questions that map to existing content sections', () => {
      const ldMatch = indexHtml.match(
        /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i
      );
      expect(ldMatch).not.toBeNull();
      const json = JSON.parse(ldMatch![1].trim());
      const questionNames = json.mainEntity.map(
        (e: { name: string }) => e.name.toLowerCase()
      );
      // At least one question about calculating viral coefficient / K-factor
      expect(
        questionNames.some((q: string) => q.includes('viral coefficient') || q.includes('k-factor'))
      ).toBe(true);
      // At least one question about break-even
      expect(
        questionNames.some((q: string) => q.includes('break even') || q.includes('break-even'))
      ).toBe(true);
      // At least one question about referral program ROI
      expect(
        questionNames.some((q: string) => q.includes('referral program roi'))
      ).toBe(true);
    });

    it('answer text does not fabricate metrics not present in visible content', () => {
      const ldMatch = indexHtml.match(
        /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i
      );
      expect(ldMatch).not.toBeNull();
      const json = JSON.parse(ldMatch![1].trim());
      // Every answer text should have a counterpart keyword in visible body content
      const bodyText = withoutNoscript.toLowerCase();
      json.mainEntity.forEach((entity: { acceptedAnswer: { text: string } }) => {
        const answerText = entity.acceptedAnswer.text.toLowerCase();
        // Verify a key phrase from each answer appears in visible content
        const hasKeyword =
          answerText.includes('k-factor') ||
          answerText.includes('referral') ||
          answerText.includes('cac');
        expect(hasKeyword).toBe(true);
        // Verify at least 2 words from the answer appear in visible content
        const answerWords = answerText.split(/\s+/).filter((w: string) => w.length > 4);
        const overlap = answerWords.filter((w: string) => bodyText.includes(w));
        expect(overlap.length).toBeGreaterThanOrEqual(2);
      });
    });
  });
});
