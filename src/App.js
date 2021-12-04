import logo from './logo.svg';
import './App.css';
import {Provider} from "react-redux";
import { store } from "./../src/state/store";
import Game from "./components/game";


function App() {
  return (
      <Provider store={store}>
        <div className="App">
          <Game />
        </div>
      </Provider>
  );
}

export default App;
