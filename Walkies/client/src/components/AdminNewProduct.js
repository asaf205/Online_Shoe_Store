import React, {useEffect, useState} from "react";
import axios from "axios";
import {useHistory, useParams} from "react-router-dom";
import {Button, InputLabel, OutlinedInput} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import {checkAdminFunc} from "./login";


axios.defaults.withCredentials = true


export let AdminNewProduct = (props)=>{
    const [product_name, setProduct_name] = useState("");
    const [product_price, setProduct_price] = useState("");
    const [product_picture, setProduct_picture] = useState("");
    const [product_size, setProduct_size] = useState([]);
    let setLogin = props.setLogin;
    let history = useHistory();


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

    useEffect(()=>{
        checkAdminFunc(props.setCheckAdmin);
    },[])
    let Submit = () => {
        let url = 'http://localhost:5000/admin/product';
        let data = {
            product_name: product_name,
            product_price: product_price,
            product_picture: product_picture,
            product_sizes: product_size,
        };
        axios.post(url,{} ,{withCredentials: true, params: data}).then((r) => {
            props.setCheckAdmin(true);
            history.push("/admin/productManagement");
        }).catch( (err) => {
            if (err == "Error: Request failed with status code 401") {
                setLogin(false);
                history.push("/login");
            }else if (err == 'Error: Request failed with status code 403')
            {
                props.setCheckAdmin(false);
                history.push("/store");
            }
        })
    }

    return (<div>
            <FormControl  fullWidth variant="outlined">
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
        </div>
    );}

