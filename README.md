# Project Name

## [RoamPacker](https://roam-packer-app.vercel.app/)

## Description

Meeting app for backpackers. Matching system, chat between saved matches and itinerary creation to plan the trip and share with a selected match.

#### [Client Repo here](https://github.com/abenedicti/roam-packer-client)

#### [Server Repo here](https://github.com/abenedicti/RoamPacker-server)

## Technologies & Libraries used

CSS, Javascript, React, axios, React Context, MongoDB, Lottie, RandomUser API, Leaflet, Cloudinary, OpenTripMap API, GeoNames API

## Backlog Functionalities

Share itinerary in real time, improvement of the chat system and add AI tool to build a trip

# Client Structure

## User Stories

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault
- **sign up** - As a user I want to sign up on the webpage to access to the main functionnalities of the app
- **login** - As a user I want to be able to log in on the webpage so that I can get back to my account
- **logout** - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account
- **homepage** - As a user I want to be able to access the homepage so that I see what the app is about, navbar displayed with the app functionnality and login
- **destinations** - As a user I want to search and filter by continent, countries and cities and see all the activities related
- **match** - As a user I want to fill a form to find a partner who has the same interests
- **itinerary** - As a user I want to create an itinerary , update it and share it with my selected match
- **favorites** - As a user I can add or remove some activities to my favorites and add them to the chosen itinerary

## Client Routes

## React Router Routes (React App)

Public
├─ / (Home)
├─ /destinations
└─ /login/signup
|
v
Authenticated
├─ /matches
├─ /messages
├─ /itineraries
│ ├─ /create-itinerary
│ └─ /my-itineraries
└─ /profile
├─ /profile
└─ /favorites

## Other Components

- Navbar
- Footer
- Modals (DeleteModal, NotificationModal, RequiredFieldModal, MessageModal)
- PrivateRoute
- LoadingSpinner
- Map
- Logout

## Services

- Auth Service
  - auth.login(user)
  - auth.signup(user)
  - auth.verify()

- Backlog Service
  - filter
  - autocompletion
  - required field

- External API
  - Randomuser API
  - GeoNames API
  - OpenTripMap API

## Context

- auth.context
