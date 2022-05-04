function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
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
    document.getElementById("loginButton").innerHTML =
      '<button class="btn btn-outline-light buttonLogin" onclick="login()">Login</button>';
  } else {
    let temp = "";
    temp =
      '<a class="nav-link dropdown-toggle fs-4 text-decoration-none text-light float-right" href="#" id="dropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">';
    temp += '<span id="name"></span></a>';
    temp +=
      '<ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark fs-6" aria-labelledby="navbarDropdown">';
    temp +=
      '<li><span class="dropdown-item" onclick="changeName()">Change Name</span></li>';
    temp +=
      '<li><span class="dropdown-item" onclick="changePassword()">Change Password</span></li>';
    temp +=
      '<li><span class="dropdown-item" onclick="admin()">Admin</span></li>';
    temp += '<li><hr class="dropdown-divider"></li>';
    temp +=
      '<li><span class="dropdown-item" onclick="logout()">Logout</span></li></ul>';
    document.getElementById("loginButton").innerHTML = temp;
    getNameOfUser();
  }
}

async function login() {
  window.location.href = "/login";
}

async function getGoods() {
  const url = API_URL + "/v1/items";
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let data = await response.json();
  if (data.message == "Success") {
    let count = 0;
    let row;
    for (let item of data.result) {
      if (count == 0) {
        row = document.createElement("div");
        row.classList = "row justify-content-center";
        document.getElementById("goods").appendChild(row);
      }
      count++;
      let temp = '<div class="card mr-3 data" style="width:300px" >';
      temp +=
        '<img class="card-img-top" src="{}" alt="Card image" style="height:300px">'.replace(
          "{}",
          item.image
        );
      temp += '<div class="card-body">';
      temp += '<h5 class="card-title"><b>{}</b></h5>'.replace("{}", item.name);
      temp += '<p class="card-text">Mô tả: {}</p>'.replace(
        "{}",
        item.description
      );
      temp += '<p class="card-text">Giá tiền: {} </p>'.replace(
        "{}",
        item.cost.toLocaleString("vi-vn")
      );
      temp +=
        '<div><a href="#" id="{}" class="btn btn-outline-info float-right" onclick="showModalRepair(this.id)">Thông tin</a></div>'.replace(
          "{}",
          item._id
        );
      temp +=
        '<div><a href="#" id="{}" class="btn btn-outline-info float-right" onclick="submitImage(this.id)">Ảnh</a></div>'.replace(
          "{}",
          item._id
        );
      temp +=
        '<div><a href="#" id="{}" class="btn btn-outline-danger float-right" onclick="deleteItem(this.id)">Xóa</a></div>'.replace(
          "{}",
          item._id
        );
      temp += "</div>";
      temp += "</div>";
      row.innerHTML += temp;
    }
  }
}

async function showType() {
  const url = API_URL + "/v1/type/";
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let data = await response.json();
  let result = [];
  if (data.message == "Success") {
    for (let type of data.result) {
      result.push(type.type);
    }
  }
  return result;
}

async function showItem() {
  const type = await showType();
  document.getElementById("addType").innerHTML = "";
  for (let i of type) {
    const option = document.createElement("option");
    option.value = i;
    option.innerText = i;
    document.getElementById("addType").append(option);
  }
  $("#additem").modal("show");
}

async function addItem() {
  const url = API_URL + "/v1/item/";
  const payload = new FormData();
  const image = document.getElementById("addImage");
  const name = document.getElementById("addName").value;
  const desc = document.getElementById("addDesc").value;
  const type = document.getElementById("addType").value;
  const price = document.getElementById("addPrice").value;

  payload.append("image", image.files[0]);
  payload.append("name", name);
  payload.append("description", desc);
  payload.append("cost", price);
  payload.append("type", type);

  const response = await fetch(url, {
    method: "POST",
    body: payload,
    // credentials: 'include',
    // headers: {
    //     'Content-Type': 'application/json',
    // },
  });
  let data = await response.json();
  if (data.message == "Success") {
    Swal.fire({
      title: "Success",
      icon: "success",
    });
    setTimeout(() => {
      window.location.href = "/admin";
    }, 1000);
  } else {
    Swal.fire({
      title: data.message,
      icon: "error",
    });
  }
}

async function submitImage(id) {
  const url = API_URL + "/v1/item/" + id;
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let data = await response.json();
  if (data.message == "Success") {
    let temp = data.result[0];
    document.getElementById("idUpdate").value = temp._id;
    // document.getElementById('namesp').value = temp.name;
    // document.getElementById('desc').value = temp.description;
    // document.getElementById('price').value = temp.cost;

    $("#updateImage").modal("show");
  }
}

