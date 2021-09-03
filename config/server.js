module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', '23990448f3e60c9e29e21edb1a4a1f59'),
    },
    url: "/don-panel"
  },
});
