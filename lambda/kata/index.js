const { error } = require('./res');

const Kata = async (event, router, db) => {
  // Check if the event exists
  if (!event || !event.path || !event.httpMethod) {
    return error({ error: 'The request is malformed' });
  }

  // Get the routes
  const routes = router.routes;

  // Check the routes for the required action
  if (
    !routes ||
    !routes[event.httpMethod] ||
    !routes[event.httpMethod][event.path]
  ) {
    return error({ error: 'The route does not exists' });
  }

  // Try to parse the body if it exists
  let body = null;
  if (event.body) {
    body = JSON.parse(event.body);
  }

  // Execute the required action
  return await routes[event.httpMethod][event.path](event, body, db);
};

module.exports = Kata;