export class HttpError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

/**
 * This implementation is based on examples from pg-promise repo:
 * https://github.com/vitaly-t/pg-promise-demo/tree/master/JavaScript
 *
 */

export function wrapAndThrowError(error) {
  throw new HttpError(error.message, 500);
}
