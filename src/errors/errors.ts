export class ConflictError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 409;
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

export class BadRequestError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 400;
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}
