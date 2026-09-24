import { JobRail } from "../src/index.js";

const client = new JobRail({
  baseUrl: "http://localhost:3001",
});

const job = await client.jobs.create({
  name: "send-email",
  payload: {
    to: "user@example.com",
    subject: "Hello from JobRail",
  },
});

console.log("Created job:", job);