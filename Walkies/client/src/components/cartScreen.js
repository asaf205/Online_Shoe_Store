import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {Button, Grid, ImageList, ImageListItem, ImageListItemBar} from "@material-ui/core";
import {create_list_of_product_objects, Get_all_products, useStyles} from "./StoreScreen";
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';
import axios from "axios";
import Typography from "@material-ui/core/Typography";

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
                    <img  className={"picText"} src={props.product_picture} alt={props.product_id} width={500} height={500}/>
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

export let CartScreen = (props) => {
    const classes = useStyles();
    const [allProduct, setAllProduct] = useState({data:[], count: 0});
    const [update,setUpdate] = useState(false);
    const history = useHistory();

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

    return (

        <div className={classes.root}>
            <Grid alignItems={"center"} alignContent={"center"} container direction={'row'} justifyContent={'center'}>
                <Button  href="/checkout"  className={classes.checkoutButtonFromCart}  color={"primary"} >
                    <Typography variant="h4" >
                        Checkout
                    </Typography>
                </Button>
            </Grid>

            <ImageList rowHeight={180} className={classes.imageList} cols={2}>
                {listItems}
            </ImageList>
        </div>)
};

let OrderDetails = (props)=>{

}