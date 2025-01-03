# numbat-tasks
To-do list app

## Status
This is currently in development, at some point I'll make this repo public.

### MVP for me to start using a self-hosted version
- [X] If no list exists (i.e. on first load) create a "default list"
- [X] Some basic styling pin things to top, bottem and draw.
- [X] Dialog to add/edit tasks
- [ ] Dialog to manage lists
- [ ] Automation (build release docker images)

### MVP to make repo public
- [ ] Config to sign up and create users on a fresh install (not using django admin console.)
- [ ] Figure out how to get refresh token working
  - [ ] Have a nice redirect when getting a 401 from the backend rather than an error page.
- [ ] Sign out sometimes, but not always blows up. Figure out why and fix it.
  - [ ] "A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition."
- [ ] More Linting
  - [ ] Code review doctor
  - [ ] Dependabot
  - [ ] JS linting tests (biome)
  - [ ] Black -> Ruff
  - [ ] Poetry -> Uv
- [ ] Docs how to get set up from zero to self-hosted.

### To be actually useful as a todo list app
- [ ] Basic sorting and filtering (by date / name)
- [ ] Search tasks
  - [ ] Search current list (client side)
  - [ ] Search all lists (server side)
- [ ] Reorder / custom order for tasks (maybe https://github.com/incuna/django-orderable)
- [ ] Webauthn for login
- [ ] Share tasks lists with other users
- [ ] Progressive web app
- [ ] Start date / Due date for 
  - [ ] Push notifications
- [ ] Sub tasks

The irony of having a todo list written in markdown, on a todo list app is not lost on me.