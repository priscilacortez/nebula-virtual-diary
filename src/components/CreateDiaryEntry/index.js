import React, { Component } from 'react';

import { withFirebase } from '../Firebase';

const CreateDiaryEntry = () => (
  <div>
    <h1>Create Diary Entry</h1>
    <CreateDiaryEntryForm />
  </div>
);

const INITIAL_STATE = {
  message: "",
  privacy: "ONLY_ME",
  error: null,
};

class CreateDiaryEntryFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { message, privacy } = this.state;
    this.props.firebase.doCreateDiaryEntry(message, privacy)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.setState({ error });
      });
    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { message, privacy, error } = this.state;

    // message must have text and privacy should be 0 or 1
    const isInvalid = message === "" || (privacy !== "ONLY_ME" && privacy !== "EVERYONE");

    return (
      <form id="diaryform" onSubmit={this.onSubmit}>
        <input
          name="message"
          value={this.state.message}
          onChange={this.onChange}
          type="textarea"
          placeholder="Dear Diary, Today is great."
        />
        <select name="privacy" form="diaryform" onChange={this.onChange}>
          <option value="ONLY_ME">Only Me</option>
          <option value="EVERYONE">Everyone</option>
        </select>
        <button disabled={isInvalid} type="submit">
          Submit
        </button>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const CreateDiaryEntryForm = withFirebase(CreateDiaryEntryFormBase)

export default CreateDiaryEntry;

export { CreateDiaryEntryForm };