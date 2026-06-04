### Initial Setup
- Fork repo
- Clone repo
- Add `.gitignore`: `$ echo "node_modules\n.next\nyarn.lock\n.yarn-error.log" > .gitignore`
- Add `.nvmrc`: `$ echo "v23.7.0" > .nvmrc`
- Add `package.json`: `$ echo "{}" > package.json`
- Manually install Next.js (Typescript) per [documentation](https://nextjs.org/docs/app/getting-started/installation) (using Yarn)
- `$ yarn run dev` to install further deps and types, add .tsconfig etc. and start dev server
- Hello world should be working


### Add API scripts
- Add to `package.json` `scripts` object:
  ```
  "catalog": "node catalog-service",
  "reservations": "node reservations-service"
  ```
- Update `package.json` `scripts.dev` value:
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