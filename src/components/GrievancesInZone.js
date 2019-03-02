import React from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import axios from "axios";
// import grievances from "./../grievances.json";
import { withRouter,Link } from "react-router-dom";
import ErrorDialog from "./Dialog";
import CircularProgress from "@material-ui/core/CircularProgress";
import {TablePagination,Typography,Paper,Table,TableBody,TableCell,TableHead,TableRow,withStyles} from '@material-ui/core';


const styles = theme => ({
  main: {
    margin: theme.spacing.unit,
  },
  root: {
    ...theme.mixins.gutters(),
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
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

class GrievancesInZone extends React.Component {
  constructor(props) {
    super(props);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.state = {
      zonalgrievances: [],
      page: 0,
      rowsPerPage: 5,
      error:'',
      open:true,
      length:'',
    }
  }

  handleDialogClose(){
    this.setState({ open: false,error:'' });
  }

   componentDidMount() {
      axios.get(`https://grievance-portal-server-1.herokuapp.com/api/official/zonalGrievances`,{ headers: headers })
          .then((response) =>{
            console.log(response.data.grievances);
            if(response.status === 200){
                this.setState({zonalgrievances:response.data.grievances,length:response.data.grievances.length})
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
  handleChangePage =  page => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render() {
    if(!(localStorage.getItem('token'))) {
      return(
          <div>
              <p>You need to be <strong>logged in </strong>to do that <Link to='/'>Please Login</Link></p>
          </div>
      )
    } 
    const { classes } = this.props;
    //const emptyRows = this.state.rowsPerPage - Math.min(this.state.rowsPerPage, this.state.zonalgrievances.length - this.state.page * this.state.rowsPerPage);
    return (
      <div className={classes.main}>
      {(!!this.state.error)?
        <ErrorDialog handleDialogClose={this.handleDialogClose} open={this.state.open}  errorMessage={this.state.error}/>
      : ''
      }
      {
        (this.state.length == '') ?
        <div className={classes.someDivision}>
          <CircularProgress  className={classes.progress} />
        </div>
        :
        ''
      }
      {(this.state.length !== '') ?
        <Paper className={classes.root} elevation={10}>
        <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell >S.No</TableCell>
            <TableCell >Department</TableCell>
            <TableCell >District</TableCell>
            <TableCell >District Officer Email</TableCell>
            <TableCell >status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            // this.state.zonalgrievances.slice(this.state.page * this.state.rowsPerPage, this.state.page *
            //  this.state.rowsPerPage + this.state.rowsPerPage)
             
             this.state.zonalgrievances.map((districtGrievances) =>(
               districtGrievances.map((grievance,i) => 
               {
                //console.log("grievance : ",grievance);
                return(
                  <TableRow key={i}>
                    <TableCell>{i}</TableCell>
                    <TableCell>
                      {(grievance.department).toUpperCase()}
                    </TableCell>
                    <TableCell >{grievance.district}</TableCell>
                    <TableCell >{grievance.email}</TableCell>
                    <TableCell>
                    <Typography color='secondary' variant="subtitle1" >
                    {grievance.status.toUpperCase()}
                  </Typography></TableCell>
                  </TableRow>   
               )})
             ))}
          {
          //   emptyRows > 0 && (
          //   <TableRow style={{ height: 49 * emptyRows }}>
          //     <TableCell colSpan={6} />
          //   </TableRow>
          // )
           }
        </TableBody>
      </Table>
          

        </Paper>
        :
        ''
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

GrievancesInZone.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps)(withRouter(GrievancesInZone)));






// <TablePagination
// rowsPerPageOptions={[5, 10, 15]}
// component="div"
// count={this.state.zonalgrievances.length}
// rowsPerPage={this.state.rowsPerPage}
// page={this.state.page}
// backIconButtonProps={{
//   'aria-label': 'Previous Page',
// }}
// nextIconButtonProps={{
//   'aria-label': 'Next Page',
// }}
// onChangePage={this.handleChangePage}
// onChangeRowsPerPage={this.handleChangeRowsPerPage}
// />