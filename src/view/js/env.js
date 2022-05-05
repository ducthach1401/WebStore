// const API_URL = 'http://localhost:8080';
const API_URL = "https://souvenirstore.glitch.me";

async function logout() {
  window.location.href = '/logout';
}

async function admin() {
  window.location.href = '/admin';
}

async function changeName() {
  window.location.href = '/name';
}

async function changePassword() {
  window.location.href = '/password';
}

async function home() {
  window.location.href = '/';
}

async function refreshToken() {
  const url = API_URL + '/v1/user/refresh';
  const time_login = document.cookie.split('=')[1];
  const hour = Math.round((Date.now() - time_login) / (60 * 1000 * 60));
  if (hour >= 4) {
    const result = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    document.cookie = 'exp=' + Date.now();
  }
}

async function getNameOfUser() {
  const url = API_URL + '/v1/user/';
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  let data = await response.json();
  document.getElementById('name').innerText = data.result.name;
}
