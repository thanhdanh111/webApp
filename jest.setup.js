const { toMatchImageSnapshot } = require('jest-image-snapshot');

require('dotenv').config({ path: './.test.env' });

expect.extend({ toMatchImageSnapshot });