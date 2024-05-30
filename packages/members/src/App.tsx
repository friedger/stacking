import { Connect } from '@stacks/connect-react';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import Jdenticon from 'react-jdenticon';
import { Address } from './components/Address';
import Auth from './components/Auth';
import { useConnect, userDataState, userSessionState } from './lib/auth';
import Landing from './pages/Landing';
import { MemberDetails } from './pages/MemberDetails';

export default function App() {
  const { authOptions } = useConnect();
  const [userSession] = useAtom(userSessionState);
  const [userData, setUserData] = useAtom(userDataState);

  useEffect(() => {
    if (userSession?.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    } else if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn();
    }
  }, [userSession, setUserData]);

  const stxAddress = userData && userData.profile.stxAddress.mainnet;
  const stxAddressToShow = new URLSearchParams(window.location.search).get('addr') || stxAddress;
  return (
    <Connect authOptions={authOptions}>
      <h1>Members' Area</h1>
      <div style={{ display: 'flex', justifyContent: 'right' }}>
        {stxAddress && (
          <>
            <div>
              <Jdenticon size="50" value={stxAddress} />
            </div>
            <div>
              <Address addr={stxAddress} />
              <br />
              <Auth userSession={userSession} />
            </div>
          </>
        )}
      </div>
      <Content
        stxAddress={stxAddress}
        stxAddressToShow={stxAddressToShow}
        userSession={userSession}
      />
    </Connect>
  );
}

function Content({ stxAddress, stxAddressToShow, userSession }) {

  return (
    <>
      {!stxAddressToShow && <Landing />}
      {stxAddressToShow && <MemberDetails stxAddressToShow={stxAddressToShow} stxAddress={stxAddress} userSession={userSession}/>}
    </>
  );
}
