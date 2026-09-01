export default defineNuxtRouteMiddleware((to, from) => {
  const user = useCookie('auth_user');

  // 1. Allow public routes without authentication
  const publicRoutes = ['/login', '/assessment', '/plans'];
  if (publicRoutes.includes(to.path)) {
    if (to.path === '/login' && user.value) {
      return navigateTo('/');
    }
    return;
  }

  // 2. Enforce authentication for protected app routes
  if (!user.value) {
    return navigateTo('/login');
  }

  // 3. Enforce RBAC and subscription route restrictions
  const clientRoutes = ['/upload', '/discrepancies', '/letters', '/fundability'];
  const adminRoutes = ['/users', '/credits', '/waitlist'];

  // Administrators cannot access client-only routes
  if (user.value.role === 'admin' && clientRoutes.includes(to.path)) {
    return navigateTo('/');
  }

  // Clients cannot access admin-only routes
  if (user.value.role !== 'admin' && adminRoutes.includes(to.path)) {
    return navigateTo('/');
  }

  // Clients without active plan (starter/turbo) cannot access credit repair feature routes
  if (user.value.role !== 'admin' && !user.value.plan_type && clientRoutes.includes(to.path)) {
    return navigateTo('/');
  }
});
