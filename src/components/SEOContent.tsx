/**
 * SEOContent — Three structured content sections below the calculator.
 *
 * Purpose: Give search engines enough indexable text to rank this page
 * for queries like "viral coefficient calculator" and
 * "referral program break even". Each section targets a distinct
 * high-intent search cluster that growth engineers actually use.
 *
 * This is not a new feature — it is the landing page's discoverability
 * layer, which was missing (<50 words of indexable content before).
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
          What is K-Factor? How to Calculate Viral Coefficient
        </h2>

        <div className="mt-4 space-y-4 text-sm leading-relaxed text-gray-400">
          <p>
            The <strong className="text-gray-200">K-factor</strong> (also called
            the <strong className="text-gray-200">viral coefficient</strong>) is
            the single most important metric for understanding whether your
            referral program can grow on its own. The K-factor formula is
            straightforward:{' '}
            <code className="rounded bg-gray-800 px-1.5 py-0.5 text-brand-400 text-xs font-mono">
              K = i &times; c
            </code>
            , where{' '}
            <strong className="text-gray-200">i</strong> is the average number
            of invites each user sends and{' '}
            <strong className="text-gray-200">c</strong> is the conversion rate
            of those invites.
          </p>

          <p>
            Here&apos;s a worked example. If each user invites 4 friends (
            <strong className="text-gray-200">i = 4</strong>) and 25% of those
            friends sign up (
            <strong className="text-gray-200">c = 0.25</strong>), your K-factor
            is 4 &times; 0.25 = <strong className="text-gray-200">1.0</strong>.
            At K = 1.0, every user replaces themselves — you have steady-state
            viral growth. Push that conversion to 30% and K jumps to 1.2,
            meaning each user brings in 1.2 new users. That compounding effect
            is what separates referral programs that stall from those that
            scale. Use the{' '}
            <strong className="text-gray-200">viral coefficient calculator</strong>{' '}
            above to plug in your own numbers and see the result instantly.
          </p>

          <p>
            A K-factor above 1 means exponential organic growth. Below 1 means
            your referral channel is slowly decaying and needs a higher reward
            or lower friction. The{' '}
            <strong className="text-gray-200">K-factor formula</strong> is the
            starting point for every growth engineer evaluating a referral
            program&apos;s potential.{' '}
            <a
              href="#calculator"
              className="text-brand-400 hover:text-brand-300 underline underline-offset-2 transition-colors"
            >
              Try the calculator above &rarr;
            </a>
          </p>
        </div>
      </article>

      {/* ────────── Section 2: Referral ROI ────────── */}
      <article className="max-w-3xl">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Referral Program ROI: When Does It Pay Off?
        </h2>

        <div className="mt-4 space-y-4 text-sm leading-relaxed text-gray-400">
          <p>
            Launching a referral program is an investment, and growth engineers
            need to know the payback period before shipping. The core question
            is simple: how does the{' '}
            <strong className="text-gray-200">referral program ROI</strong>{' '}
            compare to your baseline customer acquisition cost (CAC)?
          </p>

          <p>
            Start with three numbers. First, your current CAC from paid
            channels — say $120 per user. Second, the cost of your referral
            reward — maybe a $20 credit. Third, your invite-to-signup
            conversion rate. If 1 in 4 invites converts, each referring user
            who invites 5 friends generates 1.25 new signups at a cost of $20
            each. That&apos;s a{' '}
            <strong className="text-gray-200">referral CAC of $20</strong>{' '}
            versus $120 paid — a 6x improvement. The{' '}
            <strong className="text-gray-200">referral program break even</strong>{' '}
            happens the moment your first cohort of referred users generates
            more revenue than the rewards you paid out.
          </p>

          <p>
            Most SaaS companies see their referral channel reach break-even
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

      {/* ────────── Section 3: Who Should Use This ────────── */}
      <article className="max-w-3xl">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Who Should Use This Calculator
        </h2>

        <div className="mt-4 space-y-4 text-sm leading-relaxed text-gray-400">
          <p>
            This{' '}
            <strong className="text-gray-200">viral coefficient calculator</strong>{' '}
            is built for{' '}
            <strong className="text-gray-200">growth engineers</strong> at{' '}
            SaaS startups who need to model referral economics before writing a
            line of code. If you&apos;re at a Series A or B company running
            experiments on acquisition channels, you already know that referral
            programs look simple in theory but are hard to get right in
            practice. This tool lets you skip the spreadsheet and iterate on
            invite counts, conversion rates, and reward structures in seconds.
          </p>

          <p>
            Product managers evaluating whether a{' '}
            <strong className="text-gray-200">referral program</strong>{' '}
            justifies engineering time will find the ROI section above
            particularly useful — it translates viral metrics into the language
            of CAC and payback periods that leadership cares about. Founders
            pre-launch can use it to sanity-check whether their product&apos;s
            invite mechanics can sustain organic growth before investing in
            infrastructure.
          </p>

          <p>
            Whether you&apos;re building a waitlist, a double-sided referral
            program, or tiered rewards for power users, the math is the same.
            Plug your assumptions into the{' '}
            <strong className="text-gray-200">referral program calculator</strong>{' '}
            above, see your K-factor, and decide if the numbers justify the
            build.{' '}
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
