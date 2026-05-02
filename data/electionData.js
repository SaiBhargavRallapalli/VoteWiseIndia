'use strict';

/** Core election data for India */
const ELECTION_DATA = {
  title:    'Indian Elections',
  subtitle: 'Lok Sabha, Vidhan Sabha & Local Body Elections',
  country:  'India',
  body:     'Election Commission of India (ECI)',
  website:  'https://eci.gov.in',

  keyFacts: [
    { label: 'Eligible Voters',    value: '96.8 Crore',          icon: '👥' },
    { label: 'Lok Sabha Seats',    value: '543',                  icon: '🏛️' },
    { label: 'Polling Stations',   value: '10.5 Lakh',            icon: '🗳️' },
    { label: 'Recognised Parties', value: '6 National + 57 State', icon: '🎌' },
  ],

  electionTypes: [
    {
      id:   'lok-sabha',
      name: 'Lok Sabha',
      full: 'General Elections (Lok Sabha)',
      desc: 'Election to the Lower House of Parliament. 543 constituencies across India. Held every 5 years.',
      frequency: 'Every 5 years',
      seats: 543,
      lastHeld: '2024',
      nextDue:  '2029',
      calStart: '20290401T000000Z',
      calEnd:   '20290601T000000Z',
    },
    {
      id:   'rajya-sabha',
      name: 'Rajya Sabha',
      full: 'Rajya Sabha Elections',
      desc: 'Upper House elections. Members elected by state legislative assemblies for 6-year terms. One-third retire every 2 years.',
      frequency: 'Biennial (one-third)',
      seats: 245,
      lastHeld: '2024',
      nextDue:  '2026',
      calStart: '20260301T000000Z',
      calEnd:   '20260401T000000Z',
    },
    {
      id:   'vidhan-sabha',
      name: 'Vidhan Sabha',
      full: 'State Legislative Assembly Elections',
      desc: 'Elections to state assemblies. Each of the 28 states and 3 UTs with legislature holds separate elections.',
      frequency: 'Every 5 years (state-specific)',
      seats: 'Varies by state',
      lastHeld: '2024 (multiple states)',
      nextDue:  '2025-2027 (state-specific)',
      calStart: '20251001T000000Z',
      calEnd:   '20260101T000000Z',
    },
    {
      id:   'local-body',
      name: 'Local Body',
      full: 'Panchayat & Municipal Elections',
      desc: 'Elections for gram panchayats, municipal corporations, and local governing bodies. Conducted by State Election Commissions.',
      frequency: 'Every 5 years',
      seats: 'Varies',
      lastHeld: '2023-2024',
      nextDue:  '2028-2029',
      calStart: '20280101T000000Z',
      calEnd:   '20280401T000000Z',
    },
  ],

  votingSteps: [
    {
      step: 1, icon: '📋',
      title: 'Check Voter Registration',
      description: 'Verify you are registered on the electoral roll at voters.eci.gov.in or the Voter Helpline App. You need to be 18+ as of January 1 of the election year.',
    },
    {
      step: 2, icon: '🆔',
      title: 'Get Your EPIC Card',
      description: 'Obtain your Electors Photo Identity Card (EPIC/Voter ID) from your local Electoral Registration Officer or apply online via the National Voters Service Portal (NVSP).',
    },
    {
      step: 3, icon: '📅',
      title: 'Check Election Schedule',
      description: 'Monitor ECI announcements for Phase-wise election dates. The Model Code of Conduct comes into effect from the date of schedule announcement.',
    },
    {
      step: 4, icon: '📍',
      title: 'Find Your Polling Booth',
      description: 'Use the Voter Helpline (1950) or electoralsearch.eci.gov.in to find your assigned polling booth number and address.',
    },
    {
      step: 5, icon: '🗳️',
      title: 'Voting Day — Cast Your Vote',
      description: 'Arrive at your polling booth with EPIC or any approved alternate ID. Follow the queue, verify your name in the register, receive the ballot slip, and use the EVM.',
    },
    {
      step: 6, icon: '☑️',
      title: 'Using the EVM & VVPAT',
      description: 'Press the blue button next to your preferred candidate on the Electronic Voting Machine. A VVPAT slip appears for 7 seconds confirming your choice. Your vote is secret and secure.',
    },
    {
      step: 7, icon: '🖊️',
      title: 'Collect Indelible Ink Mark',
      description: 'After voting, indelible ink is applied to your left index finger. This prevents double voting and is a mark of democratic participation.',
    },
  ],

  registrationSteps: [
    { step: 1, title: 'Check Eligibility', desc: 'Indian citizen, 18+ years as of January 1 of qualifying year, ordinary resident of the constituency.' },
    { step: 2, title: 'Gather Documents',  desc: 'Age proof (birth certificate/passport/class X certificate), address proof (Aadhaar/utility bill/bank passbook), passport-size photograph.' },
    { step: 3, title: 'Fill Form 6',       desc: 'Visit voters.eci.gov.in or use the Voter Helpline App to fill Form 6 (new registration). NRIs use Form 6A.' },
    { step: 4, title: 'Submit Application', desc: 'Submit online or at your local Electoral Registration Office (ERO/AERO). Track application status on NVSP.' },
    { step: 5, title: 'Verification',       desc: 'A Booth Level Officer (BLO) may visit your address for verification within 30 days.' },
    { step: 6, title: 'Receive EPIC',       desc: 'Upon approval, collect your Voter ID card. Can also download e-EPIC from the NVSP portal.' },
  ],

  importantDates: [
    { id: 'd1', event: 'Rajya Sabha Biennial Elections',  date: 'March 2026',          type: 'election', calStart: '20260301T000000Z', calEnd: '20260401T000000Z' },
    { id: 'd2', event: 'Bihar Vidhan Sabha Elections',    date: 'October–November 2025', type: 'election', calStart: '20251001T000000Z', calEnd: '20251201T000000Z' },
    { id: 'd3', event: 'Delhi Municipal Elections',       date: '2025',                 type: 'local',    calStart: '20250601T000000Z', calEnd: '20250801T000000Z' },
    { id: 'd4', event: 'Next Lok Sabha Elections',        date: '2029',                 type: 'general',  calStart: '20290401T000000Z', calEnd: '20290601T000000Z' },
    { id: 'd5', event: 'Voter List Revision (Annual)',    date: 'October–January',      type: 'admin',    calStart: '20251001T000000Z', calEnd: '20260115T000000Z' },
  ],

  quizQuestions: [
    {
      id: 'q1',
      q: 'What is the minimum voting age in India?',
      options: ['16 years', '18 years', '21 years', '25 years'],
      answer: 1,
      explain: 'The 61st Constitutional Amendment (1989) lowered the voting age from 21 to 18 years.',
    },
    {
      id: 'q2',
      q: 'How many seats are there in the Lok Sabha?',
      options: ['450', '500', '543', '552'],
      answer: 2,
      explain: '543 elected seats in Lok Sabha. The President nominates 2 Anglo-Indian members (now discontinued after 104th Amendment).',
    },
    {
      id: 'q3',
      q: 'What does NOTA stand for?',
      options: [
        'No Option To Accept',
        'None Of The Above',
        'National Option To Abstain',
        'No Official Term Available',
      ],
      answer: 1,
      explain: 'NOTA (None Of The Above) was introduced by the Supreme Court in 2013, allowing voters to reject all candidates.',
    },
    {
      id: 'q4',
      q: 'Which body conducts Lok Sabha and Vidhan Sabha elections?',
      options: [
        'State Election Commission',
        'Ministry of Home Affairs',
        'Election Commission of India',
        'Supreme Court of India',
      ],
      answer: 2,
      explain: 'The Election Commission of India (ECI), an independent constitutional body, conducts elections to Parliament and State Legislatures.',
    },
    {
      id: 'q5',
      q: 'What is EVM?',
      options: [
        'Electronic Voting Machine',
        'Election Verification Method',
        'Electoral Vote Monitor',
        'Electronic Voter Module',
      ],
      answer: 0,
      explain: 'EVM (Electronic Voting Machine) has been used in Indian elections since 1982. It replaced paper ballots to reduce fraud and errors.',
    },
    {
      id: 'q6',
      q: 'What is the VVPAT?',
      options: [
        'Verified Voter Paper Audit Trail',
        'Voter Verified Paper Audit Trail',
        'Valid Vote Paper Audit Track',
        'Voting Verification Process Audit Trail',
      ],
      answer: 1,
      explain: 'VVPAT (Voter Verified Paper Audit Trail) prints a slip for 7 seconds showing the voter their choice, ensuring EVM accuracy.',
    },
    {
      id: 'q7',
      q: 'What is the Model Code of Conduct?',
      options: [
        'Rules for journalists covering elections',
        'Guidelines for voters on polling day',
        'Conduct rules for candidates and parties during elections',
        'ECI internal operational manual',
      ],
      answer: 2,
      explain: 'The Model Code of Conduct (MCC) is a set of guidelines for political parties and candidates during elections, enforced from schedule announcement to result day.',
    },
    {
      id: 'q8',
      q: 'Which form is used for new voter registration in India?',
      options: ['Form 3', 'Form 6', 'Form 8', 'Form 10'],
      answer: 1,
      explain: 'Form 6 is used for new voter enrollment. Form 6A is for NRIs, Form 7 for deletion, and Form 8 for corrections.',
    },
    {
      id: 'q9',
      q: 'What is the Voter Helpline number in India?',
      options: ['1800', '1950', '1100', '104'],
      answer: 1,
      explain: 'Voter Helpline 1950 connects citizens to Electoral Registration Officers for booth info, registration queries, and complaints.',
    },
    {
      id: 'q10',
      q: 'How long is the term of a Rajya Sabha member?',
      options: ['2 years', '4 years', '5 years', '6 years'],
      answer: 3,
      explain: 'Rajya Sabha members serve 6-year terms. One-third of members retire every 2 years, making it a permanent house — it is never fully dissolved.',
    },
    {
      id: 'q11',
      q: 'What is the full form of EPIC?',
      options: ['Electoral Photo Identity Card', 'Election Participation Identity Certificate', 'Electoral Polling Identity Card', 'Election Commission Identity Protocol'],
      answer: 0,
      explain: 'EPIC stands for Electoral Photo Identity Card, commonly known as the Voter ID card, issued by the Election Commission of India.',
    },
    {
      id: 'q12',
      q: 'Under which Article of the Constitution is the Election Commission of India established?',
      options: ['Article 312', 'Article 324', 'Article 356', 'Article 370'],
      answer: 1,
      explain: 'Article 324 of the Indian Constitution establishes the Election Commission and vests it with superintendence, direction, and control of all elections to Parliament and State Legislatures.',
    },
    {
      id: 'q13',
      q: 'What is the minimum age to contest a Lok Sabha election?',
      options: ['18 years', '21 years', '25 years', '30 years'],
      answer: 2,
      explain: 'A candidate must be at least 25 years old to contest elections to the Lok Sabha. For Rajya Sabha, the minimum age is 30 years.',
    },
    {
      id: 'q14',
      q: 'When does the Model Code of Conduct (MCC) come into force?',
      options: ['On polling day', 'When nominations open', 'On announcement of election schedule', 'When results are declared'],
      answer: 2,
      explain: 'The MCC comes into force immediately on announcement of the election schedule by the ECI and remains in effect until results are declared.',
    },
    {
      id: 'q15',
      q: 'Which form is used to report deletion of a name from the voter list?',
      options: ['Form 6', 'Form 6A', 'Form 7', 'Form 8'],
      answer: 2,
      explain: 'Form 7 is used to object to the inclusion of a name or to report deletion. Form 6 is for new enrollment, Form 6A for NRIs, and Form 8 for corrections.',
    },
  ],

  announcements: [
    { id: 'a1', text: 'Voter registration open for 2025-26 rolls. Apply at voters.eci.gov.in',                type: 'info',    time: 'Latest' },
    { id: 'a2', text: 'Download your e-EPIC (digital Voter ID) instantly from the NVSP portal',             type: 'success', time: 'New Feature' },
    { id: 'a3', text: 'Bihar Assembly Elections scheduled for late 2025. Check ECI for official dates.',     type: 'warning', time: 'Upcoming' },
    { id: 'a4', text: 'Voter Helpline 1950 now available 24x7 during election season',                       type: 'info',    time: 'Update' },
    { id: 'a5', text: 'Supreme Court mandates 100% VVPAT verification in phased manner',                     type: 'info',    time: 'Policy' },
  ],

  checklistItems: [
    { id: 'c1',  task: 'Check your voter registration status',         hint: 'Visit voters.eci.gov.in or call 1950',              icon: '📋', priority: 'high'   },
    { id: 'c2',  task: 'Verify your name in the electoral roll',       hint: 'Use electoralsearch.eci.gov.in',                    icon: '🔍', priority: 'high'   },
    { id: 'c3',  task: 'Keep your Voter ID (EPIC) card ready',         hint: 'Or download e-EPIC from the NVSP portal',           icon: '🆔', priority: 'high'   },
    { id: 'c4',  task: 'Find out your polling booth location',          hint: 'Available on electoralsearch.eci.gov.in',           icon: '📍', priority: 'high'   },
    { id: 'c5',  task: 'Note the date and phase of your election',      hint: 'Check ECI official election schedule',              icon: '📅', priority: 'high'   },
    { id: 'c6',  task: 'Read about candidates in your constituency',    hint: 'View affidavits at affidavit.eci.gov.in',           icon: '📰', priority: 'medium' },
    { id: 'c7',  task: 'Know your voting rights',                       hint: 'Right to vote freely without fear or inducement',   icon: '⚖️', priority: 'medium' },
    { id: 'c8',  task: 'Prepare alternate ID documents if needed',      hint: 'Aadhaar, Passport, Bank Passbook, or PAN card',     icon: '📄', priority: 'medium' },
    { id: 'c9',  task: 'Plan your route to the polling booth',          hint: 'Arrive early to avoid long queues',                 icon: '🗺️', priority: 'medium' },
    { id: 'c10', task: 'Inform your family and friends to vote',        hint: 'Increase voter turnout in your community',          icon: '👨‍👩‍👧', priority: 'low'    },
    { id: 'c11', task: 'Download the Voter Helpline App',               hint: 'Available on iOS and Android from ECI',             icon: '📱', priority: 'low'    },
    { id: 'c12', task: 'Try the interactive EVM Demo on this app',      hint: 'Learn how the EVM and VVPAT work before voting',    icon: '⚡', priority: 'low'    },
  ],

  evmCandidates: [
    { id: 1, name: 'Priya Sharma',   party: 'Progressive India Party', symbol: '🌸', color: '#FF6B00', slotNum: 1 },
    { id: 2, name: 'Rahul Verma',    party: 'United Democratic Front', symbol: '✋', color: '#138808', slotNum: 2 },
    { id: 3, name: 'Suresh Kumar',   party: "People's Alliance",       symbol: '🚲', color: '#0055CC', slotNum: 3 },
    { id: 4, name: 'Meena Patel',    party: 'National Reform Party',   symbol: '🌟', color: '#800080', slotNum: 4 },
    { id: 5, name: 'Anand Singh',    party: 'Rural Development Party', symbol: '🌾', color: '#8B4513', slotNum: 5 },
    { id: 6, name: 'Lakshmi Devi',   party: 'Independent',             symbol: '🏺', color: '#666666', slotNum: 6 },
    { id: 7, name: 'NOTA',           party: 'None of the Above',       symbol: '✗',  color: '#444444', slotNum: 7 },
  ],
};

