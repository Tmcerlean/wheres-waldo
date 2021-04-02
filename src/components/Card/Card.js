import './Card.css';

function Card({level, getCharacterImage}) {

  const characterIcons = () => {

    let icons = level.characters?.map((char) => {
      return (
        <img className="card__character-icon" src={getCharacterImage(char.name)} alt={`${char.name} icon`}/>
      )
    })

    return <div>{icons}</div>
  }

  return (
    <div className="card">
      <img className="card__img"alt={`level ${level.id}`} src={level.image}/>
      <div className="card__information">
        <div className="card__level">
          Level {level.id}
        </div>
        <div className="card__character-container">
          {characterIcons()}
        </div>
      </div>
    </div>
  );
}

export default Card;
