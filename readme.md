Contact me, if you want, by discord: https://discordapp.com/users/@Alitalia22#5200/

# CRUD-API

## Usage:

---

### 1. In terminal run

    `npm install`

### 2. Create file `.env` such as `.example.env`, or rename `.example.env` to `.env`

### 3. Launch the application in one of the ways

### At development mode:

if you want to run application as sinle server, in `.env` set key

`MULTI_MODE=false`.

Otherwise, if application runs as cluster

`MULTI_MODE=true`

and start

    `npm run start:dev`

### In production mode

if single server mode

    `npm run start:prod`

cluster server mode

    `npm run start:multi`

### 5. Testing:

While testing, firstly, run in terminal:

    `npm run test:dev`

and then, in _**other**_ terminal, run test:

    `npx jest`
