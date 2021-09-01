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
import {useHistory, useParams} from "react-router-dom";
import {Button, Grid, InputLabel, NativeSelect, OutlinedInput, TextField} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import {creatOptions} from "./StoreScreen";
import {makeStyles} from "@material-ui/core/styles";


axios.defaults.withCredentials = true
export const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
        margin:'10',
    },

}));

export let AdminEditProduct = (props)=>{
    const [product_id, setProduct_id] = useState("");
    const [product_name, setProduct_name] = useState("");
    const [product_price, setProduct_price] = useState("");
    const [product_picture, setProduct_picture] = useState("");
    const [product_size, setProduct_size] = useState([]);
    let {id} = useParams();
    let setLogin = props.setLogin;
    let history = useHistory();
    let classes = useStyles();
    useEffect(async ()=>{
        await getSingleProductDetails();
    },[]) ;



    let getSingleProductDetails = async () => {
        let url = 'http://localhost:5000/products/single';
        await axios.get(url, {withCredentials: true, params: {id: id}}
        ).then(async (res) => {

            setProduct_id(res.data[0].product_id)
            setProduct_name(res.data[0].product_name);
            setProduct_price(res.data[0].product_price);
            setProduct_picture(res.data[0].product_picture);
            setProduct_size(res.data[0].product_sizes);
            props.setCheckAdmin(true);
            console.log(res.data[0]);
        }).catch( (err) => {
            if (err == "Error: Request failed with status code 401") {
                setLogin(false);
                history.push("/login");
            } else if (err == 'Error: Request failed with status code 403')
            {
                props.setCheckAdmin(false);
                history.push("/store");
            }
        })
    }



    let getName=(event)=> {
        setProduct_name(event.target.value);
    }

    let getPrice = (event) => {
        setProduct_price(event.target.value);
    }

    let getPicture = (event) => {
        setProduct_picture(event.target.value);
    }

    let getSize= (event) => {
        setProduct_size(event.target.value);
    }


    let Submit = () => {
        let url = 'http://localhost:5000/admin/product';
        let data = {
            product_id: product_id,
            product_name: product_name,
            product_price: product_price,
            product_picture: product_picture,
            product_sizes: product_size,
        };
        axios.patch(url,{} ,{withCredentials: true, params: data}).then((r) => {
           history.push("/admin/productManagement");
        }).catch((e) => {

        });
    }

    return (<Grid classes={classes.root} fullWidth  container
                  direction="column"
                  justifyContent="center"
                  alignItems="center" >
            <FormControl  fullWidth variant="outlined" >
                <InputLabel htmlFor="outlined-adornment-amount">product name</InputLabel>
                <OutlinedInput
                    id="name"
                    labelWidth={60}
                    onChange={getName}
                    value={product_name}
                />
            </FormControl>
            <p></p>
            <FormControl  fullWidth variant="outlined">
                <InputLabel htmlFor="outlined-adornment-amount">product price</InputLabel>
                <OutlinedInput
                    id="price"
                    labelWidth={60}
                    onChange={getPrice}
                    value={product_price}
                />
            </FormControl>
            <p></p>
            <FormControl  fullWidth variant="outlined">
                <InputLabel htmlFor="outlined-adornment-amount">product picture</InputLabel>
                <OutlinedInput
                    id="picture"
                    labelWidth={60}
                    onChange={getPicture}
                    value={product_picture}
                />
            </FormControl>
            <p></p>
            <FormControl  fullWidth variant="outlined">
                <InputLabel htmlFor="outlined-adornment-amount">product size</InputLabel>
                <OutlinedInput
                    id="size"
                    labelWidth={60}
                    onChange={getSize}
                    value={product_size}
                />
            </FormControl>
            <p></p>
            <Button variant="contained" color="primary" onClick={Submit} fullWidth>
                Submit
            </Button>
        </Grid>
    );}

