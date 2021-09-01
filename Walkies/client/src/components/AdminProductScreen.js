import React  from "react";
import axios from "axios";
import {useStyles} from "./StoreScreen";
import {Button, ButtonGroup, ImageListItem, ImageListItemBar} from "@material-ui/core";
import {useHistory} from "react-router-dom";

export let AdminProductScreen = (props)=>{

    const classes = useStyles();
    let url = 'http://localhost:5000/admin/product';
    const history = useHistory();
    let onDelete = ()=>{
        let data = {
            product_id: props.product_id,
        }
        axios.delete(url,{withCredentials: true, params: data}).then((res)=>{
            console.log("product deleted");
            props.setDeleteProduct(!props.deleteProduct)
            props.setCheckAdmin(true);
        }).catch((err)=>{
            console.log(err)
            if (err == "Error: Request failed with status code 401") {
                props.setLogin(false);
                history.push("/login");
            } else if (err == 'User not an admin, please change account')
            {
                props.setCheckAdmin(false);
            }
        })
    }
    return(
        <ImageListItem key={props.product_id} className={classes.imageListItem}>
            <React.Fragment>
                <div className={"picText"}>
                    <img className={"picText"} src={props.product_picture} alt={props.product_id} width={500}
                         height={500}/>
                    <ImageListItemBar
                        title={props.product_name}
                        subtitle={<span>price: {props.product_price}</span>}
                    />
                </div>

                <ButtonGroup aria-label="small outlined button group" bgcolor="background.paper" fullWidth>
                    <Button  className={classes.formControl} aria-label="delete" name="checkedWishlist" onClick={onDelete} color={"primary"}>
                        Delete
                    </Button>
                <Button href={`/admin/productManagement/edit/${props.product_id}`} color={"primary"} >Edit</Button>
                </ButtonGroup>

            </React.Fragment>
        </ImageListItem>
    )
}
