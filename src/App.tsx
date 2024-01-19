import React from 'react';
import './index.scss';
import Router from "./components/Router";
import {Layout} from "./components/Layout";

function App() {
  return (
      <Layout>
        <Router />
      </Layout>
  );
}

export default App;
