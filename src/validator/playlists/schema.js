import Joi from '@hapi/joi';

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

const SongToPlaylistPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

export { PlaylistPayloadSchema, SongToPlaylistPayloadSchema };
