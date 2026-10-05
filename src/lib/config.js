// Static configuration: roleplay options, provider presets, defaults and pricing.

export const roles = {
  classmate: { label: 'Classmate', hint: 'Friendly peer from your class' },
  teacher: { label: 'Teacher', hint: 'Patient, explains and corrects' },
  friend: { label: 'Friend', hint: 'Very casual, everyday slang' },
  roommate: { label: 'Roommate', hint: 'Everyday life at home' },
  colleague: { label: 'Colleague', hint: 'Work talk, meetings, deadlines' },
  interviewer: { label: 'Interviewer', hint: 'Professional Q&A practice' },
  doctor: { label: 'Doctor', hint: 'Describe symptoms, get advice' },
  waiter: { label: 'Waiter', hint: 'Order food, ask about the menu' }
};

export const scenes = {
  daily: { label: 'Daily chat', hint: 'Small talk about your day' },
  topic: { label: 'Find a topic', hint: 'Let me suggest something to discuss' },
  group: { label: 'Group project', hint: 'Practise teamwork language' },
  discuss: { label: 'Discuss a question', hint: 'Exchange opinions on a question' }
};

// Situation library, one set per role. Feeds the topic suggestions and the shuffle button,
// so a beginner never has to invent a scenario from nothing.
export const roleTopics = {
  classmate: [
    'Grabbing lunch between classes',
    'Walking to class together',
    'A classmate asks you to explain something you just learned',
    'Planning a group presentation',
    'Complaining about the workload',
    'Catching up after the holidays',
    'Borrowing the notes you missed',
    'Studying together for a test',
    'Choosing optional courses for next term',
    'Finding a seat in a crowded lecture hall',
    'Surviving an all-nighter before a deadline',
    'Talking about a strict professor',
    'Starting a study group',
    'Returning a book you borrowed',
    'Deciding what to eat at the canteen',
    'Chatting before the lecture starts',
    'Comparing marks after an exam',
    'Joining a club together',
    'Missing the school bus',
    'Group members who did not do their part',
    'Planning a class trip',
    'Asking to swap seats',
    'A presentation that went badly',
    'Something funny that happened in class',
    'Preparing for an oral exam',
    'Whether to take a summer course',
    'A documentary the teacher showed',
    'A part-time job you just started',
    'Asking for help with a maths problem',
    'Talking about the sports day',
    'Borrowing a phone charger',
    'What to wear to the school party',
    'A new laptop you want to buy',
    'Asking about a course you might take',
    'Complaining about the canteen food',
    'Notes from a lecture you both missed',
    'Moving into a new flat',
    'Which elective is actually worth it',
    'Choosing a topic for a term paper',
    'A student club you want to join',
    'Asking what you missed yesterday',
    'Catching a film after class',
    'An exchange programme you applied for',
    'Whether to study abroad',
    'The graduation ceremony',
    'A teacher you would recommend',
    'A competition you entered',
    'Making a study timetable',
    'Planning a birthday for a classmate',
    'Forming a team for a project'
  ],
  teacher: [
    'Asking a question after class',
    'Presenting your progress at a weekly group meeting',
    'Explaining why your homework is late',
    'Asking for feedback on an essay',
    'Which course to take next term',
    'A mock interview for a school programme',
    'Asking for an extension on a deadline',
    'Discussing your mark on an exam',
    'Asking for a letter of recommendation',
    'Clarifying a topic from the last lecture',
    'A paper you want to write',
    'How to improve your writing',
    'Discussing the direction of your thesis',
    'Preparing for a supervision meeting',
    'Asking about research opportunities',
    'A concept you find confusing',
    'Your progress this term',
    'Whether you can redo an assignment',
    'A problem with your group',
    'Choosing a dissertation topic',
    'The areas you are weakest in',
    'Advice about postgraduate study',
    'Feedback you did not understand',
    'Asking to join a research project',
    'A misunderstanding about the rules',
    'How the marking criteria work',
    'A presentation you have to give',
    'Extra reading suggestions',
    'Telling the teacher you missed a class',
    'Asking for a reference for a job',
    'How to prepare for the final exam',
    'A summer programme you are considering',
    'Presenting an idea for a project',
    'Asking to record the lecture',
    'An internship opportunity',
    'How to cite sources properly',
    'Taking a placement year',
    'Feedback on a draft chapter',
    'A topic you cannot get your head around',
    'The format of the exam',
    'Your study plan for the term',
    'Help with time management',
    'A conflict inside your group',
    'Asking about scholarships',
    'Your academic interests',
    'How the coursework is graded',
    'A paper you found interesting',
    'Asking for a mock viva',
    'Your plans after graduation',
    'How to improve your speaking'
  ],
  friend: [
    'Weekend plans',
    'Recommending a film or a series',
    'A trip you want to take together',
    'Sharing some good news',
    'A friend needs advice about a problem',
    'Late-night small talk',
    'Making plans for a birthday',
    'A song you cannot get out of your head',
    'Complaining about a bad day',
    'Deciding where to eat tonight',
    'A new hobby you started',
    'Catching up after a long time',
    'A funny story from this week',
    'A party you went to last weekend',
    'Advice about a relationship',
    'A book you just finished',
    'Planning a surprise for a friend',
    'Your fitness goals',
    'Whether to adopt a pet',
    'A concert you want to go to',
    'A photo from your holiday',
    'Your favourite food',
    'A series you are both watching',
    'Plans for the summer',
    'A friend who moved away',
    'Calming someone down before an interview',
    'A game you have been playing',
    'What to do on a rainy day',
    'What growing up was like',
    'A childhood memory',
    'A language you want to learn',
    'Whether to move to a new city',
    'Your dream job',
    'A recipe you tried',
    'A fear you want to overcome',
    'A film you disagree about',
    'A weekend hike',
    'Trying to save money',
    'A wedding you went to',
    'What happened at work today',
    'A podcast you like',
    'Choosing a gift for someone',
    'A breakup you are getting over',
    'Whether to cut your hair',
    'A hobby you want to start',
    'A song recommendation',
    'The area you live in',
    'A karaoke night',
    'A mistake you learned from',
    'Plans for the new year'
  ],
  roommate: [
    'Splitting the chores',
    'Something in the flat is broken',
    'Cooking dinner together',
    'A guest is coming over',
    'Sharing the bills',
    'Noise and different sleep schedules',
    'Who cleans the bathroom',
    'Buying furniture together',
    'The wifi keeps dropping',
    'Setting rules about the kitchen',
    'One of you is messy',
    'A roommate who never does the dishes',
    'How to heat the flat in winter',
    'Shopping for groceries together',
    'Borrowing clothes without asking',
    'The landlord will not fix anything',
    'Where to put the new shelf',
    'Moving in together for the first time',
    'Splitting the cost of a new kettle',
    'One of you wants to get a pet',
    'The temperature of the room',
    'Getting the deposit back',
    'A late-night chat in the kitchen',
    'Whose turn it is to take out the rubbish',
    'A dinner party for friends',
    'One of you is moving out',
    'How to decorate the living room',
    'A noisy neighbour',
    'A laundry schedule',
    'Someone keeps eating your food',
    'Splitting the rent when a room is empty',
    'Signing a new lease',
    'Setting up the internet contract',
    'A broken washing machine',
    'Who talks to the landlord',
    'Redecorating the flat together',
    'One of you is sick and needs help',
    'A housemate who is never home',
    'Splitting the cost of cleaning supplies',
    'Agreeing on quiet hours',
    'Space in the shared fridge',
    'One of you wants to host a party',
    'What to do with the shared boxes',
    'Moving to a bigger place',
    'A misunderstanding about the bills',
    'A broken window',
    'A flat cleaning day',
    'Sharing a streaming account',
    'A new flatmate joining',
    'Saying goodbye at the end of the year'
  ],
  colleague: [
    'Your update at the daily stand-up',
    'Asking a colleague for help with a task',
    'Explaining a delay to your team',
    'A one-to-one about your goals',
    'Pitching an idea in a meeting',
    'Small talk in the kitchen at work',
    'Asking for feedback on your work',
    'A deadline that is too tight',
    'Handing over a project before a holiday',
    'Asking to work from home',
    'A difficult client',
    'Explaining a mistake you made',
    'Asking for a raise',
    'Talking about your career path',
    'The best approach to a problem',
    'A new tool the team should use',
    'Asking a colleague to review your work',
    'Planning a team lunch',
    'A meeting that ran too long',
    'Asking to move a meeting',
    'Who owns which task',
    'A colleague who just left',
    'Asking for a day off',
    'A change in requirements',
    'The targets for this quarter',
    'Asking for more resources',
    'A bug that blocked the release',
    'Your first week at a new job',
    'Asking a colleague about their role',
    'A training course you want to take',
    'How to split the workload',
    'An update on a project risk',
    'Asking for a mentor',
    'Your performance review',
    'A disagreement with a manager',
    'Asking to join a new project',
    'Onboarding a new teammate',
    'Explaining a technical decision',
    'A budget cut',
    'The direction the company is heading',
    'A conference you attended',
    'Whether to take on extra work',
    'Swapping a shift with someone',
    'How to run a retrospective',
    'Help with prioritising tasks',
    'A remote meeting that went wrong',
    'A possible promotion',
    'The holiday policy',
    'A difficult deadline you met',
    'Saying goodbye to a colleague'
  ],
  interviewer: [
    'Tell me about yourself',
    'Why do you want this role?',
    'Describe a challenge you solved',
    'Your strengths and weaknesses',
    'Where do you see yourself in five years?',
    'Do you have any questions for us?',
    'Walk me through your CV',
    'Why are you leaving your current job?',
    'A time you worked in a team',
    'A project you are proud of',
    'How you handle pressure',
    'A time you failed',
    'What makes you a good fit for this team?',
    'How you prioritise your work',
    'A time you disagreed with your manager',
    'Your salary expectations',
    'Your ideal work environment',
    'How you keep learning',
    'A time you led a group',
    'How you would handle a difficult customer',
    'What you know about our company',
    'A time you improved a process',
    'How you deal with criticism',
    'A time you missed a deadline',
    'Your biggest achievement',
    'Working with people who disagree with you',
    'A time you had to learn something quickly',
    'Why we should hire you',
    'How you stay organised',
    'A time you took a risk',
    'What motivates you',
    'A time you helped a colleague',
    'How you handle ambiguity',
    'A time you changed your mind',
    'What your colleagues would say about you',
    'How you handle negative feedback',
    'A time you showed initiative',
    'What you want from your next role',
    'A time you had to say no',
    'How you manage your time under pressure',
    'A time you solved a problem creatively',
    'What you do outside work',
    'A time you worked with a difficult person',
    'Explaining a technical idea to a non-expert',
    'A skill you are working on',
    'A time you had to adapt quickly',
    'How you decide what to work on first',
    'Where you want to grow next year',
    'A mistake and what you learned',
    'Anything else we should know'
  ],
  doctor: [
    'A sore throat and a fever',
    'A bad stomach ache',
    'Trouble sleeping recently',
    'A sports injury',
    'Asking about a prescription',
    'Booking a follow-up appointment',
    'A headache that will not go away',
    'A cough that has lasted two weeks',
    'An allergic reaction',
    'A rash on your arm',
    'Back pain from sitting all day',
    'Asking about a blood test result',
    'Feeling dizzy in the morning',
    'A sprained ankle',
    'How to take your medicine',
    'A cold that never seems to end',
    'Pain in your chest',
    'Asking about a vaccination',
    'A toothache',
    'Trouble with your eyesight',
    'Whether to change your diet',
    'A child with a temperature',
    'Vaccines before travelling',
    'Numbness in your hands',
    'Feeling tired all the time',
    'Asking for a referral to a specialist',
    'A burn on your hand',
    'Whether you can exercise with a cold',
    'Migraines that keep coming back',
    'Asking about side effects',
    'A wound that will not heal',
    'Asking for a sick note',
    'Shortness of breath',
    'Asking about contraception',
    'A hearing problem',
    'Asking about mental health support',
    'A food intolerance',
    'How long recovery will take',
    'A pain in your knee',
    'Asking about a scan',
    'Trouble swallowing',
    'Whether you need antibiotics',
    'A skin infection',
    'Booking an annual check-up',
    'A fever that comes and goes',
    'Asking about physiotherapy',
    'Losing weight without trying',
    'Living with a long-term condition',
    'A cut that might need stitches',
    'When you can go back to work'
  ],
  waiter: [
    'Ordering a main course and a drink',
    'Asking what a dish contains',
    'A dish arrived wrong',
    'Asking for the bill and splitting it',
    'Booking a table for four',
    'Asking for a recommendation',
    'Whether a dish is spicy',
    'Ordering a starter and a dessert',
    'Asking for a vegetarian option',
    'The special of the day',
    'A table by the window',
    'Asking for more water',
    'Whether the fish is fresh',
    'Ordering a bottle of wine',
    'Changing your order',
    'Gluten-free options',
    'How long the wait is',
    'The food arrived cold',
    'The wifi password',
    'Ordering breakfast',
    'Asking for a doggy bag',
    'Asking about allergens',
    'A menu for children',
    'Asking for a high chair',
    'Coffee and dessert',
    'Moving to another table',
    'The soup of the day',
    'Paying by card',
    'Asking for a receipt',
    'Whether service is included',
    'A steak and how it is cooked',
    'A takeaway box',
    'Booking a table for a birthday',
    'A jug of tap water',
    'How big the portions are',
    'Asking for the dessert menu',
    'Cancelling a dish',
    'The fastest dish on the menu',
    'A local speciality',
    'Asking for no onions',
    'Whether the kitchen is still open',
    'A quieter table',
    'Splitting the bill three ways',
    'A refund for a wrong dish',
    'The set menu',
    'What the chef recommends',
    'Asking for extra bread',
    'Bringing your own cake',
    'Correcting something on the bill',
    'Thanking the waiter and leaving a tip'
  ]
};

