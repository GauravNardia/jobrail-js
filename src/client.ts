import { JobRailError } from "./errors.js";
import { JobsResource } from "./resources/jobs.js";
import { RepeatableJobsResource } from "./resources/repeatable-jobs.js";

export interface JobRailOptions {
  baseUrl: string;
}

export class JobRail {
  readonly jobs: JobsResource;
  readonly repeatableJobs: RepeatableJobsResource;

  private readonly baseUrl: string;

  constructor(options: JobRailOptions) {
    this.baseUrl = options.baseUrl.replace(/\/+$/, "");

    this.jobs = new JobsResource(this);
    this.repeatableJobs = new RepeatableJobsResource(this);
  }

  async request<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorBody: unknown;

      try {
        errorBody = await response.json();
      } catch {
        errorBody = null;
      }

      if (
        errorBody &&
        typeof errorBody === "object" &&
        "error" in errorBody
      ) {
        const body = errorBody as {
          error: {
            code: string;
            message: string;
          };
        };

        throw new JobRailError(
          body.error.message,
          body.error.code,
          response.status,
        );
      }

      throw new JobRailError(
        `Request failed with status ${response.status}`,
        "UNKNOWN_ERROR",
        response.status,
      );
    }

    return response.json() as Promise<T>;
  }
}