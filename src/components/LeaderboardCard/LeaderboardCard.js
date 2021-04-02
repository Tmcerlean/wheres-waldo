import './LeaderboardCard.css';

const LeaderboardCard = ({level}) => {

  return (
    <div className="leaderboard-card">
      <img className="leaderboard-card__img"alt={`level ${level.id}`} src={level.image}/>
      <div className="leaderboard-card__information">
        <div className="leaderboard-card__level">
          Level {level.id}
        </div>
      </div>
    </div>
  );
}

export default LeaderboardCard;
