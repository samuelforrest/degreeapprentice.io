"use client";

import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, ClockIcon, RotateCcwIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { Figure } from "@/components/tests/figure";
import { Stimulus } from "@/components/tests/stimulus";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { categoryLabel, formatTimeLimit } from "@/lib/tests";
import { saveResult } from "@/lib/tests/progress";
import { isAnswered, scoreQuestion, scoreTest } from "@/lib/tests/scoring";
import { RATINGS, type Answer, type Question, type Rating, type Test } from "@/lib/tests/types";
import { cn } from "@/lib/utils";

const LETTERS = "ABCDEFGH";

const formatClock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

type Phase = "intro" | "running" | "done";

export function TestRunner({ test }: { test: Test }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [timed, setTimed] = useState(true);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [startedAt, setStartedAt] = useState(0);
  const [finishedAt, setFinishedAt] = useState(0);
  const [remaining, setRemaining] = useState(test.timeLimit);

  const questions = test.questions;
  const score = scoreTest(questions, answers);

  const start = (withTimer: boolean) => {
    setTimed(withTimer);
    setAnswers({});
    setIndex(0);
    setRemaining(test.timeLimit);
    setStartedAt(Date.now());
    setPhase("running");
    window.scrollTo({ top: 0 });
  };

  const finish = useCallback(() => {
    setFinishedAt(Date.now());
    setPhase("done");
    window.scrollTo({ top: 0 });
  }, []);

  // Countdown: when time runs out the test ends, as it would in a real assessment.
  useEffect(() => {
    if (phase !== "running" || !timed) return;
    const deadline = startedAt + test.timeLimit * 1000;
    const id = setInterval(() => {
      const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) finish();
    }, 250);
    return () => clearInterval(id);
  }, [phase, timed, startedAt, test.timeLimit, finish]);

  useEffect(() => {
    if (phase === "done") saveResult(test.slug, score);
  }, [phase, score, test.slug]);

  const go = (i: number) => {
    setIndex(i);
    window.scrollTo({ top: 0 });
  };
  const update = (patch: Answer) => setAnswers((prev) => ({ ...prev, [index]: { ...prev[index], ...patch } }));

  if (phase === "intro") return <Intro test={test} onStart={start} />;
  if (phase === "done")
    return (
      <Results
        test={test}
        answers={answers}
        score={score}
        seconds={Math.round((finishedAt - startedAt) / 1000)}
        timedOut={timed && remaining === 0}
        onRetry={() => setPhase("intro")}
      />
    );

  const q = questions[index];
  const stimulus = q.kind === "choice" && q.stimulus ? test.stimuli?.[q.stimulus] : undefined;
  const unanswered = questions.filter((qq, i) => !isAnswered(qq, answers[i])).length;
  const isLast = index === questions.length - 1;

  return (
    <div className="space-y-6">
      <div className="sticky top-12 z-30 -mx-4 space-y-3 border-b bg-background/90 px-4 py-3 backdrop-blur-md lg:-mx-6 lg:px-6">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="font-medium">
            Question {index + 1} <span className="text-muted-foreground">of {questions.length}</span>
          </span>
          {timed ? (
            <span
              className={cn("flex items-center gap-1.5 font-medium tabular-nums", remaining <= 60 && "text-destructive")}
              aria-live={remaining <= 60 ? "polite" : "off"}
            >
              <ClockIcon className="size-4" aria-hidden />
              {formatClock(remaining)}
            </span>
          ) : (
            <span className="text-muted-foreground">No timer</span>
          )}
        </div>
        <nav aria-label="Questions" className="flex flex-wrap gap-1.5">
          {questions.map((qq, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              aria-current={i === index ? "step" : undefined}
              aria-label={`Question ${i + 1}${isAnswered(qq, answers[i]) ? ", answered" : ""}`}
              className={cn(
                "size-7 rounded-md border text-xs tabular-nums transition-colors hover:border-foreground/30",
                isAnswered(qq, answers[i]) && "border-primary/40 bg-primary/15 text-foreground",
                i === index && "border-primary ring-2 ring-primary/40",
              )}
            >
              {i + 1}
            </button>
          ))}
        </nav>
      </div>

      <div className={cn("grid gap-6", stimulus && "lg:grid-cols-2 lg:items-start")}>
        {stimulus && (
          <div className="lg:sticky lg:top-40">
            <Stimulus stimulus={stimulus} />
          </div>
        )}
        <div className="space-y-5">
          <QuestionView question={q} answer={answers[index]} onChange={update} />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-5">
        <Button variant="outline" onClick={() => go(index - 1)} disabled={index === 0}>
          <ArrowLeftIcon data-icon="inline-start" /> Previous
        </Button>
        <div className="flex items-center gap-3">
          {isLast && unanswered > 0 && (
            <span className="text-sm text-muted-foreground">
              {unanswered} unanswered
            </span>
          )}
          {isLast ? (
            <Button onClick={finish}>Finish test</Button>
          ) : (
            <Button onClick={() => go(index + 1)}>
              Next <ArrowRightIcon data-icon="inline-end" />
            </Button>
          )}
        </div>
      </div>
      {!isLast && (
        <p className="text-center">
          <button type="button" onClick={finish} className="text-sm text-muted-foreground hover:text-foreground">
            Finish early and see results
          </button>
        </p>
      )}
    </div>
  );
}