/** All 28 Indian states with electoral data */
const STATES = [
  { name: 'Andhra Pradesh',    capital: 'Amaravati',          vidhanSabhaSeats: 175, rajyaSabhaSeats: 11, lokSabhaSeats: 25, type: 'state', region: 'South' },
  { name: 'Arunachal Pradesh', capital: 'Itanagar',            vidhanSabhaSeats: 60,  rajyaSabhaSeats: 1,  lokSabhaSeats: 2,  type: 'state', region: 'North East' },
  { name: 'Assam',             capital: 'Dispur',              vidhanSabhaSeats: 126, rajyaSabhaSeats: 7,  lokSabhaSeats: 14, type: 'state', region: 'North East' },
  { name: 'Bihar',             capital: 'Patna',               vidhanSabhaSeats: 243, rajyaSabhaSeats: 16, lokSabhaSeats: 40, type: 'state', region: 'East' },
  { name: 'Chhattisgarh',      capital: 'Raipur',              vidhanSabhaSeats: 90,  rajyaSabhaSeats: 5,  lokSabhaSeats: 11, type: 'state', region: 'Central' },
  { name: 'Goa',               capital: 'Panaji',              vidhanSabhaSeats: 40,  rajyaSabhaSeats: 1,  lokSabhaSeats: 2,  type: 'state', region: 'West' },
  { name: 'Gujarat',           capital: 'Gandhinagar',         vidhanSabhaSeats: 182, rajyaSabhaSeats: 11, lokSabhaSeats: 26, type: 'state', region: 'West' },
  { name: 'Haryana',           capital: 'Chandigarh',          vidhanSabhaSeats: 90,  rajyaSabhaSeats: 5,  lokSabhaSeats: 10, type: 'state', region: 'North' },
  { name: 'Himachal Pradesh',  capital: 'Shimla',              vidhanSabhaSeats: 68,  rajyaSabhaSeats: 3,  lokSabhaSeats: 4,  type: 'state', region: 'North' },
  { name: 'Jharkhand',         capital: 'Ranchi',              vidhanSabhaSeats: 81,  rajyaSabhaSeats: 6,  lokSabhaSeats: 14, type: 'state', region: 'East' },
  { name: 'Karnataka',         capital: 'Bengaluru',           vidhanSabhaSeats: 224, rajyaSabhaSeats: 12, lokSabhaSeats: 28, type: 'state', region: 'South' },
  { name: 'Kerala',            capital: 'Thiruvananthapuram',  vidhanSabhaSeats: 140, rajyaSabhaSeats: 9,  lokSabhaSeats: 20, type: 'state', region: 'South' },
  { name: 'Madhya Pradesh',    capital: 'Bhopal',              vidhanSabhaSeats: 230, rajyaSabhaSeats: 11, lokSabhaSeats: 29, type: 'state', region: 'Central' },
  { name: 'Maharashtra',       capital: 'Mumbai',              vidhanSabhaSeats: 288, rajyaSabhaSeats: 19, lokSabhaSeats: 48, type: 'state', region: 'West' },
  { name: 'Manipur',           capital: 'Imphal',              vidhanSabhaSeats: 60,  rajyaSabhaSeats: 1,  lokSabhaSeats: 2,  type: 'state', region: 'North East' },
  { name: 'Meghalaya',         capital: 'Shillong',            vidhanSabhaSeats: 60,  rajyaSabhaSeats: 1,  lokSabhaSeats: 2,  type: 'state', region: 'North East' },
  { name: 'Mizoram',           capital: 'Aizawl',              vidhanSabhaSeats: 40,  rajyaSabhaSeats: 1,  lokSabhaSeats: 1,  type: 'state', region: 'North East' },
  { name: 'Nagaland',          capital: 'Kohima',              vidhanSabhaSeats: 60,  rajyaSabhaSeats: 1,  lokSabhaSeats: 1,  type: 'state', region: 'North East' },
  { name: 'Odisha',            capital: 'Bhubaneswar',         vidhanSabhaSeats: 147, rajyaSabhaSeats: 10, lokSabhaSeats: 21, type: 'state', region: 'East' },
  { name: 'Punjab',            capital: 'Chandigarh',          vidhanSabhaSeats: 117, rajyaSabhaSeats: 7,  lokSabhaSeats: 13, type: 'state', region: 'North' },
  { name: 'Rajasthan',         capital: 'Jaipur',              vidhanSabhaSeats: 200, rajyaSabhaSeats: 10, lokSabhaSeats: 25, type: 'state', region: 'North' },
  { name: 'Sikkim',            capital: 'Gangtok',             vidhanSabhaSeats: 32,  rajyaSabhaSeats: 1,  lokSabhaSeats: 1,  type: 'state', region: 'North East' },
  { name: 'Tamil Nadu',        capital: 'Chennai',             vidhanSabhaSeats: 234, rajyaSabhaSeats: 18, lokSabhaSeats: 39, type: 'state', region: 'South' },
  { name: 'Telangana',         capital: 'Hyderabad',           vidhanSabhaSeats: 119, rajyaSabhaSeats: 7,  lokSabhaSeats: 17, type: 'state', region: 'South' },
  { name: 'Tripura',           capital: 'Agartala',            vidhanSabhaSeats: 60,  rajyaSabhaSeats: 1,  lokSabhaSeats: 2,  type: 'state', region: 'North East' },
  { name: 'Uttar Pradesh',     capital: 'Lucknow',             vidhanSabhaSeats: 403, rajyaSabhaSeats: 31, lokSabhaSeats: 80, type: 'state', region: 'North' },
  { name: 'Uttarakhand',       capital: 'Dehradun',            vidhanSabhaSeats: 70,  rajyaSabhaSeats: 3,  lokSabhaSeats: 5,  type: 'state', region: 'North' },
  { name: 'West Bengal',       capital: 'Kolkata',             vidhanSabhaSeats: 294, rajyaSabhaSeats: 16, lokSabhaSeats: 42, type: 'state', region: 'East' },
];

