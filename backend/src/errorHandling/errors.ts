export class BaseError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class InternalServerError extends BaseError {
  constructor() {
    super('Internal Server Error', 500);
  }
}
