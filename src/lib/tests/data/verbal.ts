import type { Question, Test } from "@/lib/tests/types";

const INSTRUCTIONS = [
  "Read each passage, then decide whether each statement is True, False or Cannot say.",
  "True: the statement follows from the passage. False: the passage contradicts it. Cannot say: the passage doesn't give enough information either way.",
  "Use only the information in the passage, not your own knowledge, even if you know more about the topic.",
  "Real verbal reasoning tests usually allow 30 to 60 seconds per statement.",
];

const TFC = ["True", "False", "Cannot say"];
const [TRUE, FALSE, CANNOT_SAY] = [0, 1, 2];

/** A True / False / Cannot say statement about a passage. */
const tfc = (stimulus: string, prompt: string, answer: number, explanation: string): Question => ({
  kind: "choice",
  stimulus,
  prompt,
  options: TFC,
  answer,
  explanation,
});

export const verbalTests: Test[] = [
  {
    slug: "verbal-true-false-cannot-say",
    category: "verbal",
    title: "Verbal reasoning: true, false or cannot say",
    description: "Three short passages on work, nature and transport, with four statements each.",
    timeLimit: 9 * 60,
    instructions: INSTRUCTIONS,
    stimuli: {
      hybrid: {
        kind: "passage",
        title: "Hybrid working",
        text: "Since 2020, the proportion of office-based staff working at least partly from home has risen sharply. Many organisations now run hybrid arrangements, in which employees split their week between home and the workplace. Supporters argue that hybrid working reduces commuting costs and gives staff more control over their time, which can improve wellbeing. Critics point out that junior employees may miss out on informal learning, such as overhearing how experienced colleagues handle difficult calls. Some companies have responded by asking new starters to spend more days in the office than established staff. Research on productivity remains mixed: some studies find small gains from hybrid working, while others find no measurable difference.",
      },
      bees: {
        kind: "passage",
        title: "Urban beekeeping",
        text: "Interest in urban beekeeping has grown in many UK cities, with hives appearing on rooftops, allotments and even office buildings. While honeybees are the species most people picture, they are only one of more than 250 bee species found in Britain. Some ecologists warn that adding large numbers of honeybee hives to cities could increase competition for flowers, potentially disadvantaging wild bees. They argue that planting more wildflowers and leaving areas of grass uncut would do more to support pollinators overall. Beekeeping associations generally recommend that new beekeepers complete a training course before keeping their first colony.",
      },
      charging: {
        kind: "passage",
        title: "Charging electric vehicles",
        text: "The number of public charging points for electric vehicles in the UK has increased rapidly in recent years, but they are unevenly spread. Drivers in London and the South East generally have far more chargers nearby than those in rural areas. Rapid chargers, which can add a large amount of range in under an hour, are more expensive to install than standard chargers and are mostly located along major roads. Many electric vehicle owners do most of their charging at home overnight, which is usually cheaper than using public chargers. However, a significant share of households have no off-street parking, which makes charging at home difficult for them.",
      },
    },
    questions: [
      tfc("hybrid", "Hybrid working means employees work entirely from home.", FALSE,
        "The passage defines hybrid working as splitting the week between home and the workplace, which contradicts working entirely from home."),
      tfc("hybrid", "Some companies ask new starters to be in the office more often than established staff.", TRUE,
        "The passage says some companies ask new starters to spend more days in the office than established staff."),
      tfc("hybrid", "Research consistently shows that hybrid working improves productivity.", FALSE,
        "The passage says research is mixed, with some studies finding no measurable difference, so it does not consistently show an improvement."),
      tfc("hybrid", "Hybrid working was first introduced in 2020.", CANNOT_SAY,
        "The passage says home working has risen since 2020, but doesn't say when hybrid working was first introduced."),
      tfc("bees", "Honeybees are the only bee species found in Britain.", FALSE,
        "The passage says honeybees are one of more than 250 bee species found in Britain."),
      tfc("bees", "Some ecologists think planting wildflowers would help pollinators more than adding hives.", TRUE,
        "The ecologists argue that planting wildflowers and leaving grass uncut would do more to support pollinators overall."),
      tfc("bees", "New beekeepers are legally required to complete a training course.", CANNOT_SAY,
        "The passage only says beekeeping associations recommend a course. It says nothing about whether the law requires one."),
      tfc("bees", "Beehives can be found on some office buildings.", TRUE,
        "The passage lists office buildings among the places where hives have appeared."),
      tfc("charging", "Rapid chargers cost more to install than standard chargers.", TRUE,
        "The passage states that rapid chargers are more expensive to install than standard chargers."),
      tfc("charging", "Charging at home is usually more expensive than using public chargers.", FALSE,
        "The passage says charging at home overnight is usually cheaper than using public chargers."),
      tfc("charging", "Most rapid chargers in the UK are in London.", CANNOT_SAY,
        "The passage says rapid chargers are mostly along major roads, and that London has more chargers overall, but not where most rapid chargers are."),
      tfc("charging", "Some households find charging at home difficult because they have no off-street parking.", TRUE,
        "The passage says households without off-street parking find charging at home difficult."),
    ],
  },
  {
    slug: "verbal-reading-comprehension",
    category: "verbal",
    title: "Verbal reasoning: mixed formats",
    description: "True, false or cannot say statements, plus multiple-choice comprehension questions.",
    timeLimit: 9 * 60,
    instructions: [
      ...INSTRUCTIONS.slice(0, 3),
      "The last passage has multiple-choice questions instead: choose the answer the passage best supports.",
      "Real verbal reasoning tests usually allow 30 to 60 seconds per question.",
    ],
    stimuli: {
      fourDay: {
        kind: "passage",
        title: "The four-day week",
        text: "In several countries, organisations have trialled a four-day working week, in which staff work fewer hours for the same pay. In one large trial, most participating companies chose to continue with the arrangement after the trial ended. Employees taking part reported lower stress and better sleep. However, the companies volunteered to take part, so they may have been better suited to shorter weeks than typical employers. Some sectors, such as healthcare, face particular challenges, because services must be available every day and staff shortages are already common.",
      },
      recycling: {
        kind: "passage",
        title: "Recycling plastic",
        text: "Not all plastic collected for recycling is actually recycled. Some items are rejected because they are contaminated with food, while others are made from types of plastic that local facilities cannot process. Black plastic trays have historically been difficult to recycle, because sorting machines that use light to identify materials struggle to detect them. Some councils now accept a wider range of plastics than they did a decade ago. Reducing the amount of plastic used in the first place is generally considered more effective than recycling.",
      },
      feedback: {
        kind: "passage",
        title: "Feedback at work",
        text: "Feedback is most useful when it is specific, timely and focused on behaviour rather than personality. Telling someone that their presentation “wasn’t great” gives them little to act on, whereas pointing out that the key figures were hard to read from the back of the room suggests a clear improvement. Feedback given weeks after an event is often less effective, because the details are no longer fresh. Many organisations now encourage managers to hold short, regular check-ins instead of relying only on an annual review. Receiving feedback well is also a skill: people who ask clarifying questions and avoid becoming defensive tend to improve faster.",
      },
    },
    questions: [
      tfc("fourDay", "Staff in the four-day week trials were paid less.", FALSE,
        "The passage says staff worked fewer hours for the same pay."),
      tfc("fourDay", "Most companies in the large trial kept the four-day week after it ended.", TRUE,
        "The passage says most participating companies chose to continue with the arrangement."),
      tfc("fourDay", "The trial results may not apply equally to all employers.", TRUE,
        "The passage notes that the companies volunteered and may have been better suited to shorter weeks than typical employers."),
      tfc("fourDay", "Healthcare organisations took part in the large trial.", CANNOT_SAY,
        "The passage mentions healthcare's challenges, but doesn't say whether any healthcare organisations took part."),
      tfc("recycling", "All plastic collected for recycling is recycled.", FALSE,
        "The passage opens by saying not all collected plastic is actually recycled."),
      tfc("recycling", "Food contamination can cause plastic to be rejected for recycling.", TRUE,
        "The passage says some items are rejected because they are contaminated with food."),
      tfc("recycling", "Every council now recycles black plastic trays.", CANNOT_SAY,
        "The passage says black trays have historically been difficult to recycle and that some councils accept more plastics, but not whether every council now recycles black trays."),
      tfc("recycling", "Sorting machines can have difficulty identifying black plastic.", TRUE,
        "The passage says machines that use light to identify materials struggle to detect black trays."),
      {
        kind: "choice",
        stimulus: "feedback",
        prompt: "What is the main point of the passage?",
        options: [
          "Annual reviews should be abolished.",
          "Feedback works best when it is specific and timely, and receiving it well matters too.",
          "Presentations are the most common reason people receive feedback.",
          "Managers should avoid giving negative feedback.",
        ],
        answer: 1,
        explanation:
          "The passage covers what makes feedback useful (specific, timely, about behaviour) and the skill of receiving it. It doesn't say annual reviews should be abolished, only that check-ins are encouraged alongside them.",
      },
      {
        kind: "choice",
        stimulus: "feedback",
        prompt: "According to the passage, why is feedback given weeks later often less effective?",
        options: [
          "Managers are usually too busy by then.",
          "It tends to be more negative.",
          "The details are no longer fresh.",
          "The employee has often moved role.",
        ],
        answer: 2,
        explanation: "The passage says late feedback is less effective because the details are no longer fresh.",
      },
      {
        kind: "choice",
        stimulus: "feedback",
        prompt: "Which of these is the best example of feedback as the passage describes it?",
        options: [
          "“Your report needs work.”",
          "“You’re just not a detail person.”",
          "“The summary didn’t mention the budget, so the client asked about it twice.”",
          "“Good job overall.”",
        ],
        answer: 2,
        explanation:
          "It's specific and about behaviour, and suggests a clear improvement. “Not a detail person” is about personality, and the others are too vague to act on.",
      },
    ],
  },
];
