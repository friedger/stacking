import { AuthOptions, FinishedAuthData, showConnect } from '@stacks/connect';
import { AppConfig, UserSession } from '@stacks/connect-react';
import { atom, useAtom, useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { authOrigin } from './constants';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSessionState = atom(new UserSession({ appConfig }));
export const userDataState = atom();
export const authResponseState = atom();

export const useConnect = () => {
  const [userSession] = useAtom(userSessionState);
  const setUserData = useSetAtom(userDataState);
  const setAuthResponse = useSetAtom(authResponseState);

  const onFinish = async (payload: FinishedAuthData) => {
    setAuthResponse(payload.authResponse);
    const userData = await payload.userSession.loadUserData();
    setUserData(userData);
  };

  const authOptions: AuthOptions = {
    authOrigin: authOrigin,
    onFinish,
    userSession, // usersession is already in state, provide it here
    redirectTo: '/',
    manifestPath: '/manifest.json',
    appDetails: {
      name: 'Fast Pool Members',
      icon: 'https://pool.friedger.de/img/logo.png',
    },
  };

  const handleOpenAuth = () => {
    showConnect(authOptions);
  };

  const handleSignOut = useCallback(() => {
    userSession?.signUserOut('/');
  }, [userSession]);

  return { handleOpenAuth, handleSignOut, authOptions };
};
