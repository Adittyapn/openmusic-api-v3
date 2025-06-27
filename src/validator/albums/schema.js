import Joi from '@hapi/joi';

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().integer().required(),
});

export { AlbumPayloadSchema };