/** All 8 Union Territories with electoral data */
const UNION_TERRITORIES = [
  { name: 'Andaman & Nicobar Islands',                   capital: 'Port Blair',     vidhanSabhaSeats: 'No legislature', rajyaSabhaSeats: 0, lokSabhaSeats: 1, type: 'ut', region: 'Island' },
  { name: 'Chandigarh',                                  capital: 'Chandigarh',     vidhanSabhaSeats: 'No legislature', rajyaSabhaSeats: 0, lokSabhaSeats: 1, type: 'ut', region: 'North' },
  { name: 'Dadra & Nagar Haveli and Daman & Diu',        capital: 'Daman',          vidhanSabhaSeats: 'No legislature', rajyaSabhaSeats: 0, lokSabhaSeats: 2, type: 'ut', region: 'West' },
  { name: 'Delhi (NCT)',                                  capital: 'New Delhi',      vidhanSabhaSeats: 70,               rajyaSabhaSeats: 3, lokSabhaSeats: 7, type: 'ut', region: 'North' },
  { name: 'Jammu & Kashmir',                             capital: 'Srinagar/Jammu', vidhanSabhaSeats: 90,               rajyaSabhaSeats: 4, lokSabhaSeats: 6, type: 'ut', region: 'North' },
  { name: 'Ladakh',                                      capital: 'Leh',            vidhanSabhaSeats: 'No legislature', rajyaSabhaSeats: 0, lokSabhaSeats: 1, type: 'ut', region: 'North' },
  { name: 'Lakshadweep',                                 capital: 'Kavaratti',      vidhanSabhaSeats: 'No legislature', rajyaSabhaSeats: 0, lokSabhaSeats: 1, type: 'ut', region: 'Island' },
  { name: 'Puducherry',                                  capital: 'Puducherry',     vidhanSabhaSeats: 30,               rajyaSabhaSeats: 1, lokSabhaSeats: 1, type: 'ut', region: 'South' },
];

