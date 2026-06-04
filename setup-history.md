### Initial Setup
- Fork repo
- Clone repo
- Add `/.gitignore`: `$ echo "node_modules\n.next\nyarn.lock\n.yarn-error.log" > .gitignore`
- Add `/.nvmrc`: `$ echo "v23.7.0" > .nvmrc`
- Add `/package.json`: `$ echo "{}" > package.json`
- Manually install Next.js (Typescript) per [documentation](https://nextjs.org/docs/app/getting-started/installation) (using Yarn)
- `$ yarn run dev` to install further deps and types, add .tsconfig etc. and start dev server
- Hello world should be working


### Add API scripts
- Add to `/package.json` `scripts` object:
  ```
  "catalog": "node catalog-service",
  "reservations": "node reservations-service"
  ```
- Update `/package.json` `scripts.dev` value:
  ```
  "dev": "yarn catalog & yarn reservations & next dev",
  ```
- Restart dev server
  ```
  catalog listening on port 4040
  reservations listening on port 5050
  ▲ Next.js 16.2.7 (Turbopack)
  - Local:         http://localhost:3000
  - Network:       http://192.168.1.212:3000
  ✓ Ready in 1140ms
  ```

Corners cut:
- Using NextJS as quickest way for me to get an API running. Likely not best tool for the job - ideally would research options, look at skillset of team to decide best choice.
- Using currently installed Node @23.7. Will update if required. Should be using LTS

### Update Node

Lol. Current Jest needs >=24

- `$ nvm i 24.16`
- Update `/.nvmrc` to reference 24.16

### Add testing support

-
  ```
  $ yarn add -D jest jest-environment-jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom ts-node @types/jest
  ```

- Create `./jest.config.ts`:
  ```
  import type { Config } from 'jest'
  import nextJest from 'next/jest.js'

  const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: './',
  })

  // Add any custom config to be passed to Jest
  const config: Config = {
    coverageProvider: 'v8',
    testEnvironment: 'jsdom',
    // Add more setup options before each test is run
    // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  }

  // createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
  export default createJestConfig(config)
  ```
- Add test commands in `./package.json` `scripts`:
  ```
  {
    ...,
    "scripts": {
      ...,
      "test": "jest",
      "test:watch": "jest --watch"
    },
    ...
  }
  ```
- Add MSW (Mock Service Worker) for mocking API test implementations
  ```
  $ yarn add -D msw
  ```
- Remove Yarn cos it doesn't want to play nice with MSW anymore
  ```
  $ yarn remove jest jest-environment-jsdom @testing-library/jest-dom @types/jest
  $ rm jest.config
  ```
- Add vitest
  ```
  $ yarn add -D vitest
  ```
- Update test commands in `./package.json` `scripts`:
  ```
  {
    ...,
    "scripts": {
      ...,
      "test": "vitest",
      "test:watch": "vitest --watch"
    },
    ...
  }
  ```