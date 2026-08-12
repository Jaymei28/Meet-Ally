export default defineNuxtRouteMiddleware((to, from) => {
  const user = useCookie('auth_user');

  // 1. Handle login route
  if (to.path === '/login') {
    if (user.value) {
      return navigateTo('/');
    }
    return;
  }

  // 2. Enforce authentication
  if (!user.value) {
    return navigateTo('/login');
  }

  // 3. Enforce RBAC route restrictions
  const clientRoutes = ['/upload', '/discrepancies', '/letters'];
  const adminRoutes = ['/users'];

  // Administrators cannot access client-only routes
  if (user.value.role === 'admin' && clientRoutes.includes(to.path)) {
    return navigateTo('/');
  }

  // Clients cannot access admin-only routes
  if (user.value.role !== 'admin' && adminRoutes.includes(to.path)) {
    return navigateTo('/');
  }
});
