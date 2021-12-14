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
        document.getElementById('goods').innerHTML = '';
        let count = 0;
        let row;
        for (let item of data.result){
            if (count == 0){
                row = document.createElement('div');
                row.classList = 'row justify-content-center';
                document.getElementById('goods').appendChild(row);
            }
            count ++;
            let temp = '<div class="card mr-3 data" style="width:300px" id="{}">'.replace('{}', item._id);
            temp += '<img class="card-img-top" src="{}" alt="Card image"  style="height:200px">'.replace('{}', item.image);
            temp += '<div class="card-body">'
            temp +=            '<h5 class="card-title"><b>{}</b></h5>'.replace('{}', item.name)
            temp +=           '<p class="card-text">Mô tả: {}</p>'.replace('{}', item.description)
            temp +=            '<p class="card-text">Giá tiền: {} </p>'.replace('{}', item.cost.toLocaleString('vi-vn'))
            temp +=            '<div><a href="#" class="btn btn-outline-info float-right">Đặt hàng</a></div>'
            temp +=          '</div>'
            temp +=       '</div>'
            row.innerHTML += temp;
        }
    }
}

async function showType () {
    const url = API_URL + '/v1/type/';
    const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    let data = await response.json();
    let result = [];
    if (data.message == 'Success') {
        for (let type of data.result){
            result.push(type.type);
        }
    }
    return result;
}

async function filterType() {
    const type = await showType();
    const form = document.createElement('div');
    form.setAttribute('class', 'form-check');
    let count = 0;
    form.innerHTML = '<input class="form-check-input" type="radio" name="filter" id="all" onchange="getGoods();" >';
    form.innerHTML += '<label class="form-check-label" for="all">Tất cả</label> <br>';
    for (let i of type){
        count++;
        form.innerHTML += '<input class="form-check-input" type="radio" name="filter" id="{}" onchange="filter(this.value);" value="[]">'.replace('{}', 'filter' + count).replace('[]', i);
        form.innerHTML += '<label class="form-check-label" for="{}">'.replace('{}', 'filter' + count) + i +'</label> <br>';
    }
    document.getElementById('select').append(form);
}


async function filter (value) {
    const url = API_URL + '/v1/item?type=' + value;
    const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    let data = await response.json();
    if (data.message == 'Success') {
        document.getElementById('goods').innerHTML = '';
        let count = 0;
        let row;
        for (let item of data.result){
            if (count == 0){
                row = document.createElement('div');
                row.classList = 'row justify-content-center';
                document.getElementById('goods').appendChild(row);
            }
            count ++;
            let temp = '<div class="card mr-3 data" style="width:300px" id="{}">'.replace('{}', item._id);
            temp += '<img class="card-img-top" src="{}" alt="Card image"  style="height:200px">'.replace('{}', item.image);
            temp += '<div class="card-body">'
            temp +=            '<h5 class="card-title"><b>{}</b></h5>'.replace('{}', item.name)
            temp +=           '<p class="card-text">Mô tả: {}</p>'.replace('{}', item.description)
            temp +=            '<p class="card-text">Giá tiền: {} </p>'.replace('{}', item.cost.toLocaleString('vi-vn'))
            temp +=            '<div><a href="#" class="btn btn-outline-info float-right">Đặt hàng</a></div>'
            temp +=          '</div>'
            temp +=       '</div>'
            row.innerHTML += temp;
        }
    }
}

function searchName() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    table = document.getElementById("goods");
    tr = table.getElementsByClassName("card mr-3 data");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("b")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
            } else {
            tr[i].style.display = "none";
            }
        }       
    }
}
