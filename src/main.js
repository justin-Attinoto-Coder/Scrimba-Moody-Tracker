import './style.css';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser
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
  serverTimestamp,
  getDocs
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
let allPosts = [];

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
const settingsBtn = document.getElementById('settingsBtn');
const userEmail = document.getElementById('userEmail');
const moodEmojis = document.querySelectorAll('.mood-emoji');
const moodText = document.getElementById('moodText');
const submitMoodBtn = document.getElementById('submitMoodBtn');
const filterBtns = document.querySelectorAll('.filter-btn');
const postsContainer = document.getElementById('postsContainer');

// Tab Navigation
const navTabs = document.querySelectorAll('.nav-tab');
const tabContents = document.querySelectorAll('.tab-content');

// Settings Modal
const settingsModal = document.getElementById('settingsModal');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const changePasswordBtn = document.getElementById('changePasswordBtn');
const deleteAccountBtn = document.getElementById('deleteAccountBtn');

// Auth Listeners
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    authSection.style.display = 'none';
    mainApp.style.display = 'block';
    userEmail.textContent = user.email;
    loadPosts();
    updateSettingsModal();
  } else {
    currentUser = null;
    authSection.style.display = 'block';
    mainApp.style.display = 'none';
  }
});
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

// Tab Navigation
navTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.dataset.tab;
    
    // Update tab buttons
    navTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    // Update tab content
    tabContents.forEach(content => content.classList.remove('active'));
    document.getElementById(`${tabName}Tab`).classList.add('active');
    
    // Load data for specific tabs
    if (tabName === 'stats') {
      updateStatistics();
    } else if (tabName === 'history') {
      updateHistory();
    }
  });
});

// Settings Modal
settingsBtn.addEventListener('click', () => {
  settingsModal.style.display = 'flex';
  updateSettingsModal();
});

closeSettingsBtn.addEventListener('click', () => {
  settingsModal.style.display = 'none';
  clearPasswordForm();
});

// Click outside modal to close
settingsModal.addEventListener('click', (e) => {
  if (e.target === settingsModal) {
    settingsModal.style.display = 'none';
    clearPasswordForm();
  }
});

// Update Settings Modal
function updateSettingsModal() {
  if (!currentUser) return;
  
  document.getElementById('settingsEmail').textContent = currentUser.email;
  
  // Determine provider
  const provider = currentUser.providerData[0]?.providerId;
  let providerText = 'Email/Password';
  if (provider === 'google.com') {
    providerText = 'Google';
    // Hide password section for Google users
    document.getElementById('passwordSection').style.display = 'none';
  } else {
    document.getElementById('passwordSection').style.display = 'block';
  }
  document.getElementById('settingsProvider').textContent = providerText;
}

// Change Password
changePasswordBtn.addEventListener('click', async () => {
  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const messageEl = document.getElementById('passwordMessage');
  
  // Clear previous messages
  messageEl.className = 'message';
  messageEl.textContent = '';
  
  // Validation
  if (!currentPassword || !newPassword || !confirmPassword) {
    showMessage(messageEl, 'Please fill in all fields', 'error');
    return;
  }
  
  if (newPassword.length < 6) {
    showMessage(messageEl, 'New password must be at least 6 characters', 'error');
    return;
  }
  
  if (newPassword !== confirmPassword) {
    showMessage(messageEl, 'New passwords do not match', 'error');
    return;
  }
  
  try {
    // Re-authenticate user
    const credential = EmailAuthProvider.credential(
      currentUser.email,
      currentPassword
    );
    await reauthenticateWithCredential(currentUser, credential);
    
    // Update password
    await updatePassword(currentUser, newPassword);
    
    showMessage(messageEl, '✅ Password updated successfully!', 'success');
    clearPasswordForm();
    
    // Close modal after 2 seconds
    setTimeout(() => {
      settingsModal.style.display = 'none';
    }, 2000);
    
  } catch (error) {
    if (error.code === 'auth/wrong-password') {
      showMessage(messageEl, 'Current password is incorrect', 'error');
    } else if (error.code === 'auth/weak-password') {
      showMessage(messageEl, 'Password is too weak', 'error');
    } else {
      showMessage(messageEl, 'Error: ' + error.message, 'error');
    }
  }
});

// Delete Account
deleteAccountBtn.addEventListener('click', async () => {
  const confirmation = prompt('⚠️ This will permanently delete your account and all data.\n\nType "DELETE" to confirm:');
  
  if (confirmation === 'DELETE') {
    try {
      // Delete all user posts first
      const postsQuery = query(
        collection(db, 'posts'),
        where('userId', '==', currentUser.uid)
      );
      const snapshot = await getDocs(postsQuery);
      
      const deletePromises = [];
      snapshot.forEach((docSnap) => {
        deletePromises.push(deleteDoc(doc(db, 'posts', docSnap.id)));
      });
      
      await Promise.all(deletePromises);
      
      // Delete user account
      await deleteUser(currentUser);
      
      alert('✅ Account deleted successfully');
      settingsModal.style.display = 'none';
      
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        alert('For security, please sign out and sign in again before deleting your account.');
      } else {
        alert('Error: ' + error.message);
      }
    }
  }
});

// Helper Functions
function showMessage(element, message, type) {
  element.textContent = message;
  element.className = `message ${type}`;
}

