import React, {useEffect, useState} from 'react';
import axios from "axios";
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import {ListItem, ListItemAvatar, ListItemText} from "@material-ui/core";
import {useHistory} from "react-router-dom";

const useStyles = makeStyles({
    table: {
        width: "60%",
        margin: 'auto'
    },
});

export let OrderHistory = (props) => {
    const classes = useStyles();
    const [orders, setOrders] = useState([]);
    const history = useHistory();
    useEffect(async () => {
        await getHistory();
    }, [])
    let getHistory = async () => {
        let url = 'http://localhost:5000/cart/history';
        await axios.get(url, {withCredentials: true, params: {page: 1}}
        ).then((res) => {
            return setOrders(res.data);
        }).catch((err) => {
            if (err == "Error: Request failed with status code 401"){
                props.login(false);
                return history.push('/login');
            }
            return setOrders([]);
        })
    }
    let getFullDateString = (num) => {
        let date = new Date(num)
        return (date.getDate()) + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
    }
    console.log(orders);
    return (
        <TableContainer className={classes.table} component={Paper}>
            <Table  aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Order Date</TableCell>
                        <TableCell >Order Id</TableCell>
                        <TableCell >Details</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((row) => (
                        <TableRow key={row.order_id}>
                            <TableCell component="th" scope="row">
                                {getFullDateString(row.date)}
                            </TableCell>
                            <TableCell >{row.order_id}</TableCell>
                            <TableCell>
                                {JSON.parse(row.order).map(product => (
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar alt="Remy Sharp" src="/broken-image.jpg">
                                                {product.product_id}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={<div><p>Name: {product.product_name}  </p><p>Quantity: {product.quantity}</p></div>}
                                                      secondary={`Size : ${product.product_size}`}/>
                                    </ListItem>
                                ))}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
