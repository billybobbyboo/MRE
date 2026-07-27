import React, { useState, useMemo } from 'react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {
  LayoutGrid, TrendingUp, Building2, Network, DollarSign, Percent, Users, AlertTriangle,
  Target, Download, ArrowRight, ArrowUpRight, CheckCircle2, Sparkles, UserCog, Lightbulb,
  ShieldAlert, Info, ChevronRight, Home, Briefcase, Compass, Award, User, Mic,
} from 'lucide-react';

// ============================================================
// DATA — synthesised from the MRE Independent Strategic Review
// (Spired, June 2026)
// ============================================================

const trajectoryData = [
  { year: 'FY26', revenue: 16.3, ebitda: 2.3, margin: 14 },
  { year: 'FY27', revenue: 17.7, ebitda: 2.916, margin: 17 },
  { year: 'FY28', revenue: 20.3, ebitda: 4.006, margin: 20 },
];

const kpis = [
  {
    label: 'Total Revenue', icon: DollarSign, baseline: 16.3, target: 20.3, unit: 'M', prefix: '$',
    baselineLabel: 'FY26', targetLabel: 'FY28', growth: '+24.5%',
  },
  {
    label: 'EBITDA', icon: TrendingUp, baseline: 2.3, target: 4.01, unit: 'M', prefix: '$',
    baselineLabel: 'FY26', targetLabel: 'FY28', growth: '+74.3%',
  },
  {
    label: 'Net Profit Margin', icon: Percent, baseline: 14, target: 20, unit: '%', prefix: '',
    baselineLabel: 'FY26', targetLabel: 'FY28', growth: '+6.0pp',
  },
];

const pumStat = { current: 4000, fy27: 4120, fy28: 4510, benchmark: 662 };

const warningBadges = [
  {
    label: 'Wage-to-Revenue Ratio', value: '54%', compare: 'Benchmark 45-55%',
    detail: 'Sitting at the upper edge of benchmark - staff cost is the single largest drag on margin.',
    severity: 'amber',
  },
  {
    label: 'Marketing Spend', value: '0.4%', compare: 'Benchmark 2-4% of revenue',
    detail: 'A significant underspend - brand presence and lead generation have gone quiet.',
    severity: 'rose',
  },
  {
    label: 'PM Net Promoter Score', value: '35', compare: 'Target 50',
    detail: 'Service delivery is under capacity pressure, though the trend is improving.',
    severity: 'amber',
  },
];

const departments = {
  sales: {
    name: 'Sales', icon: Briefcase, margin: 19, benchmarkLow: 10, benchmarkHigh: 15,
    revenueShare: 36, benchmarkShare: 59, status: 'above',
    note: 'Running above benchmark - but the review flags this is partly inflated by how indirect overhead is allocated away from Sales.',
    stats: [
      { label: 'Commission Payout Ratio', value: '54%', compare: 'Benchmark 44-55%' },
      { label: 'Advertising Recoveries', value: '106%', compare: 'Benchmark 90-110%' },
    ],
  },
  pm: {
    name: 'Property Management', icon: Home, margin: 10, benchmarkLow: 20, benchmarkHigh: 25,
    revenueShare: 64, benchmarkShare: 32, status: 'below',
    note: 'Running well below benchmark - compressed by roughly 80% of indirect overhead being allocated here on a headcount basis.',
    stats: [
      { label: 'Properties Under Management', value: '~4,000', compare: 'Benchmark 662' },
      { label: 'Manager Productivity', value: '150+', compare: 'Benchmark 110' },
      { label: 'Income per Property', value: '$2,130', compare: 'Benchmark $1,500' },
    ],
  },
};

const overheadSplit = { pm: 80, sales: 20 };

const leadershipMoves = [
  {
    name: 'GM Transition', from: 'Jake Workman (General Manager)', to: 'Fractional CEO / Strategic Advisor',
    tier: 'Governance', icon: UserCog,
    remit: 'Leads the Strategic Renewal and chairs day-to-day delivery, reporting into a newly formed Advisory Board. De-couples the business from founder-dependent decision-making.',
  },
  {
    name: 'Matt Condon', from: 'Sales Performance', to: 'GM Sales & Marketing',
    tier: 'Star', icon: TrendingUp,
    remit: 'Scales sales capability and resourcing, drives GCI growth, rebuilds the CBD (EQ) economic business unit, and stands up the marketing engine. Commercial acumen being coached in alongside the role.',
  },
  {
    name: 'Steve Fitzsimon', from: 'Director, Business Growth', to: 'GM Portfolio Growth & Service Delivery',
    tier: 'High Performer', icon: Users,
    remit: 'Remit broadened to integrate BDM and Leasing - and potentially Property Management - under one reporting line, closing a long-standing service integration gap.',
  },
  {
    name: 'Jamie Ong', from: 'Director Property Services', to: 'Retained - reporting line under review',
    tier: 'Core Player', icon: Building2,
    remit: 'Deep technical PM expertise and key to finishing the Superportfolio and MRE Asia build-out. Leadership style is a named factor in PM disengagement - coaching and a revised reporting structure are being tested.',
  },
  {
    name: 'Nelson Rowe', from: 'Head of Service Excellence', to: 'Head of Innovation',
    tier: 'High Potential', icon: Lightbulb,
    remit: 'Decoupled from co-dependency with Jamie Ong. Owns the AI/agentic technology slate and operational-excellence/CX innovation pipeline directly with the CEO/Advisor.',
  },
];