function Intro({ test, onStart }: { test: Test; onStart: (timed: boolean) => void }) {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-3">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <Link href="/tests" className="hover:text-foreground">Tests</Link>
          {" / "}
          {categoryLabel(test.category)}
        </nav>
        <h1 className="text-3xl font-semibold tracking-tight text-balance">{test.title}</h1>
        <p className="text-muted-foreground">{test.description}</p>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary">{test.questions.length} questions</Badge>
          <Badge variant="outline">{formatTimeLimit(test.timeLimit)}</Badge>
        </div>
      </div>
      <div className="space-y-2 rounded-xl border bg-card p-5">
        <h2 className="font-semibold">Before you start</h2>
        <ul className="ml-5 list-disc space-y-1.5 text-[15px] leading-relaxed text-foreground/90">
          {test.instructions.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="lg" onClick={() => onStart(true)}>
          Start timed test
        </Button>
        <Button size="lg" variant="outline" onClick={() => onStart(false)}>
          Practise without a timer
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Your scores are saved in this browser only. There&apos;s no account and nothing is sent to us.
      </p>
    </div>
  );
}

function OptionButton({
  selected,
  letter,
  onClick,
  children,
}: {
  selected: boolean;
  letter: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-3 rounded-lg border bg-card px-3 py-2.5 text-left text-[15px] transition-colors hover:border-foreground/25",
        selected && "border-primary bg-primary/10 hover:border-primary",
      )}
    >
      <span
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-md border text-xs font-medium",
          selected && "border-primary bg-primary text-primary-foreground",
        )}
      >
        {letter}
      </span>
      <span className="pt-0.5">{children}</span>
    </button>
  );
}

