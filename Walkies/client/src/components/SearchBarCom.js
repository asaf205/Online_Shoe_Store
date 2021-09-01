import React, {useEffect, useState} from 'react';
import {alpha, makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,

        backgroundColor: alpha(theme.palette.common.white, 1),
    },

    appbar: {
        color: "black",
        backgroundColor: alpha(theme.palette.common.white, 0.25),
        width:"100%",
        borderRadius: theme.shape.borderRadius,
        bgcolor: 'background.paper',
        borderColor: 'text.primary',
        m: 2,
        border: 1,
        marginBottom: 10,
    },
    search: {
        position: 'relative',
        backgroundColor: alpha(theme.palette.common.white, 0.25),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.black, 0.25),
            borderRadius: theme.shape.borderRadius,
            bgcolor: 'background.paper',
            borderColor: 'text.primary',
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
    },
}));


export let SearchBar = (props) => {
    const classes = useStyles();

    function handleSubmit(event) {
        props.search(event.target.value);
    }

    let searchDebounce = null;

    function handleChange(event) {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(async () => {
            props.search(event.target.value);
        }, 300);
    };


    return (
            <AppBar position="static" className={classes.appbar}>
                <div className={classes.search}>
                    <div className={classes.searchIcon}>
                        <SearchIcon onClick={handleSubmit}/>
                    </div>
                    <InputBase
                        placeholder="Search…"
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                        }}
                        inputProps={{'aria-label': 'search'}}
                        onChange={handleChange}
                    />
                </div>
            </AppBar>

    )
}


