import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes'
import { Link, withRouter, BrowserRouter as Router } from 'react-router-dom';
import { compose } from 'recompose';

class ListDiaryEntriesBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      diaryEntries: [],
      query: null,
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    const query = this.props.includeFeed ? this.props.firebase.feed : this.props.firebase.entries;

    query().on('value', snapshot => {
      const diaryEntriesObject = snapshot.val();
      if (diaryEntriesObject) {
        const diaryEntriesList = Object.keys(diaryEntriesObject).map(key => ({
          ...diaryEntriesObject[key],
          uid: key,
        }));

        this.setState({
          diaryEntries: diaryEntriesList,
          loading: false,
        });
      } else {
        this.setState({
          loading: false,
        });
      }
    });
  }

  componentWillUnmount() {
    if (this.state.query) {
      this.props.firebase.feed().off();
      this.props.firebase.entries().off();
    }
  }

  render() {
    const { diaryEntries, loading } = this.state;

    return (
      <div>
        {loading && <div>Loading ...</div>}

        <DiaryEntriesList diaryEntries={diaryEntries} includeFeed={this.props.includeFeed} />
      </div>
    );
  }
}

const DiaryEntriesList = ({ diaryEntries, includeFeed }) => (
  <ul>
    {diaryEntries.map(diaryEntry => (
      <li key={diaryEntry.uid}>
        <span>
          <strong>Message:</strong> {diaryEntry.message}
        </span>
        {includeFeed &&
          <span>
            <strong>By:</strong> {diaryEntry.username}
          </span>
        }
        {!includeFeed &&
          <div>
            <span>
              <strong>Privacy:</strong> {diaryEntry.privacy}
            </span>
            <span>
              <Link to={`${ROUTES.EDIT_DIARY_ENTRY}/${diaryEntry.uid}`}>Edit</Link>
            </span>
          </div>
        }
      </li>
    ))}
  </ul>
);

const ListDiaryEntries = compose(
  withRouter,
  withFirebase,
)(ListDiaryEntriesBase)

export default ListDiaryEntries;