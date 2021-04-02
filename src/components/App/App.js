import { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from '../../pages/Home/Home';
import Game from '../../pages/Game/Game';
import { firestore } from '../../firebase';
import Leaderboard from '../../pages/Leaderboard/Leaderboard';
import waldo from '../../images/waldo.jpg';
import odlaw from '../../images/odlaw.jpg';
import wizard from '../../images/wizard.jpeg';
import wenda from '../../images/wenda.jpeg';

const App = () => {

  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const getLevelInformation = async () => {
      let levelInformation = [];
      const gameLevels = await firestore.collection('levels');
      const populateArray = await gameLevels.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          levelInformation.push(doc.data())
        });
      });
      setLevels(levelInformation);
      setLoading(false)
    };
    getLevelInformation();
  }, []);

  const getCharacterImage = (character) => {
    switch (character) {
      case 'waldo':
        return waldo;
      case 'odlaw':
        return odlaw;
      case 'wizard':
        return wizard;
      case 'wenda':
        return wenda;
      default:
        break;
    };
  };

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/game">
          <Game 
            levels={levels}
            currentLevel={currentLevel}
            getCharacterImage={getCharacterImage}
          />
        </Route>
        <Route path="/leaderboard">
          <Leaderboard 
            levels={levels}
            currentLevel={currentLevel}
            setCurrentLevel={setCurrentLevel}
            getCharacterImage={getCharacterImage}
          />
        </Route>
        <Route exact path="/">
          <Home 
            levels={levels}
            setCurrentLevel={setCurrentLevel}
            loading={loading}
            getCharacterImage={getCharacterImage}
          />
        </Route>
      </Switch>
    </BrowserRouter>
    );
}

export default App;
