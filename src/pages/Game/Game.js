import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import './Game.css';
import Layout from '../../components/Layout/Layout';
import img from './level-1.jpg';
import waldo from '../../images/waldo.jpg';
import odlaw from '../../images/odlaw.jpg';
import wizard from '../../images/wizard.jpeg';
import wenda from '../../images/wenda.jpeg';
import firebase, { firestore } from '../../firebase';

const Game = ({ levels = {}, currentLevel }) => {

  const [image, setImage] = useState("");
  const [characters, setCharacters] = useState([]);
  const [gameId, setGameId] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [coords, setCoords] = useState({
    x: null,
    y: null
  });

  let history = useHistory();

  useEffect(() => {
    const getLevelData = levels[currentLevel];
    const transformedCharacters = getLevelData?.characters.map((character) => {
      const obj = { ...character, found: false };
      return obj;
    });
    setImage(getLevelData?.image);
    setCharacters(transformedCharacters);
      
      firestore
        .collection('levels')
        .where('id', '==', currentLevel) // Make this currentLevel
        .get()
        .then((querySnapshot) => {
          let loadedCharacters;
          querySnapshot.forEach((doc) => {
            const characters = doc.data().characters;
            loadedCharacters = characters.map((character) => {
              const characterObj = { name: character.name, found: false };
              return characterObj;
            });
          });
          return loadedCharacters;
        }).then((loadedCharacters) => {
          let timeStamp = firebase.firestore.FieldValue.serverTimestamp();
          firestore
            .collection("games")
            .add({
              characters: loadedCharacters,
              timeStarted: timeStamp,
              timeCompleted: null
            })
            .then((docRef) => {
              setGameId(docRef.id);
              console.log("Document written with ID: ", docRef.id);
            })
            .catch((error) => {
              console.error("Error adding document: ", error);
            });
        });
  }, [levels, currentLevel]);

  const [showOverlay, setShowOverlay] = useState({
    visible: false,
    xPosition: null,
    yPosition: null
  });

  const openTargetingBox = (state) => {
    if (state.visible === true) {
      const targetingBox = document.querySelector(".targeting-box");
      targetingBox.style.left = `${state.xPosition}px`;
      targetingBox.style.top = `${state.yPosition}px`;
      targetingBox.style.transform = "translate(-50%, -50%)";
    }
  };

  const openMenu = (state) => {
    if (state.visible === true) {
      const menuBox = document.querySelector(".menu-box");
      menuBox.style.left = `${state.xPosition}px`;
      menuBox.style.top = `${state.yPosition}px`;
      menuBox.style.transform = "translate(4rem)";
    }
  };

  useEffect(() => {
    openTargetingBox(showOverlay);
    openMenu(showOverlay);
  }, [showOverlay]);

  const imageClicked = (e) => {
    setCoords({
      x: e.pageX,
      y: e.pageY
    })
  };

  const selectCharacter = (character) => {

    const gameImage = document.querySelector(".test");

    const bounds = gameImage.getBoundingClientRect();
    const left = bounds.left;
    const top = bounds.top;
    const x = coords.x - left;
    const y = coords.y - top;
    const cw = gameImage.clientWidth;
    const ch = gameImage.clientHeight;
    const iw = gameImage.naturalWidth;
    const ih = gameImage.naturalHeight;
    const px = x/cw*iw;
    const py = y/ch*ih;

    const xLowerBoundary = px - 50;
    const xUpperBoundary = px + 50;
    const yLowerBoundary = py - 50;
    const yUpperBoundary = py + 50;

    const gameLevel = firestore.collection('levels').doc(currentLevel);

    gameLevel.get().then((doc) => {
      if (doc.exists) {
        console.log("Document data:", doc.data());
        let levelData;
        levelData = doc.data();
        if (checkSelection(levelData, character, xLowerBoundary, xUpperBoundary, yLowerBoundary, yUpperBoundary)) {
          updateGameProgress(character);
        };
      } else {
        console.log("No such document!");
      }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
  };

  const checkSelection = (levelData, character, xLowerBoundary, xUpperBoundary, yLowerBoundary, yUpperBoundary) => {

    let characterIndex;

    for (let i = 0; i < levelData.characters.length; i++) {
      if (levelData.characters[i].name === character.name) {
        characterIndex = i;
      };
    };

    if ((((levelData.characters[characterIndex].position[characterIndex]) > xLowerBoundary) && ((levelData.characters[characterIndex].position[characterIndex]) < xUpperBoundary)) && (((levelData.characters[characterIndex].position[1]) > yLowerBoundary) && ((levelData.characters[characterIndex].position[1]) < yUpperBoundary))) {
        return true;
    };
    return false;
  };

  const updateGameProgress = (character) => {

    const currentGame = firestore.collection('games').doc(gameId);

    currentGame.get().then((doc) => {
      if (doc.exists) {
        console.log("Document data:", doc.data());  
        let gameData = doc.data();

        const updatedCharacters = gameData.characters.map((char) => {
          if (character.name === char.name) {
            return {found: true, name: char.name};
          }
          return char;
        });

        const checkIfAllCharactersFound = updatedCharacters.every((char) => char.found);

        if (checkIfAllCharactersFound) {
          let timeStamp = firebase.firestore.FieldValue.serverTimestamp();
          currentGame.update({
            ...gameData,
            characters: updatedCharacters,
            timeCompleted: timeStamp
          }).then(writeResult => {

            // Wait for update to complete and display WriteResult
            console.log(writeResult);
          
            // To prove that update is finished, fetch the same document from firestore
            return currentGame.get();
          
          }).then(documentSnapshot => {
            console.log(documentSnapshot.id, "=>", documentSnapshot.data()); 
            // => "docid => { message: 'hello'}"

            let timeStartedSeconds = documentSnapshot.data().timeStarted.seconds
            let timeStartedNanoseconds = documentSnapshot.data().timeStarted.nanoseconds
            let timeCompletedSeconds = documentSnapshot.data().timeCompleted.seconds
            let timeCompletedNanoseconds = documentSnapshot.data().timeCompleted.nanoseconds

            let timeStarted = ("" + timeStartedSeconds + "." + timeStartedNanoseconds);
            let timeCompleted = ("" + timeCompletedSeconds + "." + timeCompletedNanoseconds);
            let elapsedSeconds = (parseFloat(timeCompleted) - parseFloat(timeStarted))

            setElapsedSeconds(elapsedSeconds);
            setGameOver(true);
          })
        } else {
          currentGame.update({
            ...gameData,
            characters: updatedCharacters
          })
          .then(() => {
            console.log("Document successfully updated!");
          })
          .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
          });
        }
      } else {
        console.log("No such document!");
      }
    }).catch((error) => {
        console.log("Error getting document:", error);
    })
  };

  useEffect(() => {
    if (gameOver) {
      renderGameOverModal();
    }
  }, [gameOver]);

  const renderGameOverModal = () => {
    if (gameOver) {
      return (
        <div className="game-over-modal">
          <p className="game-over-modal__p">You finished in {elapsedSeconds.toFixed(2)} seconds</p>
          <p>Please enter your name:</p>
          <form className="game-over-modal__form" onSubmit={handleSubmit}>
            <input
              name="name" 
              className="game-over-modal__input" 
              onChange={handleChange}
              value={playerName}>
            </input>
          </form>
        </div>
      )
    }
  }

  const handleChange = (e) => {
		setPlayerName(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (playerName === '') {
      // Display an error
    } else {
      console.log("It's okay");
      submitScore(playerName, elapsedSeconds);
    }
    history.push('/leaderboard');
    console.log("WORKING")  
  }

  const submitScore = (playerName, elapsedSeconds) => {
    firestore
      .collection("scores")
      .add({
        name: playerName,
        time: elapsedSeconds,
        level: currentLevel
      })
      .then((docRef) => {
        setGameId(docRef.id);
        console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };

  const renderOptions = () => {
    if ((!!characters) && (showOverlay.visible)) {
      let gameCharacters = characters?.map((character) => {
          return (
            <div className="menu-box__option-wrapper" onClick={() => selectCharacter(character)}>
              <img className="menu-box__option-image" src={getCharacterImage(character.name)} alt={`${character.name} icon`}/>
              <p className="menu-box__option-p">{character.name}</p>
            </div>
          )
      });
      return (
        <div className="menu-box">{gameCharacters}</div>
      );
    };
  };

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
    <Layout>
      <div className="game-container">
        <div className="image-container">
          <img 
            src={image} 
            className="test"
            alt="Placeholder"
            onClick={(e) => {
              setShowOverlay(({
                visible: !showOverlay.visible,
                xPosition: e.pageX,
                yPosition: e.pageY
              }));
              imageClicked(e);
            }}>
          </img>
            {showOverlay.visible && <div className="targeting-box" />}
            {renderOptions()}
        </div>
      </div>
      {renderGameOverModal()}
    </Layout>
  );
};

export default Game;
