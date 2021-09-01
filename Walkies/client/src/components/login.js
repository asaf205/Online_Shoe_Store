import React, {useState} from 'react';
import {alpha, makeStyles} from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import {Button, ButtonGroup, Checkbox} from "@material-ui/core";
import "../App.css";
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import axios from "axios";
import MuiAlert from '@material-ui/lab/Alert';
import {useHistory} from "react-router-dom";
import {CheckBox} from "@material-ui/icons";
import FormControlLabel from '@material-ui/core/FormControlLabel';


axios.defaults.withCredentials = true

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(3),
    },
    Button:{
        backgroundColor:"#8FBC8B",
        // margin: theme.spacing(3),
        color:"#E0FFFF",
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.black, 0.25),
            borderRadius: theme.shape.borderRadius,
            bgcolor: 'background.paper',
            borderColor: 'text.primary',
        }
    },

}));
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export let Login = (props)=> {
    const classes = useStyles();
    const history = useHistory();
    return (
        <div >
            <Grid
                container
                direction="column"
                justify="space-evenly"
                alignItems="center"
                id = "login"
            >
                <h1 className={classes.margin}>Login</h1>
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
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={props.rememberMe}
                            onChange={props.changeRememberMe}
                            name="rememberMe"
                            color="primary"
                        />
                    }
                    label="Remember me"
                />
                <ButtonGroup disableElevation variant="contained" >
                    <Button id="loginButton" className={classes.Button} variant="contained" onClick={props.log}>
                        Login
                    </Button>
                    <Button id="loginButton" className={classes.Button} variant="contained" onClick={()=>{history.push("/signup")}}>
                        New user ? Please click here to sign up
                    </Button>
                </ButtonGroup>
                <div>
                    {props.respons}
                </div>
            </Grid>
        </div>

    )
}

export let checkAdminFunc = (setCheckAdmin)=>{
    axios.get('http://localhost:5000/user/id',{withCredentials: true,}).then((res)=>{

        if (res.data == 0){
            console.log(res.data);
            setCheckAdmin(true);
        }
        else
        {
            setCheckAdmin(false);
        }
    })
}

export default function InputWithIcon(props) {
    const [user,setUser] = useState(null);
    const [pass,setPass] = useState(null);
    const [rememberMe,setRememberMe] = useState(false);
    const [resp,setResp] = useState(null);
    const history = useHistory();
    let changeUser = (e)=>{
        setUser(e.target.value);
    }
    let changePass = (e)=>{
        setPass(e.target.value);
    }
    let changeRememberMe = (e)=>{
        setRememberMe(e.target.checked)
    }
    let doLogin = async ()=>{
      let url = 'http://localhost:5000/user';
      let data = {
          username: user,
          password: pass,
          rememberMe: rememberMe
      }
      await axios.get(url,{
          withCredentials: true,
          params: data
      }).then(async (res)=>{
          console.log(res.headers)
          setResp(<Alert severity="success">"Success: user lodged in."</Alert>);
          await props.login(true);
          await axios.get('http://localhost:5000/user/id',{withCredentials: true,}).then((res)=>{

              if (res.data == 0){
                  console.log(res.data);
                  props.setCheckAdmin(true);
              }
              else
              {
                  props.setCheckAdmin(false);
              }
          })
          history.push('/store');

      }).catch((err)=>{
          console.log(err)
          setResp(<Alert severity="error">Error: failed to login.</Alert>);
      });
    }
    return (
            <Login respons ={resp?resp:null} user = {changeUser} pass = {changePass} rememberMe={rememberMe} changeRememberMe = {changeRememberMe} log = {doLogin} />
        );



}