export const topicsFor = role => roleTopics[role] || roleTopics.classmate;

// Fisher-Yates sample: hand back `count` distinct situations at random. `exclude` keeps a
// fresh roll from repeating everything already on screen, so the button always feels alive.
export const sampleTopics = (role, count = 6, exclude = []) => {
  const all = topicsFor(role);
  const pool = all.filter(topic => !exclude.includes(topic));
  const source = (pool.length >= count ? pool : all).slice();
  for (let i = source.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [source[i], source[j]] = [source[j], source[i]];
  }
  return source.slice(0, Math.min(count, source.length));
};

export const tones = {
  casual: { label: 'Casual' },
  balanced: { label: 'Balanced' },
  formal: { label: 'Formal' }
};

export const lengths = {
  short: { label: 'Short' },
  medium: { label: 'Medium' },
  long: { label: 'Detailed' }
};

export const reasoning = {
  no: { label: 'Off' },
  low: { label: 'Low' },
  high: { label: 'High' },
  max: { label: 'Max' }
};

export const profileDefaults = { role: 'classmate', scene: 'daily', topic: '', tone: 'casual', length: 'short' };

// How strict the correction pass is. Only real grammar issues count in `relaxed`.
// `off` skips the review entirely: no JSON mode, no correction block, fewest tokens.
export const strictness = {
  off: { label: 'Off', hint: 'No correction pass at all — replies only, so you spend the fewest tokens.' },
  relaxed: { label: 'Relaxed', hint: 'Clear grammar mistakes only (missing plural, agreement, tense).' },
  standard: { label: 'Standard', hint: 'Also tense, articles and plural forms.' },
  strict: { label: 'Strict', hint: 'Also word choice and natural phrasing.' }
};

