import { Link } from 'react-router-dom';
import './Home.css';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/Card/Card';
import CircularProgress from '@material-ui/core/CircularProgress';

const Home = ({ levels = {}, setCurrentLevel, loading }) => {

    const gameLevels = levels.map((level) => {
        return (
            <Link to="/game" onClick={() => setCurrentLevel(level.id)}>
                <Card key={level.id} level={level} />
            </Link>
        );
    });

    const loadingSpinner = () => {
        if (loading) {
            return <CircularProgress />
        }
    }

    return (
        <Layout>
            <div className="main-container">
                <div className="grid-container">
                    {gameLevels}
                </div>
            </div>
            <div className="main-container__spinner">
                {loadingSpinner()}
            </div>
        </Layout>
    );
}

export default Home;
