import app from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';

// If I had more time and if this was a fully fledged application
// I would also have include a production config
// to keep the development and prod environments separate.

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.database();
  }

  // Authentication API
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () =>
    this.auth.signOut();

  doPasswordReset = email =>
    this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);

  // User API
  user = uid => this.db.ref(`users/${uid}`);

  users = () => this.db.ref('users')

  // Diary API
  doCreateDiaryEntry = (message, privacy) => {
    this.db.ref("diary_entry").push({
      user_uid: this.auth.currentUser.uid,
      username: this.auth.currentUser.displayName,
      created_at: new Date().getTime(),
      message, privacy
    })
  }

  doDiaryEntryEdit = (uid, message, privacy) => {
    this.db.ref(`diary_entry/${uid}`).update({
      message, privacy
    })
  }

  entry = uid => this.db.ref(`diary_entry/${uid}`);

  entries = () => this.db.ref('diary_entry').orderByChild("user_uid").equalTo(this.auth.currentUser.uid);

  feed = () => this.db.ref('diary_entry').orderByChild("privacy").equalTo("EVERYONE")
}

export default Firebase;