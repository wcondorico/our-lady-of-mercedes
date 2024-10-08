import { MODULES_ROUTES } from "./modules.routes";

export const VIRTUAL_ANATOMY_PAGES = {
  SEARCH_GROUPS: 'buscar-grupos',
  DATA_GROUPS: 'datos-grupos'
} as const;

export const VIRTUAL_ANATOMY_ROUTES = {
  SEARCH_GROUPS: `${MODULES_ROUTES.VIRTUAL_ANATOMY}/${VIRTUAL_ANATOMY_PAGES.SEARCH_GROUPS}`,
  DATA_GROUPS: `${MODULES_ROUTES.VIRTUAL_ANATOMY}/${VIRTUAL_ANATOMY_PAGES.DATA_GROUPS}`
} as const;
