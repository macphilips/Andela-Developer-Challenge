// https://gist.github.com/joakimbeng/7918297

class Route {
  constructor() {
    this.routes = {};
  }

  registerRoutes(path, controller, requireAuth) {
    this.routes[path] = {
      controller,
      requireAuth,
    };
  }
}

const route = new Route();
export default route;
