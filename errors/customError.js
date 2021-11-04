class CustomError extends Error {
  constructor(message, status, type) {
    super(message);
    (this.status = status), (this.type = type);
  }
}

module.exports = CustomError;
