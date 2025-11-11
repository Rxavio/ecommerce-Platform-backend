export class AppError extends Error {
  public readonly isOperational: boolean;

  constructor(
    public statusCode: number,
    message: string,
    public errors?: string[],
  ) {
    super(message);
    this.name = "AppError";
    this.isOperational = true;

    // Fix prototype chain
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, errors?: string[]) {
    return new AppError(400, message, errors);
  }

  static unauthorized(message: string = "Unauthorized", errors?: string[]) {
    return new AppError(401, message, errors);
  }

  static forbidden(message: string = "Forbidden", errors?: string[]) {
    return new AppError(403, message, errors);
  }

  static notFound(message: string = "Not found", errors?: string[]) {
    return new AppError(404, message, errors);
  }

  static internal(
    message: string = "Internal server error",
    errors?: string[],
  ) {
    return new AppError(500, message, errors);
  }

  static conflict(
    message: string = "Resource already exists",
    errors?: string[],
  ) {
    return new AppError(409, message, errors);
  }
}
