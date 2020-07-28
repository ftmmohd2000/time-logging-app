# Graphql-Typescript-PostgreSQL Boilerplate

<center style="display:flex; justify-content:space-around; flex-flow: row nowrap" >
  <img 
    src="./assets/images/GraphQL_Logo.svg" 
    alt="GraphQL Icon" 
    height=100
  />
  <img 
    src="./assets/images/TypeScript_Logo.svg" 
    alt="TypeScript Icon" 
    height=100
  />
  <img 
    src="./assets/images/PostgreSQL_Logo.svg" 
    alt="PostgreSQL Icon" 
    height=100
  />
</center>
<br>

---

This is a boilerplate for a server built with the above
graphql-ts-psql stack, inspired by [Ben Awad](https://www.youtube.com/channel/UC-8QAzbLcRglXeN_MY9blyw "Ben's YouTube Channel").

## Key features include:

- TypeGraphQL annotations making it extremely easy to create
  new GraphQL features.
- Manual User authentication
- OAuth with **Google, Github, and Twitter**
- Tests with a 100% coverage _( Jest )_
- Feature based system for quick addition of new modules

---

## Getting set up

1. Clone this repo onto your local machine
2. Create a 'config' folder in src and add the required
   environment variables _( see environment variables section )_
3. Run 'yarn' in the root of the project
4. Make sure postgresql is up and running on port 5432 (change
   port as required in ormconfig.json)
5. Run 'yarn dev' to start the server in development mode.
6. Enjoy!

---

## Environment Variables

_Check .env.example for a skeleton_

- NODE_ENV - set node environment
  > _production, development, or test_
- SESSION_SECRET - set secret key for express-session
  > _ideally, a random alphanumeric string_
- FRONTEND_HOST - url for the frontend of your application
- PORT - the port your development server will run on
  > _port number_
- CLIENT_ID - the client ID provided by the OAuth provider
  > _one for each OAuth provider_
- CLIENT_SECRET - the client secret provided by the OAuth
  provider
  > _one for each OAuth provider_
