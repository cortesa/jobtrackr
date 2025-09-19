import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client"

type GetApolloClientArgs = {
  url: string,
  headers?: Record<string, string>
}

let globalClient: ApolloClient | null = null
let lastUrl: string | null = null

export function getApolloClient ({
  url,
  headers = {}
}: GetApolloClientArgs): {client: ApolloClient} {
  if (!globalClient || lastUrl !== url) {
    globalClient = new ApolloClient({
      link: new HttpLink({ uri: url, headers }),
      cache: new InMemoryCache()
    })
    console.log("Apollo", globalClient)
    lastUrl = url
  }

  return { client: globalClient as ApolloClient }
}
