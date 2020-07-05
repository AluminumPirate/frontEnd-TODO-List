let user = null;
let taskCounter = 0;
if (localStorage.length < 1) {
    location.href = "login.html";
  }

$(document).ready(init);

function init() {
  user = JSON.parse(localStorage.getItem("users")).find(x => x.userName == sessionStorage.getItem("currentUser"));
  

  $("#logout-button").click(logOut);
  $("#main-div").append(createPostPanel());  

  $("#task-text-button").click(addNewTask);
  showAlltasks();
  
  // $(".comment-button").click(addNewComment);
    
  $(".displayUsernameSpan").html(user.userName);
  bindActiveButtons();
}


function createPostPanel() {
  //user "<span class="displayUsernameSpan"></span>" says:
  return `
  <div id="add-task-panel" class="w3-display-container w3-row w3-aqua w3-border w3-border-black" style="height:11vh;">
   <div class="w3-row w3-margin w3-center">
   
      <div id="task-button-div" class="w3-col s8 m8 l8">
        <input id="task-text" class="w3-input w3-border w3-round-large w3-hover-gray" type="text" name="task text" placeholder="insert task" autocomplete="off" />
      </div>
      <div class="w3-col s4 m4 l4">
          <input id="task-text-button" type="button" title="add task" class="buttons w3-round w3-button w3-button-tiny w3-black w3-display-bottomright w3-margin" value="add" autocomplete="off"/>
      </div>
    </div>
  </div>
  `;
}





function addNewTask() {
  // $("#main-div").append(createTask($("#task-text").val()));
  let taskText = $("#task-text").val();
  if (taskText == "") return;

  $("#task-text").val('');
  let task = createTask(taskText, user.tasks.length);
  $("#main-div").append(task);

  $("#task-button-"+user.tasks.length).click(addNewComment);


  user = JSON.parse(localStorage.getItem("users")).find(x => x.userName == sessionStorage.getItem("currentUser"));
  user.tasks.push({
    taskText: taskText,
    comments : [],
    taskCounter: taskCounter
  })
  taskCounter++;

  bindActiveButtons();
  savetasksToStorage();
}

function createTask(task, count) {
  // user = JSON.parse(localStorage.getItem("users")).find(x => x.userName == sessionStorage.getItem("currentUser"));
 
  return `
   <div id="task-div-${count}" class="task-div w3-display-container w3-row w3-border w3-border-black w3-margin" style="height:auto;">
    
    <div class="w3-row w3-margin">
      <div class="w3-col s3 m3 l3">
        <h4 class="task-text">${task}</h4>
      </div>

      <div class="w3-col s7 m7 l7">
        <div class="w3-col s8 m8 l8">
          <input id="text-task-${count}" type="text" class=" w3-input w3-border w3-round w3-hover-gray" name="task" placeholder="comment" autocomplete="off"/>
        </div>
        <div class="w3-col s4 m4 l4">
          <input id="task-button-${count}" type="button" title="add comment" class="buttons w3-round w3-button w3-button-tiny w3-black" value="add" autocomplete="off"/>
        </div>
      </div>

      <div class="w3-col s2 m2 l2 buttons-wrapper w3-display-topright">
          <button id="hide-button-t${count}" title="hide comments" class="btn hide" onclick="hideComments(this.id)"><i class="fa fa-window-minimize"></i></button>
          <button id="remove-button-t${count}" title="delete task" class="btn trash" onclick="deleteTask(this.id)"><i class="fa fa-trash"></i></button>
      </div>
      
    </div>
  </div>
  `;
}

function logOut() {
  sessionStorage.clear();
  location.href = "login.html";
}


function bindActiveButtons() {
  $(":button").hover(function() {
    $(this).toggleClass("active");
    $(this).toggleClass("w3-hover-amber");
  });
}

