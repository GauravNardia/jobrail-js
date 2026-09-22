import type {
  CreateJobOptions,
  Job,
  JobAttemptsResponse,
  JobPage,
  ListJobsOptions,
} from "../types.js";
import type { JobRail } from "../client.js";

export class JobsResource {
  constructor(private readonly client: JobRail) {}

  async create(options: CreateJobOptions): Promise<Job> {
    return this.client.request<Job>("/v1/jobs", {
      method: "POST",
      body: JSON.stringify({
        name: options.name,
        payload: options.payload,
        priority: options.priority ?? 0,
        maxAttempts: options.maxAttempts ?? 3,
        delayMs: options.delayMs ?? 0,
        runAt: options.runAt ?? null,
        idempotencyKey: options.idempotencyKey ?? null,
      }),
    });
  }

  async get(id: string): Promise<Job> {
    return this.client.request<Job>(`/v1/jobs/${id}`);
  }

  async list(options: ListJobsOptions = {}): Promise<JobPage> {
    const params = new URLSearchParams();

    if (options.limit !== undefined) {
      params.set("limit", String(options.limit));
    }

    if (options.cursor) {
      params.set("cursor", options.cursor);
    }

    if (options.state) {
      params.set("state", options.state);
    }

    const query = params.toString();

    return this.client.request<JobPage>(
      `/v1/jobs${query ? `?${query}` : ""}`,
    );
  }

  async cancel(id: string): Promise<Job> {
    return this.client.request<Job>(`/v1/jobs/${id}/cancel`, {
      method: "POST",
    });
  }

  async retry(id: string): Promise<Job> {
    return this.client.request<Job>(`/v1/jobs/${id}/retry`, {
      method: "POST",
    });
  }

  async attempts(id: string): Promise<JobAttemptsResponse> {
    return this.client.request<JobAttemptsResponse>(
      `/v1/jobs/${id}/attempts`,
    );
  }
}