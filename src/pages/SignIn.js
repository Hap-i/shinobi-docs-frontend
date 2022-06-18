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
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useAuth } from '../context/authContext';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


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

export default function SignIn() {
    const { user, setuser } = useAuth()
    const navigate = useNavigate();
    const location = useLocation();
    const redirectPath = location.state?.path || '/'

    const toastOptions = {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
    };

    useEffect(() => {
        if (!user) {
            axios({
                url: `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/me`,
                method: "GET",
                withCredentials: true

            }).then((res) => {
                setuser(res.data.data)
                navigate(redirectPath, { replace: true })
            }).catch((err) => {
            })
        } else {
            navigate(redirectPath, { replace: true })
        }
    }, []);

    const Login = async (email, password) => {
        await axios({
            url: `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/login`,
            method: "POST",
            data: {
                "email": email,
                "password": password

            },
            withCredentials: true
        }).then((res) => {
            // toast.success(`Welcome back ${res.data.data.user.name.split(" ")[0]}`, toastOptions)
            var userObj = {
                "name": res.data.data.user.name,
                "email": res.data.data.user.email,
                "userId": res.data.data.user._id
            }
            setuser(userObj)
            navigate(redirectPath, { replace: true })
        }).catch((err) => {
            if (err.response.data.message === "Incorrect Email or Password") {
                toast.error("Invalid Credential", toastOptions)
            } else {
                toast.error("Something Went wrong! Please try again later.", toastOptions)
            }
        })
    }


    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        Login(data.get('email'), data.get('password'));
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
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2" onClick={navigate('/signup')}>
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
            <ToastContainer />
        </ThemeProvider>
    );
}