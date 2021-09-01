import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {Button, Grid, ImageList, ImageListItem, ImageListItemBar} from "@material-ui/core";
import {create_list_of_product_objects, Get_all_products} from "./StoreScreen";
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';
import axios from "axios";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import {alpha, makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
        width: "80%",
        height: "100%",
        margin: "auto"
    },

    orderTable: {
        width: "40%",
    },

    orderInfo:{
        width: "40%",
        margin: 'auto'
    },

    checkoutButton:{
        flexGrow: 1,
        alignItems: "center"
    }


}));

let Single_cart_item = (props)=>{
    const classes = useStyles();
    const handleChange = () => {
        let url = "http://localhost:5000/cart";
        let data = {
            product_id: props.product_id,
            product_size: props.product_size
        }
        axios.delete(url,{
            withCredentials: true,
            params: data
        }).then(()=>{
            console.log("the cart updated");
            props.update.set(!props.update.status);
        }).catch((err)=>{
            console.log(`there is a problem ${err}`);
        })
    };

    return (
        <ImageListItem key={props.product_id} className={classes.imageListItem}>
            <React.Fragment>
                <div className={"picText"}>
                    <img  className={"picText"} src={props.product_picture} alt={props.product_id} width={200} height={200}/>
                    <ImageListItemBar
                        title={props.product_name}
                        subtitle={<strong>Price: {props.product_price} Size: {props.product_size} Quantity: {props.product_quantity}</strong>}
                        actionIcon={
                            <div className={"picText"}>
                                <Button onClick={handleChange}><RemoveShoppingCartIcon/></Button>
                            </div>
                        }
                    />
                </div>

            </React.Fragment>
        </ImageListItem>
    )}

export let CheckoutScreen = (props) => {
    const classes = useStyles();
    const [allProduct, setAllProduct] = useState({data:[], count: 0});
    const [update,setUpdate] = useState(false);
    const history = useHistory();
    const handleChange = () => {
        let url = "http://localhost:5000/cart/checkout";
        let data = {}
        axios.post(url,{
            withCredentials: true,
            params: data
        }).then(()=>{
            console.log("done checkout");
            return history.push('/order_history');
        }).catch((err)=>{
            console.log(`there is a problem ${err}`);
        })
    };
    let orderPriceSum = 0
    useEffect(() => {
        Get_all_products(setAllProduct, props.url,history, props.login);
    }, [update]);
    let list_of_product_objects = create_list_of_product_objects(allProduct.data);
    const listItems = list_of_product_objects.map((single_product) =>

        <Single_cart_item product_id = {single_product.product_id}
                          product_name ={single_product.product_name}
                          product_price ={single_product.product_price}
                          product_picture ={single_product.product_picture}
                          product_size ={single_product.product_size}
                          product_quantity = {single_product.product_quantity}
                          update = {{status:update,set:setUpdate}}/>

    );
    let addToTotalPrice = (product) => {orderPriceSum += product.product_price * product.product_quantity}
    return (

        <div className={classes.root}>
            <TableContainer className={classes.orderTable} component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell >Name</TableCell>
                            <TableCell >Size</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell >Price</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list_of_product_objects.map((product) => (
                            <TableRow key={product.event_id + product.product_size}>
                                {addToTotalPrice(product)}
                                <TableCell>{product.product_name}</TableCell>
                                <TableCell>{product.product_size}</TableCell>
                                <TableCell>{product.product_quantity}</TableCell>
                                <TableCell>{product.product_price * product.product_quantity}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <p>Total price: {orderPriceSum}</p>
                </Table>
            </TableContainer>
            <div className={classes.orderInfo}>
                <p>If your order is ready, click on the checkout button and we will begin making you order.</p>
                <p>Currently there isn't a delivery option so please come to the store 4 working days after making the</p>
                <p>order and pay for it while you are there.</p>
                <Grid alignItems={"center"} alignContent={"center"} container direction={'row'} justifyContent={'center'}>
                    <Button variant={"contained"} color={"primary"} onClick={() => handleChange()}>Checkout</Button>
                </Grid>
            </div>
        </div>)
};

let OrderDetails = (props)=>{

}