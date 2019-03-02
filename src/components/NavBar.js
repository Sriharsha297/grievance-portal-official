import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/HomeOutlined';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import {  Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Button from '@material-ui/core/Button'
import { logout } from "../actions/User"
import { Hidden } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Person from "@material-ui/icons/Person"

const DRAWER_WIDTH = 240;

const styles = theme => ({
  root: {
    marginBottom: 2 * theme.spacing.unit,
  },

  appBar: {
    background: '#08002A',
    'box-shadow': 'none',
    flexGrow: 1,
    position: 'sticky !important'
  },

  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: DRAWER_WIDTH,
      flexShrink: 0,
    },
  },

  navLinks: {
    marginRight: 1 * theme.spacing.unit,
    color: '#eaeaea',
  },

  navIcon: {
    marginLeft: theme.spacing.unit,
    marginRight: (1 / 2) * theme.spacing.unit,
    // color: '#eaeaea'
  },

  drawerPaper: {
    'border-right': '0px',
    background: '#fff',
    width: DRAWER_WIDTH,
  },

  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: '100vh',
    position: 'fixed',
    overflow: 'scroll'
  },

  toolbar: theme.mixins.toolbar,
});

// function ListItemLink(props) {
//   return <ListItem button component="a" {...props} />;
// }

class NavBar extends React.Component {
  state = {
    mobileOpen: false,
    toLogin: false,
    anchorEl: null,
    //isLoggedIn:true,
  };

  handleDrawerToggle = (e) => {
    e.preventDefault();
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes, theme } = this.props;
    const {anchorEl} = this.state;
    let role = localStorage.getItem('role');
    if (this.state.toLogin) {
      return <Redirect to="/officiallogin" />
    }
    const drawer = (
      <div className={classes.toolbar} >
        <Divider />
        <List component="nav">

        {(!!localStorage.getItem('token')) ?
        <div>
          <ListItem button onClick={() => { this.props.history.push("/official") }}>
            <HomeIcon className={classes.navIcon} />
            <ListItemText primary='My Grievances' />
          </ListItem>
         { (localStorage.getItem('role') == 'districtOfficer')  ?
          ''
          :
          <ListItem button onClick={() => { this.props.history.push("/official/zone/grievances") }}>
            <ListItemText primary='View zonal grievances' />
          </ListItem>
        }
        </div>
          :
          ''

        }


          {(!!localStorage.getItem('fullName')) ?
            <ListItem button onClick={() => {
              localStorage.clear();
              this.props.history.push('/')
            }}>
              <ListItemText primary='Logout' />
            </ListItem>
            :
            ''
          }


        </List>
        <Divider />
      </div>
    );
    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="relative" className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Hidden xsDown>
              <Typography variant="h6" color="inherit" noWrap className={classes.appBar}>
                {!!role ? role.toUpperCase() : 'Official   '}
              </Typography>
              
              {!!(localStorage.getItem('token')) ?
                // <Button className={classes.navLinks} onClick={()=>{      
                //   localStorage.clear();
                //   this.props.dispatch(logout())}} color="inherit"
                // >
                //   Logout
                // </Button>
                <div>
                  <Button onClick={() => { this.props.history.push('/official') }} className={classes.navLinks}>
                    <HomeIcon className={classes.navIcon} />
                    My Grievances
                  </Button>
                  <Button
                    aria-owns={anchorEl ? 'simple-menu' : undefined}
                    aria-haspopup="true"
                    className={classes.navLinks}
                    onClick={this.handleClick}
                  >
                    {localStorage.getItem('fullName').split(" ")[0]}
                    <Person className={classes.navIcon}/>
                  </Button>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                  >
                    <MenuItem onClick={this.handleClose}>My account</MenuItem>
                    <MenuItem onClick={()=>{      
                        localStorage.clear();
                      this.props.history.push('/')
                     //this.setState({toLogin:true})
                    }
                    }>Logout</MenuItem>
                  </Menu>

                </div>
                :
                ''
              }

            </Hidden>
          </Toolbar>
        </AppBar>
        <nav className={classes.drawer}>
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Drawer
            container={this.props.container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={this.state.mobileOpen}
            onClose={this.handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            {drawer}
          </Drawer>
        </nav>
      </div>
    );
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
  // Injected by the documentation to work in an iframe.
  // You won't need it on your project.
  container: PropTypes.object,
  theme: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    User: state.User
  }
}

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps)(withRouter(NavBar)));