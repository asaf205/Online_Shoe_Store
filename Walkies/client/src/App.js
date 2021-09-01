import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import {
    BrowserRouter as Router,
    Switch,
    Route, Link, useHistory
} from "react-router-dom";
import All_products from "./components/StoreScreen";
import {CartScreen} from "./components/cartScreen";
import UserLogout from "./components/UserLogout";
import InputWithIcon, { checkAdminFunc} from "./components/login";
import {UserSignup} from "./components/UserSignup";
import {OrderHistory} from "./components/OrderHistory";
import {WishList} from "./components/WishList";
import {AdminScreen} from "./components/AdminScreen";
import {AdminEditProduct} from "./components/AdminEditProduct";
import {CheckoutScreen} from "./components/CheckoutScreen";
import {Button, ButtonGroup} from "@material-ui/core";
import {ProductManagementScreen} from "./components/productManagementScreen"
import {AdminNewProduct} from "./components/AdminNewProduct";
import {ReadMe} from "./components/ReadMe";


const useStyles = makeStyles((theme) => ({
    link: {
        display: 'flex',
        color:"#3f50b5",
        width:'20%',
        borderRightStyle: { width: '5rem', height: '100%' },
        borderBottom: '1px solid',
    },
    groupButton:{
        width: '100%',
        marginBottom: '10px',
    },
    Button:{
        width: '100%',
        margin: 'auto'
    }
}));

export default function App() {
    const classes = useStyles();
    const [login,setLogin] = useState(false);
    const [id,setId] = useState(0);
    const [checkAdmin,setCheckAdmin] = useState(false);

    useEffect(()=>{
        let state = ('true' == localStorage.getItem('login'));
        let admin = ('true' == localStorage.getItem('admin'));
        setLogin(state);
        setCheckAdmin(admin);
    },[])

    useEffect(()=>{
        localStorage.setItem('login',JSON.stringify(login));
        localStorage.setItem('admin',JSON.stringify(checkAdmin));
    })

    console.log(login)
    return (

    <Router>
        <div>
            <div className="nav_bar">
                <ButtonGroup className={classes.groupButton} variant="text" color="primary" aria-label="text primary button group">
                    <Button href = "/store" className={classes.link}>
                        <Typography variant="h5" >
                            STORE
                        </Typography>
                    </Button>
                    <Button  href = "/order_history" className={classes.link}>
                        <Typography variant="h5" >
                            ORDER HISTORY
                        </Typography>
                    </Button>
                    <Button  href="/wish_list" className={classes.link}>
                        <Typography variant="h5" >
                            WISH LIST
                        </Typography>
                    </Button>
                    <Button  href="/cart" className={classes.link}>
                        <Typography variant="h5" >
                            CART
                        </Typography>
                    </Button>
                    {login ?
                        <Button  href="/logout" className={classes.link}>
                            <Typography variant="h5" >
                                LOGOUT
                            </Typography>
                        </Button>
                        :
                        <Button href="/login" className={classes.link}>

                        <Typography variant="h5" >
                        LOGIN
                        </Typography>
                        </Button>}
                    {checkAdmin?<Button  href="/admin" className={classes.link}>
                        <Typography variant="h5" >
                            ADMIN
                        </Typography>
                    </Button>:null}
                    <Button  href="/readme.html" className={classes.link}>
                        <Typography variant="h5" >
                            ReadMe
                        </Typography>
                    </Button>
                </ButtonGroup>

            </div>
            <Switch>
                <Route path="/signup">
                    <UserSignup/>
                </Route>
                {
                    login ?
                        <Route path="/logout">
                            <UserLogout login={setLogin} setCheckAdmin = {setCheckAdmin}/>
                        </Route> :
                        <Route path="/login">
                            <InputWithIcon login={setLogin} setCheckAdmin = {setCheckAdmin}/>
                        </Route>
                }

                <Route path="/store">
                    <All_products data = "" url = 'http://localhost:5000/products' login = {setLogin}/>
                </Route>
                <Route path="/order_history">
                    <OrderHistory login = {setLogin}/>
                </Route>
                <Route path="/wish_list">
                    <WishList login = {setLogin}/>
                </Route>
                <Route path="/cart">
                    <CartScreen data = "" url = 'http://localhost:5000/cart' login = {setLogin}/>
                </Route>

                <Route path="/checkout">
                    <CheckoutScreen data = "" url = 'http://localhost:5000/cart' login = {setLogin}/>
                </Route>
                <Route path="/readme.html">
                    <ReadMe/>
                </Route>
                {setCheckAdmin ?
                    <Route path="/admin/productManagement/edit/:id">
                        <AdminEditProduct setLogin={setLogin} checkAdmin ={checkAdmin}setCheckAdmin = {setCheckAdmin}/>
                    </Route>:null}
                {setCheckAdmin ?
                    <Route path="/admin/productManagement/new">
                    <AdminNewProduct setLogin = {setLogin} id={setId} checkAdmin ={checkAdmin} setCheckAdmin = {setCheckAdmin}/>
                    </Route>:null}
                {setCheckAdmin ?
                    <Route path="/admin/productManagement">
                    <ProductManagementScreen setLogin = {setLogin} url = {'http://localhost:5000/products'} checkAdmin ={checkAdmin} setCheckAdmin = {setCheckAdmin}/>
                    </Route>:null}
                {setCheckAdmin ?
                    <Route path="/admin">
                    <AdminScreen setLogin = {setLogin} checkAdmin ={checkAdmin} setCheckAdmin = {setCheckAdmin}/>
                    </Route>
                :null}

            </Switch>
        </div>
    </Router>
    );
}
