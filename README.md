# HeroApp

Small Angular app to manage superheroes.
CRUD, search, pagination and SSR with hydration.

## Stack

* Angular 21
* Angular Material
* Angular SSR
* json-server
* Vitest
* Node.js 20

## Run locally

### Requirements

* Node.js 20+
* npm 10+

### Install

```bash
npm install
```

### Start the app

```bash
# Terminal 1 — mock API
npm run api

# Terminal 2 — dev server
npm start
```

Open http://localhost:4200

---

## Run with Docker

```bash
docker compose up --build
```

Open http://localhost

Nginx routes:

* `/api` → json-server
* everything else → Angular SSR

---

## Tests

```bash
npm test
```

With coverage:

```bash
npx ng test --coverage --watch=false
```
