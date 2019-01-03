const request = require('request');
const async = require('async');
const _ = require('lodash');

// module stuff
const Utils = require('./utils');
const Constants = require('./constants');
const Cache = require('./cache');

// default config
const ACCESS_TOKEN_CACHE_EXP = 1800000; // in ms, 30 min

// dynamic config
const Config = {
  baseURL: null,
  accessTokenCacheExpiry: null,
  credentials: {
    dellboomi: {
      username: null,
      token: null,
      authHeader: null,
    },
    salesforce: {
      username: null,
      password: null,
    },
  },
};

/**
 * @private
 * @function - makes request to the sunlight endpoint
 * @param options
 * @param {Function} cb
 */
function makeRequest(options, cb) {
  // begin process
  async.waterfall([
    // stage - acquire access token
    (done) => {
      // attempt to load from cache
      const cachedAccessToken = Cache.get('accessToken');
      if (cachedAccessToken) {
        // cache hit, conclude with cached one
        done(null, cachedAccessToken);
      } else {
        // cache miss
        // prepare access token request options
        const tokenReqOpts = {
          method: 'POST',
          uri: `${Config.baseURL}/${Constants.API.TOKEN}`,
          headers: {
            Authorization: Config.credentials.dellboomi.authHeader,
          },
          body: {
            username: Config.credentials.salesforce.username,
            password: Config.credentials.salesforce.password,
          },
          json: true,
        };
        // send token request
        request(tokenReqOpts, (err, response, body) => {
          if (err) return done(err);
          if (response.statusCode !== 200) return done(new Error(`${Constants.ERROR.TOKEN_NOT_GENERATED} - ${body}`));
          // all good
          /* eslint-disable-next-line camelcase */
          const {access_token} = body;
          Cache.set('accessToken', access_token, Config.accessTokenCacheExpiry);
          // conclude with access token
          return done(null, access_token);
        });
      }
    },
    // stage - make request via acquired access token
    (accessToken, done) => {
      const opts = options;
      // process url
      opts.url = `${Config.baseURL}/${opts.url}`;
      // process headers
      opts.headers = {
        Authorization: Config.credentials.dellboomi.authHeader,
        SFAccessToken: `Bearer ${accessToken}`,
      };
      // send request
      request(opts, (err, response, body) => {
        if (err) {
          // conclude with error
          done(err);
        } else if (response.statusCode !== 200) {
          // conclude with error
          done(new Error(`${Constants.ERROR.REQUEST_NOT_COMPLETED} - ${body}`));
        } else if (body && body.error) {
          // prepare error string
          const errStr = Utils.parseAPIError(body.error);
          // conclude with error
          done(new Error(`${Constants.ERROR.INVALID_REQUEST} - ${errStr}`));
        } else {
          // conclude with response received
          done(null, body);
        }
      });
    },
  ], cb);
}

/**
 * @public
 * @function - updates/initializes the config
 * @param config
 * @param {string} [config.credentials.dellboomi.username]
 * @param {string} [config.credentials.dellboomi.token]
 * @param {string} [config.credentials.salesforce.username]
 * @param {string} [config.credentials.salesforce.password]
 * @param {Boolean} [config.test=false]
 * @param {number} [config.accessTokenCacheExpiry=1800000]
 */
exports.updateConfig = (config) => {
  _.assign(Config, _.pick(config, [
    'credentials.dellboomi.username',
    'credentials.dellboomi.token',
    'credentials.salesforce.username',
    'credentials.salesforce.password',
  ]), {
    baseURL: config.test === true ? Constants.ENDPOINTS.TEST_BASE_URL : (Config.baseURL || Constants.ENDPOINTS.PROD_BASE_URL),
    accessTokenCacheExpiry: config.accessTokenCacheExpiry || Config.accessTokenCacheExpiry || ACCESS_TOKEN_CACHE_EXP,
  });
  // init/recalculate dellboomi.authHeader if username and token was provided
  if (_.has(config, 'credentials.dellboomi.token') && _.has(config, 'credentials.dellboomi.username')) {
    Config.credentials.dellboomi.authHeader = `Basic ${Buffer.from(`${config.credentials.dellboomi.username}:${config.credentials.dellboomi.token}`).toString('base64')}`;
  }
  // any update will cause the access token cache to reset
  Cache.reset('accessToken');
};

