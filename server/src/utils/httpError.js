export default class HttpError extends Error {
  constructor(message, code = 500, status = 'Unknown Error') {
    super();
    this.code = code;
    this.message = message;
    this.status = status;
  }

  static wrapAndThrowError(error) {
    throw new HttpError(error.message);
  }

  static sendError(err, res) {
    let code = err.code || 500;
    if (code < 99 || code > 599) {
      code = 500;
    }
    const { message, status } = err;
    // todo Remove statement
    res.status(code).send({ message, status });
  }
}
