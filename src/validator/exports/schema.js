import Joi from '@hapi/joi';

const ExportPlaylistPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});

export { ExportPlaylistPayloadSchema };
