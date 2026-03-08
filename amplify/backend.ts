import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { searchPaversFunction } from './functions/search-pavers/resource';
import { FunctionUrlAuthType } from 'aws-cdk-lib/aws-lambda';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  searchPaversFunction
});

// Create a Function URL allowing public access so it can be used via simple REST fetch.
const functionUrl = backend.searchPaversFunction.resources.lambda.addFunctionUrl({
  authType: FunctionUrlAuthType.NONE,
  cors: {
    allowedOrigins: ['*'],
    allowedHeaders: ['*'],
  }
});

backend.addOutput({
  custom: {
    apiUrl: functionUrl.url,
  },
});