export const correctionsEnabled = settings =>
  settings?.corrections !== false && (settings?.correctionStrictness || 'relaxed') !== 'off';

export const settingsDefaults = {
  // Model & API
  endpoint: 'https://api.deepseek.com',
  model: 'deepseek-chat',
  key: '',
  temperature: 0.7,
  // Reasoning
  reasoning: 'low',
  // Persona (defaults used when creating a conversation)
  personaName: 'Alex',
  defaultRole: 'classmate',
  defaultScene: 'daily',
  defaultTone: 'casual',
  defaultLength: 'short',
  // General
  currency: 'CNY',
  enterToSend: true,
  sidebarCollapsed: false,
  corrections: true,
  correctionStrictness: 'relaxed'
};

export const accountDefaults = { name: 'user', avatar: '' };

/* ---------- word bank ---------- */

export const MASTERY_GOAL = 10; // ten natural uses retire a word from the focus pool
export const FOCUS_LIMIT = 5; // words offered to the model each turn
export const focusWeight = word => Math.max(1, MASTERY_GOAL - (word.count || 0));
export const isLearned = word => (word.count || 0) >= MASTERY_GOAL;

export const usageDefaults = { input: 0, output: 0, cacheHit: 0, requests: 0, cost: 0, history: {} };

/* ---------- pricing ---------- */

