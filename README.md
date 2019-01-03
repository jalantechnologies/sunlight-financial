# Sunlight Financial

Module for Sunlight Financial

## Installation

Install via [npm](https://www.npmjs.com/)

```bash
npm install sunlight-financial
```

## Configuration

```javascript
const sunlight = require('sunlight-financial');

sunlight.updateConfig({
  // your config here
});
```

**Available Options:**

Each entry here is a objection notation of what could be passed for config:

- `credentials.dellboomi.username` `REQUIRED` `String`
- `credentials.dellboomi.token` `REQUIRED` `String`
- `credentials.salesforce.username` `REQUIRED` `String`
- `credentials.salesforce.password` `REQUIRED` `String`
- `test` `Boolean` - Defaults to `false` and endpoint used for making API calls is a production one. Set this to `true` and test endpoint will be used instead.
- `accessTokenCacheExpiry` `Number` - Provide time in `ms` here to indicate period within which the access token is cached. Defaults to `1800000` (`30` minutes).

## Usage

- `sendCreditApp`

- `createPricingQuote`

- `quoteUpdate`

- `sendLoanDocs`

- `fetchEquipments`

- `sendSystemDesign`

- `createApplicant`

- `objectUpdate`

- `softCredit`

- `getProjectDetail`

- `initiateChangeOrder`
