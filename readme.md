Contact me, if you want, by discord: https://discordapp.com/users/@Alitalia22#5200/

# CRUD-API

## Prepare:

after cloning git repository

    `git clone https://github.com/Alitalia60/crud-api.git`

---

### 1. In terminal run

    `npm install`

### 2. Create file `.env` such as `.example.env`, or rename `.example.env` to `.env`

---

### 3. Launch the application in one of the ways

### At development mode:

single-server mode start

    `npm run start:dev`

cluster server mode

    `npm run start:multi`

### In production mode

if single server mode

    `npm run start:prod`

cluster server mode

    `npm run start:prod -- --multi`

---

### 4. Testing:

While testing, firstly, run in server in terminal:

and then, in _**other**_ terminal, run test:

    `npx jest`

---

### 5. APP USAGE

### API

- GET /api/users - get all users (remove password from response)

- GET /api/users/:userId - get the user by id (ex. /api/users/123-dfs-er4tr) (remove password from response)

- POST /api/users - create user

- PUT /api/users/:userId - update user

- DELETE /api/users/:userId - delete user
