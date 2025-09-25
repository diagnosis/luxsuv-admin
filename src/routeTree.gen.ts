import { Route as rootRoute } from './routes/__root';
import { Route as indexRoute } from './routes/index';
import { Route as loginRoute } from './routes/login';
import { Route as dashboardRoute } from './routes/dashboard';
import { Route as bookingsRoute } from './routes/bookings';
import { Route as emailsRoute } from './routes/emails';

export const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  dashboardRoute,
  bookingsRoute,
  emailsRoute,
]);