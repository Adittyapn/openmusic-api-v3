import Joi from '@hapi/joi';

const CollaborationPayloadSchema = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});

export { CollaborationPayloadSchema };
