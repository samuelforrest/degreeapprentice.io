import type { Cv, CvEntry, CvSection } from "@/lib/cv/types";

// An example of a strong school-leaver CV for a degree apprenticeship, following UK careers advice:
// one page, a short tailored personal statement, education and skills near the top, plain single-column
// layout for applicant tracking systems, and no photo, date of birth or references. Everyone and every
// organisation in it is fictional.
export const exampleCv: Cv = {
  version: 1,
  name: "Alex Morgan",
  headline: "A level student applying for software engineering degree apprenticeships",
  email: "alex.morgan@example.com",
  phone: "07700 900123",
  location: "Leeds",
  links: "linkedin.com/in/alex-morgan-example",
  sections: [
    {
      id: "profile",
      kind: "text",
      title: "Personal statement",
      hint: "3 to 4 sentences (50 to 150 words): who you are, what you offer and the role you want. Rewrite it for every application.",
      body: "Motivated A level student studying Maths, Computer Science and Physics, applying for a software engineering degree apprenticeship. I built and maintain the fixtures website for my local football club, and I enjoy turning real problems into working code. My part-time job has taught me to work reliably in a team and stay calm under pressure. I'm keen to learn from experienced engineers while completing my degree.",
    },
    {
      id: "education",
      kind: "entries",
      title: "Education",
      hint: "Most recent first. Include predicted grades, and put subjects relevant to the role first.",
      entries: [
        {
          id: "edu-1",
          title: "A levels: Maths (predicted A), Computer Science (predicted A), Physics (predicted B)",
          organisation: "Northfield Sixth Form College",
          location: "Leeds",
          dates: "Sep 2025 – Jun 2027",
          bullets: "Extended Project Qualification on how recommendation algorithms work (predicted A*)",
        },
        {
          id: "edu-2",
          title: "GCSEs: 9 subjects at grades 9 to 6, including Maths (9) and English Language (7)",
          organisation: "Northfield Academy",
          location: "Leeds",
          dates: "Sep 2020 – Jun 2025",
          bullets: "",
        },
      ],
    },
    {
      id: "experience",
      kind: "entries",
      title: "Work experience",
      hint: "Part-time jobs, placements and volunteering all count. Start bullets with an action verb and use numbers where you can.",
      entries: [
        {
          id: "exp-1",
          title: "Customer Assistant (part-time)",
          organisation: "Greenway Supermarket",
          location: "Leeds",
          dates: "Jun 2024 – Present",
          bullets:
            "Serve over 100 customers a shift on the tills and customer service desk\nTrained three new starters on the till system\nTrusted to cash up and help close the store on weekend shifts",
        },
        {
          id: "exp-2",
          title: "Work experience placement",
          organisation: "Northern Software Ltd",
          location: "Leeds",
          dates: "Jul 2025 (1 week)",
          bullets:
            "Shadowed a development team in sprint planning and daily stand-ups\nWrote and tested a Python script that tidied up spreadsheet data for the support team",
        },
      ],
    },
    {
      id: "projects",
      kind: "entries",
      title: "Projects",
      hint: "Optional, but powerful for technical roles: things you've built, made or organised yourself.",
      entries: [
        {
          id: "proj-1",
          title: "Football club fixtures website",
          organisation: "Personal project",
          location: "",
          dates: "2024 – Present",
          bullets:
            "Built a mobile-friendly website with HTML, CSS and JavaScript, used by over 200 club members\nAdded a results page that updates automatically from a shared spreadsheet",
        },
      ],
    },
    {
      id: "skills",
      kind: "list",
      title: "Skills",
      hint: "Group your skills and be specific: “Excel (formulas and charts)” beats “good with computers”.",
      items:
        "Programming: Python, JavaScript, HTML and CSS\nSoftware: Excel (formulas and charts), Google Workspace\nCommunication: confident with customers and presenting to my class\nLanguages: Spanish (conversational)",
    },
    {
      id: "achievements",
      kind: "list",
      title: "Achievements and interests",
      hint: "Choose things that show responsibility, commitment or teamwork. Leave out generic interests like “socialising”.",
      items:
        "Captain of the college under-18 football team, organising training for 15 players\nSilver Duke of Edinburgh’s Award\nVolunteer helper at a primary school coding club every fortnight",
    },
  ],
};

export function newEntry(): CvEntry {
  return { id: newId(), title: "", organisation: "", location: "", dates: "", bullets: "" };
}

export const newId = () => Math.random().toString(36).slice(2, 10);

/** Starting points offered by "Add section". */
export const SECTION_PRESETS: { label: string; make: () => CvSection }[] = [
  { label: "Volunteering", make: () => ({ id: newId(), kind: "entries", title: "Volunteering", entries: [newEntry()] }) },
  { label: "Projects", make: () => ({ id: newId(), kind: "entries", title: "Projects", entries: [newEntry()] }) },
  { label: "Certificates", make: () => ({ id: newId(), kind: "list", title: "Certificates and courses", items: "" }) },
  { label: "Bullet list", make: () => ({ id: newId(), kind: "list", title: "New section", items: "" }) },
  { label: "Paragraph", make: () => ({ id: newId(), kind: "text", title: "New section", body: "" }) },
];
