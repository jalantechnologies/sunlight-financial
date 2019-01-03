const _ = require('lodash');

const Cache = {};

/**
 * @function - loads cache with value via key
 * @param {string} key
 * @param value
 * @param {number} [maxAge=infinite] - in ms
 */
exports.set = (key, value, maxAge) => {
  Cache[key] = {
    value, expiresAt: maxAge ? Date.now() + maxAge : 0,
  };
};

/**
 * @function - gets the value from cache for key
 * @param {string} key
 * @returns {*}
 */
exports.get = (key) => {
  // load entry
  const entry = Cache[key];
  // check if it's valid
  if (!entry || (entry.expiresAt && Date.now() > entry.expiresAt)) {
    return null;
  }
  // all good, conclude with value
  return entry.value;
};

/**
 * @function - removes entry for key from cache
 * @param {string} key
 */
exports.reset = (key) => {
  _.unset(Cache, key);
};
