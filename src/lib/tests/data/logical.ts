import type { FigureItem, Test } from "@/lib/tests/types";

type Shape = FigureItem["shape"];

/** Shorthand for one shape in a figure. */
const s = (shape: Shape, cell: number, filled = false, rotate?: number): FigureItem => ({ shape, cell, filled, rotate });
/** `n` filled shapes in the first `n` cells. */
const many = (shape: Shape, n: number) => Array.from({ length: n }, (_, i) => s(shape, i, true));

export const logicalTests: Test[] = [
  {
    slug: "logical-shape-sequences",
    category: "logical",
    title: "Logical reasoning: shape sequences",
    description: "Inductive reasoning: spot the rule and find the next figure in the series.",
    timeLimit: 8 * 60,
    instructions: [
      "Each question shows a series of figures that follows one or more rules. Work out the rules and choose the figure that comes next.",
      "Rules can involve movement, rotation, the number of shapes, the type of shape or shading. Some questions combine two rules.",
      "One question asks you to spot the odd one out instead.",
      "Real inductive reasoning tests usually allow about a minute per question.",
    ],
    questions: [
      {
        kind: "figures",
        prompt: "Which figure comes next in the series?",
        sequence: [[s("circle", 0, true)], [s("circle", 1, true)], [s("circle", 2, true)], [s("circle", 5, true)]],
        options: [[s("circle", 4, true)], [s("circle", 6, true)], [s("circle", 8, true)], [s("circle", 3, true)], [s("circle", 7, true)]],
        answer: 2,
        explanation: "The circle moves one square clockwise around the outside of the grid each time, so after the right-middle square it moves to the bottom-right corner.",
      },
      {
        kind: "figures",
        prompt: "Which figure comes next in the series?",
        sequence: [many("square", 1), many("square", 2), many("square", 3), many("square", 4)],
        options: [many("square", 4), many("circle", 5), many("square", 5), many("square", 6), many("triangle", 5)],
        answer: 2,
        explanation: "One square is added each time, so the next figure has five squares.",
      },
      {
        kind: "figures",
        prompt: "Which figure comes next in the series?",
        sequence: [[s("arrow", 4, true, 0)], [s("arrow", 4, true, 45)], [s("arrow", 4, true, 90)], [s("arrow", 4, true, 135)]],
        options: [[s("arrow", 4, true, 90)], [s("arrow", 4, true, 180)], [s("arrow", 4, true, 225)], [s("arrow", 4, true, 0)], [s("arrow", 4, true, 135)]],
        answer: 1,
        explanation: "The arrow turns 45° clockwise each time, so after pointing down-right it points straight down.",
      },
      {
        kind: "figures",
        prompt: "Which figure comes next in the series?",
        sequence: [
          [s("circle", 4, true)],
          [s("square", 4, false)],
          [s("triangle", 4, true)],
          [s("circle", 4, false)],
          [s("square", 4, true)],
        ],
        options: [[s("triangle", 4, true)], [s("circle", 4, true)], [s("square", 4, false)], [s("diamond", 4, false)], [s("triangle", 4, false)]],
        answer: 4,
        explanation: "Two rules: the shapes repeat circle, square, triangle, and the shading alternates filled and empty. Next is an empty triangle.",
      },
      {
        kind: "figures",
        prompt: "Which figure comes next in the series?",
        sequence: [
          [s("circle", 0, true), s("triangle", 8, true)],
          [s("circle", 1, true), s("triangle", 8, false)],
          [s("circle", 2, true), s("triangle", 8, true)],
          [s("circle", 3, true), s("triangle", 8, false)],
        ],
        options: [
          [s("circle", 4, true), s("triangle", 8, false)],
          [s("circle", 4, true), s("triangle", 8, true)],
          [s("circle", 5, true), s("triangle", 8, true)],
          [s("circle", 3, true), s("triangle", 8, true)],
          [s("circle", 4, true)],
        ],
        answer: 1,
        explanation: "The circle moves one square along each time, reading left to right and top to bottom, so it moves to the centre. The triangle stays put and alternates filled and empty, so it is filled next.",
      },
      {
        kind: "figures",
        prompt: "Which figure comes next in the series?",
        sequence: [[s("arrow", 0, true, 90)], [s("arrow", 2, true, 180)], [s("arrow", 8, true, 270)], [s("arrow", 6, true, 0)]],
        options: [[s("arrow", 0, true, 0)], [s("arrow", 2, true, 90)], [s("arrow", 0, true, 270)], [s("arrow", 4, true, 90)], [s("arrow", 0, true, 90)]],
        answer: 4,
        explanation: "The arrow moves clockwise around the corners and always points towards the corner it will move to next. From the bottom-left it returns to the top-left, pointing right.",
      },
      {
        kind: "figures",
        prompt: "Which figure is the odd one out?",
        sequence: [],
        options: [
          [s("circle", 0, true), s("square", 4), s("triangle", 8)],
          [s("diamond", 2), s("circle", 3, true), s("square", 7)],
          [s("triangle", 1, true), s("square", 5, true), s("circle", 6)],
          [s("square", 0), s("diamond", 4), s("triangle", 5, true)],
          [s("circle", 2), s("triangle", 6, true), s("diamond", 8)],
        ],
        answer: 2,
        explanation: "Every figure has three shapes with exactly one filled, except this one, which has two filled.",
      },
      {
        kind: "figures",
        prompt: "Which figure comes next in the series?",
        sequence: [
          [s("square", 0, true), s("circle", 2), s("triangle", 1, true)],
          [s("square", 2, true), s("circle", 0), s("triangle", 4, true)],
          [s("square", 0, true), s("circle", 2), s("triangle", 7, true)],
          [s("square", 2, true), s("circle", 0), s("triangle", 1, true)],
        ],
        options: [
          [s("square", 2, true), s("circle", 0), s("triangle", 4, true)],
          [s("square", 0, true), s("circle", 2), s("triangle", 7, true)],
          [s("square", 0, true), s("circle", 2), s("triangle", 1, true)],
          [s("square", 0, true), s("circle", 2), s("triangle", 4, true)],
          [s("square", 2, true), s("circle", 0), s("triangle", 7, true)],
        ],
        answer: 3,
        explanation: "The square and circle swap corners each time, and the triangle moves down the middle column, going back to the top after the bottom. Next, the square is top-left, the circle top-right and the triangle in the centre.",
      },
    ],
  },
  {
    slug: "logical-deductive",
    category: "logical",
    title: "Logical reasoning: deductive",
    description: "Work out what must be true from a set of statements.",
    timeLimit: 10 * 60,
    instructions: [
      "Each question gives you some statements. Assume they are all true, even if they seem unlikely.",
      "Choose the conclusion that must follow from the statements. A conclusion that could be true, but doesn't have to be, is wrong.",
      "Real deductive reasoning tests usually allow about a minute per question.",
    ],
    questions: [
      {
        kind: "choice",
        prompt: "All the engineers on the team have a degree. Sam is an engineer on the team. Which of these must be true?",
        options: ["Sam has a degree.", "Sam doesn't have a degree.", "Everyone with a degree is an engineer.", "It cannot be determined whether Sam has a degree."],
        answer: 0,
        explanation: "Sam belongs to a group in which everyone has a degree, so Sam must have one. The reverse (everyone with a degree is an engineer) doesn't follow.",
      },
      {
        kind: "choice",
        prompt: "All managers attend the Monday meeting. Jo attends the Monday meeting. Which of these must be true?",
        options: ["Jo is a manager.", "Jo is not a manager.", "It cannot be determined whether Jo is a manager.", "Only managers attend the Monday meeting."],
        answer: 2,
        explanation: "Managers attend the meeting, but nothing says only managers do. Jo could be a manager or not.",
      },
      {
        kind: "choice",
        prompt: "No apprentices work night shifts. Some warehouse staff are apprentices. Which of these must be true?",
        options: [
          "Some warehouse staff don't work night shifts.",
          "No warehouse staff work night shifts.",
          "All warehouse staff are apprentices.",
          "Some apprentices work night shifts.",
        ],
        answer: 0,
        explanation: "The warehouse staff who are apprentices can't work night shifts, so at least some warehouse staff don't. Other warehouse staff might.",
      },
      {
        kind: "choice",
        prompt: "If an order is placed before 2pm, it ships the same day. An order did not ship the same day. Which of these must be true?",
        options: [
          "The order was placed before 2pm.",
          "The order will ship tomorrow.",
          "It cannot be determined when the order was placed.",
          "The order was not placed before 2pm.",
        ],
        answer: 3,
        explanation: "If it had been placed before 2pm it would have shipped the same day. It didn't, so it can't have been placed before 2pm.",
      },
      {
        kind: "choice",
        prompt: "If it rains, the match is cancelled. The match was cancelled. Which of these must be true?",
        options: ["It rained.", "It did not rain.", "It cannot be determined whether it rained.", "The match will be rearranged."],
        answer: 2,
        explanation: "Rain is one reason the match would be cancelled, but it could have been cancelled for another reason. Concluding “it rained” is a classic mistake.",
      },
      {
        kind: "choice",
        prompt:
          "Five colleagues arrive at work one at a time. Esme arrives first. Ali arrives before Ben. Chloe arrives after Ben but before Dev. Who arrives third?",
        options: ["Ali", "Ben", "Chloe", "Dev", "Esme"],
        answer: 1,
        explanation: "Esme is first. Ali, Ben, Chloe and Dev must arrive in that order after her, so the order is Esme, Ali, Ben, Chloe, Dev.",
      },
      {
        kind: "choice",
        prompt:
          "Four meetings, A, B, C and D, start at 9am, 10am, 11am and 12pm, one at each time. C starts at 11am. A starts immediately before B. D does not start at 9am. When does D start?",
        options: ["9am", "10am", "11am", "12pm", "It cannot be determined"],
        answer: 3,
        explanation: "With C at 11am, the only two back-to-back slots left are 9am and 10am, so A is at 9am and B at 10am. That leaves 12pm for D.",
      },
      {
        kind: "choice",
        prompt: "Every project that passes review gets funding. Project X did not get funding. Which of these must be true?",
        options: [
          "Project X did not pass review.",
          "Project X passed review.",
          "Project X will be reviewed again.",
          "It cannot be determined whether Project X passed review.",
        ],
        answer: 0,
        explanation: "If Project X had passed review, it would have been funded. It wasn't, so it can't have passed.",
      },
      {
        kind: "choice",
        prompt: "Some trainees are in the finance team. Everyone in the finance team uses Excel. Which of these must be true?",
        options: [
          "All trainees use Excel.",
          "Everyone who uses Excel is a trainee.",
          "No trainees use Excel.",
          "Some trainees use Excel.",
        ],
        answer: 3,
        explanation: "The trainees in the finance team must use Excel, so at least some trainees do. Nothing is known about the other trainees.",
      },
      {
        kind: "choice",
        prompt: "If Tom works on Saturday, he takes the following Monday off. Tom did not take Monday off. Which of these must be true?",
        options: ["Tom worked on Saturday.", "Tom did not work on Saturday.", "Tom will take Tuesday off instead.", "It cannot be determined whether Tom worked on Saturday."],
        answer: 1,
        explanation: "Working Saturday always leads to Monday off. Tom didn't have Monday off, so he can't have worked on Saturday.",
      },
    ],
  },
];