exports.sendCreditApp = (params, cb) => {
  // load from params
  const {project} = params;
  // prepare options
  const options = {
    method: 'POST',
    url: Constants.API.CREDIT_APP,
    body: {projects: [project]},
    json: true,
  };
  // make request
  makeRequest(options, (err, result) => {
    if (err) return cb(err);
    // success
    return cb(null, result.projects);
  });
};

exports.createPricingQuote = (params, cb) => {
  // load from params
  const {project} = params;
  // prepare options
  const options = {
    method: 'POST',
    url: Constants.API.CREATE_ACCOUNT,
    body: {projects: [project]},
    json: true,
  };
  // make request
  makeRequest(options, (err, result) => {
    if (err) return cb(err);
    // success
    return cb(null, result.projects);
  });
};

exports.quoteUpdate = (params, cb) => {
  // load from params
  const {project} = params;
  // prepare options
  const options = {
    method: 'POST',
    url: Constants.API.QUOTE_UPDATE,
    body: {projects: [project]},
    json: true,
  };
  // make request
  makeRequest(options, (err, result) => {
    if (err) return cb(err);
    // success
    return cb(null, result.projects);
  });
};

exports.sendLoanDocs = (params, cb) => {
  // load from params
  const {project} = params;
  // prepare options
  const options = {
    method: 'POST',
    url: Constants.API.SEND_LOAN_DOCS,
    body: {projects: [project]},
    json: true,
  };
  // make request
  makeRequest(options, (err, result) => {
    if (err) return cb(err);
    // success
    return cb(null, result.projects);
  });
};

exports.fetchEquipments = (params, cb) => {
  // load from params
  const {equipments} = params;
  // prepare options
  const options = {
    method: 'POST',
    url: Constants.API.FETCH_EQUIPMENTS,
    body: {equipmentManufacturers: [equipments]},
    json: true,
  };
  // make request
  makeRequest(options, (err, result) => {
    if (err) return cb(err);
    // success
    return cb(null, result.equipmentManufacturers);
  });
};

exports.sendSystemDesign = (params, cb) => {
  // load from params
  const {project} = params;
  // prepare options
  const options = {
    method: 'POST',
    url: Constants.API.SEND_SYSTEM_DESIGN,
    body: {projects: [project]},
    json: true,
  };
  // make request
  makeRequest(options, (err, result) => {
    if (err) return cb(err);
    // success
    return cb(null, result.projects);
  });
};

exports.createApplicant = (params, cb) => {
  // load from params
  const {project} = params;
  // prepare options
  const options = {
    method: 'POST',
    url: Constants.API.CREATE_APPLICANT,
    body: {projects: [project]},
    json: true,
  };
  // make request
  makeRequest(options, (err, result) => {
    if (err) return cb(err);
    // success
    return cb(null, result.projects);
  });
};

exports.objectUpdate = (params, cb) => {
  // load from params
  const {project} = params;
  // prepare options
  const options = {
    method: 'POST',
    url: Constants.API.OBJECT_UPDATE,
    body: {projects: [project]},
    json: true,
  };
  // make request
  makeRequest(options, (err, result) => {
    if (err) return cb(err);
    // success
    return cb(null, result.projects);
  });
};

exports.softCredit = (params, cb) => {
  // load from params
  const {softCreditObject} = params;
  // prepare options
  const options = {
    method: 'POST',
    url: Constants.API.SOFT_CREDIT_APP,
    body: {prequal: softCreditObject},
    json: true,
  };
  // make request
  makeRequest(options, (err, result) => {
    if (err) return cb(err);
    // success
    return cb(null, result);
  });
};

// get details about specific project
exports.getProjectDetail = (params, cb) => {
  // load from params
  const {projectId} = params;
  // prepare options
  const options = {
    method: 'POST',
    url: Constants.API.GET_PROJECT_DETAIL,
    body: {projectIds: projectId},
    json: true,
  };
  // make request
  makeRequest(options, (err, result) => {
    if (err) return cb(err);
    // success
    return cb(null, result.projects);
  });
};

// initiate change order request
// this is done to make changes to sunlight credit app after loan docs are signed
// such as new quote, new credit etc
exports.initiateChangeOrder = (params, cb) => {
  // load from params
  const {project} = params;
  // prepare options
  const options = {
    method: 'POST',
    url: Constants.API.CHANGE_ORDER,
    body: {projects: [project]},
    json: true,
  };
  // make request
  makeRequest(options, (err, result) => {
    if (err) return cb(err);
    // success
    return cb(null, result.projects);
  });
};
