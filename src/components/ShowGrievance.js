import React from "react";
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography'
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, TextField, Grid, Drawer } from "@material-ui/core";
//import withMobileDialog from '@material-ui/core/withMobileDialog';
import axios from "axios";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import ErrorDialog from "./Dialog";
import ArrowBackSharp from "@material-ui/icons/ArrowBackSharp";
import {Link} from "react-router-dom";
import AttachmentIcon from "@material-ui/icons/AttachFile"


const styles = theme => ({
  main: {
    margin: theme.spacing.unit * 3
  },
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  button: {
    margin: theme.spacing.unit,
  },
  container:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between'
  },
  btn: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  backButton:{
    marginBottom:theme.spacing.unit,
  },
  some: {
    padding: 2*theme.spacing.unit,
    marginBottom: 3*theme.spacing.unit,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
},

overline: {
    fontSize: 14,
},
});

const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + localStorage.getItem('token')
}


class ShowGrievance extends React.Component {

  constructor(props) {
    super(props);
    this.handleDialogClose = this.handleDialogClose.bind(this);


    this.state = {
      open: false,
      buttontype: '',
      status: '',
      description: '',
      fullWidth: true,
      error:'',
      openDialog:true
    };
  }


  handleDialogClose(){
    this.setState({ openDilaog: false,error:'' });
  }

  handleClickOpen = buttontype => () => {
    this.setState({ open: true, buttontype });
  };

  handleClose = () => {
    console.log('Close clicked');
    if (this.state.status.length !== 0) {
      this.props.history.push('/');
      this.setState({ open: false, status: '', buttontype: '' });
    }
    else {
      this.setState({ open: false });
    }

  };

  handleSubmit = (status) => (e) => {
    switch (status) {
      case 'accept':
        // this.setState({ status });
        axios.put(`https://grievance-portal-server-1.herokuapp.com/api/official/updateGrievanceStatus?grievanceId=${this.props.location.state.grievance.id}&status=accepted`,null, { headers: headers } ).
          then((response) => {
            if(response.status === 200){
              console.log("Be happy!");
              this.setState({ status });
            }
          }).catch((error)=>{
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log(error.response.data.message);
              console.log(error.response.status);
              this.setState({error:error.response.data.message,openDialog:true});
          }
          });
        break;
      case 'reject':
      e.preventDefault();
      const rejectformdata = new FormData(e.target);
      console.log(...rejectformdata);
        axios.post(`https://grievance-portal-server-1.herokuapp.com/api/official/updateGrievanceStatus?grievanceId=${this.props.location.state.grievance.id}&status=rejected`, rejectformdata, { headers: {
          'enctype': 'multipart/form-data',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        } }).
          then((response) => {
            if(response.status === 200){
              console.log("be very happy!")
              this.setState({ status });
            }
          }).catch((error)=>{
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log(error.response.data.message);
              console.log(error.response.status);
              this.setState({error:error.response.data.message,openDialog:true});
          }
          });

        break;
      case 'resolve':
      e.preventDefault();
      console.log(e.target.elements.description.value);
      const formdata = new FormData(e.target);
      
