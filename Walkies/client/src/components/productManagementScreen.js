import React, {useEffect, useState} from "react";
import axios from "axios";
import {create_list_of_product_objects, Get_all_products, Single_product} from "./StoreScreen";
import {getWishList} from "./WishList";
import {SearchBar} from "./SearchBarCom";
import {Button, ImageList} from "@material-ui/core";
import {alpha, makeStyles} from "@material-ui/core/styles";
import {AdminProductScreen} from "./AdminProductScreen";
import {useHistory} from "react-router-dom";

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

}));

export let ProductManagementScreen = (props)=>{

    const classes = useStyles();

    const [allProduct, setAllProduct] = useState({data:[] ,count:0});
    const [search,setSearch] = useState(undefined);
    const [deleteProduct,setDeleteProduct] = useState(false);
    const history = useHistory();


    useEffect(async () => {
        await Get_all_products(setAllProduct, props.url,history,props.setLogin,{}).then(async ()=>{
            console.log(allProduct);
            props.setCheckAdmin(true);
        }).catch((err)=>{
            if (err == "Error: Request failed with status code 401") {
                props.setLogin(false);
                history.push("/login");
            } else if (err == 'Error: Request failed with status code 403')
            {
                props.setCheckAdmin(false);
                history.push("/store");
            }

        })},[search,deleteProduct]);

let list_of_product_objects = create_list_of_product_objects(allProduct.data);
const listItems = list_of_product_objects.map((single_product) =>(
    <AdminProductScreen product_id={single_product.product_id}
                    product_name={single_product.product_name}
                    product_price={single_product.product_price}
                    product_picture={single_product.product_picture}
                    deleteProduct ={deleteProduct}
                    setDeleteProduct={setDeleteProduct}
                    />
));

    return(
        <div className={classes.root}>

            <Button href={`/admin/productManagement/new`} className={classes.button}>New product</Button>
            <SearchBar search = {setSearch}/>
            <ImageList key={1} rowHeight={180}  cols={2} >
                {listItems}
            </ImageList>
        </div>
    )
}