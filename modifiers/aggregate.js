/**
 * Copyright (c) Weekendesk SAS.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { fromJS } = require('immutable');
const PipelineError = require('../entities/PipelineError');
const request = require('../services/request');
const urlBuilder = require('../services/urlBuilder');

module.exports = (method, url, key) => {
  const buildedUrl = urlBuilder(url);
  return async (container) => {
    try {
      const { body, statusCode } = await request(container)[method](buildedUrl);

      const containerMap = fromJS(container);
      if (!key) {
        return containerMap.mergeDeep(fromJS({ body, statusCode })).toJS();
      }
      return containerMap.mergeDeep(fromJS({ body: { [key]: body }, statusCode })).toJS();
    } catch (err) {
      const error = new PipelineError(err, err.response);
      throw error;
    }
  };
};
