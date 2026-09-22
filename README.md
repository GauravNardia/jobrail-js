# JobRail JavaScript SDK

TypeScript SDK for [JobRail](https://github.com/YOUR_USERNAME/jobrail).

JobRail is a **Redis-backed background job queue built with Rust**,
designed for reliable background processing with retries, delays,
scheduling, repeatable jobs, priorities, idempotency, and worker-based
execution.

> **Status:** JobRail is currently under active development and is not
> deployed yet. The SDK currently works with a locally running JobRail
> API.

---

## Installation

```bash
npm install jobrail
```

---

# Quick Start

Create a JobRail client:

```typescript
import { JobRail } from "jobrail";

const client = new JobRail({
  baseUrl: "http://localhost:3001",
});
```

Create a job:

```typescript
const job = await client.jobs.create({
  name: "send-email",
  payload: {
    to: "user@example.com",
    subject: "Welcome!",
  },
});

console.log(job);
```

The SDK communicates with the JobRail API over HTTP.

```text
Your application
       │
       │ jobrail-js
       ▼
JobRail API
       │
       ▼
    Redis
       │
       ▼
   Workers
```

---

# Jobs

## Create a Job

```typescript
const job = await client.jobs.create({
  name: "send-email",
  payload: {
    to: "user@example.com",
  },
});
```

## Get a Job

```typescript
const job = await client.jobs.get(jobId);

console.log(job);
```

## List Jobs

```typescript
const result = await client.jobs.list({
  limit: 20,
});

console.log(result.jobs);
```

## Filter Jobs by State

```typescript
const result = await client.jobs.list({
  state: "Failed",
  limit: 20,
});

console.log(result.jobs);
```

Supported job states include:

```text
Waiting
Prioritized
Delayed
Scheduled
Active
Completed
Failed
Cancelled
```

## Cancel a Job

```typescript
const job = await client.jobs.cancel(jobId);

console.log(job.state);
```

## Retry a Job

Retry a failed job:

```typescript
const job = await client.jobs.retry(jobId);
```

## Get Attempt History

```typescript
const result = await client.jobs.attempts(jobId);

console.log(result.attempts);
```

Each attempt contains information such as:

```typescript
{
  attempt: 1,
  startedAt: 1720000000000,
  finishedAt: 1720000005000,
  status: "Failed",
  error: "Something went wrong"
}
```

---

# Delayed Jobs

Delay a job before it becomes eligible for execution:

```typescript
const job = await client.jobs.create({
  name: "send-reminder",
  payload: {
    userId: "123",
  },
  delayMs: 10_000,
});
```

`delayMs` is specified in milliseconds.

---

# Scheduled Jobs

Schedule a job for a specific future timestamp:

```typescript
const job = await client.jobs.create({
  name: "generate-report",
  payload: {
    reportId: "123",
  },
  runAt: Date.now() + 60_000,
});
```

`runAt` must be a future Unix timestamp in milliseconds.

---

# Priority

Jobs can have a priority value:

```typescript
const job = await client.jobs.create({
  name: "important-job",
  payload: {},
  priority: 10,
});
```

---

# Retries

Configure how many attempts a job can make:

```typescript
const job = await client.jobs.create({
  name: "send-email",
  payload: {
    to: "user@example.com",
  },
  maxAttempts: 5,
});
```

JobRail handles retry scheduling on the worker side.

---

# Idempotency

Provide an idempotency key when repeated submissions should represent
the same logical job:

```typescript
const job = await client.jobs.create({
  name: "process-payment",
  payload: {
    paymentId: "payment_123",
  },
  idempotencyKey: "payment_123",
});
```

An idempotency key allows the same logical job to be safely submitted
again without unintentionally creating duplicate jobs.

---

# Repeatable Jobs

Create a job that runs repeatedly:

```typescript
const repeatableJob = await client.repeatableJobs.create({
  name: "cleanup",
  payload: {
    type: "cleanup",
  },
  schedule: {
    EveryMillis: 60_000,
  },
});
```

## List Repeatable Jobs

```typescript
const result = await client.repeatableJobs.list();

console.log(result.jobs);
```

## Get a Repeatable Job

```typescript
const job = await client.repeatableJobs.get(repeatableJobId);

console.log(job);
```

## Disable a Repeatable Job

```typescript
await client.repeatableJobs.disable(repeatableJobId);
```

## Delete a Repeatable Job

```typescript
await client.repeatableJobs.delete(repeatableJobId);
```

---

# Error Handling

JobRail exposes structured API errors through `JobRailError`:

```typescript
import { JobRail, JobRailError } from "jobrail";

const client = new JobRail({
  baseUrl: "http://localhost:3001",
});

try {
  await client.jobs.get("invalid-id");
} catch (error) {
  if (error instanceof JobRailError) {
    console.log(error.code);
    console.log(error.message);
    console.log(error.status);
  }
}
```

An error contains:

```typescript
error.code;
error.message;
error.status;
```

---

# Local Development

The JobRail API currently runs locally during development.

Start the JobRail API from the JobRail Rust repository:

```bash
cargo run -p axum-api
```

The API runs on:

```text
http://localhost:3001
```

Then configure the SDK:

```typescript
const client = new JobRail({
  baseUrl: "http://localhost:3001",
});
```

---

# Development

Clone the repository and install dependencies:

```bash
git clone https://github.com/YOUR_USERNAME/jobrail-js.git
cd jobrail-js
npm install
```

## Typecheck

```bash
npm run typecheck
```

## Build

```bash
npm run build
```

The build generates:

```text
dist/
├── index.js
└── index.d.ts
```

## Tests

```bash
npm test
```

The integration tests can be run against a locally running JobRail API.

```text
jobrail-js
    │
    │ HTTP
    ▼
localhost:3001
    │
    ▼
JobRail Axum API
    │
    ▼
Redis
```

---

# API Coverage

The SDK currently exposes the following functionality.

## Jobs

- Create jobs
- Get jobs
- List jobs
- Filter jobs
- Cancel jobs
- Retry jobs
- Get attempt history
- Delayed jobs
- Scheduled jobs
- Priority
- Maximum attempts
- Idempotency keys

## Repeatable Jobs

- Create repeatable jobs
- Get repeatable jobs
- List repeatable jobs
- Disable repeatable jobs
- Delete repeatable jobs

---

# Project Status

JobRail is currently under active development.

The current SDK is designed to work with a **self-hosted or locally
running JobRail API**.

Deployment, authentication, API keys, organizations, billing, usage
metering, and the JobRail Cloud control plane are planned for later
stages of the project.

---

# License

MIT

```text
GauravNardia
```
