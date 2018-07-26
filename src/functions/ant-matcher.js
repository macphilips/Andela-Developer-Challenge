/**
 * Code Source from: https://github.com/azagniotov/ant-style-path-matcher
 *
 */

import { isEmpty } from './util';

class AntPathMatcher {
  static get ASTERISK() {
    return '*';
  }

  static get QUESTION() {
    return '?';
  }

  static get BLANK() {
    return ' ';
  }

  constructor(pathSeparator, ignoreCase, matchStart, trimTokens) {
    this.pathSeparator = pathSeparator;
    this.ignoreCase = ignoreCase;
    this.matchStart = matchStart;
    this.trimTokens = trimTokens;
  }

  isMatch(pattern, path) {
    if (isEmpty(pattern)) {
      return isEmpty(path);
    }
    if (isEmpty(path) && pattern.charAt(0) === this.pathSeparator) {
      if (this.matchStart) {
        return true;
      }
      if (pattern.length === 2 && pattern.charAt(1) === AntPathMatcher.ASTERISK) {
        return false;
      }
      return this.isMatch(pattern.substring(1), path);
    }

    const patternStart = pattern.charAt(0);

    if (patternStart === AntPathMatcher.ASTERISK) {
      if (pattern.length === 1) {
        return isEmpty(path) || (path.charAt(0) !== this.pathSeparator
          && this.isMatch(pattern, path.substring(1)));
      }
      if (this.doubleAsteriskMatch(pattern, path)) {
        return true;
      }

      let start = 0;
      while (start < path.length) {
        if (this.isMatch(pattern.substring(1), path.substring(start))) {
          return true;
        }
        start += 1;
      }
      return this.isMatch(pattern.substring(1), path.substring(start));
    }

    const pointer = this.skipBlanks(path);
    const match = this.isMatch(pattern.substring(1), path.substring(pointer + 1));
    return !isEmpty(path) && (this.equal(path.charAt(pointer), patternStart)
      || patternStart === AntPathMatcher.QUESTION)
      && match;
  }


  doubleAsteriskMatch(pattern, path) {
    if (pattern.charAt(1) !== AntPathMatcher.ASTERISK) {
      return false;
    }
    if (pattern.length > 2) {
      return this.isMatch(pattern.substring(3), path);
    }

    return false;
  }

  /*
     doubleAsteriskMatch(  pattern,   path) {
      if (pattern.charAt(1) != AntPathMatcher.ASTERISK) {
          return false;
      } else if (pattern.length > 2 && isMatch(pattern.substring(3), path)) {
          return true;
      }
       pointer = 0;
      for ( idx = 0; idx < path.length; idx++) {
          if (path.charAt(idx) == pathSeparator) {
              pointer = idx;
              break;
          }
      }
      return isMatch(pattern.substring(2), path.substring(pointer));
  }
   */

  skipBlanks(path) {
    let pointer = 0;
    if (this.trimTokens) {
      while (!isEmpty(path) && pointer < path.length
      && path.charAt(pointer) === AntPathMatcher.BLANK) {
        pointer += 1;
      }
    }
    return pointer;
  }

  equal(pathChar, patternChar) {
    let result = pathChar === patternChar;
    if (this.ignoreCase) {
      result = pathChar.toLowerCase() === patternChar.toLowerCase();
    }
    return result;
  }
}

export default class Builder {
  constructor() {
    this.pathSeparator = '/';
    this.ignoreCase = false;
    this.matchStart = false;
    this.trimTokens = false;
  }

  withPathSeparator(pathSeparator) {
    this.pathSeparator = pathSeparator;
    return this;
  }

  withIgnoreCase() {
    this.ignoreCase = true;
    return this;
  }

  withMatchStart() {
    this.matchStart = true;
    return this;
  }

  withTrimTokens() {
    this.trimTokens = true;
    return this;
  }

  create() {
    return new AntPathMatcher(this.pathSeparator, this.ignoreCase,
      this.matchStart, this.trimTokens);
  }
}
