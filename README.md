
# botanalytics-study-case

This is a backend project developed for a Botanalytics case study, featuring secure user authentication with registration, login, logout, bcrypt encryption, and JWT token authentication, complemented by comprehensive unit tests.

## Enviroment Variables

To run this project, you need to configure the required environment variables by renaming the `.env.example` file. Simply remove the **.example** extension to create your `.env` file with your specific settings.

## Installation

Clone the Project:

```bash
  git clone https://github.com/SelenKockar/botanalytics-study-case.git
```

Navigate to the Project Directory:

```bash
  cd botanalytics-study-case
```

Install Dependencies:

```bash
  npm install
```

Build, Fetch, and Run Docker Containers:

```bash
  docker-compose up -d
```

Generate the Prisma Client:

```bash
  npm run generate
```

Migrate Database with Prisma:

```bash
  npm run db:migrate:dev
```

Start the Server:

```bash
  npm run start
```

  
## Unit testing

To run the tests, execute the following command:

```bash
  npm test
```

  
## Postman
A Postman collection for this project is available [here](https://warped-trinity-749453.postman.co/workspace/New-Team-Workspace~e291c0e0-e070-436b-919d-6905245a8dbb/collection/32027462-f956947a-90da-4192-b6ea-60116d5e621f?action=share&creator=32027462)

## Endpoints

| Method   | URL                                      | Description                              |
| -------- | ---------------------------------------- | ---------------------------------------- |
| `POST`   | `/auth/signup`                           | Registers a new user account.            |
| `POST`   | `/auth/login`                            | Authenticates and logs in a user.        |
| `POST`   | `/auth/logout`                           | Logs out a currently authenticated user. |
| `GET`    | `/auth/protected`                        | Validates user authentication status.    |

  
## Technologies Used

**Database:** PostgreSQL

**Server:** Node, Express, Prisma

  