async function updateImage() {
  const id = document.getElementById("idUpdate").value;
  const image = document.getElementById("imageUpdate");
  const url = API_URL + "/v1/image/" + id;
  const payload = new FormData();
  payload.append("image", image.files[0]);
  const response = await fetch(url, {
    method: "POST",
    body: payload,
    // credentials: 'include',
    // headers: {
    //     'Content-Type': 'application/json',
    // },
  });
  let data = await response.json();
  if (data.message == "Success") {
    Swal.fire({
      title: "Success",
      icon: "success",
    });
    setTimeout(() => {
      window.location.href = "/admin";
    }, 1000);
  } else {
    Swal.fire({
      title: data.message,
      icon: "error",
    });
  }
}

async function showModalRepair(id) {
  const url = API_URL + "/v1/item/" + id;
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let data = await response.json();
  if (data.message == "Success") {
    let temp = data.result[0];
    const type = await showType();
    document.getElementById("typeR").innerHTML = "";
    for (let i of type) {
      const option = document.createElement("option");
      option.value = i;
      option.innerText = i;
      document.getElementById("typeR").append(option);
    }

    document.getElementById("idsp").value = temp._id;
    document.getElementById("namesp").value = temp.name;
    document.getElementById("desc").value = temp.description;
    document.getElementById("price").value = temp.cost;
    document.getElementById("typeR").value = temp.type;
    $("#repair").modal("show");
  }
}

async function submitRepair() {
  const id = document.getElementById("idsp").value;
  const payload = {
    name: document.getElementById("namesp").value,
    description: document.getElementById("desc").value,
    cost: parseInt(document.getElementById("price").value),
    type: document.getElementById("typeR").value,
  };
  const url = API_URL + "/v1/item/" + id;
  const response = await fetch(url, {
    method: "PUT",
    body: JSON.stringify(payload),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let data = await response.json();
  if (data.message == "Success") {
    Swal.fire({
      title: "Success",
      icon: "success",
    });
    setTimeout(() => {
      window.location.href = "/admin";
    }, 1000);
  } else {
    Swal.fire({
      title: data.message,
      icon: "error",
    });
  }
}

async function deleteItem(id) {
  const url = API_URL + "/v1/item/" + id;
  console.log(id);
  const confirmSell = await Swal.fire({
    title: "Are you sure?",
    icon: "question",
    confirmButtonText: "OK",
    showCancelButton: true,
  });
  if (!confirmSell.isConfirmed) {
    return;
  }
  const response = await fetch(url, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let data = await response.json();
  if (data.message == "Success") {
    Swal.fire({
      title: "Success",
      icon: "success",
    });
    setTimeout(() => {
      window.location.href = "/admin";
    }, 1000);
  } else {
    Swal.fire({
      title: data.message,
      icon: "error",
    });
  }
}

async function showTypeForm() {
  $("#showType").modal("show");
}

async function addType() {
  const payload = {
    type: document.getElementById("typeData").value,
  };
  const url = API_URL + "/v1/type/";
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let data = await response.json();
  if (data.message == "Success") {
    Swal.fire({
      title: "Success",
      icon: "success",
    });
    setTimeout(() => {
      window.location.href = "/admin";
    }, 1000);
  } else {
    Swal.fire({
      title: data.message,
      icon: "error",
    });
  }
}

async function showTypeID() {
  const url = API_URL + "/v1/type/";
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let data = await response.json();
  let result = [];
  if (data.message == "Success") {
    for (let type of data.result) {
      result.push({
        type: type.type,
        id: type._id,
      });
    }
  }
  return result;
}

async function showDelete() {
  const type = await showTypeID();
  const add = document.getElementById("delete");
  add.innerHTML = "";
  for (let i of type) {
    let temp = document.createElement("div");
    temp.innerText = i.type;
    let button = document.createElement("button");
    button.setAttribute("id", i.id);
    button.setAttribute("onclick", "deleteType(this.id)");
    button.setAttribute("class", "btn btn-outline-dark");
    button.innerHTML = "Xóa";
    add.append(temp);
    add.append(button);
    add.append(document.createElement("br"));
  }
  $("#deleteType").modal("show");
}

async function deleteType(id) {
  const url = API_URL + "/v1/type/" + id;
  const response = await fetch(url, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let data = await response.json();
  if (data.message == "Success") {
    Swal.fire({
      title: "Success",
      icon: "success",
    });
    setTimeout(() => {
      window.location.href = "/admin";
    }, 1000);
  } else {
    Swal.fire({
      title: data.message,
      icon: "error",
    });
  }
}
