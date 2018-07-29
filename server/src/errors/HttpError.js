export default class HttpError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code || 500;
  }

  static wrapAndThrowError(error) {
    throw new HttpError(error.message);
  }

  static sendError(err, res) {
    const code = err.code || 500;
    const { message } = err;
    res.status(code).send({ message });
  }
}
