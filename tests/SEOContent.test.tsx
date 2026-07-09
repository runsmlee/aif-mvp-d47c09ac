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
});
