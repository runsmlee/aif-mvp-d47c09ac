/**
 * SEOContent — Three structured content sections below the calculator.
 *
 * Purpose: Give search engines enough indexable text to rank this page
 * for queries like "viral coefficient calculator",
 * "referral program break even", and "referral program ROI".
 * Each section targets a distinct high-intent search cluster.
 *
 * This is not a new feature — it is the landing page's discoverability
 * layer, sharpening its core function of being findable by Google.
 */

export function SEOContent() {
  return (
    <section
      aria-label="Learn more about referral economics"
      className="mt-16 space-y-12 border-t border-gray-800/60 pt-12"
      data-testid="seo-content"
    >
      {/* ────────── Section 1: K-Factor ────────── */}
      <article className="max-w-3xl">
        <h2 className="text-xl font-bold text-white tracking-tight">
          What Is Viral Coefficient (K-Factor)?
        </h2>

        <div className="mt-4 space-y-4 text-sm leading-relaxed text-gray-400">
          <p>
            The <strong className="text-gray-200">K-factor</strong> (also called
            the <strong className="text-gray-200">viral coefficient</strong>) is
            the single most important metric for understanding whether your
            referral program can grow on its own. A K-factor above 1 means every
            user brings in more than one new user — exponential organic growth.
            Below 1, your referral channel is slowly decaying and needs a higher
            reward or lower friction to sustain momentum.
          </p>

          <h3 className="text-base font-semibold text-gray-200 pt-2">
            The K-Factor Formula: K = i &times; c
          </h3>

          <p>
            The <strong className="text-gray-200">K-factor formula</strong> is
            straightforward:{' '}
            <code className="rounded bg-gray-800 px-1.5 py-0.5 text-brand-400 text-xs font-mono">
              K = i &times; c
            </code>
            , where <strong className="text-gray-200">i</strong> is the average
            number of invites each user sends
            and <strong className="text-gray-200">c</strong> is the conversion
            rate of those invites. If each user invites 4 friends (
            <strong className="text-gray-200">i = 4</strong>) and 25% of those
            friends sign up (
            <strong className="text-gray-200">c = 0.25</strong>), your K-factor
            is 4 &times; 0.25 = <strong className="text-gray-200">1.0</strong>.
            At K = 1.0, every user replaces themselves — you have steady-state
            viral growth. Push that conversion to 30% and K jumps to 1.2,
            meaning each user brings in 1.2 new users. That compounding effect
            is what separates referral programs that stall from those that scale.{' '}
            <a
              href="#calculator"
              className="text-brand-400 hover:text-brand-300 underline underline-offset-2 transition-colors"
            >
              Try the calculator above &rarr;
            </a>
          </p>
        </div>
      </article>

      {/* ────────── Section 2: Break Even ────────── */}
      <article className="max-w-3xl">
        <h2 className="text-xl font-bold text-white tracking-tight">
          When Does a Referral Program Break Even?
        </h2>

        <div className="mt-4 space-y-4 text-sm leading-relaxed text-gray-400">
          <p>
            Launching a referral program is an investment, and growth engineers
            need to know the payback period before shipping. The core question is
            simple: how does the{' '}
            <strong className="text-gray-200">referral program ROI</strong>{' '}
            compare to your baseline customer acquisition cost?
          </p>

          <h3 className="text-base font-semibold text-gray-200 pt-2">
            CAC vs LTV: The Referral Economics Framework
          </h3>

          <p>
            Start with three numbers. First, your current{' '}
            <strong className="text-gray-200">customer acquisition cost (CAC)</strong>{' '}
            from paid channels — say $120 per user. Second, the cost of your
            referral reward — maybe a $20 credit. Third, your invite-to-signup
            conversion rate. If 1 in 4 invites converts, each referring user who
            invites 5 friends generates 1.25 new signups at a cost of $20 each.
            That is a{' '}
            <strong className="text-gray-200">referral CAC of $20</strong>{' '}
            versus $120 paid — a 6x improvement. When your{' '}
            <strong className="text-gray-200">customer lifetime value (LTV)</strong>{' '}
            exceeds that $20 referral CAC, the channel is profitable from day one.
          </p>

          <p>
            Most SaaS companies see their referral channel reach{' '}
            <strong className="text-gray-200">referral program break even</strong>{' '}
            within 60-90 days of launch, assuming a K-factor above 0.7. Below
            0.5, the channel needs paid amplification (e.g., double-sided
            rewards) to sustain momentum. The key insight: referral programs
            compound. Month-over-month, a healthy K-factor makes every cohort
            cheaper to acquire than the last.{' '}
            <a
              href="#calculator"
              className="text-brand-400 hover:text-brand-300 underline underline-offset-2 transition-colors"
            >
              Try the calculator above &rarr;
            </a>
          </p>
        </div>
      </article>

      {/* ────────── Section 3: How to Calculate ROI ────────── */}
      <article className="max-w-3xl">
        <h2 className="text-xl font-bold text-white tracking-tight">
          How to Calculate Referral Program ROI
        </h2>

        <div className="mt-4 space-y-4 text-sm leading-relaxed text-gray-400">
          <p>
            A referral program's ROI depends on the interplay between invite
            volume, conversion rate, reward cost, and the lifetime value of
            referred users. Growth engineers at SaaS startups can model all of
            these variables in seconds using a{' '}
            <strong className="text-gray-200">viral coefficient calculator</strong>{' '}
            instead of building a spreadsheet from scratch.
          </p>

          <h3 className="text-base font-semibold text-gray-200 pt-2">
            Step-by-Step: Using This Calculator
          </h3>

          <p>
            First, estimate your average invites per user. If your product has a
            share button or referral link, check your analytics — most
            consumer-facing apps see 2-6 invites per active user. Enter that
            number as your <strong className="text-gray-200">invite count (i)</strong>.
            Next, estimate your conversion rate. Industry benchmarks for referral
            programs range from 15-35%, but your actual rate depends on incentive
            strength and friction in the signup flow. The calculator computes your
            K-factor instantly: if K is above 1, your program is self-sustaining.
          </p>

          <p>
            To translate that into ROI, compare your referral CAC (reward cost
            divided by signups per referrer) against your paid CAC. A referral
            program that costs $20 per acquisition against a paid CAC of $120
            delivers a 6x return on every dollar moved from paid to referral
            channels. Factor in that referred users typically have 16-25% higher
            retention than paid users, and the long-term{' '}
            <strong className="text-gray-200">referral program ROI</strong>{' '}
            becomes even more compelling.{' '}
            <a
              href="#calculator"
              className="text-brand-400 hover:text-brand-300 underline underline-offset-2 transition-colors"
            >
              Try the calculator above &rarr;
            </a>
          </p>
        </div>
      </article>
    </section>
  );
}
