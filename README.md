# numbat-tasks
To-do list app

## Status
This is currently in development, enough of the API is fleshed out that I can start on the front end. Once I've got an MVP there are many more things I'd like to add:

- [X] If no list exists (i.e. on first load) create a "default list"
- [X] Some basic styling pin things to top, bottem and draw.
- [ ] Dialog to add/edit tasks
- [ ] Dialog to manage lists
- [ ] Basic sorting and filtering
- [ ] Sign out sometimes, but not always blows up. Figure out why and fix it.
  - [ ] "A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition."
- [ ] More Linting
  - [ ] Code review doctor
  - [ ] Dependabot
  - [ ] JS linting tests (biome)
  - [ ] Black -> Ruff
  - [ ] Poetry -> Uv
- [ ] Automation (build release docker images)
- [ ] Webauthn for login
- [ ] Reorder / custom order for tasks
- [ ] Share tasks lists with other users
- [ ] Progressive web app
- [ ] Figure out how to get refresh token working
  - [ ] Have a nice redirect when getting a 401 from the backend.


The irony of having a todo list written in markdown, on a todo list app is not lost on me.