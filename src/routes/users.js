import { postUserHandler } from '../handlers/users.js';
import { UserPayloadSchema } from '../validator/users/schema.js';

const routes = [
  {
    method: 'POST',
    path: '/users',
    handler: postUserHandler,
    options: {
      validate: {
        payload: UserPayloadSchema,
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
