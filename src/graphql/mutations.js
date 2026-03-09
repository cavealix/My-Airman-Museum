/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createBrick = /* GraphQL */ `
  mutation CreateBrick(
    $input: CreateBrickInput!
    $condition: ModelBrickConditionInput
  ) {
    createBrick(input: $input, condition: $condition) {
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
export const updateBrick = /* GraphQL */ `
  mutation UpdateBrick(
    $input: UpdateBrickInput!
    $condition: ModelBrickConditionInput
  ) {
    updateBrick(input: $input, condition: $condition) {
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
export const deleteBrick = /* GraphQL */ `
  mutation DeleteBrick(
    $input: DeleteBrickInput!
    $condition: ModelBrickConditionInput
  ) {
    deleteBrick(input: $input, condition: $condition) {
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
