import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";
import { login } from "../actions/User";
import { Redirect } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 4,
        marginBottom: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
    },
})
class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
        //this.handleDialogClose = this.handleDialogClose.bind(this);
        this.state = {
            isAuthorised: false,
            error:'',
           // open:true
        }
    }
    // handleDialogClose(){
    //     this.setState({ open: false,error:'' });
    // }
    handleLoginSubmit(e) {
        e.preventDefault();
        const username = e.target.elements.username.value.trim();
        const password = e.target.elements.password.value.trim();
       
            const loginObj = {
                username,
                password
            }
            // let temp = {
            //     fullName: 'Harsha',
            //     role: 'zonal Officer'
            // }
            // localStorage.setItem('fullname', 'Harsha');
            // this.props.dispatch(login(temp));
            // this.setState({ isAuthorised: tvue })

            axios.post('https://grievance-portal-server-1.herokuapp.com/api/official/auth/login',loginObj)
                .then((response) => {    
                    console.log(response.data.user);
                    localStorage.setItem('fullName',response.data.user.fullName);
                    localStorage.setItem('email',response.data.user.email);
                    //localStorage.setItem('districtName',response.data.user.districtName);
                    //localStorage.setItem('zoneName',response.data.user.zoneName);
                    localStorage.setItem('phoneNumber',response.data.user.phoneNumber);
                    localStorage.setItem('role',response.data.user.role);
                    localStorage.setItem('token',response.data.token)
                    this.props.dispatch(login(response.data.user));
                    this.setState({ isAuthorised: true })
                })
                .catch((error) => {
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        console.log(error.response.data.message);
                        console.log(error.response.status);
                        this.setState({error:error.response.data.message});
                    }
                    console.log(`Error : ${error}`);
                })
               ;
    }
    render() {
        const { classes } = this.props;
        if (this.state.isAuthorised) {
            return <Redirect to="/official" />
        }
        if(!!localStorage.getItem('token')){
            return <Redirect to='/official'/>
        }
        return (
            <div className={classes.main}>
            {
            // (!!this.state.error)?
            //     <ErrorDialog handleDialogClose={this.handleDialogClose} open={this.state.open} errorMessage={this.state.error}/>
            //   :
            // ''
            }
                <CssBaseline />
                <Paper className={classes.paper} elevation={8}>
                    <form className={classes.form} onSubmit={this.handleLoginSubmit}>
                        <Typography color='primary' component="h1" variant="h5">
                            Sign in
                        </Typography>
                        {
                            // show error if login fails
                            !!this.state.error ? <Typography variant="body1" color="error" align="center">
                                {this.state.error}
                            </Typography> : null
                        }
                        <TextField
                            label="Username"
                            className={classes.textField}
                            id="username"
                            placeholder="Enter Your PhoneNumber here"
                            type="text"
                            inputProps={{ minLength: 10 }}
                            margin="normal"
                            variant="outlined"
                            required={true}
                            fullWidth
                        />
                        <TextField
                            label="Password"
                            className={classes.textField}
                            type="password"
                            id="password"
                            fullWidth
                            inputProps={{ minLength: 2 }}
                            placeholder="Enter Your Password here"
                            margin="normal"
                            variant="outlined"
                            required={true}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Login
                        </Button>
                    </form>
                </Paper>
            </div>
        )
    }
}

LoginPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect()(LoginPage));