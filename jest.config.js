export default {
  testEnvironment: 'node',

  moduleNameMapper: {
    '^Assets(.*)$': '<rootDir>/assets$1',
    '^Components(.*)$': '<rootDir>/src/components$1',
    '^Modules(.*)$': '<rootDir>/src/modules$1',
    '^UI(.*)$': '<rootDir>/src/ui$1',
    '^Styles(.*)$': '<rootDir>/src/styles$1',
    '^Utils(.*)$': '<rootDir>/src/utils$1',
  },
}
