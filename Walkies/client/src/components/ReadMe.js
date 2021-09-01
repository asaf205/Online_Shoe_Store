import React, {useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
    link: {
        display: 'flex',
        color: "#3f50b5",
    },
}))
export let ReadMe = ()=>{
    let classes = useStyles();
    return (
        <div >
        <h1>Read Me</h1>
            <h2 className={classes.link}>Store name:</h2>
            <h3> Walkies</h3>
            <h2 className={classes.link}>What are you selling?</h2>
            <h3>Shoes</h3>
            <h2 className={classes.link}>What additional page(s) did you add? How to operate it?</h2>
            <h3>
                page (1) order history  <strong>operate it:</strong> After the customer makes an order (checkout), the order details will appear on this page.<p/>
                page (2) wishlist <strong>operate it:</strong>  The customer can add a product he likes, this product will appear after pressing the heart-shaped button.
                This button is in disabled mode as long as the appropriate shoe size is not selected<p/>
                page (3) admin product management <strong>operate it:</strong> On this page the admin can perform actions like delete a product / update a product, create a new product.<p/>
                page (4) admin new product /edit product <strong>operate it:</strong> On these pages the admin can perform the action of adding or updating a product. So by filling out the product form and submitting, the product will appear in the store.
            </h3>
            <h2 className={classes.link}>What was hard to do?</h2>
            <h3>Coordinate the login operation so that the buttons will change according to the user's status, as well as cancel the user disconnection after refreshing the page (the real difficulty in this was the matter of changing the state on each page)</h3>
            <h2 className={classes.link}>Who is your partner?</h2>
            <h3>elad berkman 207680315</h3>
            <h2 className={classes.link}>What did you do?</h2>
            <h3>Mainly front end</h3>
            <h2 className={classes.link}>What did your partner do?</h2>
            <h3>Mainly back end</h3>
            <h2 className={classes.link}>Specify all the different routes your app supports:</h2>
            <h3>
                <ul>
                    <li>http://localhost:3000/signup -   signup page</li>
                    <li>http://localhost:3000/login  -   login page</li>
                    <li>http://localhost:3000/logout  -  logout route, leads to login page after logout</li>
                    <li>http://localhost:3000/store  -   main store page , only if logged in, can send products to wishlist and cart</li>
                    <li>http://localhost:3000/cart   -   cart page, shows the user cart. can remove products from cart and can move to checkout page from here</li>
                    <li>http://localhost:3000/wish_list   -   wishlist page, shows the user wishlist</li>
                    <li>http://localhost:3000/checkout   -   can see the cart , and there is a button to perform checkout that empties the cart and moves the order to order history</li>
                    <li>http://localhost:3000/admin   -   only if logged in as admin, see all events on the site. also there is a button for product management page</li>
                    <li>http://localhost:3000/admin/productManagement   -   only if logged in as admin, see all products on the site. can search and delete products from this page and move to relavant edit page or new product page.</li>
                    <li>http://localhost:3000/admin/productManagement/edit/:id   -   only if logged in as admin, edit the product. the form has prefilled data from the product.</li>
                    <li>http://localhost:3000/admin/productManagement/new   -   only if logged in as admin, create a new product.</li>
                </ul>
            </h3>
        </div>
    )
}