/* eslint-disable camelcase */

export const up = (pgm) => {
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'playlists',
      onDelete: 'cascade',
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users',
      onDelete: 'cascade',
    },
  });

  pgm.addConstraint(
    'collaborations',
    'unique_collaboration',
    'UNIQUE(playlist_id, user_id)'
  );
};

export const down = (pgm) => {
  pgm.dropTable('collaborations');
};
