export interface JobRailErrorResponse {
  error: {
    code: string;
    message: string;
  };
}

export class JobRailError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(
    message: string,
    code: string,
    status: number,
  ) {
    super(message);

    this.name = "JobRailError";
    this.code = code;
    this.status = status;
  }
}