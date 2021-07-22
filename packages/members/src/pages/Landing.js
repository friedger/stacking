import React from 'react';
import { useConnect } from '../lib/auth';

// Landing page demonstrating Blockstack connect for registration

export default function Landing(props) {
  const { handleOpenAuth } = useConnect();

  return (
    <div className="panel-landing">
      <p className="lead my-10">Enjoy the exclusive Friedger Pool membership!</p>
        <button type="button" onClick={handleOpenAuth}>
          Start now
        </button>
    </div>
  );
}
