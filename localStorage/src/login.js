let users = undefined;
let userName = null;
let password = null;
let tasks = [];

$(document).ready(init);

function init() {
  $(".login-box").slideDown();
  users = JSON.parse(localStorage.getItem("users"));
  if (users == null) {
      users = [];
  }

  $(".fa-key").css({"-webkit-transform": "rotate(90deg)"});
  $("#login-button").click(login);
  $("#register-button").click(register);
}


function register() {
  clearMsg();
  setUserNameAndPassword();

  let user = users.find(x => x.userName == userName);
  if (user != null) {
    $("#msg").text("username already exist").css("color", "red");
  }
  else if (password == "" || userName == "")
  {
    $("#msg").text("empty fields. please fill the form").css("color", "red");
  }
  else {
    users.push({
      userName: userName,
      password: password,
      tasks : []
    });

    localStorage.setItem("users", JSON.stringify(users));
    $("#msg").text("signed succesfully").css("color", "green");
  }
}

function login() {
  clearMsg();
  setUserNameAndPassword();

  let user = users.find(x => x.userName == userName && x.password == password);
  if (user != null) {
    sessionStorage.setItem("currentUser", userName);
    location.href = "app.html";
    //alert("logged");
  }
  else {
    $("#msg").text("invalid credentials").css("color", "red");
  }
}

function clearMsg() {
  $("#msg").text("");
}

function setUserNameAndPassword() {
  userName = $("#userName").val();
  password = $("#password").val().hashCode();
}


String.prototype.hashCode = function() {
    var hash = 0;
    if (this.length == 0) {
        return hash;
    }
    for (var i = 0; i < this.length; i++) {
        var char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}