import React, {useEffect, useState} from "react";
import axios from "axios";
import '../App.css';
import {
    ButtonGroup,

    IconButton, ImageList,
    ImageListItem,
    ImageListItemBar,
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from "react-router-dom";
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import {update_wish_list} from "./StoreScreen";
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';

axios.defaults.withCredentials = true
export const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
        width: "82%",
        margin: "auto"

    },

    imageList: {
        width: "100%",
        height: "100%",
    },
    imageListItem: {
        width: "25%",
        height: "100%",
    },
    icon: {
        color: 'white',
    },
    title: {
        color: theme.palette.primary.light,
    },
}));

export let getWishList = async (setState, history, setLogin) => {
    let url = 'http://localhost:5000/cart/wishlist';
    await axios.get(url, {withCredentials: true}
    ).then((res) => {
        setState(res.data);
    }).catch(err => {
        if (err == "Error: Request failed with status code 401") {
            setLogin(false);
            history.push('/login');
        }
    })
}

export let WishList = (props) => {
    const classes = useStyles();
    let [wishList, setWishList] = useState([]);
    let [update, setUpdate] = useState(false);
    const history = useHistory()
    useEffect(() => {
        return getWishList(setWishList, history, props.login);
    }, [update])

    console.log(wishList);
    return (
        <div className={classes.root}>
            <ImageList key={1} rowHeight={180} className={classes.imageList} cols={2}>
                {wishList.map(row => (
                    <Single_wish_list_item update={{status: update, set: setUpdate}} product_id={row.product_id}
                                           product_picture={row.product_picture} product_name={row.product_name}
                                           product_size={row.product_size} product_price={row.product_price}/>
                ))}
            </ImageList>
        </div>
    );
}
let Single_wish_list_item = (props) => {
    const classes = useStyles();

    const handleChange = () => {
        let data = {
            product_id: props.product_id,
            product_size: props.product_size,
        }
        update_wish_list(false, data).then(() => {
            props.update.set(!props.update.status);
            console.log("delete from wishlist");
        });
    };
    const addToCart = ()=>{
        let url = "http://localhost:5000/cart";
        let data = {
            product_id: props.product_id,
            quantity: 1,
            product_size: props.product_size,
        }
        axios.post(url,{},{
            withCredentials: true,
            params: data
        }).then((res)=>{
            handleWishListChangeDelete();
            props.update.set(!props.update.status);
            console.log("cart updated");
        }).catch((err)=>{
            console.log(`there is a problem ${err}`);
        })
    }
    const handleWishListChangeDelete = () => {

        let data = {
            product_id: props.product_id,
            product_size: props.product_size,
        }

        update_wish_list(false,data).then(()=>{
                console.log("wishlist updated");
            }
        ).catch((err)=>{

        });
    };
    console.log((`${props.product_picture}`));
    return (
        <ImageListItem key={props.product_id} className={classes.imageListItem}>
            <React.Fragment>
                <div className={"picText"}>
                    <img className={"picText"} src={props.product_picture} alt={props.product_id} width={500}
                         height={500}/>
                    <ImageListItemBar
                        title={props.product_name}
                        subtitle={<span>Price: {props.product_price} Size: {props.product_size}</span>}
                        actionIcon={
                            <ButtonGroup color="primary" aria-label="outlined primary button group">
                                <IconButton aria-label={`info about ${props.product_name}`} className={classes.icon}>
                                    <DeleteOutlineIcon onClick={handleChange}/>
                                </IconButton>
                                <IconButton aria-label={`info about ${props.product_name}`} className={classes.icon}>
                                    <AddShoppingCartIcon onClick={addToCart}/>
                                </IconButton>
                            </ButtonGroup>
                        }
                    />
                </div>
            </React.Fragment>
        </ImageListItem>
    )
}