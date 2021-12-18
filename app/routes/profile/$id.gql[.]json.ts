import { LoaderFunction, json } from "remix";
import { gql } from '@apollo/client';
import { isAuthenticated } from "~/lib/auth"
import { graphqlClient } from '~/lib/apollo'

const query = gql`
  query getProfileQuery($id: ID!) {
    profile(id: $id) {
      id
      username
      website
      avatar_url
    }
  }
`;

export let loader: LoaderFunction = async ({ request, params }) => {
    if (!(await isAuthenticated(request))) throw new Response("Unauthorized", {
        status: 401
    });
    const { data } = await graphqlClient.query({
        query,
        variables: {
            id: params.id
        }
    })
    return json({
        data
    })
}
