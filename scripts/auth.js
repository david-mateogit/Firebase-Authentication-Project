// add admin cloud functions
const adminForm = document.querySelector('.admin-actions');
adminForm.addEventListener('submit', e => {
  e.preventDefault();
  const adminEmail = document.querySelector('#admin-email').value;
  const addAdminRole = functions.httpsCallable('addAdminRole');
  addAdminRole({ email: adminEmail }).then(result => console.log(result));
});

// listen for auth status changes
auth.onAuthStateChanged(user => {
  if (user) {
    user.getIdTokenResult().then(idTokenResult => {
      user.admin = idTokenResult.claims.admin;
      setupUI(user);
    });
    // get data
    db.collection('guides').onSnapshot(
      snapshot => {
        setupGuides(snapshot.docs);
      },
      err => console.log(err.message)
    );
  } else {
    setupUI();
    setupGuides([]);
  }
});

// create new guide
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', e => {
  e.preventDefault();
  // add guide to firebase collection
  db.collection('guides')
    .add({
      title: createForm.title.value,
      content: createForm.content.value,
    })
    .then(() => {
      // close the modal and reset form
      const modal = document.querySelector('#modal-create');
      M.Modal.getInstance(modal).close();
      createForm.reset();
    })
    .catch(err => console.log(err.message));
});

// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', e => {
  e.preventDefault();

  // get user info
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;

  // sign up user & add firestore data
  auth
    .createUserWithEmailAndPassword(email, password)
    .then(cred =>
      db
        .collection('users')
        .doc(cred.user.uid)
        .set({
          bio: signupForm['signup-bio'].value,
        })
    )
    .then(() => {
      const modal = document.querySelector('#modal-signup');
      M.Modal.getInstance(modal).close();
      signupForm.reset();
      signupForm.querySelector('.error').innerHTML = '';
    })
    .catch(err => {
      signupForm.querySelector('.error').innerHTML = err.message;
    });
});

// logout
const logout = document.querySelectorAll('.logout');
logout.forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    auth.signOut();
  });
});
// login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', e => {
  e.preventDefault();

  // get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  // login user
  auth
    .signInWithEmailAndPassword(email, password)
    .then(cred => {
      const modal = document.querySelector('#modal-login');
      M.Modal.getInstance(modal).close();
      loginForm.reset();
      loginForm.querySelector('.error').innerHTML = '';
    })
    .catch(err => {
      loginForm.querySelector('.error').innerHTML = err.message;
    });
});
