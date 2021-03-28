import './Card.css';

function Card(props) {

  return (
    <div className="card">
      <img className="card__img"alt={`level ${props.level.id}`} src={props.level.image}/>
      <div className="card__information">
        <div className="card__level">
          Level {props.level.id}
        </div>
        <div className="card__characters">
          Characters
        </div>
      </div>
    </div>
  );
}

export default Card;