/** Detailed Lok Sabha information */
const LOK_SABHA = {
  name: 'Lok Sabha',
  fullName: 'House of the People (Lower House of Parliament)',
  totalSeats: 543,
  term: '5 years',
  currentTerm: '18th Lok Sabha (2024–2029)',
  electedBy: 'Direct election by eligible voters (First-Past-The-Post system)',
  eligibility: 'Indian citizen, 25+ years of age',
  speaker: 'Om Birla (as of 2024)',
  specialSeats: '131 seats reserved (84 SC + 47 ST)',
  quorum: '10% of total membership (55 members)',
  keyFunctions: [
    'Passes Union Budget and Money Bills',
    'Votes of No Confidence against the government',
    'Amends the Constitution (with special majority)',
    'Declares war and ratifies treaties',
    'Elects the President jointly with Rajya Sabha and state legislatures',
  ],
  regions: [
    { region: 'North India',      seats: 225 },
    { region: 'South India',      seats: 130 },
    { region: 'West India',       seats: 84  },
    { region: 'East India',       seats: 72  },
    { region: 'North East India', seats: 25  },
    { region: 'UTs',              seats: 7   },
  ],
};

/** Detailed Rajya Sabha information */
const RAJYA_SABHA = {
  name: 'Rajya Sabha',
  fullName: 'Council of States (Upper House of Parliament)',
  totalSeats: 245,
  electedSeats: 233,
  nominatedSeats: 12,
  term: '6 years (one-third retire every 2 years)',
  currentStrength: 245,
  electedBy: 'Indirect election by elected members of State Legislative Assemblies and UTs',
  eligibility: 'Indian citizen, 30+ years of age',
  chairman: 'Vice President of India (ex officio)',
  deputyChairman: 'Elected by Rajya Sabha members',
  isPermanent: true,
  keyFunctions: [
    'Represents the interests of states and UTs at the national level',
    'Reviews and can amend Bills passed by Lok Sabha',
    'Cannot be dissolved — a permanent house',
    'Nominates 12 members with expertise in art, literature, science, social service',
    'Special powers over State List subjects (Article 249)',
  ],
  stateSeats: [
    { state: 'Uttar Pradesh',  seats: 31 },
    { state: 'Maharashtra',    seats: 19 },
    { state: 'Tamil Nadu',     seats: 18 },
    { state: 'Bihar',          seats: 16 },
    { state: 'West Bengal',    seats: 16 },
    { state: 'Karnataka',      seats: 12 },
    { state: 'Andhra Pradesh', seats: 11 },
    { state: 'Gujarat',        seats: 11 },
    { state: 'Madhya Pradesh', seats: 11 },
    { state: 'Others',         seats: 83 },
  ],
};

