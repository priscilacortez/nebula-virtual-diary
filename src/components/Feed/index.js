import React from 'react';
import { withAuthorization } from '../Session';
import ListDiaryEntries from '../ListDiaryEntries';

const Feed = () => (
  <div>
    <h1>Feed</h1>
    <ListDiaryEntries includeFeed />
  </div>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Feed);