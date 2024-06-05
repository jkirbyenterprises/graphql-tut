const express = require('express');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const schema = require('./schema/schema');

const app = express();

// Test Query
// {
//   user(id: "23") {
//     id,
//     firstName,
//     age,
//     company{
//       id,
//       name,
//       description
//     }
//   }
// }

app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true,
}));

app.listen(4000, () => {
  console.log('Listening');
});
