// Game-based assessment practice on /tests/games. Employers increasingly use short
// browser games (Arctic Shores is the best known provider) that infer traits from how
// you play. Each task here is an original version of a well-known psychology task
// that those games are built on: same kind of mechanic, our own design and scoring.

export type GameKind = "cognitive" | "behavioural";

export type GameInfo = {
  slug: string;
  title: string;
  description: string;
  /** What assessment providers say this kind of task looks at. */
  measures: string;
  kind: GameKind;
  minutes: number;
  /** Shown before the game starts. */
  instructions: string[];
  tips: string[];
  /** The research task this is modelled on, credited on the results screen. */
  basedOn: string;
  /** Points somewhere else instead of a game of its own. */
  href?: string;
};

export const GAMES: GameInfo[] = [
  {
    slug: "balloon",
    title: "Balloon pump",
    description: "Pump balloons to earn money, and bank it before they burst.",
    measures: "Risk appetite and reward drive",
    kind: "behavioural",
    minutes: 5,
    instructions: [
      "You'll get 30 balloons. Each pump adds 5p to the balloon.",
      "Bank the money whenever you like. If a balloon bursts first, you lose the money on that balloon.",
      "Each balloon bursts at a different, random point.",
      "Keys: Space to pump, Enter to bank.",
    ],
    tips: [
      "There is no single right answer: employers compare your pattern with people who do well in the role.",
      "Play the way you'd naturally approach risk, and stay consistent rather than swinging between extremes.",
      "Notice how you react after a burst. Big swings in strategy are what the task picks up on.",
    ],
    basedOn: "Balloon Analogue Risk Task (Lejuez et al., 2002)",
  },
  {
    slug: "arrows",
    title: "Arrows",
    description: "Say which way the middle arrow points while the others try to distract you.",
    measures: "Focus, attention and processing speed",
    kind: "cognitive",
    minutes: 3,
    instructions: [
      "A row of five arrows appears. Respond to the middle arrow only.",
      "The arrows around it sometimes point the same way and sometimes the opposite way.",
      "Keys: ← or → (or tap the buttons). You get less time as the game goes on.",
      "Pressing before the arrows appear counts against you.",
    ],
    tips: [
      "Fix your eyes on the centre of the screen between rounds.",
      "Accuracy matters as much as speed: don't guess before the arrows appear.",
      "If you make a mistake, let it go and focus on the next one.",
    ],
    basedOn: "Eriksen flanker task (Eriksen & Eriksen, 1974)",
  },
  {
    slug: "sequence",
    title: "Tile sequence",
    description: "Watch tiles light up, then tap them back in the same order. It gets longer each time.",
    measures: "Short-term and working memory",
    kind: "cognitive",
    minutes: 5,
    instructions: [
      "Tiles light up one at a time. When they stop, tap them in the same order.",
      "Get it right and the next sequence is one tile longer.",
      "From 5 tiles, an amber tile may flash too: ignore it, it isn't part of the sequence.",
      "The game ends after two mistakes in a row.",
    ],
    tips: [
      "Chunk long sequences into groups of three or four.",
      "Notice the shape the path makes on the board, not just the individual tiles.",
      "Keep your eyes on the board: the distractor tile is easy to miss.",
    ],
    basedOn: "Corsi block-tapping task (Corsi, 1972)",
  },
  {
    slug: "faces",
    title: "Faces",
    description: "Pick the emotion each face is showing, from seven options.",
    measures: "Emotion recognition and emotional intelligence",
    kind: "cognitive",
    minutes: 3,
    instructions: [
      "A face appears. Choose the emotion it shows from seven options.",
      "Some expressions are subtle, so look at the eyebrows, eyes and mouth together.",
      "You have 3 minutes for 35 faces.",
    ],
    tips: [
      "Eyebrows give a lot away: drawn together and down is anger, raised in the middle is sadness or fear.",
      "Surprise and fear both have wide eyes. Fear usually has a stretched, tense mouth.",
      "Real assessments use photos of people, which are harder than these drawn faces.",
    ],
    basedOn: "Basic emotion recognition tasks (after Ekman's six basic emotions)",
  },
  {
    slug: "lock",
    title: "Code lock",
    description: "Stop the spinning dial on each highlighted number to open the lock.",
    measures: "Reaction time, precision and persistence",
    kind: "cognitive",
    minutes: 5,
    instructions: [
      "A marker spins around a dial of numbers. One number is highlighted.",
      "Press Space (or tap Stop) when the marker is over the highlighted number.",
      "Each code is 4 numbers. A miss resets that code and you start it again.",
      "The speed and direction change from code to code. You can move on at any point.",
    ],
    tips: [
      "Anticipate: start pressing slightly before the marker reaches the number.",
      "Watch a full rotation at each new speed before you commit.",
      "Persistence is part of what's measured, so don't quit at the first reset.",
    ],
    basedOn: "Coincidence-anticipation timing tasks",
  },
  {
    slug: "tickets",
    title: "Tickets",
    description: "Sort numbered tickets with a different rule depending on which box they land in.",
    measures: "Attention, rule switching and processing speed",
    kind: "cognitive",
    minutes: 3,
    instructions: [
      "A ticket with a number appears in the top box or the bottom box.",
      "Top box: is it odd or even? Bottom box: is it lower or higher than 5?",
      "Keys: F for the left answer (odd / lower), J for the right answer (even / higher).",
      "After a while the rule labels disappear, so learn them early.",
    ],
    tips: [
      "Say the rule to yourself as each ticket appears: \"top, odd-even\".",
      "Switching boxes is slower for everyone. Steady rhythm beats rushing.",
      "Rest your fingers on F and J so you never look down.",
    ],
    basedOn: "Task-switching paradigm (Rogers & Monsell, 1995)",
  },
  {
    slug: "energy",
    title: "Power generators",
    description: "Choose which of four generators to run. Some add power, some drain it, and you aren't told which.",
    measures: "Learning from feedback, impulsivity and risk",
    kind: "behavioural",
    minutes: 4,
    instructions: [
      "You start with 200 units of power and get 80 turns.",
      "Each turn, run one of four generators. It adds power, but sometimes it also drains some.",
      "Each generator behaves differently. You'll need to work out which ones are worth running.",
      "Keys: 1–4, or tap a generator.",
    ],
    tips: [
      "Try each generator a few times early on before committing.",
      "Big wins can hide bigger losses: track the overall trend, not the last turn.",
      "Once you've worked it out, stick with it.",
    ],
    basedOn: "Iowa Gambling Task (Bechara et al., 1994)",
  },
  {
    slug: "team-sales",
    title: "Team pricing",
    description: "Set a high or low price each round against another team selling the same product.",
    measures: "Cooperation, fairness and strategic decision-making",
    kind: "behavioural",
    minutes: 3,
    instructions: [
      "You and another team sell the same product. Each round, both teams pick a high or low price.",
      "Both high: £3k profit each. Both low: £1k each.",
      "If one team goes low while the other stays high, the low team takes £5k and the high team gets nothing.",
      "There are 12 rounds. You see what the other team chose after each one.",
    ],
    tips: [
      "Think about the long game: what will the other team do next round after you undercut them?",
      "There's no right answer, but cooperation, retaliation and forgiveness all show up in the results.",
    ],
    basedOn: "Iterated prisoner's dilemma (Axelrod, 1984)",
  },
  {
    slug: "predict",
    title: "Day or night",
    description: "Learn which symbol pairs tend to mean day and which mean night, with feedback each round.",
    measures: "Statistical learning and confidence in decisions",
    kind: "cognitive",
    minutes: 5,
    instructions: [
      "Each round shows a pair of symbols. Decide whether it means day or night.",
      "You have 3 seconds per round. After each one you'll see the right answer.",
      "Pairs repeat, but they aren't 100% reliable: a pair that usually means day sometimes means night.",
      "Keys: D for day, N for night.",
    ],
    tips: [
      "Guess early on: you learn from the feedback, not from waiting.",
      "Go with the answer a pair gives most often, even after it surprises you.",
      "Only 8 pairs repeat across 88 rounds, so you'll get faster.",
    ],
    basedOn: "Weather prediction task (Knowlton, Squire & Gluck, 1994)",
  },
  {
    slug: "order",
    title: "Order",
    description: "Work out the rule in three frames and build the fourth yourself.",
    measures: "Inductive reasoning and attention to detail",
    kind: "cognitive",
    minutes: 12,
    instructions: [
      "Three frames show marks changing by a rule. Build the fourth frame in the empty grid.",
      "Tap a cell to cycle it: empty, outline, filled.",
      "There are 12 puzzles with about a minute each.",
    ],
    tips: [
      "Track one mark at a time: where does it move each step?",
      "Check fill as well as position: marks often alternate between outline and filled.",
      "Count the marks in each frame. Some puzzles add one every step.",
    ],
    basedOn: "Inductive (abstract) reasoning series",
  },
  {
    slug: "patterns",
    title: "Patterns",
    description: "Pick the frame that comes next in a series of four.",
    measures: "Pattern recognition and logical reasoning",
    kind: "cognitive",
    minutes: 12,
    instructions: [
      "Four frames follow a rule. Choose which of four options comes next.",
      "Rules can change position, rotation, fill or the number of shapes.",
      "There are 15 questions in 12 minutes.",
    ],
    tips: [
      "Look for more than one rule at once: one shape might move while another rotates.",
      "Eliminate options that break any rule you've spotted.",
    ],
    basedOn: "Inductive (abstract) reasoning series",
  },
  {
    slug: "balance",
    title: "Balance",
    description: "Use balanced scales to work out hidden weights, then balance the last scale.",
    measures: "Numerical and deductive reasoning",
    kind: "cognitive",
    minutes: 10,
    instructions: [
      "Each shape has a hidden weight. The clue scales show combinations that balance.",
      "Work out how many squares balance the shapes on the final scale.",
      "Questions get harder when you're right and easier when you're wrong. There are 10.",
    ],
    tips: [
      "Express every shape in squares first, then add them up.",
      "Use simple clues to unlock harder ones: if a circle is 2 squares, a clue with a circle becomes easy.",
    ],
    basedOn: "Balance-scale reasoning problems",
  },
  {
    slug: "analysis",
    title: "Analysis",
    description: "Answer questions from tables and charts. Uses our numerical reasoning tests.",
    measures: "Numerical reasoning and information processing",
    kind: "cognitive",
    minutes: 18,
    instructions: [],
    tips: [],
    basedOn: "Numerical reasoning tests",
    href: "/tests/numerical-business-data",
  },
];

/** The run order for the full assessment: up to nine tasks, as providers configure it. */
export const FULL_RUN = ["balloon", "arrows", "sequence", "faces", "lock", "tickets", "energy", "team-sales", "order"];

export const PLAYABLE = GAMES.filter((g) => !g.href);

/** Best scores share the practice-test store, namespaced so slugs can't collide. */
export const progressKey = (slug: string) => `game:${slug}`;

export const getGame = (slug: string) => PLAYABLE.find((g) => g.slug === slug) ?? null;

/** What every game hands back when it ends. */
export type GameResult = {
  /** One line for the summary, e.g. "Span of 7" or "92% accurate". */
  headline: string;
  /** 0–100, only for tasks with right answers. Saved as a best score. */
  score?: number;
  metrics: { label: string; value: string }[];
  /** Plain-English reading of how they played. */
  insight: string;
};
