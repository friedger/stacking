import React, { useState } from "react";
import ReactDOM from "react-dom";
import { UserSession, AppConfig } from "@stacks/auth";
const App = () => {
  const appConfig = new AppConfig(["store_write"]);
  const userSession = new UserSession({ appConfig });
  console.log("rendered react");
  const [authenticated, setAuthenticated] = useState(false);
  return authenticated ? (
    <>
      <button>Claim Friedger Pool NFT</button>
      <button>Change reward receiver</button>
    </>
  ) : (
    <>
      <button>Membership</button>
    </>
  );
};

// Render to #root
ReactDOM.render(
  React.createElement(App, null),
  document.getElementById("react")
);
