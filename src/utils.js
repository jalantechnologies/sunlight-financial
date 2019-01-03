const _ = require('lodash');

exports.parseAPIError = error => _.map(error, (er) => {
  let erMsg = er.errorMessage;
  erMsg += _.map(er.errorInstance, (ei) => {
    let erInstance = '';
    if (ei.fieldName && ei.errorMessage) {
      erInstance = `<br>${ei.fieldName} ${ei.errorMessage}`;
    }
    return erInstance;
  }).join(', ');
  return erMsg;
}).join(', ');
