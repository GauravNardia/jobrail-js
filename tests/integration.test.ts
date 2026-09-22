import { afterAll, beforeAll, describe, expect, test } from "vitest";

import { JobRail } from "../src/index.js";

const client = new JobRail({
  baseUrl: "http://localhost:3001",
});

describe("JobRail SDK integration", () => {
  let jobId: string;
  let repeatableJobId: string;

  beforeAll(async () => {
    try {
      await client.jobs.list();
    } catch (error) {
      throw new Error(
        "JobRail API is not running on http://localhost:3001",
        { cause: error },
      );
    }
  });

  test("creates a job", async () => {
    const job = await client.jobs.create({
      name: `sdk-test-${Date.now()}`,
      payload: {
        message: "hello from jobrail-js",
      },
    });

    expect(job.id).toBeTypeOf("string");
    expect(job.name).toContain("sdk-test");
    expect(job.state).toBe("Waiting");
    expect(job.attemptsMade).toBe(0);
    expect(job.attemptsStarted).toBe(0);

    jobId = job.id;
  });

  test("gets a job", async () => {
    const job = await client.jobs.get(jobId);

    expect(job.id).toBe(jobId);
    expect(job.name).toContain("sdk-test");
  });

  test("lists jobs", async () => {
    const page = await client.jobs.list({
      limit: 10,
    });

    expect(Array.isArray(page.jobs)).toBe(true);
    expect(page.jobs.length).toBeGreaterThan(0);
    expect(typeof page.hasMore).toBe("boolean");
  });

  test("lists jobs with a state filter", async () => {
    const page = await client.jobs.list({
      state: "Waiting",
      limit: 10,
    });

    expect(Array.isArray(page.jobs)).toBe(true);

    for (const job of page.jobs) {
      expect(job.state).toBe("Waiting");
    }
  });

  test("gets job attempts", async () => {
    const attempts = await client.jobs.attempts(jobId);

    expect(Array.isArray(attempts.attempts)).toBe(true);
  });

  test("cancels a job", async () => {
    const job = await client.jobs.cancel(jobId);

    expect(job.id).toBe(jobId);
    expect(job.state).toBe("Cancelled");
  });

  test("creates a repeatable job", async () => {
    const repeatableJob = await client.repeatableJobs.create({
      name: `sdk-repeatable-${Date.now()}`,
      payload: {
        message: "hello from SDK",
      },
      schedule: {
        EveryMillis: 60_000,
      },
    });

    expect(repeatableJob.id).toBeTypeOf("string");
    expect(repeatableJob.name).toContain("sdk-repeatable");
    expect(repeatableJob.enabled).toBe(true);

    repeatableJobId = repeatableJob.id;
  });

  test("gets a repeatable job", async () => {
    const repeatableJob =
      await client.repeatableJobs.get(repeatableJobId);

    expect(repeatableJob.id).toBe(repeatableJobId);
    expect(repeatableJob.enabled).toBe(true);
  });

  test("lists repeatable jobs", async () => {
    const result = await client.repeatableJobs.list();

    expect(Array.isArray(result.jobs)).toBe(true);

    const found = result.jobs.find(
      (job) => job.id === repeatableJobId,
    );

    expect(found).toBeDefined();
  });

  test("disables a repeatable job", async () => {
    const repeatableJob =
      await client.repeatableJobs.disable(repeatableJobId);

    expect(repeatableJob.id).toBe(repeatableJobId);
    expect(repeatableJob.enabled).toBe(false);
  });

  test("deletes a repeatable job", async () => {
    const repeatableJob =
      await client.repeatableJobs.delete(repeatableJobId);

    expect(repeatableJob.id).toBe(repeatableJobId);
  });
});