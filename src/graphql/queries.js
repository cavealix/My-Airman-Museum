/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const searchPavers = /* GraphQL */ `
  query SearchPavers($query: String!) {
    searchPavers(query: $query) {
      id
      Name_Key
      Paver_Lines
      Row
      Column
      Lat
      Lon
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const getBrick = /* GraphQL */ `
  query GetBrick($id: ID!) {
    getBrick(id: $id) {
      id
      Name_Key
      Paver_Lines
      Row
      Column
      Lat
      Lon
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listBricks = /* GraphQL */ `
  query ListBricks(
    $filter: ModelBrickFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBricks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        Name_Key
        Paver_Lines
        Row
        Column
        Lat
        Lon
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
