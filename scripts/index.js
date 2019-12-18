const guideList = document.querySelector('.guides');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');
const adminItems = Array.from(document.querySelectorAll('.admin'));

// setup User Interface
const setupUI = user => {
  if (user) {
    if (user.admin) {
      adminItems.forEach(item => (item.style.display = 'block'));
    }
    // show user info
    db.collection('users')
      .doc(user.uid)
      .get()
      .then(doc => {
        const html = `
    <div>Logged in as ${user.email}</div>
    <div>${doc.data().bio}</div>
    <div class='red-text'>${user.admin ? 'Admin' : ''}</div>`;
        accountDetails.innerHTML = html;
      });

    // toggle UI elements
    loggedInLinks.forEach(item => (item.style.display = 'block'));
    loggedOutLinks.forEach(item => (item.style.display = 'none'));
  } else {
    // hide info
    adminItems.forEach(item => (item.style.display = 'none'));

    accountDetails.innerHTML = '';
    loggedInLinks.forEach(item => (item.style.display = 'none'));
    loggedOutLinks.forEach(item => (item.style.display = 'block'));
  }
};

// setup guides
const setupGuides = data => {
  if (data.length) {
    let html = '';
    data.forEach(doc => {
      const guide = doc.data();
      const li = `
    <li>
      <div class="collapsible-header grey lighten-4">${guide.title}</div>
      <div class="collapsible-body white">${guide.content}</div>
    </li>`;
      html += li;
    });
    guideList.innerHTML = html;
  } else {
    guideList.innerHTML = `<h5 class="center-align" > Please login to view fishing guides</h5>`;
  }
};

// setup materialize components
document.addEventListener('DOMContentLoaded', function() {
  const elems = document.querySelectorAll('.sidenav');
  const instancesNav = M.Sidenav.init(elems, {});

  const items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);

  const optionsModal = {
    onOpenStart: () => {},
    onOpenEnd: () => {},
    onCloseStart: () => {},
    onCloseEnd: () => {
      createForm.reset();
      signupForm.reset();
      loginForm.reset();
    },
  };

  const modals = document.querySelectorAll('.modal');
  const instances = M.Modal.init(modals, optionsModal);
});
