import { PATH_USER_PORTAL, PATH_MANAGEMENT, ROLE_CUSTOMER } from '../constants/authConstants';

export function handleRedirect(userRole: string) {
  const redirectPath = new URLSearchParams(window.location.search).get('redirect');

  if (redirectPath) {
    if (redirectPath.startsWith(PATH_USER_PORTAL) && userRole !== ROLE_CUSTOMER) {
      window.location.href = PATH_MANAGEMENT;
    } else if (redirectPath.startsWith(PATH_MANAGEMENT) && userRole === ROLE_CUSTOMER) {
      window.location.href = PATH_USER_PORTAL;
    } else {
      window.location.href = redirectPath;
    }
  } else {
    if (userRole === ROLE_CUSTOMER) {
      window.location.href = PATH_USER_PORTAL;
    } else {
      window.location.href = PATH_MANAGEMENT;
    }
  }
}
