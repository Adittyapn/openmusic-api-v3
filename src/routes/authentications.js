import {
  postAuthenticationHandler,
  putAuthenticationHandler,
  deleteAuthenticationHandler,
} from '../handlers/authentications.js';
import {
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
} from '../validator/authentications/schema.js';

const routes = [
  {
    method: 'POST',
    path: '/authentications',
    handler: postAuthenticationHandler,
    options: {
      validate: {
        payload: PostAuthenticationPayloadSchema,
        failAction: (request, h, error) => {
          const response = h.response({
            status: 'fail',
            message: error.details[0].message,
          });
          response.code(400);
          return response.takeover();
        },
      },
    },
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: putAuthenticationHandler,
    options: {
      validate: {
        payload: PutAuthenticationPayloadSchema,
        failAction: (request, h, error) => {
          const response = h.response({
            status: 'fail',
            message: error.details[0].message,
          });
          response.code(400);
          return response.takeover();
        },
      },
    },
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: deleteAuthenticationHandler,
    options: {
      validate: {
        payload: DeleteAuthenticationPayloadSchema,
        failAction: (request, h, error) => {
          const response = h.response({
            status: 'fail',
            message: error.details[0].message,
          });
          response.code(400);
          return response.takeover();
        },
      },
    },
  },
];

export default routes;
