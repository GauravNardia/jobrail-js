import type { JobRail } from "../client.js";
import type {
  CreateRepeatableJobOptions,
  RepeatableJob,
} from "../types.js";

export class RepeatableJobsResource {
  constructor(private readonly client: JobRail) {}

  async create(
    options: CreateRepeatableJobOptions,
  ): Promise<RepeatableJob> {
    return this.client.request<RepeatableJob>("/v1/repeatable-jobs", {
      method: "POST",
      body: JSON.stringify({
        name: options.name,
        payload: options.payload,
        schedule: options.schedule,
      }),
    });
  }

  async list(): Promise<{ jobs: RepeatableJob[] }> {
    return this.client.request<{ jobs: RepeatableJob[] }>(
      "/v1/repeatable-jobs",
    );
  }

  async get(id: string): Promise<RepeatableJob> {
    return this.client.request<RepeatableJob>(
      `/v1/repeatable-jobs/${id}`,
    );
  }

  async disable(id: string): Promise<RepeatableJob> {
    return this.client.request<RepeatableJob>(
      `/v1/repeatable-jobs/${id}/disable`,
      {
        method: "POST",
      },
    );
  }

  async delete(id: string): Promise<RepeatableJob> {
    return this.client.request<RepeatableJob>(
      `/v1/repeatable-jobs/${id}`,
      {
        method: "DELETE",
      },
    );
  }
}