const pillars = [
  {
    id: 'align', label: 'Alignment & Values', priority: 'Critical',
    objective: "Every team can explain MRE's strategy in their own words - and sees their role in it.",
    initiatives: [
      'Co-author and publish the renewal narrative with the team, not just announce it',
      'Translate purpose and refreshed values into observable, peer-recognised behaviours',
      'Use strategy as the filter for every resourcing decision - what starts, stops, continues',
      'Develop and publicly track universal KPIs tied to reward',
    ],
    measures: ['Renewal strategy, purpose & values co-authored, rolled out and embedded by Q2 FY27'],
  },
  {
    id: 'leadership', label: 'Leadership Cohesion', priority: 'Critical',
    objective: 'A cohesive, trusted "First Team" leads with one voice; roles and decision rights are unambiguous.',
    initiatives: [
      'De-couple founder dependency; formalise the Leadership Team mandate and decision rights',
      'Invest in team cohesion - right people, right roles, deeper working relationships',
      'Build a shared dashboard and balanced scorecard for group and individual accountability',
      'Put a retention and long-term incentive plan in place for key leadership talent',
    ],
    measures: ['No regrettable Leadership Team departures inside the renewal window', 'LTI / ownership model agreed by end of 2026'],
  },
  {
    id: 'culture', label: 'EVP & Culture', priority: 'Critical',
    objective: '"We look after our team because they look after our clients" - MRE becomes a trusted, coveted place to work.',
    initiatives: [
      "Reimagine the EVP with the team's own input on what's most valued",
      'Mandate fortnightly/monthly 1:1s across every people leader, tracked as a leadership KPI',
      'Reinstate visible recognition - quarterly awards, spot bonuses, team celebrations',
      'Build simple, visible career pathways within and across departments',
    ],
    measures: ['Engagement scores rise year-on-year', 'Regrettable attrition falls', '"Thrive-o-metre" pulse-check live'],
  },
  {
    id: 'ways', label: 'Ways of Working / Governance', priority: 'High',
    objective: 'Consistent operating cadence and accountability, with budgets, KPIs and rewards tied to outcomes.',
    initiatives: [
      'Reinstate budget-setting and 13-week rolling cashflow forecast discipline',
      'Stand up an Advisory Board to track strategy delivery and sale readiness',
      'Establish a weekly Leadership Team cadence with shared accountability measures',
      'Redesign seating and ways-of-working to fix cross-team isolation, especially in PM',
    ],
    measures: ['FY27 budget and cashflow forecast implemented and tracked', 'Advisory Board charter and agenda live for Q2 FY27'],
  },
  {
    id: 'growth', label: 'CVP & Growth', priority: 'High',
    objective: 'Service and sales results become proof points of MRE expertise, while the rent roll and sales engine scale profitably.',
    initiatives: [
      'Relaunch the MRE brand promise around best-in-class "moments that matter"',
      'Complete the Superportfolio rollout and re-invigorate the CBD / Chinese-speaking EQ EBU',
      'Scale the sales team and formalise reciprocal Sales-BDM referrals',
      'Rebuild the marketing engine - eDM, eGO/AI search readiness, cost-effective lead generation',
    ],
    measures: ['NPS 50+ in Property Management', '$8M Sales GCI run-rate', '380-400 net property gains p.a.', 'EBITDA to $3-4M by June 2028'],
  },
];

const founderPhases = [
  {
    phase: 'Today', label: 'Operational Founder', icon: User, tone: 'rose',
    detail: "Inconsistent day-to-day involvement - reactive decisions, overrides, low delegation. The review names this the single largest threat to value: 'founder dependency... paralysis cascades down.'",
  },
  {
    phase: 'Renewal Window (0-30mo)', label: 'Governance-Led Chair', icon: Compass, tone: 'amber',
    detail: "1 day/month on-site, per Antoinette's plan - workable only if paired with a defined Advisory Board cadence, decision-gate reviews and a named escalation path, not left as your only touchpoint.",
  },
  {
    phase: 'Post-Renewal', label: 'Strategic Advisor', icon: Award, tone: 'emerald',
    detail: 'Chair, Advisory Board / Innovation & NPD mentor / Lunch & Learn speaker / Founder podcast - the four roles the review itself proposes for you.',
  },
];

const founderMandate = [
  { icon: UserCog, title: 'Chair, Advisory Board', detail: 'Strategy delivery, business performance, risk management, decision gates, sale readiness.' },
  { icon: Lightbulb, title: 'Innovation & NPD Mentor', detail: 'Advisor for new product development and commercialisation opportunities, working with Nelson Rowe.' },
  { icon: Users, title: 'Lunch & Learn Speaker', detail: 'Visible, informal presence that rebuilds trust without reopening day-to-day override habits.' },
  { icon: Mic, title: 'Founder Podcast / Channel', detail: "A low-cost brand and culture asset the review specifically flags you're keen to start." },
];

