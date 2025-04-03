// Import the necessary functions from Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getDatabase, ref, set, push, onValue } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB9eFVYbbZQscMrf2Bni9lw01DJoYOlGk4",
  authDomain: "unspoken-words-33bd9.firebaseapp.com",
  projectId: "unspoken-words-33bd9",
  storageBucket: "unspoken-words-33bd9.firebasestorage.app",
  messagingSenderId: "440230472435",
  appId: "1:440230472435:web:cc3f9bd06bc6e5bad1a586",
  measurementId: "G-HGKQJRRYFN"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Save a journal entry (Private to the user)
function saveFeeling() {
  const feeling = document.getElementById('feeling-input').value;
  const userId = auth.currentUser ? auth.currentUser.uid : null; // Get the logged-in user's ID

  if (feeling.trim() && userId) {
    const newFeelingRef = push(ref(database, 'feelings/' + userId));
    set(newFeelingRef, {
      feeling: feeling,
      timestamp: new Date().toISOString(),
    });
    alert("Your feeling has been saved!");
    document.getElementById('feeling-input').value = ''; // Clear input field
  } else {
    alert("Please log in first and enter a feeling before submitting.");
  }
}

// Post a group discussion (Visible to everyone)
function postDiscussion() {
  const discussion = document.getElementById('discussion-input').value;

  if (discussion.trim()) {
    const newDiscussionRef = push(ref(database, 'discussions'));
    set(newDiscussionRef, {
      discussion: discussion,
      timestamp: new Date().toISOString(),
    });
    alert("Your discussion has been posted!");
    document.getElementById('discussion-input').value = ''; // Clear input field
  } else {
    alert("Please enter a discussion before posting.");
  }
}

// Display all journal entries (Only current user’s entries)
function viewFeelings() {
  const userId = auth.currentUser ? auth.currentUser.uid : null; // Get the logged-in user's ID
  if (userId) {
    const feelingsRef = ref(database, 'feelings/' + userId);
    
    onValue(feelingsRef, (snapshot) => {
      const feelings = snapshot.val();
      let displayText = '';
      
      for (const id in feelings) {
        displayText += `<p>${feelings[id].feeling}</p>`;
      }
      document.getElementById('feelings-display').innerHTML = displayText;
    });
  } else {
    alert('Please log in to view your journal entries.');
  }
}

// Display all group discussions (Visible to everyone)
function viewDiscussions() {
  const discussionsRef = ref(database, 'discussions');
  
  onValue(discussionsRef, (snapshot) => {
    const discussions = snapshot.val();
    let displayText = '';
    
    for (const id in discussions) {
      displayText += `<p>${discussions[id].discussion}</p>`;
    }
    document.getElementById('discussion-display').innerHTML = displayText;
  });
}

// Call these functions on page load to display existing data
onAuthStateChanged(auth, (user) => {
  if (user) {
    viewFeelings();
    viewDiscussions();
  } else {
    alert('Please log in to view your journal entries and group discussions.');
  }
});
