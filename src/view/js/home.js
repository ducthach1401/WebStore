function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

async function buttonLogin() {
    let login = getCookie("login");
    if (!login) {
        document.getElementById("loginButton").innerHTML = '<button class="btn btn-outline-dark buttonLogin" onclick="login()">Login</button>';
    }
    else {
        let temp = '';
        temp = '<a class="nav-link dropdown-toggle fs-4 text-decoration-none text-dark float-right" href="#" id="dropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
        temp += '<span id="name"></span></a>'
        temp += '<ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark fs-6" aria-labelledby="navbarDropdown">'
        temp += '<li><span class="dropdown-item" onclick="changeName()">Change Name</span></li>'
        temp += '<li><span class="dropdown-item" onclick="changePassword()">Change Password</span></li>'
        temp += '<li><span class="dropdown-item" onclick="admin()">Admin</span></li>'
        temp += '<li><hr class="dropdown-divider"></li>'
        temp += '<li><span class="dropdown-item" onclick="logout()">Logout</span></li></ul>'
        document.getElementById("loginButton").innerHTML = temp;
        getNameOfUser();
    }
}

async function login() {
    window.location.href = '/login';
}

async function getGoods() {
    const url = API_URL + '/v1/items';
    const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    let data = await response.json();
    if (data.message == 'Success') {
        let count = 0;
        let row;
        for (let item of data.result){
            if (count == 0){
                row = document.createElement('div');
                row.classList = 'row justify-content-center';
                document.getElementById('goods').appendChild(row);
            }
            count ++;
            let temp = '<div class="card mr-3" style="width:300px" id="{}">'.replace('{}', item._id);
            temp += '<img class="card-img-top" src="{}" alt="Card image">'.replace('{}', item.image);
            temp += '<div class="card-body">'
            temp +=            '<h5 class="card-title"><b>{}</b></h5>'.replace('{}', item.name)
            temp +=           '<p class="card-text">Mô tả: {}</p>'.replace('{}', item.description)
            temp +=            '<p class="card-text">Giá tiền: {} </p>'.replace('{}', item.cost)
            temp +=            '<div><a href="#" class="btn btn-outline-info float-right">Đặt hàng</a></div>'
            temp +=          '</div>'
            temp +=       '</div>'
            row.innerHTML += temp;
        }
    }
}