function QuestionView({ question: q, answer, onChange }: { question: Question; answer?: Answer; onChange: (a: Answer) => void }) {
  switch (q.kind) {
    case "choice":
      return (
        <>
          <h2 className="text-lg font-medium leading-snug">{q.prompt}</h2>
          <div role="radiogroup" aria-label="Answers" className="grid gap-2">
            {q.options.map((option, i) => (
              <OptionButton key={i} letter={LETTERS[i]} selected={answer?.choice === i} onClick={() => onChange({ choice: i })}>
                {option}
              </OptionButton>
            ))}
          </div>
        </>
      );

    case "figures":
      return (
        <>
          <h2 className="text-lg font-medium leading-snug">{q.prompt}</h2>
          {q.sequence.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 rounded-xl border bg-card p-4">
              {q.sequence.map((f, i) => (
                <Figure key={i} figure={f} label={`Figure ${i + 1} in the series`} />
              ))}
              <span className="flex size-16 items-center justify-center rounded-md border border-dashed text-2xl text-muted-foreground sm:size-20">
                ?
              </span>
            </div>
          )}
          <div role="radiogroup" aria-label="Answers" className="flex flex-wrap gap-3">
            {q.options.map((f, i) => (
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={answer?.choice === i}
                onClick={() => onChange({ choice: i })}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-lg border bg-card p-2 text-xs font-medium transition-colors hover:border-foreground/25",
                  answer?.choice === i && "border-primary bg-primary/10 hover:border-primary",
                )}
              >
                <Figure figure={f} label={`Option ${LETTERS[i]}`} />
                {LETTERS[i]}
              </button>
            ))}
          </div>
        </>
      );

    case "most-least":
      return (
        <>
          <p className="text-[15px] leading-relaxed">{q.scenario}</p>
          <h2 className="font-medium">Choose the most effective and the least effective response.</h2>
          <ol className="grid gap-2">
            {q.responses.map((text, i) => (
              <li key={i} className="space-y-2.5 rounded-lg border bg-card p-3">
                <p className="text-[15px]">
                  <span className="mr-2 font-medium text-muted-foreground">{LETTERS[i]}</span>
                  {text}
                </p>
                <div className="flex flex-wrap gap-2">
                  <ToggleChip
                    selected={answer?.most === i}
                    onClick={() => onChange({ most: i, ...(answer?.least === i && { least: undefined }) })}
                    label={`Mark response ${LETTERS[i]} as most effective`}
                  >
                    Most effective
                  </ToggleChip>
                  <ToggleChip
                    selected={answer?.least === i}
                    onClick={() => onChange({ least: i, ...(answer?.most === i && { most: undefined }) })}
                    label={`Mark response ${LETTERS[i]} as least effective`}
                  >
                    Least effective
                  </ToggleChip>
                </div>
              </li>
            ))}
          </ol>
        </>
      );

    case "rate":
      return (
        <>
          <p className="text-[15px] leading-relaxed">{q.scenario}</p>
          <h2 className="font-medium">Rate how effective each response would be.</h2>
          <ol className="grid gap-2">
            {q.responses.map((r, i) => (
              <li key={i} className="space-y-2.5 rounded-lg border bg-card p-3">
                <p className="text-[15px]">
                  <span className="mr-2 font-medium text-muted-foreground">{LETTERS[i]}</span>
                  {r.text}
                </p>
                <div role="radiogroup" aria-label={`Rating for response ${LETTERS[i]}`} className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                  {RATINGS.map((label, j) => {
                    const value = (j + 1) as Rating;
                    const selected = answer?.ratings?.[i] === value;
                    return (
                      <button
                        key={label}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => {
                          const ratings = [...(answer?.ratings ?? Array<Rating | undefined>(q.responses.length).fill(undefined))];
                          ratings[i] = value;
                          onChange({ ratings });
                        }}
                        className={cn(
                          "rounded-md border px-2 py-1.5 text-xs transition-colors hover:border-foreground/25",
                          selected && "border-primary bg-primary/10 font-medium hover:border-primary",
                        )}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </li>
            ))}
          </ol>
        </>
      );
  }
}

function ToggleChip({ selected, onClick, label, children }: { selected: boolean; onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={label}
      onClick={onClick}
      className={cn(
        "rounded-md border px-2.5 py-1 text-xs transition-colors hover:border-foreground/25",
        selected && "border-primary bg-primary/10 font-medium hover:border-primary",
      )}
    >
      {children}
    </button>
  );
}

function Results({
  test,
  answers,
  score,
  seconds,
  timedOut,
  onRetry,
}: {
  test: Test;
  answers: Record<number, Answer>;
  score: number;
  seconds: number;
  timedOut: boolean;
  onRetry: () => void;
}) {
  const answered = test.questions.filter((q, i) => isAnswered(q, answers[i])).length;
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="space-y-4 rounded-xl border bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground">{timedOut ? "Time's up" : "Test complete"}: {test.title}</p>
        <p className="text-5xl font-semibold tracking-tight tabular-nums text-primary">{score}%</p>
        <p className="text-sm text-muted-foreground">
          {answered} of {test.questions.length} answered · {formatClock(seconds)} taken
          {test.category === "situational" && " · partial credit for near-misses"}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button onClick={onRetry}>
            <RotateCcwIcon data-icon="inline-start" /> Try again
          </Button>
          <Button variant="outline" nativeButton={false} render={<Link href="/tests" />}>
            All tests
          </Button>
        </div>
      </div>

      <section aria-labelledby="review" className="space-y-4">
        <h2 id="review" className="text-xl font-semibold tracking-tight">Review your answers</h2>
        <ol className="space-y-4">
          {test.questions.map((q, i) => (
            <ReviewItem key={i} n={i + 1} question={q} answer={answers[i]} test={test} />
          ))}
        </ol>
      </section>
    </div>
  );
}

