import {buildSchema} from "graphql"

export const schema = buildSchema(
    `
        type User {
            id: ID
            email: String
            isActivated: Boolean
            activationLink: String
            password: String
        }
        
        input UserInput {
            id: ID!
            email: String
            isActivated: Boolean!
            activationLink: String!
            password: String
        }
       
        type Query {
            getAllUsers: [User]
            getUser(id: ID!): User
        }

        type Mutation {
            createUser(input: UserInput): User
        }
    `
)