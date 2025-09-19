"use client"

import { getApolloClient } from "@/lib/apollo"
import { ApolloProvider } from "@apollo/client/react"
import { ReactNode, useMemo } from "react"

type ProveedorApolloProps = {
	headers?: Record<string, string>
	children: React.ReactNode
}

const URL_GRAPHQL = "http://localhost:4000/"

export function ApolloDataProvider ({ children, headers = {} }: ProveedorApolloProps) {
  const { client } = useMemo(() => getApolloClient({ url: URL_GRAPHQL, headers }), [ headers ])

  return (
    <ApolloProvider client={client}>{children}</ApolloProvider>
  )
}
