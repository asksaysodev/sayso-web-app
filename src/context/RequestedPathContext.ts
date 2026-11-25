import { createContext, useContext } from 'react';

/**
 * Real URL (path + query). Inside `<Routes location>`, useLocation() returns the page
 * under the settings modal instead.
 */
export const RequestedPathContext = createContext('/');

export const useRequestedPath = () => useContext(RequestedPathContext);