function clearPasswordForm() {
  document.getElementById('currentPassword').value = '';
  document.getElementById('newPassword').value = '';
  document.getElementById('confirmPassword').value = '';
  const messageEl = document.getElementById('passwordMessage');
  messageEl.className = 'message';
  messageEl.textContent = '';
}

// Update Statistics
function updateStatistics() {
  if (!allPosts.length) return;
  
  // Total moods
  document.getElementById('totalMoods').textContent = allPosts.length;
  
  // This week moods
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thisWeekMoods = allPosts.filter(post => {
    const postDate = post.timestamp?.toDate();
    return postDate && postDate > weekAgo;
  });
  document.getElementById('thisWeekMoods').textContent = thisWeekMoods.length;
  
  // Most common mood
  const moodCounts = {};
  allPosts.forEach(post => {
    moodCounts[post.mood] = (moodCounts[post.mood] || 0) + 1;
  });
  
  let topMood = '-';
  let maxCount = 0;
  for (const [mood, count] of Object.entries(moodCounts)) {
    if (count > maxCount) {
      maxCount = count;
      topMood = mood;
    }
  }
  document.getElementById('topMood').textContent = topMood;
  
  // Calculate streak
  const streak = calculateStreak();
  document.getElementById('currentStreak').textContent = streak;
  
  // Update mood chart
  updateMoodChart(moodCounts);
}

function calculateStreak() {
  if (!allPosts.length) return 0;
  
  const dates = allPosts
    .map(post => post.timestamp?.toDate())
    .filter(date => date)
    .map(date => date.toDateString())
    .filter((date, index, self) => self.indexOf(date) === index)
    .sort((a, b) => new Date(b) - new Date(a));
  
  let streak = 0;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
  
  if (dates[0] === today || dates[0] === yesterday) {
    streak = 1;
    let expectedDate = new Date(dates[0]);
    
    for (let i = 1; i < dates.length; i++) {
      expectedDate = new Date(expectedDate.getTime() - 24 * 60 * 60 * 1000);
      if (dates[i] === expectedDate.toDateString()) {
        streak++;
      } else {
        break;
      }
    }
  }
  
  return streak;
}

function updateMoodChart(moodCounts) {
  const chartContainer = document.getElementById('moodChart');
  chartContainer.innerHTML = '';
  
  const total = allPosts.length;
  const moodLabels = {
    '😢': 'Very Sad',
    '😐': 'Neutral',
    '🙂': 'Good',
    '😊': 'Happy',
    '🤩': 'Excellent'
  };
  
  for (const [mood, label] of Object.entries(moodLabels)) {
    const count = moodCounts[mood] || 0;
    const percentage = total > 0 ? (count / total * 100).toFixed(1) : 0;
    
    const barDiv = document.createElement('div');
    barDiv.className = 'mood-bar';
    
    const fillDiv = document.createElement('div');
    fillDiv.className = 'mood-bar-fill';
    fillDiv.style.width = `${percentage}%`;
    fillDiv.innerHTML = `
      <span class="mood-bar-label">
        <span>${mood}</span>
        <span>${label}: ${count} (${percentage}%)</span>
      </span>
    `;
    
    barDiv.appendChild(fillDiv);
    chartContainer.appendChild(barDiv);
  }
}

// Update History
function updateHistory() {
  const historyContainer = document.getElementById('historyContainer');
  historyContainer.innerHTML = '';
  
  if (!allPosts.length) {
    historyContainer.innerHTML = '<p style="text-align: center; opacity: 0.6;">No mood history yet.</p>';
    return;
  }
  
  // Group by date
  const groupedByDate = {};
  allPosts.forEach(post => {
    const postDate = post.timestamp?.toDate();
    if (postDate) {
      const dateKey = postDate.toLocaleDateString();
      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = [];
      }
      groupedByDate[dateKey].push(post);
    }
  });
  
  // Display grouped posts
  for (const [date, posts] of Object.entries(groupedByDate)) {
    const dateGroup = document.createElement('div');
    dateGroup.className = 'history-date-group';
    dateGroup.innerHTML = `<h3>${date}</h3>`;
    
    posts.forEach(post => {
      const postEl = createPostElement(post.id, post.data, post.timestamp?.toDate());
      dateGroup.appendChild(postEl);
    });
    
    historyContainer.appendChild(dateGroup);
  }
}

// Load Posts (Enhanced)
function loadPosts() {
  if (!currentUser) return;

  const postsQuery = query(
    collection(db, 'posts'),
    where('userId', '==', currentUser.uid),
    orderBy('timestamp', 'desc')
  );

  onSnapshot(postsQuery, (snapshot) => {
    allPosts = [];
    postsContainer.innerHTML = '';
    
    snapshot.forEach((docSnap) => {
      const post = docSnap.data();
      allPosts.push({
        id: docSnap.id,
        data: post,
        timestamp: post.timestamp,
        ...post
      });
    });
    
    // Display filtered posts
    allPosts.forEach(({ id, data, timestamp }) => {
      const postDate = timestamp?.toDate();
      
      // Filter logic
      if (!shouldShowPost(postDate)) return;

      const postEl = createPostElement(id, data, postDate);
      postsContainer.appendChild(postEl);
    });

    if (postsContainer.children.length === 0) {
      postsContainer.innerHTML = '<p style="text-align: center; opacity: 0.6;">No posts yet. Share your mood!</p>';
    }
    
    // Update stats if on stats tab
    if (document.getElementById('statsTab').classList.contains('active')) {
      updateStatistics();
    }
  });
}

console.log('🌈 Moody initialized!');
