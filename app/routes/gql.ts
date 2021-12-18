import { LoaderFunction, ActionFunction, json } from 'remix'
import { typeDefs, resolvers } from '~/lib/apollo'
import { ApolloServer, createGraphqlHandler } from '~/lib/apollo/apollo.server'

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
})

export let loader: LoaderFunction = async ({ request, params }) => {
    return json({})
}

export let action: ActionFunction = async ({ request }) => {
    await apolloServer.start()
    const options = await apolloServer.createGraphQLServerOptions(request)
    const response = await createGraphqlHandler(options)(request)
    return response
}
