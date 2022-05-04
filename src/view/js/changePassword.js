async function changePassword() {
  const url = API_URL + '/v1/user/password';
  const password = document.getElementById('password').value;
  const password_confirm = document.getElementById('password-confirm').value;
  if (password_confirm == password) {
    const payload = {
      password: password,
      // passwordConfirm: password_confirm
    };

    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    let data = await response.json();
    if (data.message == 'Success') {
      Swal.fire({
        title: 'Success and Login again',
        icon: 'success',
      });
      setTimeout(() => {
        window.location.href = '/logout';
      }, 1000);
    } else {
      Swal.fire({
        title: data.message,
        icon: 'error',
      });
    }
  } else {
    Swal.fire({
      title: "Password don't match",
      icon: 'error',
    });
  }
}

async function cancel() {
  window.location.href = '/';
}
