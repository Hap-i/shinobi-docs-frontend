import React, { useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from '../context/authContext';
import axios from 'axios';

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="#">
                Shinobi Docs
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();

export default function SignUp() {
    const { user, setuser } = useAuth()
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            axios({
                url: `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/me`,
                method: "GET",
                withCredentials: true

            }).then((res) => {
                setuser(res.data.data)
                navigate("/")
            }).catch((err) => {
            })
        }
        // if (user) navigate("/")
    }, []);
    const toastOptions = {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
    };
    const validateData = (data) => {
        var userData = {
            firstname: data.get('firstName'),
            lastname: data.get('lastName'),
            email: data.get('email'),
            password: data.get('password'),
            confirmpassword: data.get('confirmPassword')
        }

        if (!userData.firstname) {
            toast.error("First Name is mandatory", toastOptions)
        } else if (!userData.lastname) {
            toast.error("Last Name is mandatory", toastOptions)
        } else if (!userData.email) {
            toast.error("Email Name is mandatory", toastOptions)
        } else if (!userData.password) {
            toast.error("Password is mandatory", toastOptions)
        } else if (userData.password.length < 8) {
            toast.error("Password should be atleast of 8 chars.", toastOptions)
        } else if (!userData.confirmpassword) {
            toast.error("Confirm Password is mandatory", toastOptions)
        } else if (userData.password !== userData.confirmpassword) {
            toast.error("Password and Confim Password isn't matching", toastOptions)
        } else {
            return true;
        }
        return false;

    }
    const signUp = (data) => {
        axios({
            url: `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/signup`,
            method: "POST",
            data: {
                "name": data.get('firstName') + " " + data.get('lastName'),
                "email": data.get('email'),
                "password": data.get("password"),
                "passwordConfirm": data.get("confirmPassword")
            },
            withCredentials: true

        }).then((res) => {
            var userObj = {
                "name": res.data.data.user.name,
                "email": res.data.data.user.email,
                "userId": res.data.data.user._id
            }
            setuser(userObj)
            navigate("/")
        }).catch((err) => {
            if (err.response.data.message === "Duplicate field value: email. Please use another value!") {
                toast.error("This Email is already used", toastOptions)
            } else {
                console.log(err)
                toast.error("Something Went wrong! Please try again later.", toastOptions)
            }

        })

    }
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if (validateData(data)) {
            signUp(data)
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    type="password"
                                    id="confirmPassword"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                                    label="I accept the terms and conditions."
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="#" variant="body2" onClick={navigate('/signin')}>
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>
            <ToastContainer />
        </ThemeProvider>
    );
}