import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/Card/Card';
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
        minWidth: 700,
    },
});

const Leaderboard = ({ levels = {}, currentLevel, setCurrentLevel }) => {

    const [rows, setRows] = useState([]);

    const classes = useStyles();

    const gameLevels = levels.map((level) => {
        return (
            <Link to="/leaderboard" onClick={() => setCurrentLevel(level.id)}>
                <Card key={level.id} level={level} />
            </Link>
        );
    });

    const getHighScores = (currentLevel) => {

        const highScores = firestore.collection('scores').where("level", "==", currentLevel).orderBy("time", "asc").limit(10);

        highScores.get().then((querySnapshot) => {

            let data = [];

            querySnapshot.forEach((doc) => {
                let name = doc.data().name;
                let time = doc.data().time.toFixed(2);
                data.push({name, time});
            });

            setRows(data);
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    };

    useEffect(() => {
        getHighScores(currentLevel)
      }, []);

    return (
        <Layout>
            <div className="main-container">
                <div className="level-container">
                    {gameLevels}
                </div>
                <div className="leaderboard-container">
                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="customized table">
                            <TableHead>
                            <TableRow>
                                <StyledTableCell>Name</StyledTableCell>
                                <StyledTableCell>Time&nbsp;(s)</StyledTableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {rows?.map((row) => (
                                <StyledTableRow key={row.name}>
                                <StyledTableCell component="th" scope="row">
                                    {row.name}
                                </StyledTableCell>
                                <StyledTableCell>{row.time}</StyledTableCell>
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