const saleReadinessSteps = [
  { title: 'Be clear on the why', detail: 'Financial objective: liquidity at optimal valuation. Non-financial: succession optionality.' },
  { title: 'Get your house in order', detail: 'Optimise business performance, operations, commercials and financials.' },
  { title: 'Identify value enhancements', detail: 'Prioritise adjustments achievable within 12-18 months with fast payback.' },
  { title: 'Determine your target buyers', detail: 'Actively research and prepare structurally - 3rd-party sale vs. MBO.' },
  { title: 'Know your business worth', detail: 'Valuation methodology vs. buyer willingness to pay. What is the floor sale price?' },
  { title: 'Tell your authentic story', detail: "An educational narrative - brand story, what's been done, what MRE can do next." },
  { title: 'Negotiate the terms', detail: 'Pour effort into non-binding terms - bargaining power is highest right here.' },
];

// Simulator constants - derived transparently from the review's own stated assumptions
const FY27_EBITDA = 2916000;
const OFFICIAL_FY28_EBITDA = 4006000;
const EBITDA_PER_PUM = 1000;     // ($1,900 AAMI x 1.20 ancillary) x (1 - 6% direct - 50% salaries) \u2248 $1,003, rounded
const EBITDA_PER_AGENT = 94925;  // (($8.0M GCI target - $5.868M FY26 GCI) / 8 agents) x (1 - 55% commission) - ($200K fixed / 8)
const FIXED_REINVESTMENT = -50000; // FY28: Training/Consulting -$100K, EVP -$100K, Marketing (-$50K spend + $200K ROAS return) net +$150K

// ============================================================
// FORMAT HELPERS
// ============================================================
const fmtM = (n) => `$${n.toFixed(1)}M`;
const fmtDollar = (n) => `$${Math.round(n).toLocaleString('en-AU')}`;
const fmtCompact = (n) => {
  const sign = n < 0 ? '-' : '';
  const abs = Math.abs(n);
  if (abs >= 1000000) return `${sign}$${(abs / 1000000).toFixed(2)}M`;
  if (abs >= 1000) return `${sign}$${Math.round(abs / 1000)}K`;
  return `${sign}$${Math.round(abs)}`;
};

// ============================================================
// SMALL REUSABLE COMPONENTS
// ============================================================

const TrajectoryBar = ({ pct, colorClass = 'bg-white' }) => (
  <div className="h-1.5 w-full rounded-full bg-neutral-800">
    <div
      className={`h-1.5 rounded-full ${colorClass} transition-all duration-500`}
      style={{ width: `${Math.min(100, Math.max(4, pct))}%` }}
    />
  </div>
);

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-lg border border-neutral-700 bg-neutral-900/95 px-3 py-2 shadow-2xl backdrop-blur">
      <p className="mb-1 font-mono text-xs font-semibold text-neutral-300">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="font-mono text-xs text-neutral-400">
          <span style={{ color: p.color }}>{p.name}</span>: {p.dataKey === 'margin' ? `${p.value}%` : `$${p.value}M`}
        </p>
      ))}
    </div>
  );
};

