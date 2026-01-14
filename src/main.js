import './style.css';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';

// Firebase Configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// State
let selectedMood = null;
let currentFilter = 'all';
let currentUser = null;

// DOM Elements
const authSection = document.getElementById('authSection');
const mainApp = document.getElementById('mainApp');
const emailAuthBtn = document.getElementById('emailAuthBtn');
const googleAuthBtn = document.getElementById('googleAuthBtn');
const emailForm = document.getElementById('emailForm');
const emailSignInBtn = document.getElementById('emailSignInBtn');
const emailSignUpBtn = document.getElementById('emailSignUpBtn');
const cancelEmailBtn = document.getElementById('cancelEmailBtn');
const signOutBtn = document.getElementById('signOutBtn');
const userEmail = document.getElementById('userEmail');
const moodEmojis = document.querySelectorAll('.mood-emoji');
const moodText = document.getElementById('moodText');
const submitMoodBtn = document.getElementById('submitMoodBtn');
const filterBtns = document.querySelectorAll('.filter-btn');
const postsContainer = document.getElementById('postsContainer');

// Auth Listeners
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    authSection.style.display = 'none';
    mainApp.style.display = 'block';
    userEmail.textContent = user.email;
    loadPosts();
  } else {
    currentUser = null;
    authSection.style.display = 'block';
    mainApp.style.display = 'none';
  }
});

// Email Auth Toggle
emailAuthBtn.addEventListener('click', () => {
  emailForm.style.display = 'flex';
  emailAuthBtn.style.display = 'none';
  googleAuthBtn.style.display = 'none';
});

cancelEmailBtn.addEventListener('click', () => {
  emailForm.style.display = 'none';
  emailAuthBtn.style.display = 'inline-block';
  googleAuthBtn.style.display = 'inline-block';
});

// Sign In with Email
emailSignInBtn.addEventListener('click', async () => {
  const email = document.getElementById('emailInput').value;
  const password = document.getElementById('passwordInput').value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    alert('Error: ' + error.message);
  }
});

// Sign Up with Email
emailSignUpBtn.addEventListener('click', async () => {
  const email = document.getElementById('emailInput').value;
  const password = document.getElementById('passwordInput').value;
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    alert('Error: ' + error.message);
  }
});

// Sign In with Google
googleAuthBtn.addEventListener('click', async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    alert('Error: ' + error.message);
  }
});

// Sign Out
signOutBtn.addEventListener('click', () => {
  signOut(auth);
});

// Mood Selection
moodEmojis.forEach(emoji => {
  emoji.addEventListener('click', () => {
    moodEmojis.forEach(e => e.classList.remove('selected'));
    emoji.classList.add('selected');
    selectedMood = emoji.dataset.mood;
  });
});

// Submit Mood
submitMoodBtn.addEventListener('click', async () => {
  if (!selectedMood) {
    alert('Please select a mood!');
    return;
  }

  try {
    await addDoc(collection(db, 'posts'), {
      userId: currentUser.uid,
      mood: selectedMood,
      text: moodText.value.trim(),
      timestamp: serverTimestamp()
    });

    // Reset form
    selectedMood = null;
    moodText.value = '';
    moodEmojis.forEach(e => e.classList.remove('selected'));
  } catch (error) {
    alert('Error saving mood: ' + error.message);
  }
});

// Filter Buttons
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    loadPosts();
  });
});

// Load Posts
function loadPosts() {
  if (!currentUser) return;

  const postsQuery = query(
    collection(db, 'posts'),
    where('userId', '==', currentUser.uid),
    orderBy('timestamp', 'desc')
  );

  onSnapshot(postsQuery, (snapshot) => {
    postsContainer.innerHTML = '';
    
    snapshot.forEach((docSnap) => {
      const post = docSnap.data();
      const postDate = post.timestamp?.toDate();
      
      // Filter logic
      if (!shouldShowPost(postDate)) return;

      const postEl = createPostElement(docSnap.id, post, postDate);
      postsContainer.appendChild(postEl);
    });

    if (postsContainer.children.length === 0) {
      postsContainer.innerHTML = '<p style="text-align: center; opacity: 0.6;">No posts yet. Share your mood!</p>';
    }
  });
}

// Filter Helper
function shouldShowPost(postDate) {
  if (!postDate) return false;
  if (currentFilter === 'all') return true;

  const now = new Date();
  const diffTime = now - postDate;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  if (currentFilter === 'today') return diffDays < 1;
  if (currentFilter === 'week') return diffDays < 7;
  if (currentFilter === 'month') return diffDays < 30;
  
  return true;
}

// Create Post Element
function createPostElement(id, post, postDate) {
  const postDiv = document.createElement('div');
  postDiv.className = 'post';
  
  // Mood-based gradient
  const moodGradients = {
    '😢': 'var(--gradient-sad)',
    '😐': 'var(--gradient-neutral)',
    '🙂': 'var(--gradient-happy)',
    '😊': 'var(--gradient-primary)',
    '🤩': 'var(--gradient-post)'
  };
  postDiv.style.background = moodGradients[post.mood] || 'var(--gradient-post)';

  const dateStr = postDate ? postDate.toLocaleDateString() + ' ' + postDate.toLocaleTimeString() : 'Just now';

  postDiv.innerHTML = `
    <div class="post-header">
      <span class="post-mood">${post.mood}</span>
      <span class="post-date">${dateStr}</span>
    </div>
    ${post.text ? `<p class="post-text">${post.text}</p>` : ''}
    <div class="post-actions">
      <button class="edit-btn" onclick="editPost('${id}', '${post.text}')">Edit</button>
      <button class="delete-btn" onclick="deletePost('${id}')">Delete</button>
    </div>
  `;

  return postDiv;
}

// Delete Post
window.deletePost = async (id) => {
  if (confirm('Delete this mood post?')) {
    try {
      await deleteDoc(doc(db, 'posts', id));
    } catch (error) {
      alert('Error deleting: ' + error.message);
    }
  }
};

// Edit Post
window.editPost = async (id, currentText) => {
  const newText = prompt('Edit your note:', currentText);
  if (newText !== null) {
    try {
      await updateDoc(doc(db, 'posts', id), {
        text: newText.trim()
      });
    } catch (error) {
      alert('Error updating: ' + error.message);
    }
  }
};

console.log('🌈 Moody initialized!');
