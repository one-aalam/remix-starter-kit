import { ApolloClient, InMemoryCache } from '@apollo/client';
import { SchemaLink } from '@apollo/client/link/schema';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { supabase } from '~/lib/supabase/supabase.server'

const typeDefs = /* GraphQL */`
    schema {
        query: Query
    }
    type Query {
        profile(id: ID!): Profile
    }
    type Profile {
        id: ID!
        username: String
        website: String
        avatar_url: String
    }
`;

const resolvers = {
    Query: {
        profile: async (root: any, args: { id: string }, context: any, info: any) => {
            // Bring your Prisma/ORM, API calls here...
            const { data: profile , error } = await supabase.from('profiles').select(`id, username, website, avatar_url`).eq('id', args.id).single()
            return profile
        }
    }
}

const schema = makeExecutableSchema({ typeDefs, resolvers });

export const graphqlClient = new ApolloClient({
    cache: new InMemoryCache(),
    ssrMode: true,
    link: new SchemaLink({ schema })
});
