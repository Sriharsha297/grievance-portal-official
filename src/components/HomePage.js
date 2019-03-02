import React from "react";
//import grievances from "./../grievances.json";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withRouter , Link } from "react-router-dom";
import axios from "axios";
import {Button,Grid,FormControl,Input,InputLabel,MenuItem,Typography,Divider,Card,CardContent,CardActions,Select,withStyles,Paper} from "@material-ui/core"
import ErrorDialog from "./Dialog";
import CircularProgress from '@material-ui/core/CircularProgress';



const styles = theme => ({
  main: {
    margin: theme.spacing.unit,
  },
  root: {
    flexGrow: 1,
  },
  formControl: {
    margin: theme.spacing.unit*2,
    minWidth: 260,
  },
  pos: {
    marginTop: 12,
  },
  card: {
    minWidth: 280,
    margin: theme.spacing.unit * 1,
    padding: theme.spacing.unit ,
    color: theme.palette.text.primary,
  },
  someDivision:{
    textAlign: 'center'
  },
  progress: {
    marginBottom: theme.spacing.unit * 5,
  },
});


const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + localStorage.getItem('token')
}

const role = localStorage.getItem('role');


class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.state = {
      grievances: [],
      page: 0,
      rowsPerPage: 5,
      value: 0,
      filter: '',
      labelWidth: 0,
      error:'',
      open:true,
      length:true,
      role:''
      //loading:false,
    }
  }
 

  handleDialogClose(){
    this.setState({ open: false,error:'' });
  }

  handleTabChange = (event,value) => {
    this.setState({ value });
    console.log(value);
  };

  handleSelectChange = event => {
    //this.setState({ filter: event.target.value });
    this.setState({length:true})
    console.log("hey");
    console.log(role);
    console.log(event.target.value);
    if(!!event.target.value){
      axios.get(`https://grievance-portal-server-1.herokuapp.com/api/official/allocatedGrievances?role=${role}&status=${event.target.value}`, {headers: headers})
      .then((response) => {
        console.log(response)
  
        if(response.status === 200){
            this.setState({grievances:response.data.grievances, filter: event.target.value,length:response.data.grievances.length});
        }
      })
      .catch((error)=>{
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data.message);
          console.log(error.response.status);
          this.setState({error:error.response.data.message,open:true});
        }
      });
    }
    else{
      axios.get(`https://grievance-portal-server-1.herokuapp.com/api/official/allocatedGrievances`, {headers: headers})
      .then((response) => {
        console.log(response)
        if(response.status === 200){
            this.setState({grievances:response.data.grievances,length:response.data.grievances.length})
        }
      })
      .catch((error)=>{
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data.message);
          console.log(error.response.status);
          this.setState({error:error.response.data.message,open:true});
      }
      console.log(`Error : ${error}`);
      });
    }
  
  };


  // componentDidMount(){
  //   console.log("lol",)
  // }
 //Api call
  componentDidMount() {
    console.log(":",headers,"filter :"+this.state.filter );
  
    axios.get(`https://grievance-portal-server-1.herokuapp.com/api/official/allocatedGrievances`, {headers: headers})
      .then((response) => {
        console.log(response)
        if(response.status === 200){
            this.setState({grievances:response.data.grievances,length:response.data.grievances.length})
        }
      })
      .catch((error)=>{
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data.message);
          console.log(error.response.status);
          this.setState({error:error.response.data.message,open:true});
      }
      console.log(`Error : ${error}`);
      });
 }

  handleChangePage = page => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render() {
    
    //console.log(localStorage.getItem('fullName'))
    if (!(localStorage.getItem('fullName'))) {
      return (
        <div >
          <p >You need to be <strong>logged in </strong>to do that <Link to='/'>Please Login</Link></p>
        </div>
      )
    }
  
    const { classes } = this.props;
    return (
      <div className={classes.main}>
      {(!!this.state.error)?
          <ErrorDialog handleDialogClose={this.handleDialogClose} open={this.state.open} errorMessage={this.state.error}/>
        : ''
      }
      {
        (this.state.length === true ) ?
        <div className={classes.someDivision}>
          <CircularProgress  className={classes.progress} />
        </div>
        :
        ''
      }
     
      {(this.state.length) === 0 ?  
        <p>No Grievances {this.state.filter} yet! <a href="/official">Refresh</a></p>
        :
      <Paper>
      {
      (role ==='districtOfficer' && this.state.length !==0 && this.state.length !== true) ?
      <div className={classes.someDivision}>
      <form>
        <FormControl className={classes.formControl}>
          <InputLabel shrink htmlFor="filter">
            Filter
          </InputLabel>
          <Select
            value={this.state.filter}
            onChange={this.handleSelectChange}
            input={<Input name="filter" id="filter" />}
            displayEmpty
            name="filter"
            className={classes.selectEmpty}
          >
            <MenuItem value="">
              <em>Received</em>
            </MenuItem>
            <MenuItem value='scrutinized'>Scrutnized</MenuItem>
            <MenuItem value='accepted'>Accepted</MenuItem>
            <MenuItem value='rejected'>Rejected</MenuItem>
            <MenuItem value='resolved'>Resolved</MenuItem>
          </Select>
        </FormControl>
      </form>
      </div>
      :
     ''
      }
      <Divider/>
      <Grid container spacing={32} justify='center'>
        {
          this.state.grievances.map((grievance, index) => (
            <Grid item xs={12} sm={6} md={5} lg={5} >
            <Card className={classes.card} elevation={6}>
              <CardContent>
                <Typography variant="h6" component="h2">
                  Grievance Id: {grievance.id}
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                  Received Date:
            </Typography>
                <Typography color='primary'>
                {grievance.submittedTime.toUpperCase()}
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                  Description:
                </Typography>
                <Typography component="p">
                  {grievance.description.substring(0,40)}
              <br />
                </Typography>
                <Typography className={classes.pos} color="secondary">
                  Status: {grievance.status}
                </Typography>
              </CardContent>
              <CardActions>

              {(grievance.status === 'submitted') ?
              <Button color='primary'  variant='contained' onClick={() => {

                  console.log(headers);
                    axios.put(`https://grievance-portal.herokuapp.com/api/official/updateGrievanceStatus?grievanceId=${grievance.id}&status=scrutinized`,null, { headers: headers } )
                      .then((response)=>{
                    console.log(response);
                      this.props.history.push({
                        pathname: `/official/grievances/${grievance.id}`,
                        state: { grievance }
                      });
                }).catch((error) => {
                  if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(error.response.data.message);
                    console.log(error.response.status);
                    this.setState({error:error.response.data.message,open:true});
                }
                console.log(`Error : ${error}`);
                });
                // this.props.history.push({
                //   pathname: `/official/grievances/${grievance.id}`,
                //   state: { grievance }
                // });
              }
              }>Scrutinize</Button>
              :
              <Button color='primary' variant='contained' onClick={() => {
                this.props.history.push({
                  pathname: `/official/grievances/${grievance.id}`,
                  state: { grievance }
                });
              }} >View</Button>
            }
              </CardActions>
            </Card>
            </Grid>
          ))
        }
        </Grid>
      
        </Paper>
      }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    User: state.User
  }
}

HomePage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps)(withRouter(HomePage)));