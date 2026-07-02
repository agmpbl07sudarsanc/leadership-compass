/* ════════════════════════════════════════════════════════════════
   The Leadership Compass — AI features layer
   Self-contained: injects its own UI. Pages only include this file.
   Features: smart search, article summarizer, text-to-speech,
   reading assistant chat, recommendations, social snippets.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Article index (used by search, recommendations, snippets) ── */
  // ROOT is '' on the home page, '../' inside pages/ and posts/.
  var ROOT = location.pathname.match(/\/(pages|posts)\//) ? '../' : '';

  var ARTICLES = [
    {
      url: 'posts/job-descriptions-are-lying.html',
      title: 'Job Descriptions Are Lying to Your Candidates',
      tag: 'Talent',
      excerpt: 'Your job post is the first promise you make to a future employee. Most companies break it in the first paragraph.',
      keywords: 'job descriptions postings requirements wish list candidates honesty realistic preview hiring recruiting employer brand self selection',
      quote: 'A job description should be a preview, not a pitch. Previews that lie produce refunds.',
      linkedin: 'Ten years experience in a five-year-old technology. "Fast-paced environment" meaning understaffed. A wish list no human matches.\nYour job post is the first promise you make to a future employee - and most companies break it in paragraph one.\nNew essay on The Leadership Compass.\n#Hiring #JobDescriptions #Recruiting'
    },
    {
      url: 'posts/interview-is-a-sample.html',
      title: 'The Interview Is a Sample, Not a Ceremony',
      tag: 'Talent',
      excerpt: 'Most interviews measure how good someone is at interviews. The job, unfortunately, is something else.',
      keywords: 'interviews structured behavioral work samples assessment hiring bias chemistry gut feel scorecards questions panels prediction',
      quote: 'Gut feel is pattern matching on the patterns you already prefer.',
      linkedin: 'Most interviews measure how good someone is at interviews.\nThe job, unfortunately, is something else.\nGut feel is pattern matching on the patterns you already prefer. What to do instead.\nNew essay on The Leadership Compass.\n#Interviewing #Hiring #Talent'
    },
    {
      url: 'posts/your-best-hire-already-works-for-you.html',
      title: 'Internal Mobility: Your Best Hire Already Works for You',
      tag: 'Talent',
      excerpt: 'Companies pay premiums for external mystery while proven internal candidates read the posting and conclude it is not really open.',
      keywords: 'internal mobility promotion hiring from within external hires premium career paths transfers postings hoarding succession development retention',
      quote: 'Every senior role filled externally tells your best people the way up is out.',
      linkedin: 'External hires: paid more, slower to ramp, more likely to fail - the research is consistent.\nYet most processes favor the stranger over the proven insider.\nEvery senior role filled externally tells your best people: the way up is out.\nNew essay on The Leadership Compass.\n#InternalMobility #Hiring #Talent'
    },
    {
      url: 'posts/references-reimagined.html',
      title: 'References, Reimagined: Questions That Actually Predict',
      tag: 'Talent',
      excerpt: 'Nobody gives a referee who will sink them. The information is not in whether the review is positive - it is in the texture.',
      keywords: 'reference checks calls questions backchannel hiring verification signal calibration weaknesses growth manager conversations',
      quote: 'References do not answer "is this person good?" They answer "what does it take to manage this person well?"',
      linkedin: 'The standard reference call: "Would you rehire them?" "Absolutely." Five pleasant minutes, zero information.\nAsked differently, references become the highest-signal hour in your hiring process.\nThe questions that work.\nNew essay on The Leadership Compass.\n#Hiring #ReferenceChecks #Talent'
    },
    {
      url: 'posts/the-counteroffer-trap.html',
      title: 'The Counteroffer Trap',
      tag: 'Talent',
      excerpt: 'A counteroffer pays resignation-day prices for loyalty you could have bought cheaper all year.',
      keywords: 'counteroffer resignation retention salary raise leaving notice negotiation flight risk compensation loyalty market adjustment',
      quote: 'The counteroffer answers the money. The resignation was rarely about the money.',
      linkedin: 'Star resigns. Panic. Counteroffer: 20% raise, promises, love-bombing.\nMost are gone within a year anyway - because the counteroffer answers the money, and the resignation was rarely about the money.\nNew essay on The Leadership Compass.\n#Retention #Counteroffers #Talent'
    },
    {
      url: 'posts/hiring-slow-isnt-a-virtue.html',
      title: 'Hiring Slow Isn\'t a Virtue: Speed With Discipline',
      tag: 'Talent',
      excerpt: 'Your six-week process is not more rigorous than a two-week one. It is the same three hours of evaluation, spread across more calendar.',
      keywords: 'hiring speed time to hire process velocity candidate experience scheduling debriefs offers ghosting pipeline drop off rigor',
      quote: 'Slowness is not diligence. Slowness is mostly queueing.',
      linkedin: '"Hire slow, fire fast" confused thoroughness with duration.\nYour six-week process is the same three hours of evaluation spread across more calendar - and the best candidates are gone by week three.\nNew essay on The Leadership Compass.\n#Hiring #Recruiting #TalentAcquisition'
    },
    {
      url: 'posts/potential-over-polish.html',
      title: 'Potential Over Polish: Spotting High-Ceiling Candidates',
      tag: 'Talent',
      excerpt: 'Polish tells you where someone has been. Potential tells you where they are going. Interviews systematically overprice the first.',
      keywords: 'potential high ceiling candidates polish privilege learning agility growth trajectory raw talent nontraditional backgrounds hiring signals coachability',
      quote: 'Hire for the slope, not the intercept.',
      linkedin: 'Polish is what privilege and practice look like in an interview.\nPotential is what compounds after you hire.\nHire for the slope, not the intercept - and learn to tell the two apart.\nNew essay on The Leadership Compass.\n#Hiring #Potential #Talent'
    },
    {
      url: 'posts/four-day-week-what-trials-show.html',
      title: 'The Four-Day Week: What the Trials Actually Show',
      tag: 'Future of Work',
      excerpt: 'The four-day week works - in the organizations that did the redesign work the headline skips.',
      keywords: 'four day week 4 day compressed hours productivity pilots trials wellbeing meetings redesign output focus work time reduction',
      quote: 'The four-day week is not a schedule change. It is a forced audit of where the fifth day was actually going.',
      linkedin: 'The four-day week trials keep "succeeding" - but read past the headline.\nThe orgs that thrived did brutal redesign work first: meetings cut, processes streamlined, focus protected.\nThe schedule change was the reward, not the intervention.\nNew essay on The Leadership Compass.\n#FourDayWeek #FutureOfWork #Productivity'
    },
    {
      url: 'posts/hybrid-is-hard-mode.html',
      title: 'Hybrid Is Hard Mode: Why Half-Remote Beats You Up',
      tag: 'Future of Work',
      excerpt: 'Hybrid is not the easy middle. It is both operating systems running at once, with all the conflicts that implies.',
      keywords: 'hybrid work remote office anchor days proximity bias meetings mixed rooms coordination flexibility policy design distributed',
      quote: 'Hybrid done by default combines the constraints of the office with the distances of remote - and the benefits of neither.',
      linkedin: 'Fully remote has playbooks. Fully in-office has tradition.\nHybrid - the compromise everyone chose - is secretly the hardest of the three to run well.\nDone by default, it combines the constraints of the office with the distances of remote.\nNew essay on The Leadership Compass.\n#HybridWork #FutureOfWork #RemoteWork'
    },
    {
      url: 'posts/skills-have-half-lives.html',
      title: 'Skills Have Half-Lives Now: Learning as Infrastructure',
      tag: 'Future of Work',
      excerpt: 'When skills decay faster than careers, the learning system is the career system.',
      keywords: 'reskilling upskilling learning development skill decay half-life continuous learning lms training budget growth time to learn',
      quote: 'Organizations say people are their greatest asset, then treat the maintenance of that asset as a discretionary line item.',
      linkedin: 'Technical skills now decay in a few years. Careers last forty.\nThat math makes learning infrastructure, not a perk - yet most orgs treat it as a discretionary budget line and a compliance LMS.\nWhat learning-as-plumbing actually looks like.\nNew essay on The Leadership Compass.\n#Learning #Reskilling #FutureOfWork'
    },
    {
      url: 'posts/the-gig-inside.html',
      title: 'The Gig Inside: Internal Talent Marketplaces',
      tag: 'Future of Work',
      excerpt: 'Your organization is full of people who would love different work and managers who cannot see them. The marketplace is the introduction.',
      keywords: 'internal talent marketplace gigs projects mobility skills matching hoarding managers capacity development side projects staffing',
      quote: 'Talent hoarding is rational for every individual manager and ruinous for the organization that allows it.',
      linkedin: 'Your org is full of people who want different work and managers who cannot see them.\nInternal talent marketplaces promise the introduction - but the tech is the easy part.\nTalent hoarding is rational for every manager and ruinous for the org that allows it.\nNew essay on The Leadership Compass.\n#TalentMarketplace #InternalMobility #FutureOfWork'
    },
    {
      url: 'posts/automation-anxiety.html',
      title: 'Automation Anxiety: Leading People Who Fear the Roadmap',
      tag: 'Future of Work',
      excerpt: 'People can handle hard futures. What they cannot handle is suspecting their leaders know the future and are not saying.',
      keywords: 'automation ai anxiety job security change communication redeployment reskilling honesty roadmap fear transformation trust',
      quote: 'Uncertainty plus silence equals the worst story people can imagine - told by them, about you.',
      linkedin: 'Your roadmap says "efficiency." Your people hear "replacement."\nUncertainty plus silence equals the worst story people can imagine - told by them, about you.\nHow to lead automation honestly.\nNew essay on The Leadership Compass.\n#Automation #AI #ChangeLeadership'
    },
    {
      url: 'posts/office-is-a-tool.html',
      title: 'The Office Is a Tool, Not a Default',
      tag: 'Future of Work',
      excerpt: 'Treat the office as a tool with specific jobs and it earns its keep. Treat it as a default and it becomes expensive theater.',
      keywords: 'office space real estate rto return to office collaboration design presence proxy work purpose anchor days facilities',
      quote: 'If the office cannot answer "what is this for?", attendance mandates are just rent justification.',
      linkedin: 'The question was never office vs remote.\nIt is: what is an office FOR, now that presence is no longer the proxy for work?\nIf the office cannot answer that, attendance mandates are just rent justification.\nNew essay on The Leadership Compass.\n#Office #RTO #FutureOfWork'
    },
    {
      url: 'posts/always-on-boundaries.html',
      title: 'Boundaries in an Always-On Workplace',
      tag: 'Future of Work',
      excerpt: 'Availability creep is not a personal discipline problem. It is a system design problem wearing one.',
      keywords: 'boundaries always on availability right to disconnect burnout notifications after hours email norms recovery urgency leadership modeling',
      quote: 'Whatever leaders do after 7pm becomes policy, no matter what the policy says.',
      linkedin: 'The tech that freed work from the office also freed it from the evening, the weekend, the holiday.\nAvailability creep is not a personal discipline problem. It is a system design problem wearing one.\nAnd whatever leaders do after 7pm becomes policy.\nNew essay on The Leadership Compass.\n#Boundaries #Burnout #FutureOfWork'
    },
    {
      url: 'posts/recognition-is-a-system.html',
      title: 'Recognition Is a System, Not a Mood',
      tag: 'Culture',
      excerpt: 'Left to chance, recognition flows to the loud, the visible, and the recent - and your quiet contributors learn their lesson.',
      keywords: 'recognition appreciation rewards visibility quiet contributors specific praise rituals peer recognition motivation retention morale',
      quote: 'What gets recognized gets repeated. What goes unseen goes elsewhere.',
      linkedin: 'Left to mood and memory, recognition flows to the loud, the visible, and the recent.\n\nYour quiet contributors learn the lesson - and take it to their next employer.\n\nWhat gets recognized gets repeated. What goes unseen goes elsewhere.\n\nNew essay on The Leadership Compass.\n\n#Recognition #Culture #Retention'
    },
    {
      url: 'posts/remote-culture-isnt-built-on-zoom-happy-hours.html',
      title: 'Remote Culture Isn\'t Built on Zoom Happy Hours',
      tag: 'Culture',
      excerpt: 'Remote culture is not the absence of an office. It is the presence of deliberate systems where hallways used to be.',
      keywords: 'remote work distributed teams async documentation virtual culture connection belonging zoom meetings written communication rituals',
      quote: 'In an office, culture happens to you. Remote, culture only happens on purpose.',
      linkedin: 'Another Zoom happy hour will not fix your remote culture.\n\nIn an office, culture happens to you. Remote, culture only happens on purpose.\n\nWhere it actually lives: documentation, decision visibility, async respect.\n\nNew essay on The Leadership Compass.\n\n#RemoteWork #Culture #DistributedTeams'
    },
    {
      url: 'posts/the-silence-audit.html',
      title: 'The Silence Audit: Hearing What Your Culture Won\'t Say',
      tag: 'Culture',
      excerpt: 'The most important information in your organization is whatever people have collectively decided not to say.',
      keywords: 'silence speaking up psychological safety taboo topics bad news whistleblowing candor surveys skip levels organizational listening',
      quote: 'Silence is not the absence of information. It is information with the volume turned down by fear.',
      linkedin: 'Every organization has topics that conversations bend around - visible in the glance exchanged, the swift subject change.\n\nSilence is not absence of information. It is information with the volume turned down by fear.\n\nHow to run a silence audit.\n\nNew essay on The Leadership Compass.\n\n#Culture #PsychologicalSafety #Leadership'
    },
    {
      url: 'posts/conflict-is-a-feature.html',
      title: 'Conflict Is a Feature: Building Teams That Argue Well',
      tag: 'Culture',
      excerpt: 'A team with no visible conflict has not transcended disagreement. It has just moved it somewhere you cannot moderate it.',
      keywords: 'conflict disagreement debate task conflict relationship conflict decision making devil advocate norms productive argument teams trust',
      quote: 'The goal is not less conflict. It is cheaper conflict - early, open, and about the work.',
      linkedin: 'A team with no visible conflict has not transcended disagreement.\n\nIt has moved it somewhere you cannot moderate it.\n\nThe goal is not less conflict - it is cheaper conflict: early, open, about the work.\n\nNew essay on The Leadership Compass.\n\n#Teams #Conflict #Culture'
    },
    {
      url: 'posts/rituals-beat-values.html',
      title: 'Rituals Beat Values: Small Repeated Acts That Define Teams',
      tag: 'Culture',
      excerpt: 'Nobody remembers your values slide. Everybody remembers what your team does every single Friday.',
      keywords: 'rituals habits team practices demo day retro gratitude celebrations cadence repetition norms traditions culture building',
      quote: 'Culture is not what you believe. It is what you repeat.',
      linkedin: 'Nobody remembers your values slide.\n\nEverybody remembers what your team does every single Friday.\n\nCulture is not what you believe. It is what you repeat.\n\nNew essay on The Leadership Compass.\n\n#Culture #Teams #Rituals'
    },
    {
      url: 'posts/when-culture-eats-your-best-intentions.html',
      title: 'When Culture Eats Your Best Intentions: Change That Sticks',
      tag: 'Culture',
      excerpt: 'Culture change fails when it asks people to behave against the systems that still reward the old behavior.',
      keywords: 'culture change transformation initiatives incentives systems behavior change pilots middle managers reinforcement sustainability',
      quote: 'A culture initiative that leaves incentives untouched is a request. The incentives are the instruction.',
      linkedin: 'The workshop was inspiring. The values were relaunched. A year later, nothing moved.\n\nCulture change fails when it asks people to behave against systems that still reward the old behavior.\n\nWhat the survivors do differently.\n\nNew essay on The Leadership Compass.\n\n#CultureChange #Transformation #Leadership'
    },
    {
      url: 'posts/trust-is-built-in-drops.html',
      title: 'Trust Is Built in Drops and Lost in Buckets',
      tag: 'Culture',
      excerpt: 'Every team runs on a trust balance nobody can see but everybody can feel.',
      keywords: 'trust credibility reliability promises consistency betrayal repair vulnerability speed of trust transparency relationships teams',
      quote: 'Trust is built in drops and lost in buckets - and most leaders only check the level after the spill.',
      linkedin: 'Every team runs on a trust balance nobody can see but everybody can feel.\n\nBuilt in drops - kept promises, credit given, truth told early.\nLost in buckets - one broken commitment, one thrown report, one spun message.\n\nNew essay on The Leadership Compass.\n\n#Trust #Leadership #Culture'
    },
    {
      url: 'posts/people-analytics-without-creepiness.html',
      title: 'People Analytics Without the Creepiness',
      tag: 'HR Strategy',
      excerpt: 'The test for any people metric: would you be comfortable explaining to employees exactly how it is used?',
      keywords: 'people analytics hr data surveillance privacy metrics dashboards trust ethics monitoring productivity tracking transparency aggregation',
      quote: 'Data employees do not trust becomes data employees learn to game.',
      linkedin: 'The line between people analytics and surveillance is thinner than your dashboard admits.\n\nThe test for any metric: would you be comfortable explaining to employees exactly how it is used?\n\nNew essay on The Leadership Compass.\n\n#PeopleAnalytics #HR #Ethics'
    },
    {
      url: 'posts/skills-based-organization-promise-vs-plumbing.html',
      title: 'The Skills-Based Organization: Promise vs. Plumbing',
      tag: 'HR Strategy',
      excerpt: 'Skills-based hiring fails not at the philosophy but at the plumbing - taxonomy, verification, and trust.',
      keywords: 'skills-based hiring skills taxonomy degrees pedigree credentials verification assessment internal mobility job architecture competencies',
      quote: 'Removing the degree requirement is a press release. Building a skills system is a multi-year renovation.',
      linkedin: '"We are now a skills-based organization!"\n\nTranslation, usually: we removed degree requirements from job posts.\n\nThe philosophy is right. The plumbing - taxonomy, verification, manager trust - is where it actually lives or dies.\n\nNew essay on The Leadership Compass.\n\n#SkillsBased #Hiring #HR'
    },
    {
      url: 'posts/compensation-transparency-is-coming.html',
      title: 'Compensation Transparency Is Coming. Get Ahead of It.',
      tag: 'HR Strategy',
      excerpt: 'Transparency does not create pay problems. It reveals the ones you have been compounding quietly.',
      keywords: 'pay transparency compensation salary bands ranges equity audit legislation posting pay gaps fairness rewards philosophy',
      quote: 'If publishing your pay ranges would cause a riot, the problem is not the publishing.',
      linkedin: 'Pay secrecy is already dead - between legislation and Glassdoor, it just has not been buried.\n\nIf publishing your ranges would cause a riot, the problem is not the publishing.\n\nHow to get ahead of it.\n\nNew essay on The Leadership Compass.\n\n#PayTransparency #Compensation #HR'
    },
    {
      url: 'posts/workforce-planning-unpredictable-age.html',
      title: 'Workforce Planning in an Age You Can\'t Predict',
      tag: 'HR Strategy',
      excerpt: 'Stop trying to predict the workforce you will need. Build one that can become what you need.',
      keywords: 'workforce planning headcount forecasting scenarios flexibility contingent talent pools skills adjacency buffers agility strategic',
      quote: 'The plan is not the asset. The ability to re-plan quickly is.',
      linkedin: 'Your five-year headcount plan is fiction. It was probably fiction in year one.\n\nThe replacement is not better forecasting - it is a workforce built to bend.\n\nNew essay on The Leadership Compass.\n\n#WorkforcePlanning #HR #Strategy'
    },
    {
      url: 'posts/hrbp-from-complaint-desk-to-strategy-table.html',
      title: 'HR Business Partners: From Complaint Desk to Strategy Table',
      tag: 'HR Strategy',
      excerpt: 'The seat at the table is not granted with the title. It is earned one business problem at a time.',
      keywords: 'hr business partner hrbp strategic partner escalations operating model centers of excellence business acumen workforce insight credibility',
      quote: 'If you only bring people problems to the business, you will only be invited to people-problem meetings.',
      linkedin: 'The HRBP role was designed to be strategic.\n\nMost days it is consumed by escalations, admin, and being the complaint desk.\n\nWhat it actually takes to claim the seat at the table.\n\nNew essay on The Leadership Compass.\n\n#HRBP #HR #StrategicHR'
    },
    {
      url: 'posts/onboarding-window-90-days.html',
      title: 'The Onboarding Window: 90 Days That Decide Three Years',
      tag: 'HR Strategy',
      excerpt: 'By day 90, most new hires have privately decided how long they are staying. Onboarding is when you influence the verdict.',
      keywords: 'onboarding new hire ramp retention first week buddy manager early experience preboarding connection productivity time to value',
      quote: 'Nobody quits over a missing laptop. They quit over what the missing laptop told them.',
      linkedin: 'By day 90, most new hires have privately decided how long they will stay.\n\nNobody quits over a missing laptop. They quit over what the missing laptop told them.\n\nOnboarding is a retention system disguised as paperwork week.\n\nNew essay on The Leadership Compass.\n\n#Onboarding #Retention #HR'
    },
    {
      url: 'posts/policies-are-not-culture.html',
      title: 'Policies Are Not Culture: When to Write Rules and When Not To',
      tag: 'HR Strategy',
      excerpt: 'A policy written for the worst 2% is experienced by the other 98% as a verdict on them.',
      keywords: 'policies rules handbook trust judgment compliance bureaucracy guidelines principles autonomy exceptions employee relations',
      quote: 'You cannot write enough rules to replace judgment. You can write enough to discourage it.',
      linkedin: 'Every policy is a monument to a moment someone was not trusted.\n\nA rule written for the worst 2% is experienced by the other 98% as a verdict on them.\n\nWhen rules protect people - and when they just outsource judgment.\n\nNew essay on The Leadership Compass.\n\n#HR #Culture #Policy'
    },
    {
      url: 'posts/first-90-days-listen-first.html',
      title: 'The First 90 Days: Listen Before You Touch Anything',
      tag: 'Leadership',
      excerpt: 'The pressure to make an early mark ruins more leadership transitions than incompetence ever has.',
      keywords: 'new leader transition first 90 days onboarding listening tour early wins quick wins diagnosis trust credibility new role manager',
      quote: 'The fastest way to lose a new team is to fix things that were not broken in ways you did not understand.',
      linkedin: 'New in a leadership role? The pressure to "make your mark" fast ruins more transitions than incompetence ever has.\n\nThe leaders who last spend their first quarter learning the system before changing it.\n\nNew essay on The Leadership Compass.\n\n#Leadership #NewManager #First90Days'
    },
    {
      url: 'posts/delegation-is-not-dumping.html',
      title: 'Delegation Is Not Dumping',
      tag: 'Leadership',
      excerpt: 'Most "delegation problems" are actually trust problems wearing a time-management costume.',
      keywords: 'delegation empowerment micromanagement authority outcomes ownership trust workload accountability development managers letting go',
      quote: 'If they must do it exactly as you would, you have not delegated. You have hired your own hands.',
      linkedin: 'There are two ways to delegate badly:\n\n1. Dumping - task without context or authority\n2. Puppeteering - the task plus 40 check-ins\n\nReal delegation hands over the OUTCOME. Here is what that takes.\n\nNew essay on The Leadership Compass.\n\n#Leadership #Delegation #Management'
    },
    {
      url: 'posts/courage-to-be-disliked.html',
      title: 'The Courage to Be Disliked: Decisions That Cost Popularity',
      tag: 'Leadership',
      excerpt: 'The need to be liked is the most expensive trait a leader can have - and the most disguised.',
      keywords: 'tough decisions unpopular leadership courage likeability conflict avoidance hard calls fairness respect trust difficult conversations',
      quote: 'Avoiding a hard decision is also a decision. It just transfers the cost to people with less power to absorb it.',
      linkedin: 'Every consequential decision creates losers.\n\nLeaders who need to be liked end up making the one choice that pleases nobody: avoidance.\n\nOn the difference between being liked and being trusted.\n\nNew essay on The Leadership Compass.\n\n#Leadership #DecisionMaking #Courage'
    },
    {
      url: 'posts/feedback-is-a-gift-nobody-wraps-well.html',
      title: 'Feedback Is a Gift Nobody Wraps Well',
      tag: 'Leadership',
      excerpt: 'Most feedback fails before it is spoken - because it was designed to protect the giver, not help the receiver.',
      keywords: 'feedback difficult conversations sbi radical candor criticism praise specific observation behavior growth coaching managers delivery',
      quote: 'Feedback designed to be comfortable to give is rarely useful to receive.',
      linkedin: 'We have sandwiched, softened, and acronym-ed feedback into uselessness.\n\n"Great job overall, just a few small things..." helps nobody.\n\nWhat works: specific observation, clean delivery, genuine curiosity.\n\nNew essay on The Leadership Compass.\n\n#Feedback #Leadership #Management'
    },
    {
      url: 'posts/leading-through-uncertainty.html',
      title: 'Leading Through Uncertainty Without Faking Certainty',
      tag: 'Leadership',
      excerpt: 'False certainty buys a calm week and costs a year of credibility.',
      keywords: 'uncertainty ambiguity change crisis communication transparency decisiveness confidence honesty volatility scenarios leadership trust',
      quote: 'Confidence is not knowing the outcome. It is knowing you can handle the range of outcomes.',
      linkedin: 'Your team does not need you to know the future.\n\nThey need you to be honest about the fog AND decisive inside it - at the same time.\n\nFalse certainty buys a calm week and costs a year of credibility.\n\nNew essay on The Leadership Compass.\n\n#Leadership #Uncertainty #Change'
    },
    {
      url: 'posts/the-succession-question.html',
      title: 'The Succession Question Every Leader Avoids',
      tag: 'Leadership',
      excerpt: 'Being irreplaceable is not job security. It is a ceiling you built yourself.',
      keywords: 'succession planning bench strength bus factor development pipeline readiness deputies knowledge transfer promotion talent review continuity',
      quote: 'If your team cannot run without you, you have not built a team. You have built a dependency.',
      linkedin: 'A question most leaders dodge:\n\nIf you disappeared for 90 days, what would break?\n\nIf the honest answer is "a lot" - that is not job security. That is a ceiling you built yourself.\n\nNew essay on The Leadership Compass.\n\n#Succession #Leadership #TalentDevelopment'
    },
    {
      url: 'posts/energy-not-time.html',
      title: 'Energy, Not Time, Is Your Scarcest Resource',
      tag: 'Leadership',
      excerpt: 'You can recover lost time tomorrow. Decisions made while depleted are permanent.',
      keywords: 'energy management burnout recovery focus deep work depletion decision fatigue rest sleep renewal performance sustainable pace leadership',
      quote: 'A leader running on empty does not just perform worse. They decide worse - and decisions are the job.',
      linkedin: 'Time management is the wrong obsession.\n\nTwo hours of focused energy outproduce eight hours of depletion - and decisions made while drained are permanent.\n\nManage the battery, not just the clock.\n\nNew essay on The Leadership Compass.\n\n#Leadership #EnergyManagement #Burnout'
    },
    {
      url: 'posts/your-calendar-is-your-strategy.html',
      title: 'Your Calendar Is Your Real Strategy',
      tag: 'Leadership',
      excerpt: 'Strategy decks describe intentions. Calendars describe reality. How to audit the only strategy your organization actually has.',
      keywords: 'calendar time allocation priorities strategy execution one-on-ones meetings ceremony audit attention leadership week planning',
      quote: 'Strategy is not what you announce. Strategy is what you fund with attention.',
      linkedin: "Your strategy deck says innovation.\n\nYour calendar says operational reviews.\n\nThe calendar wins - it always does. Time is the only budget that never lies.\n\nNew essay on The Leadership Compass.\n\n#Leadership #Strategy #TimeManagement"
    },
    {
      url: 'posts/exit-interviews-are-too-late.html',
      title: 'Exit Interviews Are Too Late. Try Stay Interviews.',
      tag: 'HR Strategy',
      excerpt: 'By the time someone is honest in an exit interview, the insight costs you a rehire. Five questions that collect the same intelligence while you can still act.',
      keywords: 'stay interviews exit interviews retention attrition turnover questions managers follow-up engagement flight risk talent keep people leaving',
      quote: 'Exit data tells you why you lost someone. Stay data tells you who you\'re about to lose.',
      linkedin: "The exit interview: we wait until someone has nothing to lose, THEN ask what we could've done better.\n\nFinally honest. Completely useless.\n\nThe 5-question stay interview gets the same intelligence while you can still act on it.\n\nNew essay on The Leadership Compass.\n\n#Retention #HR #TalentManagement"
    },
    {
      url: 'posts/your-meetings-are-your-culture.html',
      title: 'Your Meetings Are Your Culture',
      tag: 'Culture',
      excerpt: 'Forget the values poster. The way your meetings run is the most accurate description of your culture that exists - and the highest-leverage place to change it.',
      keywords: 'meetings culture psychological safety speaking order decisions agenda shadow meeting norms values behavior rooms facilitation',
      quote: 'You don\'t have a meeting problem. You have a culture that is accurately expressing itself in meetings.',
      linkedin: "An anthropologist studying your culture wouldn't read the values page.\n\nThey'd sit in your meetings for a week.\n\nWho talks. What's safe to say. What happens after. It's all there.\n\nNew essay on The Leadership Compass.\n\n#Culture #Meetings #Leadership"
    },
    {
      url: 'posts/five-generations-one-workplace.html',
      title: 'Five Generations, One Workplace',
      tag: 'Future of Work',
      excerpt: 'The widest age range any workforce has ever contained - and most of what we believe about generational differences is wrong. What actually differs matters more.',
      keywords: 'generations gen z millennials boomers age diversity life stage career lattice knowledge transfer retirement communication norms workforce demographics',
      quote: 'Generational labels are horoscopes for HR - specific enough to feel insightful, vague enough to apply to everyone.',
      linkedin: "Five generations now share the workforce. A first in history.\n\nAnd the research is clear: within-generation differences DWARF between-generation ones.\n\nWhat actually differs - life stage, career horizon, knowledge transfer - matters far more.\n\nNew essay on The Leadership Compass.\n\n#FutureOfWork #Workforce #HR"
    },
    {
      url: 'posts/your-best-people-leave-quietly.html',
      title: 'Your Best People Leave Quietly. Your Worst Stay Loudly.',
      tag: 'Talent',
      excerpt: 'Top performers rarely complain on the way out - they just leave. Why retention systems miss the people who matter most, and the quiet signals to watch.',
      keywords: 'retention attrition top performers high performers quiet quitting resignation signals flight risk counteroffers complainers discretionary effort talent',
      quote: 'High performers don\'t escalate. They conclude.',
      linkedin: "The people who complain the most almost never leave.\n\nThe people who leave almost never complained.\n\nYour best engineer resigns on a quiet Tuesday - and everyone's shocked. They shouldn't be.\n\nNew essay on The Leadership Compass.\n\n#Retention #Talent #Leadership"
    },
    {
      url: 'posts/strong-legs-or-easier-road.html',
      title: 'Strong Legs or an Easier Road: What HR Should Really Build',
      tag: 'Leadership',
      excerpt: 'Most of modern HR is road-smoothing. The organizations that endure are building stronger travelers instead.',
      keywords: 'resilience capacity development stretch assignments productive struggle friction snowplow growth recovery hard decisions capability building strength hr identity',
      quote: 'Easier roads erode. Stronger legs travel anywhere.',
      linkedin: "Don't ask for an easier road. Ask for stronger legs.\n\nMost of modern HR is road-smoothing: removing friction, softening feedback, clearing obstacles.\n\nBut you cannot smooth a road that hasn't been built yet - and the next decade of work is mostly unbuilt road.\n\nNew essay on The Leadership Compass.\n\n#HR #Leadership #Resilience"
    },
    {
      url: 'posts/why-the-best-leaders-unlearn.html',
      title: 'Why the Best Leaders Are Unlearning Everything They Know',
      tag: 'Leadership',
      excerpt: 'The leadership playbook from 2015 is broken. The leaders who thrive are the ones brave enough to start over.',
      keywords: 'leadership unlearning change management AI distributed teams generations assumptions humility mental models playbook adaptability outcomes culture values',
      quote: 'What am I certain about that might be wrong?',
      linkedin: 'The leadership playbook from 2015 is broken.\n\nAI, distributed teams, five generations in one workplace - and most leaders are still running the old playbook.\n\nThe best leaders I know treat their assumptions as hypotheses, not truths.\n\nNew essay on The Leadership Compass.\n\n#Leadership #FutureOfWork #HR'
    },
    {
      url: 'posts/the-hr-tech-stack-is-a-lie.html',
      title: 'The HR Tech Stack Is a Lie (And What to Build Instead)',
      tag: 'HR Strategy',
      excerpt: 'Sixteen tools, zero integration, and a spreadsheet holding it all together. The problem is architecture, not technology.',
      keywords: 'hr technology tech stack hris ats integration data architecture systems of record ipaas middleware ai automation vendors tools consolidation roadmap people analytics',
      quote: 'Your stack doesn’t need another logo. It needs a blueprint.',
      linkedin: '16+ HR tools in the average enterprise. And the source of truth is still a spreadsheet.\n\nThe problem isn’t technology - it’s architecture.\n\nMy three-phase roadmap: Consolidate, Connect, then (and only then) Augment with AI.\n\nNew essay on The Leadership Compass.\n\n#HRTech #PeopleAnalytics #CHRO'
    },
    {
      url: 'posts/psychological-safety-is-not-about-being-nice.html',
      title: 'Psychological Safety Is Not About Being Nice',
      tag: 'Culture',
      excerpt: 'The most psychologically safe teams argue more, not less. What the research actually found.',
      keywords: 'psychological safety culture teams trust conflict debate feedback google project aristotle accountability standards learning dissent harmony niceness',
      quote: 'Psychological safety isn’t the absence of conflict. It’s the absence of fear about what conflict will cost you.',
      linkedin: 'Somewhere along the way, "psychological safety" got translated as "be nice."\n\nThat’s almost exactly backwards.\n\nThe most psychologically safe teams argue MORE in the room, not less. Silence isn’t harmony.\n\nNew essay on The Leadership Compass.\n\n#Culture #PsychologicalSafety #Leadership'
    },
    {
      url: 'posts/ai-wont-replace-managers.html',
      title: "AI Won't Replace Managers. But Managers Who Use AI Will.",
      tag: 'Future of Work',
      excerpt: 'The real divide is between managers who treat AI as a capability and those who pretend it is not happening.',
      keywords: 'ai artificial intelligence managers management automation future of work productivity meetings admin coordination tools adoption norms judgment coaching',
      quote: "AI doesn't threaten management. It threatens the administrative cosplay that has been passing for management.",
      linkedin: "AI isn't coming for the manager's job.\n\nIt's coming for the parts that were never really management: status reports, meeting summaries, coordination overhead.\n\nThe divide that matters isn't human vs machine - it's deniers vs amplified.\n\nNew essay on The Leadership Compass.\n\n#AI #Management #FutureOfWork"
    },
    {
      url: 'posts/quiet-power-of-leaders-who-listen.html',
      title: 'The Quiet Power of Leaders Who Listen More Than They Talk',
      tag: 'Leadership',
      excerpt: 'In a culture that rewards the loudest voice, the most effective leaders master strategic silence.',
      keywords: 'listening silence meetings airtime questions speak last decision hygiene anchoring information trust one-on-ones quiet leadership influence',
      quote: 'The loudest voice in the room rents attention. The leader who listens owns it.',
      linkedin: "When the most senior person speaks first, the meeting is over.\n\nEverything after that is agreement-finding dressed up as discussion.\n\nWhy the best leaders go last - and how to practice it.\n\nNew essay on The Leadership Compass.\n\n#Leadership #Listening #Management"
    },
    {
      url: 'posts/culture-fit-vs-culture-add.html',
      title: 'Stop Hiring for Culture Fit. Start Hiring for Culture Add.',
      tag: 'Talent',
      excerpt: 'Culture fit became a bias laundromat. A framework for hiring people who add what is missing.',
      keywords: 'hiring recruiting culture fit culture add bias diversity interviews structured behavioral questions talent acquisition team composition innovation onboarding',
      quote: "A team that only hires people it's comfortable with is optimizing for the absence of friction. But friction is where the new ideas are.",
      linkedin: '"Great skills, but I\'m not sure about culture fit."\n\nToo often that means: this person is not like us.\n\nFlip the question: what does this team LACK that this person brings?\n\nNew essay on The Leadership Compass.\n\n#Hiring #Talent #DEI'
    },
    {
      url: 'posts/your-leadership-brand.html',
      title: 'Your Leadership Brand Is What Happens When You Leave the Room',
      tag: 'Leadership',
      excerpt: 'Reputation is built in the micro-moments your team experiences every day.',
      keywords: 'leadership brand reputation trust credit feedback micro-moments behavior consistency executive presence influence career exit interviews',
      quote: "People don't remember your vision statement. They remember what you did when it was inconvenient.",
      linkedin: 'Right now, two people who work for you are talking about you.\n\nWhat they\'re saying - based on Tuesday\'s meeting, not your LinkedIn headline - is your leadership brand.\n\nEverything else is marketing.\n\nNew essay on The Leadership Compass.\n\n#Leadership #PersonalBrand'
    },
    {
      url: 'posts/performance-reviews-are-dead.html',
      title: 'Performance Reviews Are Dead. Long Live Continuous Feedback.',
      tag: 'HR Strategy',
      excerpt: 'Annual reviews are a relic. What the companies winning the talent war replaced them with.',
      keywords: 'performance reviews continuous feedback ratings compensation one-on-ones development conversations manager capability recency bias appraisal hr process',
      quote: 'The annual review asks one conversation to do four jobs - evaluate, develop, justify pay, and document - and does all four badly.',
      linkedin: 'The annual performance review: feedback about January, delivered in December.\n\nEleven months too late to act on.\n\nWhat actually replaces it (hint: not quarterly reviews).\n\nNew essay on The Leadership Compass.\n\n#PerformanceManagement #HR #Feedback'
    },
    {
      url: 'posts/culture-deck-without-the-nonsense.html',
      title: "How to Build a Culture Deck That Isn't Performative Nonsense",
      tag: 'Culture',
      excerpt: 'Most culture decks are aspirational fiction. How to write one that actually reflects reality.',
      keywords: 'culture deck values trade-offs netflix candor behavior falsifiable employer brand onboarding self-selection mission statement authenticity',
      quote: '"We value excellence" is decoration. Culture is what you choose when good things conflict.',
      linkedin: 'Your culture deck says Integrity, Innovation, Excellence.\n\nYour employees\' group chat says otherwise.\n\nThe only test that matters: could a candidate use it to predict their worst day?\n\nNew essay on The Leadership Compass.\n\n#Culture #EmployerBrand #HR'
    }
  ];

  function el(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }


  // Try the Vercel serverless API; resolve null on any failure so the
  // caller can fall back to the client-side implementation. This keeps
  // local preview and static hosts fully functional.
  function tryApi(path, payload) {
    if (!window.fetch || !window.AbortController) return Promise.resolve(null);
    var ctl = new AbortController();
    var timer = setTimeout(function () { ctl.abort(); }, 12000);
    return fetch(path, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      signal: ctl.signal
    }).then(function (r) {
      clearTimeout(timer);
      return r.ok ? r.json() : null;
    }).catch(function () {
      clearTimeout(timer);
      return null;
    });
  }

  /* ════════════════ 1. SMART SEARCH (all pages) ════════════════ */

  function initSearch() {
    // Add a search button to the navbar, before the Subscribe CTA.
    var links = document.querySelector('.navbar-links');
    if (links) {
      var li = el('<li><button class="search-trigger" aria-label="Search articles (press /)" title="Search ( / )">' +
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="17" height="17"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
        '</button></li>');
      var cta = links.querySelector('.navbar-cta');
      links.insertBefore(li, cta ? cta.closest('li') : null);
      li.querySelector('button').addEventListener('click', openSearch);
    }

    // Overlay
    var overlay = el(
      '<div class="ai-search-overlay" role="dialog" aria-modal="true" aria-label="Search articles" hidden>' +
      '  <div class="ai-search-box">' +
      '    <div class="ai-search-row">' +
      '      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="20" height="20"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
      '      <input type="text" placeholder="Ask in plain language… e.g. “how do I fix our HR tools mess”" aria-label="Search query">' +
      '      <button class="ai-search-close" aria-label="Close search">ESC</button>' +
      '    </div>' +
      '    <div class="ai-search-results"></div>' +
      '  </div>' +
      '</div>');
    document.body.appendChild(overlay);

    var input = overlay.querySelector('input');
    var results = overlay.querySelector('.ai-search-results');

    function openSearch() {
      overlay.hidden = false;
      document.body.style.overflow = 'hidden';
      renderResults('');
      input.focus();
    }
    function closeSearch() {
      overlay.hidden = true;
      document.body.style.overflow = '';
      input.value = '';
    }

    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeSearch(); });
    overlay.querySelector('.ai-search-close').addEventListener('click', closeSearch);
    input.addEventListener('input', function () { renderResults(input.value); });

    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && !e.target.matches('input, textarea')) { e.preventDefault(); openSearch(); }
      if (e.key === 'Escape' && !overlay.hidden) closeSearch();
    });

    // Natural-language-friendly scoring: every meaningful word in the
    // query votes across title, tag, excerpt, and a keyword bag, so
    // "how do I fix our HR tools mess" still lands on the HR tech post.
    var STOP = /^(the|a|an|and|or|of|in|on|for|to|is|are|was|were|be|how|do|does|did|i|we|our|my|me|you|your|it|its|this|that|with|about|what|why|when|who|can|should|article|articles|post|posts)$/;

    function score(article, words) {
      var hay = (article.title + ' ' + article.tag + ' ' + article.excerpt + ' ' + article.keywords).toLowerCase();
      var s = 0;
      words.forEach(function (w) {
        if (hay.indexOf(w) !== -1) s += 2;
        else if (w.length > 4 && hay.indexOf(w.slice(0, -1)) !== -1) s += 1; // crude stemming
      });
      return s;
    }

    function renderResults(q) {
      var words = q.toLowerCase().split(/\W+/).filter(function (w) { return w && !STOP.test(w); });
      var list = ARTICLES;
      if (words.length) {
        list = ARTICLES.map(function (a) { return { a: a, s: score(a, words) }; })
          .filter(function (x) { return x.s > 0; })
          .sort(function (x, y) { return y.s - x.s; })
          .map(function (x) { return x.a; });
      }
      if (!list.length) {
        results.innerHTML = '<p class="ai-search-hint">No matches. Try different words — e.g. <strong>“psychological safety”</strong> or <strong>“HR tools”</strong>.</p>';
        return;
      }
      results.innerHTML = list.map(function (a) {
        return '<a class="ai-search-item" href="' + ROOT + a.url + '">' +
          '<span class="ai-search-tag">' + esc(a.tag) + '</span>' +
          '<strong>' + esc(a.title) + '</strong>' +
          '<span class="ai-search-excerpt">' + esc(a.excerpt) + '</span></a>';
      }).join('');
    }
  }

  /* ════════════ 2–6. POST-PAGE FEATURES ════════════ */

  function currentArticle() {
    var path = location.pathname.split('/').pop();
    for (var i = 0; i < ARTICLES.length; i++) {
      if (ARTICLES[i].url.indexOf(path) !== -1) return ARTICLES[i];
    }
    return null;
  }

  function initPostFeatures() {
    var body = document.querySelector('.post-body');
    if (!body) return;
    var article = currentArticle();
    var header = document.querySelector('.post-header');

    /* ── Toolbar ── */
    var bar = el(
      '<div class="ai-toolbar" role="group" aria-label="Article tools">' +
      '  <button data-act="summary"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="15" height="15"><line x1="21" y1="6" x2="3" y2="6"/><line x1="15" y1="12" x2="3" y2="12"/><line x1="17" y1="18" x2="3" y2="18"/></svg> Summarize</button>' +
      '  <button data-act="share"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="15" height="15"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg> Share snippet</button>' +
      '</div>');
    (header || body).insertAdjacentElement(header ? 'afterend' : 'beforebegin', bar);

    /* ── 2. Summarizer: extract the load-bearing sentences ── */
    var panel = el('<div class="ai-summary" hidden><h4>TL;DR</h4><ul></ul></div>');
    bar.insertAdjacentElement('afterend', panel);

    function buildSummary() {
      var bullets = [];
      // The first paragraph after each h2 usually carries the section's thesis.
      body.querySelectorAll('h2').forEach(function (h) {
        var p = h.nextElementSibling;
        while (p && p.tagName !== 'P') p = p.nextElementSibling;
        if (p) {
          var m = p.textContent.trim().match(/^.+?[.!?](?=\s|$)/);
          var sentence = m ? m[0] : p.textContent.trim();
          if (sentence && sentence.length > 40) bullets.push(sentence);
        }
      });
      // Fall back to leading paragraphs if the post has no h2 structure.
      if (bullets.length < 3) {
        body.querySelectorAll(':scope > p').forEach(function (p) {
          if (bullets.length >= 3) return;
          var s = p.textContent.trim();
          var m2 = s.match(/^.+?[.!?](?=\s|$)/);
          if (s.length > 60) bullets.push(m2 ? m2[0] : s);
        });
      }
      return bullets.slice(0, 3);
    }

    var sumBtn = bar.querySelector('[data-act="summary"]');
    sumBtn.addEventListener('click', function () {
      if (!panel.hidden) {
        panel.hidden = true;
        sumBtn.classList.remove('active');
        return;
      }
      panel.hidden = false;
      sumBtn.classList.add('active');
      if (panel.querySelector('li')) return; // already built

      var ul = panel.querySelector('ul');
      ul.innerHTML = '<li>Summarizing…</li>';
      tryApi('/api/summarize', {
        title: article ? article.title : document.title,
        article: body.innerText
      }).then(function (data) {
        var bullets = (data && data.bullets && data.bullets.length) ? data.bullets : buildSummary();
        ul.innerHTML = bullets.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('');
      });
    });

    /* ── 4. Social snippet modal ── */
    if (article) {
      var modal = el(
        '<div class="ai-modal" role="dialog" aria-modal="true" aria-label="Share snippet" hidden>' +
        '  <div class="ai-modal-box">' +
        '    <h3>Share this article</h3>' +
        '    <div class="ai-quote-card"><p>“' + esc(article.quote) + '”</p><span>— The Leadership Compass by Sudarshan</span></div>' +
        '    <textarea class="ai-linkedin-text" rows="7" aria-label="LinkedIn post text" readonly>' + esc(article.linkedin) + '</textarea>' +
        '    <div class="ai-modal-actions">' +
        '      <button data-copy="linkedin">Copy LinkedIn post</button>' +
        '      <button data-copy="quote">Copy pull quote</button>' +
        '      <button data-copy="close">Close</button>' +
        '    </div>' +
        '  </div>' +
        '</div>');
      document.body.appendChild(modal);

      bar.querySelector('[data-act="share"]').addEventListener('click', function () { modal.hidden = false; });
      modal.addEventListener('click', function (e) {
        if (e.target === modal || e.target.dataset.copy === 'close') { modal.hidden = true; return; }
        var what = e.target.dataset.copy;
        if (!what) return;
        var text = what === 'linkedin' ? article.linkedin : '“' + article.quote + '” — The Leadership Compass by Sudarshan';
        navigator.clipboard.writeText(text).then(function () {
          var prev = e.target.textContent;
          e.target.textContent = 'Copied ✓';
          setTimeout(function () { e.target.textContent = prev; }, 1400);
        });
      });
    }

    /* ── 5. Recommendations ── */
    if (article) {
      var others = ARTICLES.filter(function (a) { return a !== article; });
      var rec = el(
        '<section class="ai-recommend" aria-label="Recommended articles">' +
        '  <h2>Readers also read</h2>' +
        '  <div class="ai-recommend-grid">' +
        others.map(function (a) {
          return '<a class="ai-recommend-card" href="' + ROOT + a.url + '">' +
            '<span class="ai-search-tag">' + esc(a.tag) + '</span>' +
            '<strong>' + esc(a.title) + '</strong>' +
            '<span class="ai-search-excerpt">' + esc(a.excerpt) + '</span></a>';
        }).join('') +
        '  </div>' +
        '</section>');
      var newsletter = document.querySelector('.newsletter-section');
      (newsletter || document.querySelector('footer')).insertAdjacentElement('beforebegin', rec);
    }

    /* ── 6. Reading assistant chat (grounded in this article) ── */
    var paragraphs = Array.prototype.map.call(
      body.querySelectorAll('p, li, blockquote'),
      function (n) { return n.textContent.trim(); }
    ).filter(function (t) { return t.length > 50; });

    function answer(q) {
      var words = q.toLowerCase().split(/\W+/).filter(function (w) { return w.length > 3; });
      if (!words.length) return 'Could you say a bit more? Ask me about any idea in this article.';
      var best = null, bestScore = 0;
      paragraphs.forEach(function (p) {
        var lp = p.toLowerCase(), s = 0;
        words.forEach(function (w) { if (lp.indexOf(w) !== -1) s++; });
        if (s > bestScore) { bestScore = s; best = p; }
      });
      if (best && bestScore > 0) {
        return 'Here’s the most relevant passage from the article:\n\n“' + best + '”';
      }
      return 'I couldn’t find that topic in this article. It focuses on: ' +
        (article ? article.excerpt : 'the themes in the text above') + ' — try asking about one of those ideas.';
    }

    var chat = el(
      '<div class="ai-chat">' +
      '  <div class="ai-chat-panel" hidden>' +
      '    <div class="ai-chat-head"><strong>Ask about this article</strong><button class="ai-chat-x" aria-label="Close">×</button></div>' +
      '    <div class="ai-chat-log"><div class="ai-msg bot">Hi! Ask me anything about this article and I’ll point you to the relevant part.</div></div>' +
      '    <form class="ai-chat-form"><input type="text" placeholder="e.g. what should I do first?" aria-label="Your question"><button type="submit" aria-label="Send">➤</button></form>' +
      '  </div>' +
      '  <button class="ai-chat-fab" aria-label="Open reading assistant">' +
      '    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="22" height="22"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
      '  </button>' +
      '</div>');
    document.body.appendChild(chat);

    var chatPanel = chat.querySelector('.ai-chat-panel');
    var log = chat.querySelector('.ai-chat-log');
    chat.querySelector('.ai-chat-fab').addEventListener('click', function () { chatPanel.hidden = !chatPanel.hidden; if (!chatPanel.hidden) chat.querySelector('input').focus(); });
    chat.querySelector('.ai-chat-x').addEventListener('click', function () { chatPanel.hidden = true; });
    chat.querySelector('.ai-chat-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var input = this.querySelector('input');
      var q = input.value.trim();
      if (!q) return;
      log.insertAdjacentHTML('beforeend', '<div class="ai-msg user">' + esc(q) + '</div>');
      input.value = '';
      log.insertAdjacentHTML('beforeend', '<div class="ai-msg bot ai-msg-pending">Thinking…</div>');
      log.scrollTop = log.scrollHeight;
      var pending = log.querySelector('.ai-msg-pending');
      tryApi('/api/chat', {
        title: article ? article.title : document.title,
        article: body.innerText,
        question: q
      }).then(function (data) {
        var text = (data && data.answer) ? data.answer : answer(q);
        pending.classList.remove('ai-msg-pending');
        pending.innerHTML = esc(text).replace(/\n/g, '<br>');
        log.scrollTop = log.scrollHeight;
      });
    });
  }


  /* ════════════════ 7. EDITORIAL ANIMATIONS ════════════════ */

  function initAnimations() {
    // Gate: initial hidden state only applies once this class exists,
    // so content stays visible for no-JS readers and crawlers.
    document.documentElement.classList.add('anim-ready');

    // What gets a scroll reveal: cards and section-level blocks.
    var targets = document.querySelectorAll(
      '.post-card, .featured-post, .section-header, .topic-pill, ' +
      '.service-card, .resource-card, .newsletter-inner, ' +
      '.ai-recommend-card, .author-box, .about-photo, .about-text, .stat'
    );
    targets.forEach(function (t) { t.classList.add('reveal'); });

    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (t) { t.classList.add('visible'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target); // reveal once; never re-hide while reading
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      targets.forEach(function (t) { io.observe(t); });
    }

    // Reading progress bar - article pages only.
    var body = document.querySelector('.post-body');
    if (body) {
      var bar = document.createElement('div');
      bar.className = 'read-progress';
      document.body.appendChild(bar);
      var ticking = false;
      function update() {
        var rect = body.getBoundingClientRect();
        var total = rect.height - window.innerHeight;
        var done = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
        bar.style.width = (total > 0 ? (done / total) * 100 : 0) + '%';
        ticking = false;
      }
      window.addEventListener('scroll', function () {
        if (!ticking) { requestAnimationFrame(update); ticking = true; }
      }, { passive: true });
      update();
    }
  }


  /* ════════════════ 8. BACK TO TOP ════════════════ */

  function initBackTop() {
    var btn = document.createElement('button');
    btn.className = 'back-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="18" height="18"><polyline points="18 15 12 9 6 15"/></svg>';
    document.body.appendChild(btn);
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    var shown = false;
    window.addEventListener('scroll', function () {
      var want = window.scrollY > window.innerHeight;
      if (want !== shown) { shown = want; btn.classList.toggle('show', want); }
    }, { passive: true });
  }


  /* ════════════════ 9. DARK MODE ════════════════ */

  var SUN = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="17" height="17"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
  var MOON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="17" height="17"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    var btn = document.querySelector('.theme-toggle');
    if (btn) {
      btn.innerHTML = theme === 'dark' ? SUN : MOON;
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  function initTheme() {
    var links = document.querySelector('.navbar-links');
    if (links) {
      var li = el('<li><button class="theme-toggle" aria-label="Toggle dark mode"></button></li>');
      var search = links.querySelector('.search-trigger');
      links.insertBefore(li, search ? search.closest('li') : null);
      li.querySelector('button').addEventListener('click', function () {
        var next = currentTheme() === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', next);
        applyTheme(next);
      });
    }

    var saved = localStorage.getItem('theme');
    var preferred = saved ||
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(preferred);

    // Follow OS changes live, unless the reader chose explicitly.
    if (!saved && window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        if (!localStorage.getItem('theme')) applyTheme(e.matches ? 'dark' : 'light');
      });
    }
  }

  /* ── Boot ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  function boot() {
    initTheme();
    initSearch();
    initPostFeatures();
    initAnimations();
    initBackTop();
  }
})();
