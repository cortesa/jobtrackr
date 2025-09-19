"use client"

import { gql } from "@apollo/client"
import { useQuery } from "@apollo/client/react"

export const QUERY_COMPANIES = gql`
  query Companies{
    companies {
      id
      name
      website
      color
    }
  }
`

export function useCompanies() {
  const response = useQuery(QUERY_COMPANIES)

  return { ...response }
}
