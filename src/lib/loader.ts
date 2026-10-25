/**
 * The sessionStorage key that marks this session as having seen the home
 * page's loader. A plain module rather than part of the loader component: the
 * root layout reads it on the server, where a client module's exports are
 * references, not values.
 */
export const LOADED_KEY = 'etza-loaded';