      console.log('Bearer ' + localStorage.getItem('token'));
      fetch(`https://grievance-portal-server-1.herokuapp.com/api/official/updateGrievanceStatus?grievanceId=${this.props.location.state.grievance.id}&status=resolved`,{
        method: 'POST',
        mode: 'cors',
        headers: {
          'enctype': 'multipart/form-data',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body:formdata
      })
        .then((response) => {
          if(response.status === 200){
            this.setState({ status });
          }
          else if(response.status === 500){
            response.json()
              .then(result => {
                this.setState({error:result.message,openDialog:true});
              })
            
          }
        }).catch((error)=>{
          console.log(`Error : ${error}`);
        });
      break;
    }
  }

  handleDialogue = () => {
    switch (this.state.buttontype) {
      case 'accept':
        return (
          <Dialog
            fullWidth={this.state.fullWidth}
            maxWidth={'md'}
            open={this.state.open}
            buttontype={this.state.buttontype}
            onClose={this.handleClose}
          >
          {(this.state.status).length === 0 ?
            <DialogTitle id="Accept">
              Are you sure?
          </DialogTitle>
            :
            <DialogTitle id="Accept">
              Grievance Accepted!
          </DialogTitle>
          }
            <DialogActions>
              {this.state.status.length === 0 ?
                <Button onClick={this.handleSubmit('accept')} color="primary">
                  Accept Grievance
              </Button>
                :
                ''
              }
              <Button onClick={this.handleClose} color="primary" autoFocus >
                Close
        </Button>
            </DialogActions>
          </Dialog>
        )
      case 'reject':
        return (
          <Dialog
            fullWidth={this.state.fullWidth}
            maxWidth={'md'}
            open={this.state.open}
            buttontype={this.state.buttontype}
            onClose={this.handleClose}
          >
  
          {(this.state.status).length === 0 ?
            <DialogTitle id="Reject">
              Fill details for REJECTION:
          </DialogTitle>
            :
            <DialogTitle id="Reject">
              Grievance Rejected!
          </DialogTitle>
          }
              <DialogContent>
                {(this.state.status).length === 0 ?
                  <form onSubmit={this.handleSubmit('reject')}>
                    <TextField
                      autoFocus
                      margin="dense"
                      label="Description"
                      type="text"
                      id="description"
                      name="description"
                      rows='5'
                      multiline
                      required
                      fullWidth
                     // onChange={this.handleChange}
                    />
                    <input
                      type="file"
                      id="fileUpload"
                      name="attachments"
                      accept=".pdf"
                      style={{display: 'none'}}
                    />
                    <label htmlFor="fileUpload">
                      <Typography variant="subtitle2">Select file(if any)</Typography>
                      <Button component="span" className={this.props.classes.btn} variant="contained">
                          Upload
                          <CloudUploadIcon style={{ margin: '0 0 4px 6px' }} />
                      </Button>
                      <Typography color="secondary">Only pdf file format is supported</Typography>
                      {(this.state.status).length === 0 ?
                        <Button 
                          variant='outlined'
                          color="primary"
                          type="submit"
                        >
                            Reject Grievance
                        </Button>
                         :
                         ''
                       }
                    </label>
                  </form>
                  :
                  ''
                }

              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                  Close
                </Button>
              </DialogActions>
          </Dialog>
        )

      case 'resolve':
        return (
          
          <Dialog
            fullWidth={this.state.fullWidth}
            maxWidth={'md'}
            open={this.state.open}
            buttontype={this.state.buttontype}
            onClose={this.handleClose}
          >
  

                {(this.state.status).length === 0 ?
                  <DialogTitle id="Resolve">
                    Fill RESOLUTION Details:
                </DialogTitle>
                  :
                  <DialogTitle id="Resolve">
                    Grievance Resolved!
                </DialogTitle>
                }
                <DialogContent>
                {(this.state.status).length === 0 ?
                  <form onSubmit={this.handleSubmit('resolve')}>
                    <TextField
                      autoFocus
                      margin="dense"
                      label="Description"
                      type="text"
                      id="description"
                      name="description"
                      variant='outlined'
                      rows='5'
                      multiline
                      required
                      fullWidth
                     // onChange={this.handleChange}
                    />
                    <input
                      type="file"
                      id="fileUpload"
                      name="attachments"
                      accept=".pdf"
                      style={{display: 'none'}}
                    />
                    <label htmlFor="fileUpload">
                      <Typography variant="subtitle2">Select file(if any)</Typography>
                      <Button component="span" className={this.props.classes.btn} variant="contained">
                          Upload
                          <CloudUploadIcon style={{ margin: '0 0 4px 6px' }} />
                      </Button>
                      <Typography color="secondary">Only pdf file format is supported</Typography>
                      {(this.state.status).length === 0 ?
                        <Button 
                          variant='outlined'
                          color="primary"
                          type="submit"
                        >
                            Resolve Grievance
                        </Button>
                         :
                         ''
                       }
                    </label>
                  </form>
                  :
                  ''
                }

              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                  Close
                </Button>
              </DialogActions>
          </Dialog>
        )
      default:
        return (
          <div>
          </div>
        )
    }
  }

  // handleChange = (event) => {
  //   const { target: { name, value } } = event;
  //   this.setState(() => ({ description: value }))
  // }

  showActions = () => {
    console.log(this.props.location.state.grievance.status);
    switch (this.props.location.state.grievance.status) {
      case 'submitted':
        return (
        
            <div className={this.props.classes.container}>
              <Button variant="contained" color="primary" disabled={!!this.state.status} onClick={this.handleClickOpen('accept')}>
                Accept
              </Button>
              <Button variant="contained" color="secondary" disabled={!!this.state.status} onClick={this.handleClickOpen('reject')} >
                Reject
              </Button>
            </div>
        )
      case 'scrutinized':
        return (

            <div className={this.props.classes.container}>
              <Button variant="contained" color="primary" disabled={!!this.state.status} onClick={this.handleClickOpen('accept')} className={this.props.classes.button}>
                Accept
              </Button>
              <Button variant="contained" color="secondary" disabled={!!this.state.status} onClick={this.handleClickOpen('reject')} className={this.props.classes.button}>
                Reject
              </Button>
            </div>
        )
      case 'work in progress':
        return (
          <div>
            <Button variant="contained" color="primary" onClick={this.handleClickOpen('resolve')} className={this.props.classes.button}>
              Resolve
            </Button>
          </div>
        )
      default:
        return (
          <div>
          </div>
        )
    }
  }

  showExtra = () => {
    switch (this.props.location.state.grievance.status) {
      case 'scrutinized':
      return(
        <Grid item xs={12} sm={6}>
            <Typography variant="overline" color="primary"  >Scrutinized Time: {this.props.location.state.grievance.scrutinizedTime}</Typography>
        </Grid>
      )
      case 'work in progress':
      return(
        <span>
          <Grid item xs={12} sm={12}>
            <Typography variant="overline"   >Scrutinized Time: {this.props.location.state.grievance.scrutinizedTime}</Typography>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Typography variant="overline" >In Progress Time : {this.props.location.state.grievance.inprogressTime}</Typography>
          </Grid>
          </span>
      )
      default:
        return(
          <div>
          </div>
        )
    }
  }

  render() {
    if (!(localStorage.getItem('token'))) {
      return (
        <div >
          <p >You need to be <strong>logged in </strong>to do that <Link to='/'>Please Login</Link></p>
        </div>
      )
    }
    //console.log(this.props.location.state.grievance);
    const { classes } = this.props;
    return (
      
      <div className={classes.main}>
          {(!!this.state.error)?
            <ErrorDialog handleDialogClose={this.handleDialogClose} open={this.state.openDialog}  errorMessage={this.state.error}/>
          : ''
          }
          <Button
          className={classes.backButton}
          onClick={() => {window.history.back()}}
          variant="text" 
          >
            <ArrowBackSharp/>
          </Button>

          <Grid container spacing={0}>
            <Grid item xs={12} sm={12} md={9} xl={8} style={{margin: 'auto'}}>
              <Paper className={classes.some} elevation={5}>
                <Grid container spacing={0}>
                  <Grid item xs={12} sm={12}>
                    <Typography variant="h6">Grievance: {this.props.location.state.grievance.id}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="overline" className={classes.overline}>Username: {this.props.location.state.grievance.fullName}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1" className={classes.overline}>EMAIL: {this.props.location.state.grievance.email}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="overline" className={classes.overline}>PhoneNumber: {this.props.location.state.grievance.username}</Typography>
                  </Grid> 
                  <Grid item xs={12} sm={6}>
                    <Typography variant="overline" className={classes.overline}>Gender: {this.props.location.state.grievance.gender}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="overline" className={classes.overline}>District: {this.props.location.state.grievance.district}</Typography>
                  </Grid> 
                  <Grid item xs={12} sm={6}>
                    <Typography variant="overline" className={classes.overline}>State: {this.props.location.state.grievance.state}</Typography>
                  </Grid> 
                  <Grid item xs={12} sm={6}>
                    <Typography variant="overline" className={classes.overline}>Pincode: {this.props.location.state.grievance.pincode}</Typography>
                  </Grid> 
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subheading" className={classes.overline}>DEPARTMENT: {this.props.location.state.grievance.department}</Typography>
                  </Grid> 
                  <Grid item xs={12} sm={12}>
                    <Typography variant="overline" color="primary"  >Submitted At: {this.props.location.state.grievance.submittedTime}</Typography>
                  </Grid>
                  {this.showExtra()}
                  <Grid item xs={12} sm={12}>
                    <Typography variant="overline" color="secondary" className={classes.overline}>Status: {this.props.location.state.grievance.status}</Typography>
                  </Grid>  
                  <Grid item xs={12} sm={12} md={12} xl={12} >
                    <Typography variant="subtitle1"  className={classes.overline} inline={true}>DESCRIPTION: </Typography>
                    <Typography variant="body1" inline={true}>{this.props.location.state.grievance.description}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Button 
                      onClick ={
                      ()=>{ 
                      window.open(this.props.location.state.grievance.attachments[0] ,'_blank') }
                      } 
                      variant="text"><AttachmentIcon/>Attachments
                    </Button>
                  </Grid> 
                </Grid>
                <Divider/>

                {this.showActions()}
                {this.handleDialogue()}
           
             </Paper>
            </Grid>
          </Grid>
       
      </div>
    )
  }
}

ShowGrievance.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    User: state.User
  }
}

export default withStyles(styles)(connect(mapStateToProps)(ShowGrievance));