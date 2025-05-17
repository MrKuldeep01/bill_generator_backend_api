class ApiError {
  constructor(statusCode, message, error = []) {
    this.statusCode = statusCode;
    this.error = error;
    this.message = message;
    this.success = false;
    this.data = null;
  }
}

export default ApiError;
