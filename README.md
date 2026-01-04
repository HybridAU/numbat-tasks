# Numbat Tasks

A self-hosted to do list app

<img src="docs/docs/assets/numbat.svg" alt="Numbat Tasks logo" width="100" height="100">

## Why *another* to-do list app
Numbat tasks aims to be a personal to-do list app in the Goldilocks zone between too simple and too complex. 
There are [thousands of half built](https://www.commitstrip.com/en/2014/11/25/west-side-project-story/)
to-do list apps out there, usually with about 3 commits last touched 5 years ago. There is a handful of 
well-supported and maintained projects, but many of them say things like "Jira replacement with Kanban boards, 
gantt chart, and burndown charts that the whole team can use". 

I wanted a privacy-friendly place to put my shopping list that I felt comfortable exposing to the internet.

Plus, nothing says "procrastinating" like building a massively over-engineered to-do list app,
rather than actually doing the things.

## Status
This still very much a work in progress, there are some core features missing (listed below).
It's stable enough, with minimal features that I've actually managed to use it myself for 
things like my shopping list and general to-do list for over a year. 

Once I get it feature complete enough that I can convince my wife to switch from Google Keep,
then I'll know I've truly succeeded.

## Core missing features
- [ ] Config to sign up and [manage users](https://github.com/HybridAU/numbat-tasks/issues/32). 
      Especially on a fresh install, it would be nice to be able to do everything through a nice
      web interface without needing to run django management commands or use the django admin console.
- [ ] Get a domain name and host
  - [ ] Home page
  - [ ] Docs
  - [ ] Demo site
- [ ] [Search tasks](https://github.com/HybridAU/numbat-tasks/issues/34) within the current list
- [ ] Webauthn for login
- [ ] Share tasks lists with other users
- [ ] Start date / Due date for 
  - [ ] Push notifications
- [ ] Sub tasks
- [ ] Play a happy chime when a task is marked as completed

The irony of having a todo list written in markdown, on a todo list app is not lost on me.
