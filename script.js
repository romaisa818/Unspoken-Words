// Firebase configuration (replace with your Firebase project details)
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  databaseURL: "https://your-database-name.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const auth = firebase.auth();

// Save a journal entry (Private to the user)
function saveFeeling() {
  const feeling = document.getElementById('feeling-input').value;
  const userId = auth.currentUser.uid; // Get the logged-in user's ID

  if (feeling.trim()) {
    const newFeelingRef = database.ref('feelings/' + userId).push();
    newFeelingRef.set({
      feeling: feeling,
      timestamp: new Date().toISOString(),
    });
    alert("Your feeling has been saved!");
    document.getElementById('feeling-input').value = ''; // Clear input field
  } else {
    alert("Please enter a feeling before submitting.");
  }
}

// Post a group discussion (Visible to everyone)
function postDiscussion() {
  const discussion = document.getElementById('discussion-input').value;

  if (discussion.trim()) {
    const newDiscussionRef = database.ref('discussions').push();
    newDiscussionRef.set({
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
  const userId = auth.currentUser.uid; // Get the logged-in user's ID
  const feelingsRef = database.ref('feelings/' + userId);
  
  feelingsRef.on('value', (snapshot) => {
    const feelings = snapshot.val();
    let displayText = '';
    
    for (const id in feelings) {
      displayText += `<p>${feelings[id].feeling}</p>`;
    }
    document.getElementById('feelings-display').innerHTML = displayText;
  });
}

// Display all group discussions (Visible to everyone)
function viewDiscussions() {
  const discussionsRef = database.ref('discussions');
  
  discussionsRef.on('value', (snapshot) => {
    const discussions = snapshot.val();
    let displayText = '';
    
    for (const id in discussions) {
      displayText += `<p>${discussions[id].discussion}</p>`;
    }
    document.getElementById('discussion-display').innerHTML = displayText;
  });
}

// Call these functions on page load to display existing data
auth.onAuthStateChanged(user => {
  if (user) {
    viewFeelings();
    viewDiscussions();
  } else {
    alert('Please log in to view your journal entries and group discussions.');
  }
});
