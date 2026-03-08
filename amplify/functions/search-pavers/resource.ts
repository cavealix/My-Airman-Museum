import { defineFunction, secret } from '@aws-amplify/backend';

export const searchPaversFunction = defineFunction({
    entry: './handler.ts',
    environment: {
        // Inject the database_url secret into the function environment
        DATABASE_URL: secret('database_url')
    }
});
