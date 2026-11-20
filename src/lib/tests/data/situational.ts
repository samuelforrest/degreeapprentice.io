import type { Test } from "@/lib/tests/types";

const INSTRUCTIONS = [
  "Each question describes a situation you could face as a degree apprentice, followed by possible responses.",
  "Some questions ask you to choose the most and least effective response. Others ask you to rate every response from Counterproductive to Effective.",
  "There are no trick questions: answer as you genuinely think you should act at work, not as you would like to be seen.",
  "You have 9 minutes, about a minute and a half per scenario. Go with your judgement rather than overthinking each one.",
];

export const situationalTests: Test[] = [
  {
    slug: "sjt-teamwork",
    category: "situational",
    title: "Working in a team",
    description: "Missed deadlines, credit-taking, disagreements and helping new starters.",
    timeLimit: 9 * 60,
    instructions: INSTRUCTIONS,
    questions: [
      {
        kind: "most-least",
        scenario:
          "You are one of four apprentices writing a report for a client, due on Friday. Priya has missed two internal deadlines for her section, and the rest of the team is getting frustrated.",
        responses: [
          "Quietly finish Priya's section yourself so the report is done on time.",
          "Speak to Priya privately, ask how her section is going and whether anything is getting in the way, then agree how the team can help.",
          "Post in the team group chat that Priya's missed deadlines are holding everyone up.",
          "Email your manager straight away to report that Priya is behind.",
        ],
        most: 1,
        least: 2,
        explanation:
          "Talking to Priya first finds out the cause (she may be overloaded or stuck) and keeps the relationship intact, while still protecting the deadline. Calling her out in the group chat embarrasses her publicly and damages trust in the team without fixing anything. Escalating straight to your manager skips a reasonable first step, and silently doing her work hides the problem and isn't sustainable.",
      },
      {
        kind: "rate",
        scenario:
          "In a team meeting, you notice that a figure on one of the slides is wrong. A senior colleague is presenting the slides to a client tomorrow.",
        responses: [
          {
            text: "Speak to the colleague privately after the meeting, showing where the figure comes from and what you think it should be.",
            rating: 4,
            why: "Gets the error fixed before the client sees it, gives the evidence and avoids embarrassing anyone.",
          },
          {
            text: "Say nothing: they are senior and have probably checked it already.",
            rating: 1,
            why: "Lets a known error reach a client. Seniority doesn't make anyone immune to mistakes.",
          },
          {
            text: "Raise it politely in the meeting as a question, such as “Should that figure be 12%?”",
            rating: 3,
            why: "Gets it corrected and the question framing is tactful, but a private word would avoid putting them on the spot.",
          },
          {
            text: "Mention it to another apprentice and let them decide whether to say anything.",
            rating: 2,
            why: "Passes responsibility on and makes it less likely the error is fixed in time.",
          },
        ],
      },
      {
        kind: "most-least",
        scenario:
          "A colleague in your team has several times presented ideas you suggested in team discussions as their own.",
        responses: [
          "Start sharing your ideas in writing, such as in the team's shared document, before meetings.",
          "Calmly speak to the colleague, explain how it has affected you and ask to be credited in future.",
          "Stop sharing ideas in team discussions so they can't be taken.",
          "Tell your manager that the colleague is being dishonest.",
        ],
        most: 1,
        least: 2,
        explanation:
          "Raising it directly and calmly gives the colleague a chance to change, and is often enough to fix the problem. Sharing ideas in writing also helps, but avoids the conversation. Withholding ideas is least effective: it hurts the team's work and your own development. Going to your manager first, and labelling the colleague dishonest, escalates before you've tried to resolve it.",
      },
      {
        kind: "rate",
        scenario:
          "Two colleagues disagree about how your team should approach a task due next week. The discussion has gone round in circles for half an hour.",
        responses: [
          {
            text: "Suggest the team lists the pros and cons of each approach and agrees what matters most before choosing.",
            rating: 4,
            why: "Moves the discussion from opinions to agreed criteria, so the team can reach a decision together.",
          },
          {
            text: "Back whichever colleague is more senior so the argument ends quickly.",
            rating: 2,
            why: "Ends the argument, but not on the merits, and the other colleague may feel dismissed.",
          },
          {
            text: "Leave them to sort it out and get on with your own work.",
            rating: 2,
            why: "Avoids the problem rather than helping the team move forward before the deadline.",
          },
          {
            text: "Suggest asking the project manager to decide if the team can't agree by the end of the day.",
            rating: 3,
            why: "Sets a sensible limit and a route to a decision, though the team could probably resolve it themselves first.",
          },
        ],
      },
      {
        kind: "most-least",
        scenario:
          "A new apprentice joined your team this week. They seem quiet, and you have noticed them eating lunch alone at their desk every day.",
        responses: [
          "Invite them to join you and a few colleagues for lunch.",
          "Assume they prefer their own company and leave them to it.",
          "Tell your manager that the new apprentice doesn't seem to be fitting in.",
          "Send them a link to the intranet page for new starters.",
        ],
        most: 0,
        least: 1,
        explanation:
          "A friendly, low-pressure invitation is the most direct way to help someone settle in, and they can always say no. Assuming they want to be alone means no one helps, which is least effective. Telling your manager isn't harmful but skips the simple step you could take yourself, and an intranet link is impersonal.",
      },
      {
        kind: "most-least",
        scenario:
          "You agreed to help a colleague with their analysis this afternoon. Your manager now asks you to urgently prepare figures for a 4pm meeting.",
        responses: [
          "Tell your manager you have already committed your afternoon and can't help.",
          "Explain the clash to your manager, and let your colleague know straight away so you can agree another time.",
          "Try to do both at once and hope you finish.",
          "Do your manager's task and help your colleague later, without telling them.",
        ],
        most: 1,
        least: 3,
        explanation:
          "Being open with both people lets your manager prioritise with full information and lets your colleague plan around the change. Leaving your colleague waiting without warning is least effective: it damages trust and could hold up their work. Refusing your manager outright and juggling both are better than silence, but each risks one task suffering.",
      },
    ],
  },
  {
    slug: "sjt-workplace",
    category: "situational",
    title: "Your first months at work",
    description: "Mistakes, feedback, workload, customers and confidentiality.",
    timeLimit: 9 * 60,
    instructions: INSTRUCTIONS,
    questions: [
      {
        kind: "rate",
        scenario:
          "You realise you sent a client a spreadsheet with an error that changes their budget totals. Nobody else has noticed yet.",
        responses: [
          {
            text: "Tell your manager straight away, explain what went wrong and suggest how to correct it.",
            rating: 4,
            why: "Owning the mistake quickly, with a proposed fix, limits the damage and builds trust.",
          },
          {
            text: "Quietly send the client a corrected version without explaining why.",
            rating: 2,
            why: "Fixes the numbers but may confuse the client and leaves your manager unaware of an issue with their client.",
          },
          {
            text: "Wait to see whether the client notices before doing anything.",
            rating: 1,
            why: "The client could make decisions on wrong figures, and the mistake looks far worse if it's found later.",
          },
          {
            text: "Correct the error and ask a colleague to check your work before resending it.",
            rating: 3,
            why: "A careful fix, but your manager should still know a client received incorrect figures.",
          },
        ],
      },
      {
        kind: "most-least",
        scenario:
          "Your manager tells you that your reports are too long and hard to follow. You think the detail is important.",
        responses: [
          "Ask for an example of a report they think works well, and which parts of yours they would change.",
          "Thank them, but carry on writing reports the way you have been.",
          "Ask other colleagues whether they agree with your manager.",
          "Cut your next report down to a single page, whatever it needs to cover.",
        ],
        most: 0,
        least: 1,
        explanation:
          "Asking for examples and specifics turns general feedback into something you can act on, and opens a conversation about what detail matters. Ignoring the feedback is least effective: it signals you aren't willing to develop. Canvassing colleagues can look like you're undermining your manager, and over-correcting may leave out information that's needed.",
      },
      {
        kind: "rate",
        scenario:
          "This week you have three tasks from three different people, and you can't do all of them well by their deadlines.",
        responses: [
          {
            text: "List the tasks with how long each will take, and ask your manager to help you prioritise.",
            rating: 4,
            why: "Flags the problem early, with the information needed to make a good decision.",
          },
          {
            text: "Work late every night to get everything done.",
            rating: 2,
            why: "May work once, but hides the workload problem, risks mistakes and isn't sustainable.",
          },
          {
            text: "Do the most senior person's task first and let the others slip without telling them.",
            rating: 1,
            why: "The others find out too late to plan around it, which damages trust.",
          },
          {
            text: "Tell each person how things stand and agree realistic deadlines where you can.",
            rating: 3,
            why: "Honest and proactive, though your manager is often better placed to weigh competing priorities.",
          },
        ],
      },
      {
        kind: "most-least",
        scenario:
          "A customer phones, angry that their order is late. Orders aren't your area, and the colleague who handles them is off today.",
        responses: [
          "Tell them it isn't your department and ask them to call back tomorrow.",
          "Listen, apologise for the inconvenience, take their details and promise a call back from the right person by a set time, then make sure it happens.",
          "Transfer them to the main switchboard.",
          "Promise the order will arrive tomorrow to calm them down.",
        ],
        most: 1,
        least: 3,
        explanation:
          "Taking ownership, even when it isn't your area, and making a promise you can keep is what customers value most. Promising a delivery date you can't guarantee is least effective: it will make things worse when the promise is broken. Sending them away or transferring them leaves them more frustrated.",
      },
      {
        kind: "rate",
        scenario:
          "Over drinks, a friend asks you about a confidential project your company is working on, which they've heard rumours about.",
        responses: [
          {
            text: "Explain that it's confidential, but that you're happy to talk about what your job is like in general.",
            rating: 4,
            why: "Protects the confidential information clearly and politely, without making it awkward.",
          },
          {
            text: "Change the subject without saying why.",
            rating: 3,
            why: "Protects the information, though being clear that it's confidential stops them asking again.",
          },
          {
            text: "Share a few general details, leaving out any names.",
            rating: 1,
            why: "Still a breach of confidentiality. Removing names doesn't make confidential information safe to share.",
          },
        ],
      },
      {
        kind: "most-least",
        scenario:
          "Your manager asks you to complete a task using software you've never used. They seem to assume you already know it.",
        responses: [
          "Explain that you're new to it and ask whether there's training or someone who could show you the basics.",
          "Say nothing and teach yourself from online tutorials, even if the task takes much longer.",
          "Ask another apprentice to do the task for you in exchange for helping them later.",
          "Tell your manager the task isn't part of your role.",
        ],
        most: 0,
        least: 3,
        explanation:
          "Being honest about what you don't know yet is expected of apprentices, and it lets your manager set a realistic timeline and support your learning. Refusing the task is least effective: learning new tools is part of every role. Teaching yourself shows initiative but risks a late deadline nobody planned for, and handing the task to someone else means you don't learn.",
      },
    ],
  },
  {
    slug: "sjt-apprenticeship",
    category: "situational",
    title: "Balancing work and study",
    description: "Study days, coursework, academic honesty and representing your employer.",
    timeLimit: 9 * 60,
    instructions: INSTRUCTIONS,
    questions: [
      {
        kind: "most-least",
        scenario:
          "A university assignment is due on Friday. Your manager asks you to cover an important project task on Thursday, which is your study day.",
        responses: [
          "Explain that Thursday is your study day and your assignment is due, and suggest another way the task could be covered.",
          "Agree, and plan to ask the university for an extension.",
          "Agree, and stay up late on Thursday night to finish the assignment.",
          "Refuse without explaining why.",
        ],
        most: 0,
        least: 3,
        explanation:
          "Study time is part of your apprenticeship agreement, and explaining the clash while offering alternatives shows you care about both your work and your degree. Refusing without explanation is least effective: your manager may not realise the conflict and it harms the relationship. Agreeing and relying on an extension or a late night puts your studies at risk.",
      },
      {
        kind: "rate",
        scenario: "You're struggling to keep up with one of your university modules, and the next assessment is in three weeks.",
        responses: [
          {
            text: "Contact your tutor now and explain which parts you're finding difficult.",
            rating: 4,
            why: "Asking early, with specifics, gives you the most time to get help before the assessment.",
          },
          {
            text: "Form a study group with other apprentices on the course.",
            rating: 3,
            why: "A good way to learn together, though it may not resolve the specific gaps without a tutor's input.",
          },
          {
            text: "Wait and raise it at your next progress review with your employer and training provider.",
            rating: 3,
            why: "The right people to know, but waiting for the review could leave too little time before the assessment.",
          },
          {
            text: "Keep quiet and hope it gets easier.",
            rating: 1,
            why: "The problem is likely to grow, and nobody can help if they don't know.",
          },
        ],
      },
      {
        kind: "most-least",
        scenario:
          "Someone on your course posts the answers to an upcoming assessed online test in your cohort's group chat.",
        responses: [
          "Don't use the answers, and let the course leader know.",
          "Use the answers. Everyone else will.",
          "Don't use the answers, but say nothing.",
          "Post in the chat that using the answers is cheating and could get people removed from the course.",
        ],
        most: 0,
        least: 1,
        explanation:
          "Using leaked answers is academic misconduct and could end your apprenticeship, so it's least effective. Telling the course leader protects the fairness of the assessment for everyone. Warning the group is well-meant but doesn't stop the test being compromised, and staying quiet leaves the problem in place.",
      },
      {
        kind: "rate",
        scenario:
          "For the last month your team has been so busy that you haven't been given the study time set out in your apprenticeship agreement.",
        responses: [
          {
            text: "Raise it with your line manager, referring to the study time in your apprenticeship agreement.",
            rating: 4,
            why: "A direct, professional way to resolve it with the person who controls your time.",
          },
          {
            text: "Mention it to your training provider at your next progress review.",
            rating: 3,
            why: "They need to know and can help, but talking to your manager first is usually quicker.",
          },
          {
            text: "Do your coursework in the evenings and at weekends, and say nothing.",
            rating: 2,
            why: "Keeps you on track short term but isn't sustainable, and nobody knows there's a problem to fix.",
          },
          {
            text: "Stop coming into work on your study days so you can catch up.",
            rating: 1,
            why: "Not turning up without agreement creates a new, more serious problem.",
          },
        ],
      },
      {
        kind: "most-least",
        scenario: "Your team has just won a big new project, and you'd like to share the news on social media.",
        responses: [
          "Post a photo from the office that shows your screen with the client's details on it.",
          "Check your company's social media policy and only share what has already been made public.",
          "Post about it, but don't name your employer.",
          "Never mention anything about work on social media.",
        ],
        most: 1,
        least: 0,
        explanation:
          "Checking the policy and sharing only public information lets you celebrate without risk. Posting a photo showing client details is least effective: it's a serious confidentiality breach. Not naming your employer doesn't make unannounced news safe to share, and avoiding work entirely is unnecessary.",
      },
      {
        kind: "rate",
        scenario: "You're invited to present your university project at a team meeting. You're nervous about presenting.",
        responses: [
          {
            text: "Accept, and practise with a colleague beforehand.",
            rating: 4,
            why: "Takes the development opportunity and manages the nerves through preparation.",
          },
          {
            text: "Ask whether you could co-present with a more experienced colleague.",
            rating: 3,
            why: "A sensible way to build confidence, though you'll get less practice than presenting yourself.",
          },
          {
            text: "Decline, and offer to do it next year when you're more confident.",
            rating: 2,
            why: "Misses a valuable chance to develop, and confidence usually comes from doing it.",
          },
          {
            text: "Accept, but read your notes word for word without practising.",
            rating: 2,
            why: "You take the opportunity, but without preparing you're less likely to present well.",
          },
        ],
      },
    ],
  },
];
