import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';

const INITIAL_STATE = {
  message: '',
  privacy: 'ONLY_ME',
  error: null,
  loading: true,
  uid: '',
}

class EditDiaryEntryFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
  }

  componentDidMount() {
    // Check if user is authorized to see entry
    this.props.firebase.entry(this.props.match.params.id)
      .on('value', snapshot => {
        const diaryEntryObject = snapshot.val();
        if (diaryEntryObject) {
          this.setState({
            message: diaryEntryObject.message,
            privacy: diaryEntryObject.privacy,
            loading: false,
            uid: this.props.match.params.id,
          });
        } else {
          this.setState({
            loading: false,
            error: {
              message: 'Error Retrieving Diary Entry.'
            }
          });
        }
      })
  }

  componentWillUnmount() {
    this.props.firebase.entry().off()
  }

  onSubmit = event => {
    const { message, privacy, uid } = this.state;
    this.props.firebase
      .doDiaryEntryEdit(uid, message, privacy)
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { message, privacy, error, loading } = this.state;

    const isInvalid = message === "" || (privacy !== "ONLY_ME" && privacy !== "EVERYONE");
    return (
      <div>
        {loading
          ? <p>Loading...</p>
          : <form id="editDiaryform" onSubmit={this.onSubmit}>
            <input
              name="message"
              value={this.state.message}
              onChange={this.onChange}
              type="textarea"
              placeholder="Dear Diary, Today is great."
            />
            <select name="privacy" form="editDiaryform" onChange={this.onChange}>
              <option value="ONLY_ME">Only Me</option>
              <option value="EVERYONE">Everyone</option>
            </select>
            <button disabled={isInvalid} type="submit">
              Submit
          </button>
            {error && <p>{error.message}</p>}
          </form>}
      </div>
    );
  }
}

const EditDiaryEntryForm = compose(
  withRouter,
  withFirebase,
)(EditDiaryEntryFormBase)

export default EditDiaryEntryForm;