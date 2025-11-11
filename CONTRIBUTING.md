## Contributing

Conventional Commits format.

Examples:

- feat(backend): implement user login endpoint
- fix(auth): handle token expiration in refresh flow
- chore(utils): add logging utility functions
- docs(readme): update API usage example

Format: <type>(scope): <short description>

Common types:
- feat: a new feature
- fix: a bug fix
- docs: documentation only changes
- style: formatting, missing semi-colons, etc
- refactor: code change that neither fixes a bug nor adds a feature
- perf: a code change that improves performance
- test: adding missing tests or correcting existing tests
- chore: changes to the build process or auxiliary tools

When you clone this repo, run:

```powershell
npm install
npm run prepare
```

The `prepare` script installs Husky hooks so commit messages are validated locally. If a commit message doesn't follow the rules, the commit will be blocked until you update the message.
