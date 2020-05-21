# Running in development environment
Running the application requires npm and Node. The application can be run in a development environment by going to the `api` folder and running `node app.js`. The React front-end can be started by going to the `react-app` folder and running `npm start`.

Additionally, there needs to be a `.env` file in the project's root. The file needs to have `JWT_SECRET` variable used for signing JWT tokens. Example: `JWT_SECRET=verysecretkey`.