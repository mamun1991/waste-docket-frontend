import {gql} from '@apollo/client';

export const singleUpload = gql`
  mutation Mutation(
    $file: Upload!
    $accessToken: String!
    $uploadType: AllowedUploads
    $documentId: String
  ) {
    singleUpload(
      file: $file
      accessToken: $accessToken
      uploadType: $uploadType
      documentId: $documentId
    ) {
      message
      status
    }
  }
`;

export const singleDelete = gql`
  mutation DeleteFileFromBucket(
    $documentId: String
    $fileType: AllowedDeleteTypes!
    $accessToken: String!
    $fileUrl: String!
  ) {
    deleteFileFromBucket(
      documentId: $documentId
      accessToken: $accessToken
      fileType: $fileType
      fileUrl: $fileUrl
    ) {
      status
      message
    }
  }
`;

const mutations = {singleUpload, singleDelete};

export default mutations;
