import { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import LeaderboardCard from '../../components/LeaderboardCard/LeaderboardCard';
import './Leaderboard.css';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { firestore } from '../../firebase';

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        fontSize: 14,
    },
    body: {
        fontSize: 12,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

function createData(name, time) {
    return { name, time };
}

const useStyles = makeStyles({
    table: {
        minWidth: 500,
    },
});


const Leaderboard = ({ levels = {}, currentLevel, setCurrentLevel, getCharacterImage }) => {

    let history = useHistory();

    const [rows, setRows] = useState([]);

    const classes = useStyles();

    const gameLevels = levels.map((level) => {
        return (
            <Link onClick={() => setCurrentLevel(level.id)}>
                <LeaderboardCard key={level.id} level={level} />
            </Link>
        );
    });

    const getHighScores = (currentLevel) => {

        console.log(currentLevel)

        const highScores = firestore.collection('scores').where("level", "==", currentLevel).orderBy("time", "asc").limit(10);

        highScores.get().then((querySnapshot) => {

            let data = [];

            querySnapshot.forEach((doc) => {
                console.log(doc);
                let name = doc.data().name;
                let time = doc.data().time.toFixed(2);
                data.push({name, time});
                console.log(doc.data())
            });

            console.log(data)

            setRows(data);
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    };

    useEffect(() => {
        getHighScores(currentLevel)
    }, [currentLevel]);

    const handleClick = () => {
        history.push("/");
    }

    return (
        <Layout>
            <div class="home-button">
                <a onClick={handleClick}>Home</a>
            </div>
            <div className="main-wrapper">
                <div className="level-container">
                    {gameLevels}
                </div>
                <div className="leaderboard-container">
                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="customized table">
                            <TableHead>
                            <TableRow>
                                <StyledTableCell align="center">Name</StyledTableCell>
                                <StyledTableCell align="center">Time&nbsp;(s)</StyledTableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {rows?.map((row) => (
                                <StyledTableRow key={row.name}>
                                <StyledTableCell align="center" component="th" scope="row">
                                    {row.name}
                                </StyledTableCell>
                                <StyledTableCell align="center">{row.time}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </Layout>
    );
}

export default Leaderboard;
