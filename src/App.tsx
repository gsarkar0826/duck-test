/* eslint-disable no-unused-vars */
import { FC, useEffect } from 'react';
import logo from "./logo.svg";
import "./App.css";
import * as duckdb from "@duckdb/duckdb-wasm";
import duckdb_wasm from "@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm";
import duckdb_wasm_eh from "@duckdb/duckdb-wasm/dist/duckdb-eh.wasm";
import duckdb_worker_mvp from "@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js";
import duckdb_worker_eh from "@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js";

const WEBPACK_BUNDLES = {
  mvp: {
    mainModule: duckdb_wasm,
    mainWorker: duckdb_worker_mvp,
  },
  eh: {
    mainModule: duckdb_wasm_eh,
    mainWorker: duckdb_worker_eh,
  }
};

const App: FC = ({}) => {
  useEffect(() => {
    const resolveDatabase = async () => {
      const bundle = await duckdb.selectBundle(WEBPACK_BUNDLES);
      // init async duckdb-wasm
      const worker = new Worker(bundle.mainWorker!);
      const logger = new duckdb.ConsoleLogger();
      const db = new duckdb.AsyncDuckDB(logger, worker);
      await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

      // establish connection
      const conn = await db.connect();
      // todo: connect with .db file
      const table = await conn.query(`SELECT 42;`);
      console.log(table);
    };

    resolveDatabase();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};

export default App;
