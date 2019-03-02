import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';

class ErrorDialog extends React.Component {
  state = {
    fullWidth: true,
  };

  // handleClose = () => {
  //   this.setState({ open: false });
  // };

  render() {
    //const { fullScreen } = this.props;
    const {handleDialogClose,errorMessage,open} = this.props;
    console.log("why",errorMessage,"open",open);
    return (
      <div>
        <Dialog
            fullWidth={this.state.fullWidth}
            maxWidth={'md'}
            open={open}
            onClose={this.handleDialogClose}
            aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">{"Server Error : "}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {errorMessage}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary" autoFocus>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

ErrorDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
};

export default withMobileDialog()(ErrorDialog);