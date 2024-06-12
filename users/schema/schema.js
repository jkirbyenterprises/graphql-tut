const graphql = require('graphql');
const axios = require('axios');
const { response } = require('express');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
} = graphql;

const CompanyType = new GraphQLObjectType({
    name: "Company",
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        users: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
                // return fetch(`http://localhost:3000/companies/${parentValue.id}////users`)
                //     .then(response => response.json());
                return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
                    .then(response => response.data);
            }
        }
    })
})

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: {
            type: CompanyType,
            resolve(parentValue, args) {
                // return fetch(`http://localhost:3000/companies/${parentValue.companyId}`)
                //     .then(response => response.json());
                return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                    .then(response => response.data);
            }
        },
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                // return fetch(`http://localhost:3000/users/${args.id}`)
                //     .then(response => response.json());
                return axios.get(`http://localhost:3000/users/${args.id}`)
                    .then(response => response.data);
            }
        },
        company: {
            type: CompanyType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                // return fetch(`http://localhost:3000/companies/${args.id}`)
                //     .then(response => response.json());
                return axios.get(`http://localhost:3000/companies/${args.id}`)
                    .then(response => response.data);
            }
        }
    }
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType, // the type that is returned (does not have to match)
            args: { // fields provided on creation/update/delete
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                companyId: { type: GraphQLString },
            },
            resolve(parentValue, args) {
                const { firstName, age } = args;
                return axios.post('http://localhost:3000/users', { firstName, age })
                    .then(response => response.data);
            }
        },
        deleteUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString)},
            },
            resolve(parentValue, args) {
                axios.delete(`http://localhost:3000/users/${args.id}`, {})
                    .then(response => response.data);
            }
        },
        //replace with a PUT request (replaces all fields)
        // editUser: {
        //     type: UserType,
        //     args: {
        //         id: { type: new GraphQLNonNull(GraphQLString)},
        //         firstName: { type: new GraphQLNonNull(GraphQLString) },
        //         age: { type: new GraphQLNonNull(GraphQLInt) },
        //         companyId: { type: GraphQLString },
        //     },
        //     resolve(parentValue, args) {
        //         const { id, firstName, age, companyId } = args;
        //         axios.put(`http://localhost:3000/users/${id}`, { firstName, age, companyId })
        //             .then(response => response.data);
        //     }
        // }
        // update provided fields with a PATCH request (replaces only provided fields)
        editUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString)},
                firstName: { type: GraphQLString },
                age: { type: GraphQLInt },
                companyId: { type: GraphQLString },
            },
            resolve(parentValue, args) {
                axios.patch(`http://localhost:3000/users/${args.id}`, args)
                    .then(response => response.data);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation,
});