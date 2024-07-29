import type { Config } from '@jest/types'

const baseDir = '<rootDir>/src';
const baseDirTest = '<rootDir>/test';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true,
    collectCoverage: true,
    collectCoverageFrom: [
        `${baseDir}/**/*.ts`
    ],
    testMatch: [
        `${baseDirTest}/**/*.test.ts`
    ],
}

export default config;