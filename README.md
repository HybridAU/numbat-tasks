# numbat-tasks
To-do list app

## Status
This is currently in development, at some point I'll make this repo public.

### MVP for me to start using a self-hosted version
- [X] If no list exists (i.e. on first load) create a "default list"
- [X] Some basic styling pin things to top, bottem and draw.
- [X] Dialog to add/edit tasks
- [X] Dialog to manage lists
- [X] Automation (build release docker images)

### MVP to make repo public
- [ ] Complete Authentication Provider
  - [X] Redirect to sign in if not logged in
  - [X] Use a component so we don't render anything on the page until after auth has done its thing
  - [X] Save / Load token in local storage
  - [ ] Use refresh token
  - [ ] Wrapper around fetch to handle 401
- [ ] Config to sign up and create users on a fresh install (not using django admin console.)
- [X] Sign out sometimes, but not always blows up. Figure out why and fix it.
  - [X] "A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition."
  - Lazy loading was the problem
- [ ] More Linting
  - [ ] Code review doctor
  - [ ] Dependabot
  - [X] JS linting (biome / typescript)
  - [ ] JS Tests (jest)
  - [X] Black -> Ruff
  - [X] Poetry -> Uv
- [X] Docs how to get set up from zero to self-hosted.
- [ ] Automatically bump versions after build
- [ ] Draw a better logo

### To be actually useful as a todo list app
- [ ] Get a domain name and host
  - [ ] Home page
  - [ ] Docs
  - [ ] Demo site
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
- [ ] Play a happy chime when a task is marked as completed

The irony of having a todo list written in markdown, on a todo list app is not lost on me.
