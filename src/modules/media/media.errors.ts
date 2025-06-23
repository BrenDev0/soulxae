import AppError from "../../core/errors/AppError";

export class S3Error extends AppError {
  constructor(message = 's3 bucket operation failed', context?: Record<string, unknown>) {
    super(message, 500, false, context);
    this.name = 'S3Error';
  }
}
