const { defaults: tsjPreset } = require('ts-jest/presets');
module.exports = {
  ...tsjPreset,
  testEnvironment: 'node',
};
