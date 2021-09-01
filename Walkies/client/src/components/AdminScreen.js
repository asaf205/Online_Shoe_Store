import React, {useEffect, useState} from "react";
import axios from "axios";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {SearchBar} from "./SearchBar";
import {PageController} from "./PageController";
import {useHistory} from "react-router-dom";

import {Button} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {alpha, makeStyles} from "@material-ui/core/styles";


axios.defaults.withCredentials = true
export const useStyles = makeStyles((theme) => ({
    button: {
        display: 'flex',
        flexFlow: "column",
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: '#5c6bc0',
        width: "100%",
        height: "100%",
        margin: "auto"
    },
    root: {
        display: 'flex',
        flexFlow: "column",
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
        width: "82%",
        height: "100%",
        margin: "auto"
    },
}));

export let AdminScreen = (props) => {

    const classes = useStyles();

    const [state, setState] = useState({events: [], page: 1, search: "", numberOfItems: 0});

    let setLogin = props.setLogin;
    let history = useHistory();
    const [page, setPage] = useState(false);

    useEffect(() => {
        getHistory()
    }, [page]);
    let searchDebounce = null;

    const onSearch = async (event) => {
        let eventValue = event;
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(async () => {
            setState({
                events: state.events,
                search: eventValue,
                page: 1,
                numberOfItems: state.numberOfItems,
            })
            setPage(!page);
        }, 300);
    }

    let skipToPage = (pageNumber) => {
        setState({
            events: state.events,
            search: state.search,
            page: pageNumber,
            numberOfItems: state.numberOfItems,
        })
        setPage(!page);
    }

    let getHistory = async () => {
        let url = 'http://localhost:5000/admin/events';
        await axios.get(url, {withCredentials: true, params: {search: state.search, page: state.page}}
        ).then(async (res) => {
            setState({events: res.data.data, search: state.search, page: state.page, numberOfItems: res.data.count});
            props.setCheckAdmin(true);
        }).catch((err) => {
            console.log(err);
            if (err == "Error: Request failed with status code 401") {
                setLogin(false);
                history.push("/login");
            } else if (err == 'Error: Request failed with status code 403')
            {
                props.setCheckAdmin(false);
                history.push("/store");
            }
            setState({events: [], search: state.search, page: state.page, numberOfItems: 0});
        })
    }

    let getFullDateString = (num) => {
        let date = new Date(num)
        return (date.getDate()) + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
    }

    let checkAdminLog = props.checkAdmin;
    console.log(checkAdminLog);
    return (
                <div className={classes.root}>
                    <Grid container
                          direction="row"
                          justifyContent="center"
                          alignItems="flex-start"
                    >
                        <Button href={"/admin/productManagement"} className={classes.button} variant="contained" >Product
                            Management</Button>
                    </Grid>
                    <SearchBar
                        onSearch={onSearch}
                    />

                    <PageController
                        page={state.page}
                        totalNumberOfPages={Math.ceil(state.numberOfItems / 50)}
                        skipToPage={skipToPage}
                    />
                    <div
                        className="results">Showing {Math.ceil(state.numberOfItems / 50) == state.page ? state.numberOfItems % 50 : 50} results
                    </div>
                    <p className='results'>page {state.page} from {Math.ceil(state.numberOfItems / 50)}</p>
                    <TableContainer component={Paper}>

                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Event id</TableCell>
                                    <TableCell>User id</TableCell>
                                    <TableCell>Username</TableCell>
                                    <TableCell>Order Date</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Message</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {state.events.map(event => (
                                    <TableRow key={event.event_id}>
                                        <TableCell>{event.event_id}</TableCell>
                                        <TableCell>{event.user_id}</TableCell>
                                        <TableCell>{event.username}</TableCell>
                                        <TableCell>{getFullDateString(Number.parseInt(event.event_date))}</TableCell>
                                        <TableCell>{event.event_type}</TableCell>
                                        <TableCell>{event.event_message}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

    );
}
