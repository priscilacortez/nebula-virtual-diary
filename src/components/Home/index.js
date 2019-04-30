import React from 'react';
import { withAuthorization } from '../Session';
import CreateDiaryEntry from '../CreateDiaryEntry';
import ListDiaryEntries from '../ListDiaryEntries';

const Home = () => (
  <div>
    <h1>Home</h1>
    <CreateDiaryEntry />
    <h2>My Diary Entries</h2>
    <ListDiaryEntries />
  </div>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Home);