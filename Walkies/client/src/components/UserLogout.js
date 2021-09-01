import React, {useEffect, useState} from "react";
import axios from "axios";
import {makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import {Button} from "@material-ui/core";
import {useHistory} from "react-router-dom";

axios.defaults.withCredentials = true

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(3),
    },
    Button: {
        backgroundColor: "#8FBC8B",
        margin: theme.spacing(3),
        color: "#E0FFFF",
    },
}));

export default function UserLogout(props) {
    let classes = useStyles();
    const [resp, setResp] = useState(null);
    const history = useHistory()
    let doLogout = async () => {
        let url = 'http://localhost:5000/user/logout';
        await axios.get(url,{withCredentials: true}
    ).then( async (res) => {
            setResp("Success: user logout.");
            await props.login(false);
            await axios.get('http://localhost:5000/user/id',{withCredentials: true,}).then((res)=>{
                if (res.data == 0){
                    props.setCheckAdmin(true);
                }
                else
                {
                    props.setCheckAdmin(false);
                }
                console.log(res)
            })
            history.push('/login');
        }).catch(async (err) => {
            console.log(err)
            if (err == 'Error: Request failed with status code 401'){
                props.login(false);
                history.push('/login');
            }else{
                setResp("Error: failed to logout.");
            }

        })
    }
    useEffect(()=>{
        doLogout().then(()=>{
            alert("We are sad to see you leave");
        }).catch((err)=>{
            console.log(err);
        })
    },[])

    return (null)

}
