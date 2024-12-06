class Exception extends Error {
  constructor(message, code) {
    super(message);

    this.code = code;
    this.isOperational = true;
  }
}

module.exports = Exception;
