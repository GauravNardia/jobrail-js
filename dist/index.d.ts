type JobState = "Waiting" | "Prioritized" | "Delayed" | "Scheduled" | "Active" | "Completed" | "Failed" | "Cancelled";
interface CreateJobOptions {
    name: string;
    payload: unknown;
    priority?: number;
    maxAttempts?: number;
    delayMs?: number;
    runAt?: number;
    idempotencyKey?: string;
}
interface Job {
    id: string;
    name: string;
    state: JobState;
    attemptsMade: number;
    attemptsStarted: number;
    runAt: number | null;
}
interface JobAttempt {
    attempt: number;
    startedAt: number;
    finishedAt: number | null;
    status: "Running" | "Completed" | "Failed" | "Cancelled";
    error: string | null;
}
interface JobAttemptsResponse {
    attempts: JobAttempt[];
}
interface JobPage {
    jobs: Job[];
    nextCursor: string | null;
    hasMore: boolean;
}
interface ListJobsOptions {
    limit?: number;
    cursor?: string;
    state?: JobState;
}
interface RepeatableJob {
    id: string;
    name: string;
    payload: unknown;
    schedule: RepeatSchedule;
    enabled: boolean;
    nextRunAt: number | null;
}
type RepeatSchedule = {
    EveryMillis: number;
};
interface CreateRepeatableJobOptions {
    name: string;
    payload: unknown;
    schedule: RepeatSchedule;
}

declare class JobsResource {
    private readonly client;
    constructor(client: JobRail);
    create(options: CreateJobOptions): Promise<Job>;
    get(id: string): Promise<Job>;
    list(options?: ListJobsOptions): Promise<JobPage>;
    cancel(id: string): Promise<Job>;
    retry(id: string): Promise<Job>;
    attempts(id: string): Promise<JobAttemptsResponse>;
}

declare class RepeatableJobsResource {
    private readonly client;
    constructor(client: JobRail);
    create(options: CreateRepeatableJobOptions): Promise<RepeatableJob>;
    list(): Promise<{
        jobs: RepeatableJob[];
    }>;
    get(id: string): Promise<RepeatableJob>;
    disable(id: string): Promise<RepeatableJob>;
    delete(id: string): Promise<RepeatableJob>;
}

interface JobRailOptions {
    baseUrl: string;
}
declare class JobRail {
    readonly jobs: JobsResource;
    readonly repeatableJobs: RepeatableJobsResource;
    private readonly baseUrl;
    constructor(options: JobRailOptions);
    request<T>(path: string, options?: RequestInit): Promise<T>;
}

declare class JobRailError extends Error {
    readonly code: string;
    readonly status: number;
    constructor(message: string, code: string, status: number);
}

export { type CreateJobOptions, type CreateRepeatableJobOptions, type Job, type JobAttempt, type JobAttemptsResponse, type JobPage, JobRail, JobRailError, type JobState, type ListJobsOptions, type RepeatSchedule, type RepeatableJob };