// Off-peak prices in CNY per 1M tokens; peak hours double every line item.
export const RATE_INPUT = 1;
export const RATE_OUTPUT = 2;
export const RATE_CACHE_HIT = 0.02;

export const PEAK_WINDOWS = [[9, 12], [14, 18]]; // Asia/Shanghai
export const PEAK_MULTIPLIER = 2;
export const PER_MILLION = 1_000_000;

export const costOf = (usage = {}, multiplier = 1) =>
  (((usage.input || 0) * RATE_INPUT + (usage.output || 0) * RATE_OUTPUT + (usage.cacheHit || 0) * RATE_CACHE_HIT) / PER_MILLION) * multiplier;

export const currencies = {
  CNY: { symbol: '¥', factor: 1, label: 'CNY ¥' },
  USD: { symbol: '$', factor: 1 / 7.24, label: 'USD $' }
};

const currencyOf = code => currencies[code] || currencies.CNY;

export const symbolOf = code => currencyOf(code).symbol;

// All stored costs are CNY; `factor` converts to the display currency.
export const money = (cny, code = 'CNY') => {
  const c = currencyOf(code);
  return `${c.symbol}${(cny * c.factor).toFixed(4)}`;
};

export const rateLabel = (perMillionCny, code = 'CNY') => {
  const c = currencyOf(code);
  return `${c.symbol}${(perMillionCny * c.factor).toFixed(2)} / M`;
};
