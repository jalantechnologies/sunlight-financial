exports.API = {
  TOKEN: 'gettoken/accesstoken',
  CREDIT_APP: 'credit/submit',
  CREATE_ACCOUNT: 'pricing/createaccount',
  OBJECT_UPDATE: 'object/applicant',
  QUOTE_UPDATE: 'object/quote',
  SEND_LOAN_DOCS: 'sendloandocs/request/',
  FETCH_EQUIPMENTS: 'equipment/fetchequipments/',
  SEND_SYSTEM_DESIGN: 'equipment/createequipment/',
  CREATE_APPLICANT: 'applicant/create/',
  SOFT_CREDIT_APP: 'prequal/create/',
  GET_PROJECT_DETAIL: 'getstatus/status/',
  CHANGE_ORDER: 'changeorder/submit/',
};

exports.ERROR = {
  TOKEN_NOT_GENERATED: 'Sunlight module encountered error while making request - Token request returned invalid status code',
  REQUEST_NOT_COMPLETED: 'Sunlight module encountered error while making request - API request returned invalid status code',
  INVALID_REQUEST: 'Sunlight module encountered error while making request - API call returned error',
};

exports.ENDPOINTS = {
  TEST_BASE_URL: 'https://test.connect.boomi.com/ws/rest/v1/pt',
  PROD_BASE_URL: 'https://connect.boomi.com/ws/rest/v1',
};