let taskNumber = undefined;
function addNewComment() {
  let taskNumber = $(this)[0].id.split("task-button-")[1];
  let taskDiv = $("#task-div-"+taskNumber);

  let commentDiv = $("#text-task-"+taskNumber);
  let comment = commentDiv.val();
  if (comment == "") return;

  commentDiv.val('');

  console.log(taskNumber)

  user = JSON.parse(localStorage.getItem("users")).find(x => x.userName == sessionStorage.getItem("currentUser"));
  
  // if(user.tasks[taskNumber].comments.commentCounter == undefined) {commentCounter = 1;}
  user.tasks[taskNumber].comments.push({
    comment: comment,
    // commentCounter: commentCounter
  })

  taskDiv.append(createComment(comment, taskNumber, ($(this)).parent().parent().parent().siblings().length));
  //$("task-div-0").click();
  
  savetasksToStorage();
}

function createComment(comment, taskNumber, commentNumber) {
  
  return `<div class="w3-row comment">
    <div class="w3-col s2 m2 l2 buttons-wrapper">
      <button id="edit-button-t${taskNumber}-c${commentNumber}" title="edit comment" class="btn edit" onclick="editComment(this.id)"><i class="fa fa-edit"></i></button>
      <button id="remove-button-t${taskNumber}-c${commentNumber}" title="delete comment" class="btn trash" onclick="removeComment(this.id)"><i class="fa fa-trash"></i></button>
    </div>

    
    <div class="w3-col s10 m10 l10">
      <p>${comment}</p> 
    </div>
    

  </div>`;
}

function removeComment(commentID) {
  console.log("remove comment")
  $("#"+commentID).parent().parent().remove();
  console.log(commentID);
  let task = commentID.match(/\d+/ig)[0];
  let comment = commentID.match(/\d+/ig)[1];

  user.tasks[task].comments.splice(comment, 1);
  if (user.tasks[task].comments.length == 0) {
    removeTask(task);
  }

  savetasksToStorage();

  main = $("#main-div");
  for (let i = 0; i < main[0].childElementCount; i++) {
    main[0].children[1].remove();
  }

  showAlltasks();
}

function removeTask(taskNumber) {
  user.tasks.splice(taskNumber,1);
  taskNumber--;
}

function deleteTask(id) {
  let task = id.match(/\d+/ig)[0];

  user.tasks[task].comments.splice(0, user.tasks[task].comments.length);
  removeTask(task);
  $("#task-div-"+task).remove();
  savetasksToStorage();
}   

let hidden = false;
function hideComments(ref) {
  let check;
  for (let i = 1; i < $("#"+ref).parent().parent().parent()[0].childElementCount; i++){
    if (hidden == false) {
        $("#"+ref).parent().parent().parent()[0].children[i].hidden = true;
        check = true;
    } else {
        $("#"+ref).parent().parent().parent()[0].children[i].hidden = false;
        check = false;
    }
  }

  hidden = check;
}

function savetasksToStorage() {
  let users = JSON.parse(localStorage.getItem("users"));
  users.find(x => x.userName == user.userName).tasks = user.tasks;
  localStorage.setItem("users", JSON.stringify(users));
}

function resettasks() {
  user.tasks = [];
  savetasksToStorage();
}

function showAlltasks() {
  // $("#first-button-div").empty();
  
  for (let i = 0; i < user.tasks.length; i++) {
    $("#main-div").append(createTask(user.tasks[i].taskText, i));
    $("#task-button-"+i).click(addNewComment);

    // alert("added " + user.tasks[i].taskText + " task");
    
    for (let j = 0; j < user.tasks[i].comments.length; j++) {
      $("#task-div-"+i).append(createComment(user.tasks[i].comments[j].comment, i, j));
    }
  }
}

// function bindActiveButtons() {
//   $(":button").hover(
//     function() {
//       if ($(this).hasClass("active")) {
//         $(this).removeClass("active");
//       } else {
//         $(this).addClass("active");
//       }
//   });
// }
