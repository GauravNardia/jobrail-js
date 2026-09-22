export type JobState =
  | "Waiting"
  | "Prioritized"
  | "Delayed"
  | "Scheduled"
  | "Active"
  | "Completed"
  | "Failed"
  | "Cancelled";

export interface CreateJobOptions {
  name: string;
  payload: unknown;
  priority?: number;
  maxAttempts?: number;
  delayMs?: number;
  runAt?: number;
  idempotencyKey?: string;
}

export interface Job {
  id: string;
  name: string;
  state: JobState;
  attemptsMade: number;
  attemptsStarted: number;
  runAt: number | null;
}

export interface JobAttempt {
  attempt: number;
  startedAt: number;
  finishedAt: number | null;
  status: "Running" | "Completed" | "Failed" | "Cancelled";
  error: string | null;
}

export interface JobAttemptsResponse {
  attempts: JobAttempt[];
}

export interface JobPage {
  jobs: Job[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface ListJobsOptions {
  limit?: number;
  cursor?: string;
  state?: JobState;
}

export interface RepeatableJob {
  id: string;
  name: string;
  payload: unknown;
  schedule: RepeatSchedule;
  enabled: boolean;
  nextRunAt: number | null;
}

export type RepeatSchedule = {
  EveryMillis: number;
};

export interface CreateRepeatableJobOptions {
  name: string;
  payload: unknown;
  schedule: RepeatSchedule;
}