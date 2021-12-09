async function changeName() {
    const url = API_URL + '/v1/user/name';
    const name = document.getElementById('name').value;
    if (name.length > 20){
        Swal.fire({
            title: "Name must be less than 20 characters",
            icon: 'error'
        });
    }
    else {
        const payload = {
            name: document.getElementById('name').value
        }
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        let data = await response.json();
        if (data.message == 'Success'){
            Swal.fire({
                title: "Change Name",
                icon: 'success'
            });
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        }
        else {
            Swal.fire({
                title: data.message,
                icon: 'error'
            });
        }
    }
}

async function getUserID() {
    const url = API_URL + '/v1/user/'
    const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    let data = await response.json();
    return data;
}


async function cancel() {
    window.location.href = '/';
}