/** Presidential election process */
const PRESIDENT = {
  title: 'President of India',
  currentPresident: 'Droupadi Murmu (15th President, since July 2022)',
  term: '5 years',
  eligibility: [
    'Indian citizen',
    '35+ years of age',
    'Qualified to be elected as a member of the Lok Sabha',
    'Must not hold any office of profit under the Government',
  ],
  electedBy: 'Electoral College comprising elected members of both Houses of Parliament AND elected members of all State Legislative Assemblies and Delhi & Puducherry legislatures',
  votingSystem: 'Single Transferable Vote with proportional representation',
  totalVoteValue: 'Each MP vote = sum of all MLA votes / total MPs (ensures balance between Parliament and states)',
  process: [
    { step: 1, title: 'Nomination',          desc: 'Candidate needs 50 proposers and 50 seconders from the Electoral College. Security deposit of ₹15,000.' },
    { step: 2, title: 'Election Commission', desc: 'ECI conducts the election. Voting is by secret ballot using a special pen.' },
    { step: 3, title: 'Preferential Voting', desc: 'Voters mark preferences (1, 2, 3…) against candidates rather than just one choice.' },
    { step: 4, title: 'Vote Counting',       desc: 'Counting uses Single Transferable Vote — if no candidate gets majority, lowest candidate eliminated and votes redistributed.' },
    { step: 5, title: 'Oath & Assumption',   desc: 'Elected President takes oath before the Chief Justice of India in the Central Hall of Parliament.' },
  ],
  powers: [
    'Head of State and Supreme Commander of Armed Forces',
    'Appoints Prime Minister, Governors, Chief Justice, and other judges',
    'Summons, prorogues, and dissolves Parliament',
    'Gives assent to Bills (can return non-Money Bills once)',
    'Declares National Emergency, President\'s Rule, and Financial Emergency',
  ],
  vicePresident: {
    title:     'Vice President of India',
    current:   'Jagdeep Dhankhar (14th Vice President, since August 2022)',
    role:      'Ex-officio Chairman of Rajya Sabha; acts as President when office is vacant',
    electedBy: 'Electoral College of both Houses of Parliament (not state legislatures)',
    term:      '5 years',
  },
};

module.exports = { ELECTION_DATA, STATES, UNION_TERRITORIES, LOK_SABHA, RAJYA_SABHA, PRESIDENT };

// Re-export convenience accessors used by routes
module.exports.CHECKLIST_ITEMS  = ELECTION_DATA.checklistItems;
module.exports.EVM_CANDIDATES   = ELECTION_DATA.evmCandidates;
