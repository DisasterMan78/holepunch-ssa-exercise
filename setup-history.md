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
- Struggling to get `tsconfig.json` `"baseUrl"` to work for tidy import statements. Not important enough to warrant further investigation RN

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
- Add vitest with react-plugin and browser-playwright package
  ```
  $ yarn add -D vitest @vitejs/plugin-react @vitest/browser-playwright
  ```
- Update test commands in `./package.json` `scripts`:
  ```
  {
    ...,
    "scripts": {
      ...,
      "test:node": "vitest __tests__/api/ __tests__/utils/  --browser=false",
      "test:browser": "vitest __tests__/components/ __tests__/pages/"
    },
    ...
  }
  ```
- Add vitest browser support:
  ```
  $ yarn exec vitest init browser
  > Typescript
  > playwright
  > chromium
  > react
  > y
  ```
- Update `/vitest.config.ts`
  ```
  [...]
  test: {
    globals: true,
    browser: {
      [...]
      instances: [{ browser: 'chromium' as const }]
    },
    [...]
  }
  [...]
  ```
- Add playwright
  ```
  $ yarn add -D playwright
  $ yarn playwright install
  ```
  N.B. If there are issues downloading Chromium from the playwrght CDN, run `$ yarn test` and note the error, e.g.
  ```
  Error: browserType.launch: Executable doesn't exist at /Users/{username}/Library/Caches/ms-playwright/chromium-1223/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing
  ```

  Note the full path shown - yours may vary!

  (instructions for Mac OS based on https://github.com/microsoft/playwright/issues/28329#issuecomment-1825934342)
    - In `terminal` run ` $ brew install chromium`
    -
      ```
      $ mkdir /Users/{username}/Library/Caches/ms-playwright/chromium-1223/chrome-mac-x64/Google\ Chrome\ for\ Testing.app
      ```
    -
      ```
      $ cp -r /Applications/Chromium.app /Users/{username}/Library/Caches/ms-playwright/chromium-1223/chrome-mac-x64/Google\ Chrome\ for\ Testing.app
      ```

- Update `/tsconfig.json`
  ```
  {
    [...],
    "compilerOptions": {
      [...],
      "types": ["vitest/globals"]
    }
    [...],
  }
  ```
- Remove vitest sample code
  ```
  $ rm -rfv vitest-example
  ```