const SectionHeader = ({ eyebrow, title, description }) => (
  <div className="mb-6">
    {eyebrow && <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-white/80">{eyebrow}</p>}
    <h2 className="text-xl font-semibold tracking-tight text-neutral-100 sm:text-2xl">{title}</h2>
    {description && <p className="mt-1.5 max-w-2xl text-sm text-neutral-400">{description}</p>}
  </div>
);

const KpiCard = ({ kpi }) => {
  const pct = ((kpi.baseline) / (kpi.target)) * 100;
  const Icon = kpi.icon;
  return (
    <div className="group rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 transition-colors hover:border-white/30">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-lg border border-neutral-800 bg-neutral-800/60 p-2">
          <Icon className="h-4 w-4 text-white" strokeWidth={2} />
        </span>
        <span className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 font-mono text-xs font-semibold text-white">
          <ArrowUpRight className="h-3 w-3" /> {kpi.growth}
        </span>
      </div>
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{kpi.label}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-mono text-2xl font-bold text-neutral-100 sm:text-3xl">
          {kpi.prefix}{kpi.target}{kpi.unit}
        </span>
        <span className="text-xs text-neutral-500">by {kpi.targetLabel}</span>
      </div>
      <div className="mt-4">
        <TrajectoryBar pct={pct} />
        <div className="mt-1.5 flex justify-between font-mono text-[11px] text-neutral-500">
          <span>{kpi.baselineLabel}: {kpi.prefix}{kpi.baseline}{kpi.unit}</span>
          <span>{kpi.targetLabel}: {kpi.prefix}{kpi.target}{kpi.unit}</span>
        </div>
      </div>
    </div>
  );
};

const WarningCard = ({ badge }) => {
  const tones = {
    amber: { border: 'border-neutral-500/25', bg: 'bg-neutral-500/10', text: 'text-neutral-400', badgeLabel: 'Operational Drag' },
    rose: { border: 'border-white/25', bg: 'bg-white/10', text: 'text-white', badgeLabel: 'Critical Drag' },
  };
  const t = tones[badge.severity];
  return (
    <div className={`rounded-xl border ${t.border} bg-neutral-900/60 p-5`}>
      <div className="mb-3 flex items-center justify-between">
        <span className={`inline-flex items-center gap-1.5 rounded-full ${t.bg} px-2.5 py-1 text-xs font-semibold ${t.text}`}>
          <AlertTriangle className="h-3.5 w-3.5" /> {t.badgeLabel}
        </span>
        <span className="font-mono text-xl font-bold text-neutral-100">{badge.value}</span>
      </div>
      <p className="text-sm font-medium text-neutral-200">{badge.label}</p>
      <p className="mt-0.5 font-mono text-xs text-neutral-500">{badge.compare}</p>
      <p className="mt-2.5 text-xs leading-relaxed text-neutral-400">{badge.detail}</p>
    </div>
  );
};

const TabButton = ({ tab, active, onClick }) => {
  const Icon = tab.icon;
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-1 py-3.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
        active ? 'border-white text-neutral-100' : 'border-transparent text-neutral-500 hover:text-neutral-300'
      }`}
    >
      <Icon className="h-4 w-4" />
      {tab.label}
    </button>
  );
};

// ============================================================
// TAB: EXECUTIVE SUMMARY
// ============================================================
const ExecutiveSummaryTab = () => (
  <div>
    <SectionHeader
      eyebrow="MREnew - Scenario C"
      title="FY26 Baseline vs. FY28 Target"
      description="Three years of the Strategic Renewal plan, headline by headline. Every figure below is sourced from the Spired Independent Strategic Review, June 2026."
    />
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((k) => <KpiCard key={k.label} kpi={k} />)}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="rounded-lg border border-neutral-800 bg-neutral-800/60 p-2">
            <Users className="h-4 w-4 text-white" strokeWidth={2} />
          </span>
        </div>
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Active Properties Under Mgmt.</p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-mono text-2xl font-bold text-neutral-100 sm:text-3xl">~{pumStat.current.toLocaleString()}</span>
        </div>
        <p className="mt-4 text-xs text-neutral-500">
          Industry benchmark: <span className="font-mono text-neutral-400">{pumStat.benchmark}</span>. MRE operates at roughly 6x typical agency scale.
        </p>
        <p className="mt-2 font-mono text-[11px] text-white/80">
          On track for ~{pumStat.fy28.toLocaleString()} by FY28 (+380 to 400 net per year)
        </p>
      </div>
    </div>

    <div className="mt-10">
      <SectionHeader eyebrow="Watchlist" title="Operational Drags on the Plan" description="The three cost and service metrics doing the most damage to margin and trust today." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {warningBadges.map((b) => <WarningCard key={b.label} badge={b} />)}
      </div>
    </div>

    <div className="mt-10 rounded-xl border border-neutral-800 bg-gradient-to-br from-neutral-900 to-neutral-900/40 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-white" />
          <div>
            <p className="font-medium text-neutral-200">Scenario C Optimise for Sale Optionality</p>
            <p className="mt-1 max-w-2xl text-sm text-neutral-400">
              24-36 month horizon. Improves short-term yield and builds long-term sale optionality, while creating a win-win ownership mindset for key people. Preferred over immediate liquidation (value left on table) or a 36-month+ turnaround (doesn't fit founder objectives).
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="rounded-full border border-neutral-600/50 bg-neutral-800/60 px-3 py-1 text-center text-[11px] font-semibold text-neutral-300">
            IN PROGRESS
          </span>
          <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-center text-xs font-semibold text-white">
            24-36 MONTH HORIZON
          </span>
        </div>
      </div>
    </div>
  </div>
);

// ============================================================
// TAB: FINANCIAL PERFORMANCE (incl. Simulator)
// ============================================================
const FinancialPerformanceTab = () => {
  const [pumGrowth, setPumGrowth] = useState(390);
  const [salesAgents, setSalesAgents] = useState(8);
  const [overheadSavings, setOverheadSavings] = useState(500000);

  const sim = useMemo(() => {
    const pumContribution = pumGrowth * EBITDA_PER_PUM;
    const salesContribution = salesAgents * EBITDA_PER_AGENT;
    const total = FY27_EBITDA + pumContribution + salesContribution + overheadSavings + FIXED_REINVESTMENT;
    const impliedMargin = (total / (trajectoryData[2].revenue * 1000000)) * 100;
    const deltaVsOfficial = total - OFFICIAL_FY28_EBITDA;
    return { pumContribution, salesContribution, total, impliedMargin, deltaVsOfficial };
  }, [pumGrowth, salesAgents, overheadSavings]);

  const drivers = [
    {
      label: 'Rent Roll & Sales Growth (net)', icon: TrendingUp, tone: 'emerald',
      fy27: 466000, fy28: 940000,
      detail: 'Net of delivery COGS - 120 net PUM adds in FY27 scaling to 380-400 in FY28, plus Sales GCI expanding toward an $8M run-rate.',
    },
    {
      label: 'Overhead Rationalisation', icon: Target, tone: 'amber',
      fy27: 300000, fy28: 200000,
      detail: '~$500K of net salary/on-cost savings across FY27/28, largely from correcting the headcount-based overhead allocation that over-burdens Property Management.',
    },
    {
      label: 'Reinvestment (Marketing, Training, EVP)', icon: Users, tone: 'rose',
      fy27: -150000, fy28: -50000,
      detail: 'Training & consulting and EVP investment, partly offset by marketing spend returning ~4x ROAS - the net drag shrinks in FY28 as spend tapers.',
    },
  ];

  return (
    <div>
      <SectionHeader
        eyebrow="Financial Trajectory"
        title="Revenue, EBITDA & Margin Expansion"
        description="FY26 actuals through the FY27/28 management plan, as set out in the review's EBITDA bridge."
      />

      <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 sm:p-6">
        <ResponsiveContainer width="100%" height={340}>
          <ComposedChart data={trajectoryData} margin={{ top: 10, right: 12, left: -8, bottom: 0 }}>
            <CartesianGrid stroke="#262626" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="year" stroke="#525252" tick={{ fill: '#a3a3a3', fontSize: 12 }} axisLine={{ stroke: '#525252' }} tickLine={false} />
            <YAxis yAxisId="left" stroke="#525252" tick={{ fill: '#a3a3a3', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}M`} />
            <YAxis yAxisId="right" orientation="right" stroke="#525252" tick={{ fill: '#a3a3a3', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 25]} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(148,163,184,0.06)' }} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#a3a3a3', paddingTop: 12 }} />
            <Bar yAxisId="left" dataKey="revenue" name="Revenue ($M)" fill="#525252" radius={[4, 4, 0, 0]} barSize={40} />
            <Bar yAxisId="left" dataKey="ebitda" name="EBITDA ($M)" fill="#ffffff" radius={[4, 4, 0, 0]} barSize={40} />
            <Line yAxisId="right" type="monotone" dataKey="margin" name="Net Margin (%)" stroke="#d4d4d4" strokeWidth={2.5} dot={{ r: 5, fill: '#d4d4d4', strokeWidth: 0 }} activeDot={{ r: 7 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-10">
        <SectionHeader eyebrow="Bridge" title="Profitability Drivers" description="What actually closes the gap from $2.3M to $4.0M EBITDA, by category." />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {drivers.map((d) => {
            const Icon = d.icon;
            const tones = {
              emerald: 'text-white bg-white/10 border-white/20',
              amber: 'text-white bg-white/10 border-white/20',
              rose: 'text-neutral-400 bg-neutral-500/10 border-neutral-500/20',
            };
            return (
              <div key={d.label} className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5">
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${tones[d.tone]}`}>
                  <Icon className="h-3.5 w-3.5" /> {d.fy27 + d.fy28 >= 0 ? 'Contributes' : 'Costs'}
                </span>
                <p className="mt-3 text-sm font-medium text-neutral-200">{d.label}</p>
                <div className="mt-3 flex items-center gap-4 font-mono text-sm">
                  <span className="text-neutral-400">FY27 <b className="text-neutral-200">{fmtCompact(d.fy27)}</b></span>
                  <ArrowRight className="h-3.5 w-3.5 text-neutral-600" />
                  <span className="text-neutral-400">FY28 <b className="text-neutral-200">{fmtCompact(d.fy28)}</b></span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-neutral-500">{d.detail}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-10 rounded-xl border border-white/20 bg-gradient-to-br from-neutral-900 to-neutral-900/40 p-6">
        <div className="mb-6 flex items-center gap-3">
          <span className="rounded-lg border border-white/25 bg-white/10 p-2">
            <Target className="h-4.5 w-4.5 text-white" />
          </span>
          <div>
            <p className="font-medium text-neutral-100">Strategy Simulator Path To FY28 EBITDA</p>
            <p className="text-xs text-neutral-500">Drag the levers to stress-test the plan's own assumptions, starting from the FY27 base of $2.92M.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="space-y-7 lg:col-span-3">
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <label className="text-sm font-medium text-neutral-300">Net Annual PUM Growth</label>
                <span className="font-mono text-lg font-semibold text-white">{pumGrowth}</span>
              </div>
              <input type="range" min={0} max={500} step={10} value={pumGrowth}
                onChange={(e) => setPumGrowth(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-neutral-800 accent-white" />
              <p className="text-xs text-neutral-500">Plan target: 380 to 400 net properties per year, at ~$1,900 AAMI plus 20% ancillary fees.</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <label className="text-sm font-medium text-neutral-300">Sales Agent Headcount Growth</label>
                <span className="font-mono text-lg font-semibold text-white">+{salesAgents}</span>
              </div>
              <input type="range" min={0} max={8} step={1} value={salesAgents}
                onChange={(e) => setSalesAgents(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-neutral-800 accent-white" />
              <p className="text-xs text-neutral-500">Plan target: up to 8 recruits, 2 to 3 of them CBD-based, driving GCI toward an $8M run-rate.</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <label className="text-sm font-medium text-neutral-300">Overhead Savings</label>
                <span className="font-mono text-lg font-semibold text-white">{fmtCompact(overheadSavings)}</span>
              </div>
              <input type="range" min={0} max={500000} step={25000} value={overheadSavings}
                onChange={(e) => setOverheadSavings(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-neutral-800 accent-white" />
              <p className="text-xs text-neutral-500">Plan target: ~$500K net salary/on-cost savings by June 2028.</p>
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-xl border border-neutral-800 bg-neutral-950/60 p-5 lg:col-span-2">
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Simulated FY28 EBITDA</p>
            <p className="mt-1 font-mono text-3xl font-bold text-neutral-100">{fmtCompact(sim.total)}</p>
            <p className="mt-1 font-mono text-xs text-neutral-500">Implied margin: {sim.impliedMargin.toFixed(1)}% (on $20.3M FY28 plan revenue)</p>
            <div className="my-4 h-px bg-neutral-800" />
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">vs. Official Plan Target</p>
            <p className={`mt-1 font-mono text-sm font-semibold ${sim.deltaVsOfficial >= 0 ? 'text-white' : 'text-neutral-400'}`}>
              {sim.deltaVsOfficial >= 0 ? '+' : ''}{fmtCompact(sim.deltaVsOfficial)} vs. $4.01M target
            </p>
            <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-neutral-600">
              <Info className="mt-0.5 h-3 w-3 shrink-0" />
              Simplified 3-lever model derived from the plan's own stated ratios. Expect variance from the full internal build.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// TAB: DEPARTMENT ANALYTICS
// ============================================================
const DeptCard = ({ dept }) => {
  const Icon = dept.icon;
  const inBand = dept.status === 'above';
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="rounded-lg border border-neutral-800 bg-neutral-800/60 p-2.5">
          <Icon className="h-5 w-5 text-white" />
        </span>
        <div>
          <p className="font-medium text-neutral-100">{dept.name}</p>
          <p className="font-mono text-xs text-neutral-500">{dept.revenueShare}% of revenue (benchmark {dept.benchmarkShare}%)</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">Net Profit Margin</span>
          <span className={`font-mono text-2xl font-bold ${inBand ? 'text-white' : 'text-neutral-400'}`}>{dept.margin}%</span>
        </div>
        <div className="mt-2 h-1.5 w-full rounded-full bg-neutral-800">
          <div className={`h-1.5 rounded-full ${inBand ? 'bg-white' : 'bg-neutral-400'}`} style={{ width: `${Math.min(100, (dept.margin / 30) * 100)}%` }} />
        </div>
      </div>

      <p className="mb-4 text-xs leading-relaxed text-neutral-400">{dept.note}</p>

      <div className="space-y-2 border-t border-neutral-800 pt-4">
        {dept.stats.map((s) => (
          <div key={s.label} className="flex items-center justify-between text-xs">
            <span className="text-neutral-500">{s.label}</span>
            <span className="font-mono font-medium text-neutral-300">{s.value} <span className="text-neutral-600">({s.compare})</span></span>
          </div>
        ))}
      </div>
    </div>
  );
};

const DepartmentAnalyticsTab = () => (
  <div>
    <SectionHeader
      eyebrow="Cost Structure"
      title="Sales vs. Property Management"
      description="Two very different economic engines, currently distorted by a single headcount-based overhead allocation."
    />
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <DeptCard dept={departments.sales} />
      <DeptCard dept={departments.pm} />
    </div>

    <div className="mt-10 rounded-xl border border-neutral-800 bg-neutral-900/60 p-6">
      <SectionHeader
        eyebrow="Root Cause"
        title="Indirect Overhead Allocation"
        description="Overhead is currently split by headcount, not by revenue or complexity. This structurally understates Sales margin and overstates PM's cost burden."
      />
      <div className="flex h-8 w-full overflow-hidden rounded-lg border border-neutral-800">
        <div className="flex items-center justify-center bg-neutral-500/70 text-xs font-semibold text-neutral-950" style={{ width: `${overheadSplit.pm}%` }}>
          Property Management {overheadSplit.pm}%+
        </div>
        <div className="flex items-center justify-center bg-white/70 text-xs font-semibold text-neutral-950" style={{ width: `${overheadSplit.sales}%` }}>
          Sales {overheadSplit.sales}%
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Today</p>
          <p className="mt-1 font-mono text-lg font-semibold text-neutral-400">10% PM margin</p>
        </div>
        <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Plan Target</p>
          <p className="mt-1 font-mono text-lg font-semibold text-white">12% PM margin</p>
          <p className="mt-1 text-xs text-neutral-500">via a reviewed overhead methodology, not just revenue growth</p>
        </div>
      </div>
    </div>
  </div>
);

// ============================================================
// TAB: LEADERSHIP & ROADMAP
// ============================================================
const LeadershipCard = ({ move }) => {
  const Icon = move.icon;
  const tierTones = {
    Star: 'text-white bg-white/10 border-white/20',
    'High Performer': 'text-neutral-300 bg-neutral-400/10 border-neutral-400/20',
    'High Potential': 'text-neutral-300 bg-neutral-400/10 border-neutral-400/20',
    'Core Player': 'text-neutral-400 bg-neutral-500/10 border-neutral-500/20',
    Governance: 'text-white bg-white/10 border-white/20',
  };
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 transition-colors hover:border-white/30">
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className="rounded-lg border border-neutral-800 bg-neutral-800/60 p-2">
          <Icon className="h-4 w-4 text-white" />
        </span>
        <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${tierTones[move.tier] || tierTones['Core Player']}`}>
          {move.tier}
        </span>
      </div>
      <p className="font-medium text-neutral-100">{move.name}</p>
      <div className="mt-2 flex items-start gap-2 text-xs">
        <span className="text-neutral-500">{move.from}</span>
      </div>
      <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-white">
        <ArrowRight className="h-3 w-3" />
        <span>{move.to}</span>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-neutral-500">{move.remit}</p>
    </div>
  );
};

const LeadershipRoadmapTab = () => {
  const [activePillar, setActivePillar] = useState(0);
  const pillar = pillars[activePillar];

  return (
    <div>
      <SectionHeader
        eyebrow="Right People, Right Roles"
        title="Leadership Restructure"
        description="Five moves de-coupling founder dependency and closing the leadership-cohesion gap identified across 25+ stakeholder interviews."
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {leadershipMoves.map((m) => <LeadershipCard key={m.name} move={m} />)}
      </div>

      <div className="mt-12">
        <SectionHeader eyebrow="MREnew Blueprint" title="The 5 Strategic Pillars" description="Scenario C, broken into what MRE is actually betting on to win." />

        <div className="flex flex-wrap gap-2 border-b border-neutral-800 pb-4">
          {pillars.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActivePillar(i)}
              className={`rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                activePillar === i
                  ? 'border-white/40 bg-white/10 text-white'
                  : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-900/60 p-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-neutral-100">{pillar.label}</h3>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              pillar.priority === 'Critical' ? 'bg-white/10 text-white' : 'bg-neutral-500/10 text-neutral-400'
            }`}>
              {pillar.priority === 'Critical' ? 'STRATEGIC PRIORITY' : 'HIGH PRIORITY'}
            </span>
          </div>
          <p className="mb-6 text-sm italic leading-relaxed text-neutral-300">&ldquo;{pillar.objective}&rdquo;</p>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">Key Initiatives</p>
              <ul className="space-y-2.5">
                {pillar.initiatives.map((init) => (
                  <li key={init} className="flex items-start gap-2 text-sm text-neutral-400">
                    <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/70" />
                    {init}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">Success Measures</p>
              <ul className="space-y-2.5">
                {pillar.measures.map((m) => (
                  <li key={m} className="flex items-start gap-2 text-sm text-neutral-400">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/70" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// TAB: FOUNDER TRANSITION
// ============================================================
const PhaseCard = ({ item }) => {
  const Icon = item.icon;
  const tones = {
    rose: { border: 'border-neutral-700/50', chip: 'bg-neutral-500/10 text-neutral-500', icon: 'text-neutral-500' },
    amber: { border: 'border-neutral-500/40', chip: 'bg-neutral-300/10 text-neutral-300', icon: 'text-neutral-300' },
    emerald: { border: 'border-white/30', chip: 'bg-white/10 text-white', icon: 'text-white' },
  };
  const t = tones[item.tone];
  return (
    <div className={`rounded-xl border ${t.border} bg-neutral-900/60 p-5`}>
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-lg border border-neutral-800 bg-neutral-800/60 p-2">
          <Icon className={`h-4 w-4 ${t.icon}`} />
        </span>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${t.chip}`}>{item.phase}</span>
      </div>
      <p className="font-medium text-neutral-100">{item.label}</p>
      <p className="mt-2 text-xs leading-relaxed text-neutral-500">{item.detail}</p>
    </div>
  );
};

const FounderTransitionTab = () => (
  <div>
    <SectionHeader
      eyebrow="Peter Hooymans"
      title="Founder Transition Plan"
      description="From operational founder to strategic chair. The role change the renewal depends on as much as any leadership hire."
    />

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {founderPhases.map((p) => <PhaseCard key={p.phase} item={p} />)}
    </div>

    <div className="mt-8 rounded-xl border border-white/25 bg-gradient-to-br from-neutral-900 to-neutral-900/40 p-6">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 rounded-lg border border-white/25 bg-white/10 p-2">
          <AlertTriangle className="h-4 w-4 text-white" />
        </span>
        <div>
          <p className="font-medium text-neutral-100">Flag: the governance gap</p>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-neutral-400">
            Stepping back operationally is the right call. It's literally what the review recommends. But there's a wide range
            between "overriding every decision" and "one day a month," and the plan still needs you as Chair for strategy delivery,
            risk management and decision gates. Confirm explicitly with Antoinette: is 1 day/month <em className="text-neutral-300 not-italic font-medium">in addition to</em> a
            scheduled Advisory Board cadence and a defined escalation path, or is it your only visibility into the business?
            Those are very different governance models wearing the same headline number.
          </p>
        </div>
      </div>
    </div>

    <div className="mt-10">
      <SectionHeader eyebrow="Ongoing Role" title="Your Mandate Post-Renewal" description="The four roles the review itself proposes, all visible, none operational." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {founderMandate.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.title} className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5">
              <span className="mb-3 inline-flex rounded-lg border border-neutral-800 bg-neutral-800/60 p-2">
                <Icon className="h-4 w-4 text-white" />
              </span>
              <p className="text-sm font-medium text-neutral-200">{m.title}</p>
              <p className="mt-2 text-xs leading-relaxed text-neutral-500">{m.detail}</p>
            </div>
          );
        })}
      </div>
    </div>

    <div className="mt-10">
      <SectionHeader eyebrow="24-30 Month Horizon" title="Sale-Readiness Roadmap" description="The review's own seven-step path to becoming sale-ready, in order." />
      <div className="space-y-3">
        {saleReadinessSteps.map((s, i) => (
          <div key={s.title} className="flex items-start gap-4 rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 font-mono text-xs font-semibold text-white">
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-medium text-neutral-200">{s.title}</p>
              <p className="mt-0.5 text-xs text-neutral-500">{s.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="mt-10 rounded-xl border border-neutral-800 bg-neutral-900/60 p-6">
      <SectionHeader eyebrow="What You're Transitioning Toward" title="Ownership & Exit Snapshot" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Ownership Today</p>
          <p className="mt-1 font-mono text-2xl font-bold text-neutral-100">100%</p>
          <p className="mt-1 text-xs text-neutral-500">Sole owner - no dilution yet.</p>
        </div>
        <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Retained Ownership</p>
          <p className="mt-1 font-mono text-2xl font-bold text-neutral-100">85-90%</p>
          <p className="mt-1 text-xs text-neutral-500">Scenario C, after phantom equity / MBO structuring.</p>
        </div>
      </div>
      <p className="mt-4 flex items-start gap-1.5 text-xs leading-relaxed text-neutral-500">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neutral-600" />
        The review recommends phantom equity / MBO optionality for Matt Condon and Steve Fitzsimon ahead of any sale.
        This reduces your net proceeds at exit even where it doesn't touch the cap table directly. See the Leadership tab
        for the roles this affects.
      </p>
    </div>
  </div>
);

// ============================================================
// MAIN COMPONENT
// ============================================================
const TABS = [
  { id: 'summary', label: 'Executive Summary', icon: LayoutGrid },
  { id: 'financial', label: 'Financial Performance', icon: TrendingUp },
  { id: 'department', label: 'Department Analytics', icon: Building2 },
  { id: 'leadership', label: 'Leadership & Roadmap', icon: Network },
  { id: 'founder', label: 'Founder Transition', icon: Compass },
];

export default function MREExecutiveDashboard() {
  const [activeTab, setActiveTab] = useState('summary');

  const handleExport = () => window.print();

  return (
    <div className="min-h-screen bg-neutral-950 font-sans text-neutral-300 print:bg-white">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/30 bg-white/10">
              <ShieldAlert className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight text-neutral-100">MRE <span className="font-normal text-neutral-500">/ Executive Portal</span></p>
              <p className="text-xs text-neutral-500">Strategic Renewal &middot; Scenario C &middot; Founder Review</p>
            </div>
          </div>
          <button
            onClick={handleExport}
            className="print:hidden flex items-center justify-center gap-2 rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm font-medium text-neutral-200 transition-colors hover:border-white/40 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <Download className="h-4 w-4" /> Export as PDF
          </button>
        </div>

        {/* Tab Nav */}
        <div className="print:hidden mb-8 flex gap-6 overflow-x-auto border-b border-neutral-800">
          {TABS.map((tab) => (
            <TabButton key={tab.id} tab={tab} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} />
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'summary' && <ExecutiveSummaryTab />}
        {activeTab === 'financial' && <FinancialPerformanceTab />}
        {activeTab === 'department' && <DepartmentAnalyticsTab />}
        {activeTab === 'leadership' && <LeadershipRoadmapTab />}
        {activeTab === 'founder' && <FounderTransitionTab />}

        {/* Footer */}
        <div className="mt-16 border-t border-neutral-800 pt-6">
          <p className="text-[11px] leading-relaxed text-neutral-600">
            Synthesised from the MRE Independent Strategic Review (Spired, June 2026). Figures are drawn directly from the
            report's benchmark table and EBITDA bridge except where marked as simulator estimates. Commercially sensitive
            &mdash; for founder use.
          </p>
        </div>
      </div>
    </div>
  );
}
