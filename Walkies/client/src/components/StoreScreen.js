import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {
    Button, ButtonGroup, FormControl, ImageList, ImageListItem,
    ImageListItemBar, InputBase,  NativeSelect, withStyles,
} from "@material-ui/core";
import axios from 'axios';
import {alpha, makeStyles} from "@material-ui/core/styles";
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import '../App.css';
import {getWishList} from "./WishList";
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import {SearchBar} from "./SearchBarCom";
import {PageController} from "./PageController";
axios.defaults.withCredentials = true;

export const useStyles = makeStyles((theme) => ({
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
    imageList: {
        width: "100%",
        height: "100%",
    },
    imageListItem: {
        width: "33.3%",
        height: "100%",
    },
    icon: {
        color: 'white',
    },
    title: {
        color: theme.palette.primary.light,
    },
    formControl: {
        minWidth: 20,
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.black, 0.25),
            borderRadius: theme.shape.borderRadius,
            bgcolor: 'background.paper',
            borderColor: 'text.primary',
        }
    },
    checkoutButtonFromCart: {
        width: '50%'
    }

}));

const BootstrapInput = withStyles((theme) => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(3),
        },
    },
    input: {
        borderRadius: 4,
        position: 'relative',
        // backgroundColor: theme.palette.background.paper,
        border: `1px solid #3c3838`,
        fontSize: 16,
        padding: '10px 26px 10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderRadius: 3,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}))(InputBase);

export let create_list_of_product_objects = (data) => {
    let list_of_product_objects = [];
    for (let product of data) {
        let product_object = {
            product_id: product.product_id,
            product_name: product.product_name,
            product_price: product.product_price,
            product_picture: product.product_picture,
            product_size: product.product_size,
            product_quantity: product.quantity,
        }
        console.log(product_object)
        list_of_product_objects.push(product_object);
    }

    return list_of_product_objects;
}


export let Get_all_products = async(func, url,history,setLogin,data) => {
    console.log({withCredentials: true, search:data})
   await axios.get(url,{withCredentials: true, params: data,}).then((results) => {
        func(results.data);
    }).catch((err)=>{
        if (err == "Error: Request failed with status code 401"){
            setLogin(false);
            history.push('/login');
        }
        return console.log(err);
    })
}



export let All_products = (props) => {
    const classes = useStyles();
    const [allProduct, setAllProduct] = useState({data: props.data, count: 0 });
    const [wishList,setWishList] = useState([]);
    const [search,setSearch] = useState(undefined);
    const [page,setPage] = useState(1);

    let skipToPage = (pageNumber)=> {
        setPage(pageNumber)

    }

    const history = useHistory();

    console.log(search);
    useEffect(async () => {
        await Get_all_products(setAllProduct, props.url,history,props.login,{search:search, page: page}).then(async ()=>{
            await getWishList(setWishList,history,props.login);
        });
        console.log("after prod");
    }, [search,page]);
    const wishListStatus = new Set();
    wishList.map((product)=>{
            wishListStatus.add(product.product_id);
        })
    console.log(wishListStatus);
    let list_of_product_objects = create_list_of_product_objects(allProduct.data);
    const listItems = list_of_product_objects.map((single_product) =>(
        <Single_product product_id={single_product.product_id}
                        product_name={single_product.product_name}
                        product_price={single_product.product_price}
                        product_picture={single_product.product_picture}
                        wish_list_status = {wishListStatus.has(parseInt(single_product.product_id))}/>
    ));

    return (
        <div className={classes.root}>
            <SearchBar search = {setSearch}/>
            <PageController
                page = {page}
                totalNumberOfPages = {Math.ceil(allProduct.count / 50)}
                skipToPage = {skipToPage}
            />
            <div className="results">Showing {Math.ceil(allProduct.count / 50) == page ? allProduct.count % 50  : 50} results </div>
            <p className='results'>page {page} from {Math.ceil(allProduct.count / 50)}</p>
            <ImageList key={1} rowHeight={180} className={classes.imageList} cols={2}>
                {listItems}
            </ImageList>
        </div>)
};


export let update_wish_list = async (itemState,data)=>{
    let url = "http://localhost:5000/cart/wishlist"
    console.log(itemState)
    if (itemState){
        await axios.post(url,{},{
            withCredentials: true,
            params: data
        })
    }else{
        await axios.delete(url,{
            withCredentials: true,
            params: data
        })
    }
}

export let Single_product = (props) => {
    const classes = useStyles();
    const [size, setSize] = useState('size');
    const [quantity, setQuantity] = useState('quantity');
    const [wishListForSingleProduct, setWishListForSingleProduct] = useState(props.wish_list_status);
    console.log(props.wish_list_status)
    const handleChangeSize = (event) => {
        if (event.target.value != size){
            setWishListForSingleProduct(false);
            console.log(`size change ${wishListForSingleProduct}`);
        }
        setSize(event.target.value);
    };
    const handleChangeQuantity = (event) => {
        setQuantity(event.target.value);
    };
    const handleSubmit = () => {
        addToCart(props.product_id, quantity);
    }
    const addToCart = ()=>{
        let url = "http://localhost:5000/cart";
        let data = {
            product_id:props.product_id,
            quantity: quantity,
            product_size: size,
        }
        axios.post(url,{},{
            withCredentials: true,
            params: data
        }).then((res)=>{
            console.log("cart updated");
        }).catch((err)=>{
            console.log(`there is a problem ${err}`);
        })
    }
    const handleWishListChangeDelete = () => {
        setWishListForSingleProduct(false);
        let data = {
            product_id: props.product_id,
            product_size: size,
        }

        update_wish_list(false,data).then(()=>{
                console.log("wishlist updated");
            }
        ).catch((err)=>{
            if (err == "Error: Request failed with status code 400")
            {
                setWishListForSingleProduct(true);
            }
        });
    };
    const handleWishListChangeAdd = ()=>
    {
        console.log(`before firs up ${wishListForSingleProduct}`)
        setWishListForSingleProduct(true);
        let data = {
            product_id: props.product_id,
            product_size: size,
        }
        update_wish_list(true,data).then(()=>{
                console.log("wishlist updated");
            }

        ).catch((err)=>{
            if (err == "Error: Request failed with status code 400")
            {
                setWishListForSingleProduct(false);

            }
        });
    };

    let action = (
        <ButtonGroup aria-label="small outlined button group" bgcolor="background.paper">
        <Button disabled={true?size == 'size':false} required className={classes.formControl} aria-label="delete"  name="checkedWishlist">
            {wishListForSingleProduct ?<FavoriteIcon onClick={handleWishListChangeDelete}/>:<FavoriteBorderIcon onClick={handleWishListChangeAdd} />}

        </Button>
            <Button disabled={true?size == 'size' || quantity == 'quantity':false} required className={classes.formControl} ><AddShoppingCartIcon onClick={handleSubmit}/></Button>
        <FormControl required variant="outlined" size={"small"} className={classes.formControl}>
            <NativeSelect
                id="demo-customized-select-native"
                value={size}
                onChange={handleChangeSize}
                input={<BootstrapInput/>}
            >
                {creatOptions(10, 34, "size")}
            </NativeSelect>
        </FormControl>
        <FormControl bgcolor="background.paper" required className={classes.formControl} size={"small"} >
            <NativeSelect
                id="demo-customized-select-native"
                value={quantity}
                onChange={handleChangeQuantity}
                input={<BootstrapInput/>}
            >
                {creatOptions(10, 0, "quantity")}
            </NativeSelect>
        </FormControl>
    </ButtonGroup>)
    return (
        <ImageListItem key={props.product_id} className={classes.imageListItem}>
            <React.Fragment>
                <div className={"picText"}>
                    <img className={"picText"} src={props.product_picture} alt={props.product_id} width={500}
                         height={500}/>
                    <ImageListItemBar
                        title={props.product_name}
                        subtitle={<span>price: {props.product_price}</span>}
                        actionIcon={action}
                    />
                </div>

            </React.Fragment>
        </ImageListItem>
    )

}
export let creatOptions = (number, start, nameOf) => {
    let optionList = [<option value={nameOf}>{nameOf}</option>]
    for (let i = 1; i < number; i++) {
        optionList.push(<option value={i + start}>{i + start}</option>)
    }
    return optionList
}

export default All_products;