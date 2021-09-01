import React, {useState} from "react";
import axios from "axios";
import {makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import AccountCircle from "@material-ui/icons/AccountCircle";
import TextField from "@material-ui/core/TextField";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import {Button} from "@material-ui/core";
import {Link, useHistory} from "react-router-dom";

axios.defaults.withCredentials = true

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(3),
    },
    Button:{
        backgroundColor:"#8FBC8B",
        margin: theme.spacing(3),
        color:"#E0FFFF",
    },
}));
let Signup = (props)=> {
    const classes = useStyles();
    return (
        <div>
            <Grid
                container
                direction="column"
                justify="space-evenly"
                alignItems="center"
            >
                <h1 className={classes.margin}>Singup</h1>
                <FormControl className={classes.margin}>
                    <InputLabel htmlFor="input-with-icon-adornment">User Name</InputLabel>
                    <Input
                        id="input-with-icon-adornment"
                        placeholder=" User Name"
                        label=" User Name"
                        onChange={props.user}
                        startAdornment={
                            <InputAdornment position="start">
                                <AccountCircle/>
                            </InputAdornment>
                        }
                    />
                </FormControl>
                <TextField
                    className={classes.margin}
                    id="input-with-icon-textfield"
                    placeholder="Password"
                    label="Password"
                    type="password"
                    position="center"
                    onChange={props.pass}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <VpnKeyIcon/>
                            </InputAdornment>
                        ),
                    }}
                />
                <Button id="signupButton" className={classes.Button} variant="contained" onClick={props.log}>
                    Signup
                </Button>
                <div>
                    {props.respons}
                </div>
                <Link to = "./signup" className={classes.margin} >Forgot Username / password</Link>
            </Grid>
        </div>

    )
}

export function UserSignup() {

    const [user,setUser] = useState(null);
    const [pass,setPass] = useState(null);
    const [resp,setResp] = useState(null);
    const history = useHistory();

    let changeUser = (e)=>{
        setUser(e.target.value);
    }
    let changePass = (e)=>{
        setPass(e.target.value);
    }
    let doSignup = ()=>{
        let url = 'http://localhost:5000/user';
        let data = {
            username: user,
            password: pass,
        }
        axios.post(url,{},{
            withCredentials: true,
            params: data
        }).then((res)=>{
            setResp("Success: user signup.");
            history.push("/login");

        }).catch((err)=>{
            setResp("Error: failed to signup.");
        });

    }
    return (
        <Signup respons ={resp?resp:null} user = {changeUser} pass = {changePass} log = {doSignup}/>
    );

}