import UsersService from '../services/UsersService.js';

const usersService = new UsersService();

const postUserHandler = async (request, h) => {
  const { username, password, fullname } = request.payload;
  const userId = await usersService.addUser({ username, password, fullname });

  const response = h.response({
    status: 'success',
    message: 'User berhasil ditambahkan',
    data: {
      userId,
    },
  });
  response.code(201);
  return response;
};

export { postUserHandler };
