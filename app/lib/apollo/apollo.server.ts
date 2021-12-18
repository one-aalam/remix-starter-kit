import {
    GraphQLOptions,
    HttpQueryError,
    runHttpQuery,
    ApolloServerBase
  } from 'apollo-server-core';

  export function createGraphqlHandler(
    options: GraphQLOptions,
  ) {
    if (!options) {
      throw new Error('Apollo Server requires options.');
    }

    if (arguments.length > 1) {
      throw new Error(
        `Apollo Server expects exactly one argument, got ${arguments.length}`,
      );
    }

    const graphqlHandler = async (req: Request): Promise<Response> => {
      const url = new URL(req.url);
      const query =
        req.method === 'POST'
          ? await req.json()
          : {
              query: url.searchParams.get('query'),
              variables: url.searchParams.get('variables'),
              operationName: url.searchParams.get('operationName'),
              extensions: url.searchParams.get('extensions'),
            };

      return runHttpQuery([req], {
        method: req.method,
        options: options,
        query,
        request: req as Request,
      }).then(
        ({ graphqlResponse, responseInit }) =>
          new Response(graphqlResponse, responseInit),
        (error: HttpQueryError) => {
          if ('HttpQueryError' !== error.name) throw error;

          const res = new Response(error.message, {
            status: error.statusCode,
            headers: error.headers,
          });

          return res;
        },
      );
    };

    return graphqlHandler;
}

export class ApolloServer extends ApolloServerBase {
    async createGraphQLServerOptions(request: Request): Promise<GraphQLOptions> {
      return super.graphQLServerOptions({ request });
    }
}
