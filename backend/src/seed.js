require('dotenv').config();

const mongoose = require('mongoose');
const Case = require('./models/Case');

const MONGO_URI = process.env.MONGO_URI;

// ---------- Helpers for realistic timestamps ----------
function daysAgo(daysAgoMin, daysAgoMax) {
  const ms = (daysAgoMin + Math.random() * (daysAgoMax - daysAgoMin)) * 86400000;
  return new Date(Date.now() - ms);
}

function updatedAfter(createdAt, maxExtraHours = 72) {
  return new Date(createdAt.getTime() + Math.random() * maxExtraHours * 3600000);
}

// ---------- YOUR FULL DATASET ----------

const cases = [
  // ── PHISHING ──────────────────────────────────────────────────────────────
  {
    title: 'Fake login page mimicking major bank circulating via DMs',
    category: 'phishing', status: 'escalated', priority: 'high', riskLevel: 'high',
    assignedTo: 'analyst_1',
    notes: 'Domain registered 3 days ago. Credential harvesting confirmed. Referred to legal.',
  },
  {
    title: 'Phishing link disguised as account verification email',
    category: 'phishing', status: 'resolved', priority: 'high', riskLevel: 'high',
    assignedTo: 'analyst_2',
    notes: 'Confirmed phishing domain removed. Affected users notified and passwords reset.',
  },
  {
    title: 'Fake crypto wallet recovery page shared in support channels',
    category: 'phishing', status: 'in-review', priority: 'high', riskLevel: 'high',
    assignedTo: 'analyst_1',
    notes: 'Page collects seed phrases. Takedown request submitted to hosting provider.',
  },
  {
    title: 'Spoofed government benefits portal targeting low-income users',
    category: 'phishing', status: 'escalated', priority: 'high', riskLevel: 'high',
    assignedTo: 'analyst_3',
    notes: 'Multiple victims reported. Escalated to trust & safety leadership and CISA.',
  },
  {
    title: 'OAuth phishing app requesting excessive account permissions',
    category: 'phishing', status: 'resolved', priority: 'medium', riskLevel: 'medium',
    assignedTo: 'analyst_2',
    notes: 'App revoked and developer account suspended. 340 affected users re-authenticated.',
  },
  {
    title: 'Phishing DM campaign impersonating platform support team',
    category: 'phishing', status: 'pending', priority: 'medium', riskLevel: 'medium',
    assignedTo: '',
    notes: '',
  },
  {
    title: 'Fake invoice PDF with embedded phishing link distributed via groups',
    category: 'phishing', status: 'in-review', priority: 'medium', riskLevel: 'medium',
    assignedTo: 'analyst_1',
    notes: 'PDF hash flagged by threat intel feed. Investigating distribution network.',
  },

  // ── SPAM ──────────────────────────────────────────────────────────────────
  {
    title: 'Coordinated spam campaign across 400+ newly created accounts',
    category: 'spam', status: 'resolved', priority: 'high', riskLevel: 'high',
    assignedTo: 'analyst_2',
    notes: 'All 412 accounts suspended. IP range blocked. Originated from single botnet.',
  },
  {
    title: 'Bulk unsolicited promotional messages sent to 1,200 users',
    category: 'spam', status: 'escalated', priority: 'high', riskLevel: 'medium',
    assignedTo: 'analyst_3',
    notes: 'Sender bypassed rate limits using rotating proxies. Engineering notified.',
  },
  {
    title: 'Automated comment spam flooding trending posts with affiliate links',
    category: 'spam', status: 'in-review', priority: 'medium', riskLevel: 'medium',
    assignedTo: 'analyst_1',
    notes: 'Bot fingerprint identified. Reviewing 80 associated accounts.',
  },
  {
    title: 'Repeated low-quality spam replies on creator content',
    category: 'spam', status: 'resolved', priority: 'low', riskLevel: 'low',
    assignedTo: 'analyst_2',
    notes: 'Account warned and comment privileges temporarily restricted.',
  },
  {
    title: 'Spam ring promoting counterfeit goods via private groups',
    category: 'spam', status: 'in-review', priority: 'medium', riskLevel: 'medium',
    assignedTo: 'analyst_3',
    notes: 'Linked to known counterfeit network. Coordinating with brand protection team.',
  },
  {
    title: 'Mass follow/unfollow spam to game recommendation algorithm',
    category: 'spam', status: 'pending', priority: 'low', riskLevel: 'low',
    assignedTo: '',
    notes: '',
  },
  {
    title: 'Spam accounts seeding referral codes across public forums',
    category: 'spam', status: 'resolved', priority: 'low', riskLevel: 'low',
    assignedTo: 'analyst_1',
    notes: 'False positive — legitimate affiliate program. Account reinstated.',
  },
  {
    title: 'Automated DM spam targeting new user onboarding flow',
    category: 'spam', status: 'pending', priority: 'medium', riskLevel: 'medium',
    assignedTo: '',
    notes: '',
  },

  // ── FRAUD ─────────────────────────────────────────────────────────────────
  {
    title: 'Fake escrow service scam targeting high-value marketplace sellers',
    category: 'fraud', status: 'escalated', priority: 'high', riskLevel: 'high',
    assignedTo: 'analyst_1',
    notes: 'At least 8 confirmed victims. Total reported losses ~$14,000. Law enforcement notified.',
  },
  {
    title: 'Advance-fee fraud scheme disguised as grant opportunity',
    category: 'fraud', status: 'in-review', priority: 'high', riskLevel: 'high',
    assignedTo: 'analyst_2',
    notes: 'Classic 419 pattern. Investigating account age and payment processor links.',
  },
  {
    title: 'Scam cryptocurrency giveaway impersonating public figure',
    category: 'fraud', status: 'resolved', priority: 'high', riskLevel: 'high',
    assignedTo: 'analyst_3',
    notes: 'Account permanently suspended. Wallet address added to fraud blocklist.',
  },
  {
    title: 'Fake job posting collecting personal data and upfront fees',
    category: 'fraud', status: 'in-review', priority: 'medium', riskLevel: 'high',
    assignedTo: 'analyst_1',
    notes: 'Posting removed. Investigating whether operator controls additional accounts.',
  },
  {
    title: 'Pump-and-dump scheme coordinated via private investment group',
    category: 'fraud', status: 'escalated', priority: 'high', riskLevel: 'high',
    assignedTo: 'analyst_2',
    notes: 'Coordinated across 3 groups with 12,000 combined members. SEC referral pending.',
  },
  {
    title: 'Fraudulent charity solicitation following natural disaster',
    category: 'fraud', status: 'resolved', priority: 'high', riskLevel: 'high',
    assignedTo: 'analyst_3',
    notes: 'Account suspended. Donation links removed. Charity verification team alerted.',
  },
  {
    title: 'Fake product reviews purchased to manipulate seller ratings',
    category: 'fraud', status: 'pending', priority: 'medium', riskLevel: 'medium',
    assignedTo: '',
    notes: '',
  },
  {
    title: 'Credential stuffing attack on merchant accounts',
    category: 'fraud', status: 'in-review', priority: 'high', riskLevel: 'high',
    assignedTo: 'analyst_1',
    notes: 'Unusual login pattern from 14 countries in 2 hours. Security team engaged.',
  },
  {
    title: 'Romance scam targeting elderly users via dating feature',
    category: 'fraud', status: 'escalated', priority: 'high', riskLevel: 'high',
    assignedTo: 'analyst_2',
    notes: 'Victim reported $6,200 loss. Account suspended. Referred to consumer protection.',
  },
  {
    title: 'Fake ticket resale scam for sold-out events',
    category: 'fraud', status: 'resolved', priority: 'medium', riskLevel: 'medium',
    assignedTo: 'analyst_3',
    notes: 'Listings removed. Seller account banned. Buyers refunded via payment dispute.',
  },

  // ── HARASSMENT ────────────────────────────────────────────────────────────
  {
    title: 'Targeted harassment campaign against journalist following article',
    category: 'harassment', status: 'escalated', priority: 'high', riskLevel: 'high',
    assignedTo: 'analyst_1',
    notes: 'Coordinated across 20+ accounts. Victim contacted. Accounts suspended pending review.',
  },
  {
    title: 'Doxxing post containing home address and phone number of private individual',
    category: 'harassment', status: 'resolved', priority: 'high', riskLevel: 'high',
    assignedTo: 'analyst_2',
    notes: 'Content removed within 15 minutes of report. Account permanently banned.',
  },
  {
    title: 'Repeated unwanted contact after block — evading via new accounts',
    category: 'harassment', status: 'in-review', priority: 'medium', riskLevel: 'medium',
    assignedTo: 'analyst_3',
    notes: 'Three sock puppet accounts identified. Device fingerprint flagged for monitoring.',
  },
  {
    title: 'Pile-on harassment targeting minor after viral post',
    category: 'harassment', status: 'escalated', priority: 'high', riskLevel: 'high',
    assignedTo: 'analyst_1',
    notes: 'Minor account protected. 47 harassing accounts actioned. Parents notified.',
  },
  {
    title: 'Threatening messages sent to public health official',
    category: 'harassment', status: 'resolved', priority: 'high', riskLevel: 'high',
    assignedTo: 'analyst_2',
    notes: 'Content removed. Account suspended. Law enforcement preservation request fulfilled.',
  },
  {
    title: 'Sustained low-level harassment via replies and quote posts',
    category: 'harassment', status: 'pending', priority: 'medium', riskLevel: 'medium',
    assignedTo: '',
    notes: '',
  },
  {
    title: 'Coordinated mass-reporting abuse to silence activist account',
    category: 'harassment', status: 'in-review', priority: 'medium', riskLevel: 'medium',
    assignedTo: 'analyst_3',
    notes: 'Abuse of reporting system confirmed. Target account restored. Reporters flagged.',
  },

  // ── HATE SPEECH ───────────────────────────────────────────────────────────
  {
    title: 'Neo-Nazi recruitment content posted in gaming community',
    category: 'hate_speech', status: 'resolved', priority: 'high', riskLevel: 'high',
    assignedTo: 'analyst_1',
    notes: 'Content removed. Account permanently suspended. Group disbanded.',
  },
  {
    title: 'Ethnic slurs and dehumanizing language targeting refugee community',
    category: 'hate_speech', status: 'escalated', priority: 'high', riskLevel: 'high',
    assignedTo: 'analyst_2',
    notes: 'Multiple posts across 6 accounts. Escalated for coordinated behavior review.',
  },
  {
    title: 'Antisemitic conspiracy theory post gaining significant engagement',
    category: 'hate_speech', status: 'in-review', priority: 'high', riskLevel: 'high',
    assignedTo: 'analyst_3',
    notes: 'Post has 4,200 shares. Reviewing amplification network before action.',
  },
  {
    title: 'Homophobic slurs in comments on LGBTQ+ creator content',
    category: 'hate_speech', status: 'resolved', priority: 'medium', riskLevel: 'medium',
    assignedTo: 'analyst_1',
    notes: 'Comments removed. Account issued final warning. Creator support team notified.',
  },
  {
    title: 'Islamophobic content disguised as political commentary',
    category: 'hate_speech', status: 'in-review', priority: 'medium', riskLevel: 'medium',
    assignedTo: 'analyst_2',
    notes: 'Borderline case. Escalating to policy team for context review.',
  },
  {
    title: 'Hate group using coded language to evade automated detection',
    category: 'hate_speech', status: 'escalated', priority: 'high', riskLevel: 'high',
    assignedTo: 'analyst_3',
    notes: 'New slang terms identified. Classifier update requested. 14 accounts suspended.',
  },
  {
    title: 'Racially motivated threats posted after local news event',
    category: 'hate_speech', status: 'resolved', priority: 'high', riskLevel: 'high',
    assignedTo: 'analyst_1',
    notes: 'Content removed. Account banned. Law enforcement notified per policy.',
  },

  // ── MISINFORMATION ────────────────────────────────────────────────────────
  {
    title: 'Fabricated quote attributed to sitting head of state going viral',
    category: 'misinformation', status: 'escalated', priority: 'high', riskLevel: 'high',
    assignedTo: 'analyst_2',
    notes: 'Post has 18,000 shares. Label applied. Escalated to government affairs team.',
  },
  {
    title: 'False claim that vaccine causes infertility shared in parenting groups',
    category: 'misinformation', status: 'resolved', priority: 'high', riskLevel: 'high',
    assignedTo: 'analyst_3',
    notes: 'Content removed per health misinformation policy. Account restricted.',
  },
  {
    title: 'Manipulated video of election official falsely showing ballot destruction',
    category: 'misinformation', status: 'escalated', priority: 'high', riskLevel: 'high',
    assignedTo: 'analyst_1',
    notes: 'Synthetic media confirmed by forensics team. Removed. Referred to elections integrity.',
  },
  {
    title: 'Misleading statistics about crime rates used to incite fear',
    category: 'misinformation', status: 'in-review', priority: 'medium', riskLevel: 'medium',
    assignedTo: 'analyst_2',
    notes: 'Fact-check label applied pending full review. Monitoring engagement.',
  },
  {
    title: 'False report of active shooter circulating during public event',
    category: 'misinformation', status: 'resolved', priority: 'high', riskLevel: 'high',
    assignedTo: 'analyst_3',
    notes: 'Content removed immediately. Account suspended. Local authorities confirmed false.',
  },
  {
    title: 'Pseudoscientific cancer cure claims in health community',
    category: 'misinformation', status: 'in-review', priority: 'medium', riskLevel: 'medium',
    assignedTo: 'analyst_1',
    notes: 'Reviewing against health policy. Medical advisory board consulted.',
  },
  {
    title: 'Coordinated inauthentic accounts spreading climate denial narratives',
    category: 'misinformation', status: 'in-review', priority: 'medium', riskLevel: 'medium',
    assignedTo: 'analyst_2',
    notes: 'Network of 34 accounts identified. Investigating funding and coordination.',
  },
  {
    title: 'Satire article shared without context as factual news',
    category: 'misinformation', status: 'resolved', priority: 'low', riskLevel: 'low',
    assignedTo: 'analyst_3',
    notes: 'False positive — satire label added to source. No action on sharing accounts.',
  },

  // ── ABUSE ─────────────────────────────────────────────────────────────────
  {
    title: 'CSAM report flagged by PhotoDNA hash match',
    category: 'abuse', status: 'escalated', priority: 'high', riskLevel: 'high',
    assignedTo: 'analyst_1',
    notes: 'Content removed immediately. Account suspended. NCMEC CyberTipline report filed.',
  },
  {
    title: 'Graphic self-harm content posted in mental health support group',
    category: 'abuse', status: 'resolved', priority: 'high', riskLevel: 'high',
    assignedTo: 'analyst_2',
    notes: 'Content removed. User referred to crisis resources. Account under monitoring.',
  },
  {
    title: 'Non-consensual intimate image reported by victim',
    category: 'abuse', status: 'escalated', priority: 'high', riskLevel: 'high',
    assignedTo: 'analyst_3',
    notes: 'Image removed. Account suspended. Victim support resources provided.',
  },
  {
    title: 'Animal cruelty video shared for shock value',
    category: 'abuse', status: 'resolved', priority: 'high', riskLevel: 'high',
    assignedTo: 'analyst_1',
    notes: 'Content removed. Account permanently banned. Reported to animal welfare authorities.',
  },
  {
    title: 'Graphic violence in livestream — moderator escalation',
    category: 'abuse', status: 'resolved', priority: 'high', riskLevel: 'high',
    assignedTo: 'analyst_2',
    notes: 'Stream terminated. Account suspended. Clip preserved for law enforcement.',
  },
  {
    title: 'Eating disorder promotion content targeting teenagers',
    category: 'abuse', status: 'in-review', priority: 'high', riskLevel: 'high',
    assignedTo: 'analyst_3',
    notes: 'Community identified as pro-ED. Reviewing 200+ posts for policy violations.',
  },
  {
    title: 'Suicide method instructions shared in response to crisis post',
    category: 'abuse', status: 'resolved', priority: 'high', riskLevel: 'high',
    assignedTo: 'analyst_1',
    notes: 'Content removed. Both accounts referred to crisis intervention resources.',
  },

  // ── POLICY VIOLATION ──────────────────────────────────────────────────────
  {
    title: 'Undisclosed paid promotion by influencer violating ad policy',
    category: 'policy_violation', status: 'resolved', priority: 'medium', riskLevel: 'low',
    assignedTo: 'analyst_2',
    notes: 'Warning issued. Post labeled as advertisement. No further action required.',
  },
  {
    title: 'Impersonation account mimicking verified public figure',
    category: 'policy_violation', status: 'in-review', priority: 'medium', riskLevel: 'medium',
    assignedTo: 'analyst_3',
    notes: 'Account lacks parody disclosure. Awaiting response from verified account holder.',
  },
  {
    title: 'Seller listing prohibited weapons accessories on marketplace',
    category: 'policy_violation', status: 'resolved', priority: 'high', riskLevel: 'high',
    assignedTo: 'analyst_1',
    notes: 'Listings removed. Seller account suspended. Reported to ATF per legal policy.',
  },
  {
    title: 'Unauthorized use of copyrighted music in monetized content',
    category: 'policy_violation', status: 'resolved', priority: 'low', riskLevel: 'low',
    assignedTo: 'analyst_2',
    notes: 'DMCA takedown processed. Creator notified. Strike added to account.',
  },
  {
    title: 'Minor lying about age to access adult content sections',
    category: 'policy_violation', status: 'escalated', priority: 'high', riskLevel: 'high',
    assignedTo: 'analyst_3',
    notes: 'Account age-gated pending verification. Escalated to child safety team.',
  },
  {
    title: 'Coordinated inauthentic behavior inflating petition signatures',
    category: 'policy_violation', status: 'in-review', priority: 'medium', riskLevel: 'medium',
    assignedTo: 'analyst_1',
    notes: 'Bot signatures identified. Petition flagged. Investigating operator accounts.',
  },
  {
    title: 'Drug sales using coded language in public marketplace listings',
    category: 'policy_violation', status: 'escalated', priority: 'high', riskLevel: 'high',
    assignedTo: 'analyst_2',
    notes: 'Listings removed. Account suspended. Law enforcement referral under review.',
  },
  {
    title: 'Misleading health claims in sponsored post violating ad standards',
    category: 'policy_violation', status: 'pending', priority: 'medium', riskLevel: 'medium',
    assignedTo: '',
    notes: '',
  },
  {
    title: 'Banned user operating under new account after permanent suspension',
    category: 'policy_violation', status: 'in-review', priority: 'medium', riskLevel: 'medium',
    assignedTo: 'analyst_3',
    notes: 'Device fingerprint matches banned account. Preparing evasion suspension.',
  },
  {
    title: 'Gambling promotion targeting users in jurisdictions where prohibited',
    category: 'policy_violation', status: 'resolved', priority: 'medium', riskLevel: 'medium',
    assignedTo: 'analyst_1',
    notes: 'Geo-targeted ads removed. Advertiser account suspended pending compliance review.',
  },
  {
    title: 'Unverified medical professional giving prescription advice',
    category: 'policy_violation', status: 'pending', priority: 'medium', riskLevel: 'medium',
    assignedTo: '',
    notes: '',
  },
  {
    title: 'Mass account creation from single device to abuse free trial',
    category: 'policy_violation', status: 'resolved', priority: 'low', riskLevel: 'low',
    assignedTo: 'analyst_2',
    notes: 'Duplicate accounts merged. Device flagged. Billing anomaly resolved.',
  },
  {
    title: 'Automated scraping of user data violating platform terms',
    category: 'policy_violation', status: 'escalated', priority: 'high', riskLevel: 'high',
    assignedTo: 'analyst_3',
    notes: 'API abuse confirmed. Access revoked. Legal team reviewing data exposure scope.',
  },
  {
    title: 'Hate group rebranding after ban to evade detection',
    category: 'policy_violation', status: 'in-review', priority: 'high', riskLevel: 'high',
    assignedTo: 'analyst_1',
    notes: 'New group name identified via member overlap analysis. Suspension imminent.',
  },
  {
    title: 'Spam bot network gaming trending topics algorithm',
    category: 'spam', status: 'pending', priority: 'medium', riskLevel: 'medium',
    assignedTo: '',
    notes: '',
  },
  {
    title: 'Fake account impersonating NGO to solicit donations',
    category: 'fraud', status: 'pending', priority: 'high', riskLevel: 'high',
    assignedTo: '',
    notes: '',
  },
  {
    title: 'Coordinated harassment of trans creator following viral post',
    category: 'harassment', status: 'pending', priority: 'high', riskLevel: 'high',
    assignedTo: '',
    notes: '',
  },
  {
    title: 'Deepfake audio of CEO used in financial fraud scheme',
    category: 'fraud', status: 'escalated', priority: 'high', riskLevel: 'high',
    assignedTo: 'analyst_2',
    notes: 'Synthetic audio confirmed. Content removed. Fraud team and legal notified.',
  },
  {
    title: 'Low-severity spam replies on older posts — single account',
    category: 'spam', status: 'resolved', priority: 'low', riskLevel: 'low',
    assignedTo: 'analyst_3',
    notes: 'Account warned. Spam comments removed. No further action required.',
  },
];


  // ✅ KEEP ADDING YOUR FULL 75 CASES HERE
  // (paste the rest of your dataset exactly as you had it)

// ---------- Transform with timestamps ----------
const seeded = cases.map((c) => {
  const maxAge =
    c.riskLevel === 'high' ? 7 :
    c.riskLevel === 'medium' ? 20 : 30;

  const createdAt = daysAgo(0.1, maxAge);

  const extraHours =
    c.status === 'pending' ? 2 :
    c.status === 'resolved' ? 48 : 72;

  const updatedAt = updatedAfter(createdAt, extraHours);

  return { ...c, createdAt, updatedAt };
});

// ---------- SEED FUNCTION ----------
async function seed() {
  try {
    console.log("👉 USING DB:", MONGO_URI);

    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const existing = await Case.countDocuments();

    if (existing > 0 && process.env.SEED_RESET !== 'true') {
      console.log(`⚠️ Database already has ${existing} cases. Skipping seed.`);
      console.log("👉 Use SEED_RESET=true to force reseed");
      return;
    }

    await Case.deleteMany({});
    console.log("🧹 Cleared existing cases");

    await Case.insertMany(seeded);
    console.log(`✅ Inserted ${seeded.length} cases`);

  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected");
  }
}

seed();