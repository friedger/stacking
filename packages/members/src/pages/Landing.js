import React from 'react';
import { useConnect } from '../lib/auth';

// Landing page demonstrating Blockstack connect for registration

export default function Landing(props) {
  const { handleOpenAuth } = useConnect();

  return (
    <div className="Landing">
      <div className="jumbotron jumbotron-fluid pt-3 mb-0">
        <div className="container">
          <div className="panel-landing text-center mt-3">
            <p className="lead">Enjoy the exclusive Friedger Pool membership!</p>
            (Requires Stacks Wallet for Web extension. Get it <a href="https://hiro.so/wallet/install-web">here</a>.)
            <p className="card-link mb-5">
              <button className="btn btn-outline-primary" type="button" onClick={handleOpenAuth}>
                Start now
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
