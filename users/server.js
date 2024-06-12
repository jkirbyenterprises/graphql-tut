const express = require('express');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const schema = require('./schema/schema');

const app = express();

app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true,
}));

app.listen(4000, () => {
  console.log('Listening');
});

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
// Multiple Root Queries
// query fetchCompany {
//   company(id: "2")
//   {
//     id,
//     name,
//     description
//     users
//     {
//       id,
//       firstName,
//       age,
//       company
//       {
//         name
//       }
//     }
//   }
// }
// more complex
// query fetchCompany{
//   user(id:"23")
//   {
//     id,
//     firstName,
//     age
//   }
//   company(id: "2")
//   {
//     ...companyDetails,
//     users
//     {
//       id,
//       firstName,
//       age
//     }
//   }
//   anotherCompany: company(id: "1")
//   {
//     ...companyDetails,
//   }
// }

// fragment companyDetails on Company
// {
//   id,
//   name,
//   description
// }

// add user mutation
// mutation
// {
//   addUser(firstName: "Stephen", age: 26)
//   {
//     id,
//     firstName,
//     age
//   }
// }
// delete user mutation
// mutation
// {
//   deleteUser(id: "MLqR8Fk")
//   {
//     id,
//     firstName,
//     age
//   }
// }
// edit user mutation
// mutation
// {
//   editUser(id:"0V3bUWn", firstName: "Steve", age: 27)
//   {
//     id,
//     firstName,
//     age
//   }
// }
// edit user mutation (PATCH)
// mutation
// {
//   editUser(id:"0V3bUWn", firstName: "Stephen")
//   {
//     id,
//     firstName,
//     age
//   }
// }