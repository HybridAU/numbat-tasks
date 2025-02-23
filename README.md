# Numbat Tasks
Because if there is one thing the world needs it's another half-baked to-do list app.

## Status
This is currently in development, at some point I'll make this repo public.

### MVP for me to start using a self-hosted version
- [X] If no list exists (i.e. on first load) create a "default list"
- [X] Some basic styling pin things to top, bottem and draw.
- [X] Dialog to add/edit tasks
- [X] Dialog to manage lists
- [X] Automation (build release docker images)

### MVP to make repo public
- [X] Basic Authentication Provider
  - [X] Redirect to sign in if not logged in
  - [X] Use a component so we don't render anything on the page until after auth has done its thing
  - [X] Save / Load token in local storage
  - [X] Use refresh token
- [ ] Config to sign up and create users on a fresh install (not using command line)
- [X] Sign out sometimes, but not always blows up. Figure out why and fix it.
  - [X] "A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition."
  - Lazy loading was the problem
- [X] Docs how to get set up from zero to self-hosted.
- [ ] Automatically bump versions after build
- [ ] Draw a better logo
- [ ] Get a domain name and host
  - [ ] Home page
  - [ ] Docs
  - [ ] Demo site

### Things needed to make Numbat Tasks actually useful
- [ ] Sub tasks
- [ ] Play a happy chime when a task is marked as completed https://github.com/joshwcomeau/use-sound
- [ ] Share tasks lists with other users
- [ ] Basic sorting and filtering of tasks (sort by date / name)
- [ ] More advanced ordering. Reorder / custom order for tasks (maybe https://github.com/incuna/django-orderable)
- [ ] Start date / Due date for tasks
  - [ ] Push notifications
- [ ] Improved auth provider
  - [ ] Show nice toast notification if kicking the user back to the login screen.
  - [ ] Wrapper around fetch to handle 401
- [ ] Progressive web app
  - [ ] Support offline updates. 
    - How would that work?
    - save all tasks to local storage?
    - create an all tasks API endpoint for initial load to sync everything?
    - sync changes with latest updates winning on conflicts?
- [ ] More Linting
  - [ ] Code review doctor
  - [ ] Dependabot
  - [X] JS linting (biome / typescript)
  - [ ] JS Tests (jest)
  - [X] Black -> Ruff
  - [X] Poetry -> Uv
- [ ] Search tasks
  - [ ] Search current list (client side)
  - [ ] Search all lists (server side)
- [ ] Webauthn for login

The irony of having a todo list written in markdown, on a todo list app is not lost on me.
