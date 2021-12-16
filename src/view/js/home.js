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
            let temp = '<div class="card mr-3 data" style="width:300px">'
            temp += '<img class="card-img-top" src="{}" alt="Card image"  style="height:200px; cursor: pointer ;" onclick="window.open(this.src)">'.replace('{}', item.image);
            temp += '<div class="card-body">'
            temp +=            '<h5 class="card-title"><b>{}</b></h5>'.replace('{}', item.name)
            temp +=           '<p class="card-text">Mô tả: {}</p>'.replace('{}', item.description)
            temp +=            '<p class="card-text" id="gt{}">Giá tiền: {} </p>'.replace('{}', item._id).replace('{}', item.cost.toLocaleString('vi-vn'))
            temp +=            '<p class="card-text">Thành tiền: <input type="text" id = "tt{}" disabled class="w-50"> </span> </p>'.replace('{}', item._id);
            temp +=            '<div><input type="number" class="w-25" min="1" id="number{}" onchange="total(this.id);" onkeyup="total(this.id);"><a href="#" class="btn b1tn-outline-info float-right" id="{}" onclick="addCart(this.id)">Thêm vào giỏ</a></div>'.replace('{}', item._id).replace('{}', item._id);
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
            let temp = '<div class="card mr-3 data" style="width:300px">'
            temp += '<img class="card-img-top" src="{}" alt="Card image"  style="height:200px">'.replace('{}', item.image);
            temp += '<div class="card-body">'
            temp +=            '<h5 class="card-title"><b>{}</b></h5>'.replace('{}', item.name)
            temp +=           '<p class="card-text">Mô tả: {}</p>'.replace('{}', item.description)
            temp +=            '<p class="card-text" id="gt{}">Giá tiền: {} </p>'.replace('{}', item._id).replace('{}', item.cost.toLocaleString('vi-vn'))
            temp +=            '<p class="card-text">Thành tiền: <input type="text" id = "tt{}" disabled class="w-50"> </span> </p>'.replace('{}', item._id);
            temp +=            '<div><input type="number" class="w-25" min="1" id="number{}" onchange="total(this.id);" onkeyup="total(this.id);"><a href="#" class="btn b1tn-outline-info float-right" id="{}" onclick="addCart(this.id)">Thêm vào giỏ</a></div>'.replace('{}', item._id).replace('{}', item._id);
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

async function addCart(id) {
    const url = API_URL + '/v1/item/' + id;
    const quantity = parseInt(document.getElementById('number' + id).value);
    const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    let data = await response.json();
    if (isNaN(quantity)){
        Swal.fire({
            title: "Vui lòng chọn số lượng",
            icon: "error"
        })
        return;
    }
    if (data.message == 'Success') {
        let check = window.localStorage.getItem(data.result[0].name);
        let cost = document.getElementById('gt' + id).innerText.replace('Giá tiền: ', '').split('.').join('');
        cost = parseInt(cost);
        if (check == null){
            window.localStorage.setItem(data.result[0].name, JSON.stringify({
                price: cost,
                quantity: quantity
            }));
        }
        else {
            check = JSON.parse(check);
            window.localStorage.setItem(data.result[0].name, JSON.stringify({
                price: cost,
                quantity: quantity + parseInt(check.quantity)
            }));
        }
        Swal.fire({
            title: "Thêm hàng vào giỏ",
            icon: 'success'
        })
        document.getElementById('number' + id).value = '';
        document.getElementById('tt' +id).value = '';
    }
    else {
        Swal.fire({
            title: data.message,
            icon: 'error'
        });
    }
}

async function cart() {
    const bodyOrder = document.getElementById('ordersp');
    bodyOrder.innerHTML = '<tr><th>STT</th><th>Tên sản phẩm</th><th>Số lượng</th><th>Đơn giá</th><th>Thành tiền</th></tr>';
    const data = Object.keys(window.localStorage);
    let stt = 0;
    let sum = 0;
    for (let item of data){
        stt ++;
        const data = JSON.parse(window.localStorage.getItem(item));
        const row = document.createElement('tr');
        let td = document.createElement('td');
        td.innerText = stt;
        row.append(td);

        td = document.createElement('td');
        td.innerText = item;
        row.append(td);

        td = document.createElement('td');
        td.innerText = data.quantity;
        row.append(td);

        td = document.createElement('td');
        td.innerText = data.price.toLocaleString('vi-vn');
        row.append(td);

        td = document.createElement('td');
        td.innerText = (data.price * data.quantity).toLocaleString('vi-vn');
        row.append(td);

        td = document.createElement('td');
        td.innerHTML = '<button class="btn btn-outline-danger" onclick="deleteItem(this.value);" value="{}">Xóa</button>'.replace('{}', item);
        row.append(td);
        bodyOrder.appendChild(row);
        sum += data.price * data.quantity;
    }
    if (stt == 0){
        Swal.fire({
            title: "Bạn chưa có gì trong giỏ nha!"
        })
        return;
    }
    document.getElementById('tt').innerText = sum.toLocaleString('vi-vn')
    $('#order').modal('show');
}

async function deleteItem(value) {
    window.localStorage.removeItem(value);
    if (window.localStorage.length == 0){
        $('#order').modal('hide');
        return;
    }
    await cart();
}

async function total (number_id) {
    const quantity = parseInt(document.getElementById(number_id).value);
    const id = number_id.replace('number', '');
    if (isNaN(quantity)){
        document.getElementById('tt' +id).value = '';
        document.getElementById(number_id).value = '';
        return;
    }
    let cost = document.getElementById('gt' + id).innerText.replace('Giá tiền: ', '').split('.').join('');
    cost = parseInt(cost);
    document.getElementById('tt' +id).value = (cost * quantity).toLocaleString('vi-vn');
}

async function submitCart() {
    let data = {
        name: document.getElementById('name').value,
        sdt: document.getElementById('sdt').value,
        address: document.getElementById('address').value,
        facebook: document.getElementById('fb').value,
        note: document.getElementById('note').value
    };
    const noti = document.getElementById('noti');
    noti.innerHTML = '';
    if (data.name.length <= 0) {
        noti.innerHTML = 'Bạn chưa điền tên!!';
        return;
    }

    if (data.sdt.length <= 0) {
        noti.innerHTML = 'Bạn chưa điền SDT!!';
        return;
    }

    if (data.address.length <= 0) {
        noti.innerHTML = 'Bạn chưa điền địa chỉ!!';
        return;
    }

    if (data.facebook.length <= 0) {
        delete data.facebook;
    }

    if (data.note.length <= 0) {
        delete data.note;
    }

    let stt = 0;
    const items = Object.keys(window.localStorage);
    let goods = [];
    for (let item of items){
        stt ++;
        let pItem = JSON.parse(window.localStorage.getItem(item));
        let temp = {
            stt: stt,
            name: item,
            quantity: pItem.quantity,
            price: pItem.price.toLocaleString('vi-vn'),
            total: (pItem.quantity * pItem.price).toLocaleString('vi-vn')
        }
        goods.push(temp);
    }
    if (stt == 0){
        return;
    }
    data.goods = goods;
    data.totalPrice = document.getElementById('tt').innerText;
    const url = API_URL + '/v1/order';
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    let res = await response.json();
    if (res.message == 'Success'){
        Swal.fire({
            title: "Đặt đơn thành công!",
            icon: 'success'
        });
        setTimeout(() => {
            window.localStorage.clear();
            window.location.href = '/';
        }, 1000);
    }
    else {
        Swal.fire({
            title: res.message,
            icon: 'error'
        });
    }
}