function ReviewItem({ n, question: q, answer, test }: { n: number; question: Question; answer?: Answer; test: Test }) {
  const points = scoreQuestion(q, answer);
  const status = !isAnswered(q, answer) && points === 0 ? "Not answered" : points === 1 ? "Correct" : points === 0 ? "Incorrect" : "Partly right";

  return (
    <li className="space-y-3 rounded-xl border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-medium leading-snug">
          <span className="mr-2 text-muted-foreground tabular-nums">{n}.</span>
          {q.kind === "choice" || q.kind === "figures" ? q.prompt : q.scenario}
        </h3>
        <Badge variant={points === 1 ? "default" : points === 0 ? "outline" : "secondary"} className="shrink-0">
          {points === 1 ? <CheckIcon data-icon="inline-start" /> : points === 0 ? <XIcon data-icon="inline-start" /> : null}
          {status}
        </Badge>
      </div>
      {q.kind === "choice" && q.stimulus && test.stimuli?.[q.stimulus] && (
        <p className="text-xs text-muted-foreground">Based on: {test.stimuli[q.stimulus].title}</p>
      )}
      <ReviewBody question={q} answer={answer} />
    </li>
  );
}

function ReviewBody({ question: q, answer }: { question: Question; answer?: Answer }) {
  const line = (label: string, value: React.ReactNode, good?: boolean) => (
    <p className="text-sm">
      <span className="text-muted-foreground">{label}: </span>
      <span className={cn(good === true && "text-primary", good === false && "text-destructive")}>{value}</span>
    </p>
  );

  switch (q.kind) {
    case "choice":
      return (
        <div className="space-y-1.5">
          {line("Your answer", answer?.choice !== undefined ? q.options[answer.choice] : "Not answered", answer?.choice === q.answer)}
          {answer?.choice !== q.answer && line("Correct answer", q.options[q.answer])}
          <p className="text-sm leading-relaxed text-foreground/90">{q.explanation}</p>
        </div>
      );
    case "figures":
      return (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center gap-2">
              <span className="text-muted-foreground">Correct answer:</span>
              <Figure figure={q.options[q.answer]} label={`Option ${LETTERS[q.answer]}`} className="size-12 sm:size-12" />
              {LETTERS[q.answer]}
            </span>
            {answer?.choice !== q.answer &&
              line("Your answer", answer?.choice !== undefined ? LETTERS[answer.choice] : "Not answered", false)}
          </div>
          <p className="text-sm leading-relaxed text-foreground/90">{q.explanation}</p>
        </div>
      );
    case "most-least":
      return (
        <div className="space-y-1.5">
          {line(
            "Most effective",
            <>
              {LETTERS[q.most]}: {q.responses[q.most]}
            </>,
          )}
          {line(
            "Least effective",
            <>
              {LETTERS[q.least]}: {q.responses[q.least]}
            </>,
          )}
          {line(
            "You chose",
            `most ${answer?.most !== undefined ? LETTERS[answer.most] : "–"}, least ${answer?.least !== undefined ? LETTERS[answer.least] : "–"}`,
            answer?.most === q.most && answer?.least === q.least,
          )}
          <p className="text-sm leading-relaxed text-foreground/90">{q.explanation}</p>
        </div>
      );
    case "rate":
      return (
        <ul className="space-y-2.5">
          {q.responses.map((r, i) => {
            const given = answer?.ratings?.[i];
            return (
              <li key={i} className="space-y-0.5 border-l-2 pl-3 text-sm">
                <p>
                  <span className="mr-1.5 font-medium text-muted-foreground">{LETTERS[i]}</span>
                  {r.text}
                </p>
                <p>
                  <span className="text-muted-foreground">Expert rating: </span>
                  <span className="font-medium">{RATINGS[r.rating - 1]}</span>
                  <span className="text-muted-foreground"> · You: </span>
                  <span className={cn(given === r.rating ? "text-primary" : given === undefined ? "" : "text-destructive")}>
                    {given ? RATINGS[given - 1] : "Not rated"}
                  </span>
                </p>
                <p className="text-foreground/80">{r.why}</p>
              </li>
            );
          })}
        </ul>
      );
  }
}
