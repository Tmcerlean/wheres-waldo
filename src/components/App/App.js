import { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from '../../pages/Home/Home';
import Game from '../../pages/Game/Game';
import firebase, { firestore } from '../../firebase';
import Leaderboard from '../../pages/Leaderboard/Leaderboard';

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
          console.log(doc.data())
          levelInformation.push(doc.data())
        });
      });
      setLevels(levelInformation);
      setLoading(false)
    };
    getLevelInformation();
  }, []);

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/game">
          <Game 
            levels={levels}
            currentLevel={currentLevel}
          />
        </Route>
        <Route path="/leaderboard">
          <Leaderboard 
            levels={levels}
            currentLevel={currentLevel}
            setCurrentLevel={setCurrentLevel}
          />
        </Route>
        <Route exact path="/">
          <Home 
            levels={levels}
            setCurrentLevel={setCurrentLevel}
            loading={loading}
          />
        </Route>
      </Switch>
    </BrowserRouter>
    );
}

export default App;
