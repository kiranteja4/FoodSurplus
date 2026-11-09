const LOCAL_DEVELOPMENT_ORIGIN = /^http:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?$/;

export function createCorsOptions({ NODE_ENV, CLIENT_URL }) {
  return {
    origin(origin, callback) {
      const isConfiguredOrigin = origin === CLIENT_URL;
      const isLocalDevelopmentOrigin =
        NODE_ENV !== 'production' && LOCAL_DEVELOPMENT_ORIGIN.test(origin ?? '');

      callback(null, isConfiguredOrigin || isLocalDevelopmentOrigin);
    },
    credentials: true,
  };
}
