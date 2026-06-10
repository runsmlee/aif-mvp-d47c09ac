import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SEOContent } from '../src/components/SEOContent';

describe('SEOContent', () => {
  it('renders all three content sections with H2 headings', () => {
    render(<SEOContent />);
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /What is K-Factor\? How to Calculate Viral Coefficient/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /Referral Program ROI: When Does It Pay Off\?/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /Who Should Use This Calculator/i,
      })
    ).toBeInTheDocument();
  });

  it('includes anchor links back to the calculator in each section', () => {
    render(<SEOContent />);
    const anchors = screen.getAllByRole('link', { name: /try the calculator above/i });
    expect(anchors).toHaveLength(3);
    anchors.forEach((anchor) => {
      expect(anchor).toHaveAttribute('href', '#calculator');
    });
  });

  it('contains SEO-critical keywords in content', () => {
    render(<SEOContent />);
    const content = document.body.textContent ?? '';
    expect(content).toContain('viral coefficient calculator');
    expect(content).toContain('K-factor formula');
    expect(content).toContain('referral program break even');
    expect(content).toContain('referral program ROI');
  });

  it('uses semantic HTML with article elements for each section', () => {
    render(<SEOContent />);
    const articles = screen.getAllByRole('article');
    expect(articles).toHaveLength(3);
  });

  it('wraps all content in a section with accessible label', () => {
    render(<SEOContent />);
    const section = screen.getByRole('region', { name: /learn more about referral economics/i });
    expect(section).toBeInTheDocument();
  });
});
