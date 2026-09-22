// src/errors.ts
var JobRailError = class extends Error {
  code;
  status;
  constructor(message, code, status) {
    super(message);
    this.name = "JobRailError";
    this.code = code;
    this.status = status;
  }
};

// src/resources/jobs.ts
var JobsResource = class {
  constructor(client) {
    this.client = client;
  }
  client;
  async create(options) {
    return this.client.request("/v1/jobs", {
      method: "POST",
      body: JSON.stringify({
        name: options.name,
        payload: options.payload,
        priority: options.priority ?? 0,
        maxAttempts: options.maxAttempts ?? 3,
        delayMs: options.delayMs ?? 0,
        runAt: options.runAt ?? null,
        idempotencyKey: options.idempotencyKey ?? null
      })
    });
  }
  async get(id) {
    return this.client.request(`/v1/jobs/${id}`);
  }
  async list(options = {}) {
    const params = new URLSearchParams();
    if (options.limit !== void 0) {
      params.set("limit", String(options.limit));
    }
    if (options.cursor) {
      params.set("cursor", options.cursor);
    }
    if (options.state) {
      params.set("state", options.state);
    }
    const query = params.toString();
    return this.client.request(
      `/v1/jobs${query ? `?${query}` : ""}`
    );
  }
  async cancel(id) {
    return this.client.request(`/v1/jobs/${id}/cancel`, {
      method: "POST"
    });
  }
  async retry(id) {
    return this.client.request(`/v1/jobs/${id}/retry`, {
      method: "POST"
    });
  }
  async attempts(id) {
    return this.client.request(
      `/v1/jobs/${id}/attempts`
    );
  }
};

// src/resources/repeatable-jobs.ts
var RepeatableJobsResource = class {
  constructor(client) {
    this.client = client;
  }
  client;
  async create(options) {
    return this.client.request("/v1/repeatable-jobs", {
      method: "POST",
      body: JSON.stringify({
        name: options.name,
        payload: options.payload,
        schedule: options.schedule
      })
    });
  }
  async list() {
    return this.client.request(
      "/v1/repeatable-jobs"
    );
  }
  async get(id) {
    return this.client.request(
      `/v1/repeatable-jobs/${id}`
    );
  }
  async disable(id) {
    return this.client.request(
      `/v1/repeatable-jobs/${id}/disable`,
      {
        method: "POST"
      }
    );
  }
  async delete(id) {
    return this.client.request(
      `/v1/repeatable-jobs/${id}`,
      {
        method: "DELETE"
      }
    );
  }
};

// src/client.ts
var JobRail = class {
  jobs;
  repeatableJobs;
  baseUrl;
  constructor(options) {
    this.baseUrl = options.baseUrl.replace(/\/+$/, "");
    this.jobs = new JobsResource(this);
    this.repeatableJobs = new RepeatableJobsResource(this);
  }
  async request(path, options = {}) {
    const url = `${this.baseUrl}${path}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      }
    });
    if (!response.ok) {
      let errorBody;
      try {
        errorBody = await response.json();
      } catch {
        errorBody = null;
      }
      if (errorBody && typeof errorBody === "object" && "error" in errorBody) {
        const body = errorBody;
        throw new JobRailError(
          body.error.message,
          body.error.code,
          response.status
        );
      }
      throw new JobRailError(
        `Request failed with status ${response.status}`,
        "UNKNOWN_ERROR",
        response.status
      );
    }
    return response.json();
  }
};
export {
  JobRail,
  JobRailError
};
