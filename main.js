let myArray = [];

const myObj1 = {
  tasks: myArray,
  theme: "default",
  id: 1,
  listName: "My day",
  type: "system",
  isActive: false,
};
const myObj2 = {
  tasks: myArray,
  theme: "default",
  id: 2,
  listName: "Important",
  type: "system",
  isActive: false,
};
const myObj3 = {
  tasks: myArray,
  theme: "default",
  id: 3,
  listName: "Next 7 days",
  type: "system",
  isActive: false,
};
const myObj4 = {
  tasks: myArray,
  theme: "default",
  id: 4,
  listName: "All my tasks",
  type: "system",
  isActive: false,
};
const myObj5 = {
  tasks: myArray,
  theme: "default",
  id: 5,
  listName: "Home",
  type: "system",
  isActive: true,
};

let lists = [];
lists.push(myObj1);
lists.push(myObj2);
lists.push(myObj3);
lists.push(myObj4);
lists.push(myObj5);

// localStorage.removeItem("lists");
// localStorage.removeItem("taskCounter");
// localStorage.removeItem("counter");
// localStorage.removeItem("activeListIndex");
// localStorage.removeItem("activeTaskIndex");
// localStorage.removeItem("activeTaskId");

let taskCounter = parseInt(localStorage.getItem("taskCounter")) || 1;
let counter = parseInt(localStorage.getItem("counter")) || 6;
let listsFromStorage = JSON.parse(localStorage.getItem("lists")) || lists;

console.log(listsFromStorage);
const icon = document.querySelector(".icon");
const leftSide = document.querySelector(".left-side");
const addNewList = document.querySelector(".add-new-list");
const addNewTask = document.querySelector(".add-new-task");
const quickShortcuts = document.querySelector(".quick-shortcuts");
const headIcon = document.querySelector(".head-icon");
const rightSide = document.querySelector(".right-side");
const userLists = document.querySelector(".user-lists");
const newList = document.getElementById("newList");
const addButton = document.getElementById("add-button");
const userTasks = document.querySelector(".tasks");
const newTask = document.getElementById("newTask");
const addButtonForTask = document.getElementById("add-button-task");
const userListsContainer = document.querySelector(".user-lists");

let activeListIndex = localStorage.getItem("activeListIndex") || 0;

updateAllTasksList();

function updateAllTasksList() {
  listsFromStorage = JSON.parse(localStorage.getItem("lists")) || lists;
  listsFromStorage[0].tasks = [];
  listsFromStorage[1].tasks = [];
  listsFromStorage[2].tasks = [];
  listsFromStorage[3].tasks = [];

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  // add leading zero to month and day if they are less than 10
  const formattedMonth = month < 10 ? `0${month}` : month;
  const formattedDay = day < 10 ? `0${day}` : day;
  const currentDate = `${year}-${formattedMonth}-${formattedDay}`;

  for (let l = 4; l < listsFromStorage.length; l++) {
    listsFromStorage[l].tasks.forEach((Atask) => {
      listsFromStorage[3].tasks.push(Atask);
      if (Atask.dueDate == currentDate) {
        listsFromStorage[0].tasks.push(Atask);
      }
      if (Atask.important === true) {
        listsFromStorage[1].tasks.push(Atask);
      }
    });
    const nextWeek = `${year}-${formattedMonth}-${formattedDay + 7}`;
    const filteredArray = listsFromStorage[l].tasks.filter(
      (obj) =>
        new Date(obj.dueDate) <= new Date(nextWeek) &&
        new Date(obj.dueDate) >= new Date(currentDate)
    ); // Filter the array to get objects with a dueDate within the next 7 days
    filteredArray.forEach((x) => {
      listsFromStorage[2].tasks.push(x);
    });
  }
  let activeListIndex = localStorage.getItem("activeListIndex") || 0;
  if (
    listsFromStorage.length > activeListIndex &&
    listsFromStorage[activeListIndex].tasks
  ) {
    listsFromStorage[activeListIndex].tasks.sort((a, b) => {
      if (!a.checked && b.checked) {
        return -1; // a is unchecked, b is checked, so a comes before b
      } else if (a.checked && !b.checked) {
        return 1; // b is unchecked, a is checked, so b comes before a
      } else {
        return a.taskName.localeCompare(b.taskName); // compare taskName strings
      }
    });
  }
  localStorage.setItem("lists", JSON.stringify(listsFromStorage));
  listsFromStorage = JSON.parse(localStorage.getItem("lists")) || lists;
}

// localStorage.removeItem("showLeft");
if ((localStorage.getItem("showLeft") || true) === "true") {
  quickShortcuts.classList.add("hide-left");
  addNewList.classList.add("hide-left");
  leftSide.classList.add("hide-left-side");
  // leftSide.style.zIndex = "0";
  headIcon.classList.add("when-hide-left-head-icon");
  rightSide.classList.add("when-hide-left-right-side");
} else {
  quickShortcuts.classList.remove("hide-left");
  addNewList.classList.remove("hide-left");
  leftSide.classList.remove("hide-left-side");
  // leftSide.style.zIndex = "1";
  headIcon.classList.remove("when-hide-left-head-icon");
  rightSide.classList.remove("when-hide-left-right-side");
}

icon.addEventListener("click", () => {
  quickShortcuts.classList.toggle("hide-left");
  addNewList.classList.toggle("hide-left");
  leftSide.classList.toggle("hide-left-side");
  headIcon.classList.toggle("when-hide-left-head-icon");
  rightSide.classList.toggle("when-hide-left-right-side");

  // Invert the value of "showLeft" key in localStorage
  const showLeft = localStorage.getItem("showLeft") || true === "true";
  localStorage.setItem("showLeft", !showLeft);
  console.log(localStorage.getItem("showLeft"));
  if (leftSide.style.zIndex == "0") {
    leftSide.style.zIndex = "0";
  } else {
    leftSide.style.zIndex = "1";
  }
  // location.reload(true);
});

addButton.addEventListener("click", addNewListFromUser);
addButtonForTask.addEventListener("click", addNewTaskFromUser);

function addNewListFromUser() {
  // list object that have name from user and some values by default
  const myObj = {
    listName: newList.value.trim(),
    tasks: [],
    theme: "default",
    id: counter++,
    type: "user",
    isActive: false,
  };
  // update counter(list id) on local storage
  localStorage.setItem("counter", counter);
  if (myObj.listName === "") {
    return;
  }
  // add new list object to main array of lists
  listsFromStorage.push(myObj);
  // update main array into local storage
  localStorage.setItem("lists", JSON.stringify(listsFromStorage));
  newList.value = "";
  listsFromStorage = JSON.parse(localStorage.getItem("lists")) || lists;
  const index = listsFromStorage.length - 1;
  localStorage.setItem("activeListIndex", index);
  activeListIndex = index;
  printLists();
}

function addNewTaskFromUser() {
  // Get the active list from storage
  const activeListIndex = localStorage.getItem("activeListIndex") || 0;
  if (activeListIndex === null) {
    return;
  }
  const activeList = listsFromStorage[activeListIndex];

  // Get the task name and validate it
  const taskName = newTask.value.trim();
  if (taskName === "") {
    return;
  }

  // Create the task object
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  // add leading zero to month and day if they are less than 10
  const formattedMonth = month < 10 ? `0${month}` : month;
  const formattedDay = day < 10 ? `0${day}` : day;
  const currentDate = `${year}-${formattedMonth}-${formattedDay}`;
  let myObj = {
    id: taskCounter++,
    taskName,
    creationDate: currentDate,
    dueDate: "",
    important: false,
    note: "",
    attachment: "",
    valid: true,
    checked: false,
  };

  // Add the task object to the active list
  if (activeListIndex < 4) {
    if (activeListIndex == 0) {
      myObj.dueDate = currentDate;
    } else if (activeListIndex == 1) {
      myObj.important = true;
    }
    listsFromStorage[4].tasks.push(myObj);
  } else {
    activeList.tasks.push(myObj);
  }
  localStorage.setItem("taskCounter", taskCounter);

  // Update the lists in storage
  localStorage.setItem("lists", JSON.stringify(listsFromStorage));

  // Clear the input field
  newTask.value = "";

  // Print the updated list of tasks
  printTasks(listsFromStorage, activeList.tasks);
}

function printLists() {
  themeChanged();
  // const listsFromStorage = JSON.parse(localStorage.getItem("lists"));
  userListsContainer.innerHTML = "";
  for (const list of listsFromStorage.filter((L) => L.type !== "system")) {
    const newDiv = document.createElement("div");
    newDiv.classList.add("new-list", "icon-text", "list", `class${list.id}`);
    newDiv.id = `list${list.id}`;

    const newIcon = document.createElement("i");
    newIcon.classList.add("fa", "fa-list-ul");

    const newP = document.createElement("p");
    newP.classList.add("list-name");
    newP.innerHTML = list.listName;

    newDiv.appendChild(newIcon);
    newDiv.appendChild(newP);
    userListsContainer.appendChild(newDiv);
    // if (list.id == localStorage.getItem("activeListIndex") || 0) {
    //   newDiv.click();
    // }
  }
  addEvent();
}

function addEvent() {
  if (listsFromStorage.length > 0) {
    const allLists = document.querySelectorAll(".list");
    let activeList = null;
    // Retrieve the index of the last active list from local storage
    const index = parseInt(localStorage.getItem("activeListIndex") || 0);

    allLists.forEach((list, i) => {
      list.addEventListener("click", () => {
        if (activeList !== null) {
          activeList.classList.remove("active");
        }
        list.classList.add("active");
        activeList = list;
        const listId = parseInt(list.classList[3].match(/\d+/)[0]);
        // console.log(listId);

        const currentList = document.querySelector(".current-list input");
        if (activeListIndex <= 4) {
          currentList.readOnly = true;
        }
        const currentListObj = listsFromStorage.find((i) => i.id == listId);
        currentList.value = currentListObj.listName;
        currentListObj.isActive = true;

        for (const listObj of listsFromStorage) {
          if (listObj.id !== currentListObj.id) {
            listObj.isActive = false;
          }
        }
        if (i != (localStorage.getItem("activeListIndex") || 0)) {
          localStorage.setItem("activeTaskIndex", 0);
          location.reload(true);
        }
        localStorage.setItem("activeListIndex", i);
        themeChanged();
        printTasks(listsFromStorage, currentListObj.tasks);
        localStorage.setItem("lists", JSON.stringify(listsFromStorage));
        if (window.screen.width <= 768) {
          quickShortcuts.classList.add("hide-left");
          addNewList.classList.add("hide-left");
          leftSide.classList.add("hide-left-side");
          headIcon.classList.add("when-hide-left-head-icon");
          rightSide.classList.add("when-hide-left-right-side");
        }
      });

      // Set the activeList to the last active element
      if (i === index) {
        list.click();
      }
    });
  }
}

const detailsBox = document.querySelector(".details-box");

function printTasks(listsFromStorage, taskList) {
  updateAllTasksList();
  const tasksBox = document.querySelector(".tasks");
  tasksBox.innerHTML = "";
  if (taskList.length > 0) {
    taskList.forEach((task, index) => {
      if (task.valid) {
        const div = createTaskElement(task);
        const deleteTask = () => {
          taskList = taskList.filter((item) => item.id !== task.id);
          updateLocalStorage(listsFromStorage, taskList);
          div.remove();
          for (let i = 4; i < listsFromStorage.length; i++) {
            listsFromStorage[i].tasks = listsFromStorage[i].tasks.filter(
              (item) => item.id !== task.id
            );
          }
          localStorage.setItem("lists", JSON.stringify(listsFromStorage));
          listsFromStorage = JSON.parse(localStorage.getItem("lists")) || lists;
          printTasks(listsFromStorage, taskList);
          location.reload(true);
        };
        // delete task
        const delIcon = div.querySelector(".x-icon-for-task");
        delIcon.addEventListener("click", deleteTask);

        const handleClick = (event) => {
          localStorage.setItem("activeTaskId", parseInt(task.id));
          localStorage.setItem("activeTaskIndex", index);
          let activeTaskId = localStorage.getItem("activeTaskId");
          // reset background color of all tasks
          const taskElements = document.querySelectorAll(".task");
          taskElements.forEach((taskElement) => {
            taskElement.style.backgroundColor = "transparent";
          });
          // change background color of clicked task
          if (parseInt(div.classList[1].match(/\d+/)[0]) == activeTaskId) {
            div.style.backgroundColor = "var(--section-background-alt)";
          } else {
            div.style.backgroundColor = "transparent";
          }
          if (window.screen.width <= 768) {
            // Show details box on small screens
            detailsBox.style.display = "block";
            document.querySelector(".container").style.gridTemplateColumns =
              "auto";
          } else {
            // show details box on large screens when click on task
            detailsBox.style.display = "block";
            document.querySelector(".container").style.gridTemplateColumns =
              "1fr 1fr";
          }
          populateDetailsBox(task);
          const checkbox = div.querySelector("input");
          checkbox.addEventListener("change", function () {
            if (this.checked) {
              // Checkbox is checked
              console.log("Checkbox is checked");
              listsFromStorage.forEach((ii) => {
                ii.tasks.forEach((iii) => {
                  if (iii.id == task.id) {
                    iii.checked = true;
                  }
                });
              });
            } else {
              // Checkbox is unchecked
              console.log("Checkbox is unchecked");
              listsFromStorage.forEach((ii) => {
                ii.tasks.forEach((iii) => {
                  if (iii.id == task.id) {
                    iii.checked = false;
                  }
                });
              });
            }
            // listsFromStorage[activeListIndex].tasks.sort((a, b) => {
            //   if (!a.checked && b.checked) {
            //     return -1; // a is unchecked, b is checked, so a comes before b
            //   } else if (a.checked && !b.checked) {
            //     return 1; // b is unchecked, a is checked, so b comes before a
            //   } else {
            //     return a.taskName.localeCompare(b.taskName); // compare taskName strings
            //   }
            // });
            localStorage.setItem("lists", JSON.stringify(listsFromStorage));
            if (window.screen.width > 768) {
              setTimeout(() => {
                location.reload(true);
              }, 200); // Delay of 0.2 second (200 milliseconds)
            } else {
              detailsBox.style.display = "none";
              location.reload(true);
            }
          });
        };
        div.addEventListener("click", handleClick);
        tasksBox.appendChild(div);
        if (
          index == localStorage.getItem("activeTaskIndex") &&
          taskList.length > 0 &&
          window.screen.width > 768
        ) {
          div.click();
          detailsBox.style.display = "block";
          document.querySelector(".container").style.gridTemplateColumns =
            "1fr 1fr";
        } else if (taskList.length == 0) {
          detailsBox.style.display = "none";
          document.querySelector(".container").style.gridTemplateColumns =
            "auto";
        }
      }
    });
  } else {
    detailsBox.style.display = "none";
    document.querySelector(".container").style.gridTemplateColumns = "auto";
  }
}

const detailsInput = document.querySelector(".details .name input");
// Save original task name
detailsInput.addEventListener("input", () => {
  let activeTaskId = localStorage.getItem("activeTaskId") || 0;
  let activeTaskIndex = localStorage.getItem("activeTaskIndex") || 0;

  const originalTaskName =
    listsFromStorage[activeListIndex].tasks[activeTaskIndex].taskName;
  // detailsInput.value = originalTaskName; // Assign original value to input

  const newTaskName = detailsInput.value.trim();
  if (newTaskName !== "" && newTaskName !== originalTaskName) {
    listsFromStorage[activeListIndex].tasks[activeTaskIndex].taskName =
      newTaskName;
    listsFromStorage.forEach((it) => {
      it.tasks.forEach((tt) => {
        if (tt.id == activeTaskId) {
          tt.taskName = newTaskName;
        }
      });
    });
    localStorage.setItem("lists", JSON.stringify(listsFromStorage));
    const myNewArray = document.querySelectorAll(".task");
    myNewArray.forEach((div) => {
      if (parseInt(div.classList[1].match(/\d+/)[0]) == activeTaskId) {
        div.querySelector("label").textContent = newTaskName; // Update task name in last clicked task element
      }
    });
    populateDetailsBox(
      listsFromStorage[activeListIndex].tasks[activeTaskIndex]
    );
    printTasks(listsFromStorage, listsFromStorage[activeListIndex].tasks);
    // location.reload(true);
  }
});
const dueDateInput = document.querySelector(".details .short input");
dueDateInput.addEventListener("input", () => {
  let activeTaskId = localStorage.getItem("activeTaskId") || 0;
  let activeTaskIndex = localStorage.getItem("activeTaskIndex") || 0;
  if (
    listsFromStorage[activeListIndex].tasks[activeTaskIndex].id == activeTaskId
  ) {
    listsFromStorage[activeListIndex].tasks[activeTaskIndex].dueDate =
      dueDateInput.value;
    listsFromStorage.forEach((it) => {
      it.tasks.forEach((tt) => {
        if (tt.id == activeTaskId) {
          tt.dueDate = dueDateInput.value;
        }
      });
    });
    localStorage.setItem("lists", JSON.stringify(listsFromStorage));
    populateDetailsBox(
      listsFromStorage[activeListIndex].tasks[activeTaskIndex]
    );
    printTasks(listsFromStorage, listsFromStorage[activeListIndex].tasks);
    // location.reload(true);
  }
});

const noteTextarea = document.querySelector(".note textarea");
noteTextarea.addEventListener("input", () => {
  let activeTaskId = localStorage.getItem("activeTaskId") || 0;
  let activeTaskIndex = localStorage.getItem("activeTaskIndex") || 0;
  if (
    listsFromStorage[activeListIndex].tasks[activeTaskIndex].id ==
      activeTaskId &&
    noteTextarea.value !== ""
  ) {
    listsFromStorage[activeListIndex].tasks[activeTaskIndex].note =
      noteTextarea.value;
    listsFromStorage.forEach((it) => {
      it.tasks.forEach((tt) => {
        if (tt.id == activeTaskId) {
          tt.note = noteTextarea.value;
        }
      });
    });
    localStorage.setItem("lists", JSON.stringify(listsFromStorage));
    populateDetailsBox(
      listsFromStorage[activeListIndex].tasks[activeTaskIndex]
    );
    printTasks(listsFromStorage, listsFromStorage[activeListIndex].tasks);
    // location.reload(true);
  }
});

const setImportant = document.querySelector(".important i");
setImportant.addEventListener("click", () => {
  let activeTaskId = localStorage.getItem("activeTaskId") || 0;
  let activeTaskIndex = localStorage.getItem("activeTaskIndex") || 0;
  if (
    listsFromStorage[activeListIndex].tasks[activeTaskIndex].id == activeTaskId
  ) {
    listsFromStorage[activeListIndex].tasks[activeTaskIndex].important =
      !listsFromStorage[activeListIndex].tasks[activeTaskIndex].important;
    listsFromStorage.forEach((it) => {
      it.tasks.forEach((tt) => {
        if (tt.id == activeTaskId) {
          tt.important =
            listsFromStorage[activeListIndex].tasks[activeTaskIndex].important;
        }
      });
    });

    localStorage.setItem("lists", JSON.stringify(listsFromStorage));
    populateDetailsBox(
      listsFromStorage[activeListIndex].tasks[activeTaskIndex]
    );
    printTasks(listsFromStorage, listsFromStorage[activeListIndex].tasks);
    location.reload(true);
  }
});

function createTaskElement(task) {
  const div = document.createElement("div");
  div.classList.add("task", `task${task.id}`);

  const taskdiv = document.createElement("div");
  const input = document.createElement("input");
  input.type = "checkbox";
  input.name = `task${task.id}`;
  input.id = `task${task.id}`;
  // if (task.checked == true) {}
  input.checked = task.checked;

  const label = document.createElement("label");
  label.textContent = task.taskName;
  label.htmlFor = `task${task.id}`;

  const delIcon = document.createElement("div");
  delIcon.classList.add("x-icon-for-task");

  taskdiv.style.marginTop = "10px";
  taskdiv.append(input, label, delIcon);

  const timediv = document.createElement("div");
  timediv.classList.add("time");
  let listNameText = "";
  let listDateText = "";
  if (activeListIndex < 4) {
    // const link = document.createElement("a");
    listsFromStorage = JSON.parse(localStorage.getItem("lists"));
    for (let l = 4; l < listsFromStorage.length; l++) {
      listsFromStorage[l].tasks.forEach((t) => {
        if (task.id == t.id) {
          // link.innerHTML = listsFromStorage[l].listName;
          listNameText = listsFromStorage[l].listName;
          // link.setAttribute("href", `#list${listsFromStorage[l].id}`);
        }
      });
    }
    if (task.dueDate != "") {
      listDateText = task.dueDate;
      timediv.innerHTML = listNameText + " > " + listDateText;
      div.append(taskdiv, timediv);
    } else {
      timediv.innerHTML = listNameText;
      div.append(taskdiv, timediv);
    }
  } else {
    timediv.innerHTML = task.dueDate;
    if (task.dueDate != "") {
      div.append(taskdiv, timediv);
    } else {
      div.append(taskdiv);
    }
  }
  return div;
}

function populateDetailsBox(task) {
  const detailsInput = document.querySelector(".details .name input");
  const dueDateInput = document.querySelector(".details .short input");
  const noteTextarea = document.querySelector(".note textarea");
  const attachment = document.querySelector(".attachment label");
  const setImportant = document.querySelector(".important i");

  detailsInput.value = task.taskName;
  dueDateInput.value = task.dueDate;
  noteTextarea.value = task.note;
  setImportant.style.color = task.important
    ? "var(--main-color-alt)"
    : "inherit";
}

function updateLocalStorage(listsFromStorage, taskList) {
  const activeListIndex = localStorage.getItem("activeListIndex") || 0;
  listsFromStorage[activeListIndex].tasks = taskList;
  localStorage.setItem("lists", JSON.stringify(listsFromStorage));
}

printLists();

// const listsFromStorage = JSON.parse(localStorage.getItem("lists"));
listsFromStorage.forEach((i) => {
  if (i.isActive == "yes") {
    printTasks(listsFromStorage, i.tasks);
  }
});
localStorage.setItem("lists", JSON.stringify(listsFromStorage));

const searchp = document.querySelector(".search-icon p");
const searchIcon = document.querySelector(".search-icon i");
const searchform = document.querySelector(".search-icon form");
const searchInput = document.querySelector(".search-icon input");

searchIcon.addEventListener("click", () => {
  searchInput.classList.toggle("when-show-search-input");
  if (searchInput.classList.contains("when-show-search-input")) {
    searchform.style.width = "fit-content";
    searchform.style.height = "fit-content";
    searchInput.style.width = "250px";
    searchInput.style.paddingLeft = "10px";
  } else {
    // searchform.style.width = "0px";
    searchInput.style.width = "0px";
    searchInput.style.padding = "10px 0px";
  }
});
searchp.addEventListener("click", () => {
  searchInput.classList.toggle("when-show-search-input");
  if (searchInput.classList.contains("when-show-search-input")) {
    searchform.style.width = "fit-content";
    searchform.style.height = "fit-content";
    searchInput.style.width = "250px";
    searchInput.style.paddingLeft = "10px";
  } else {
    // searchform.style.width = "0px";
    searchInput.style.width = "0px";
    searchInput.style.padding = "10px 0px";
  }
});
searchInput.addEventListener("input", handleSearch);
searchInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    handleSearch();
  }
});

const showAll = document.querySelector(".showAll");
function handleSearch() {
  const activeListIndex = localStorage.getItem("activeListIndex") || 0;
  const tasks = listsFromStorage[activeListIndex].tasks;
  tasks.forEach((task) => {
    task.valid = true;
  });
  const searchValue = searchInput.value;
  if (searchValue !== "") {
    tasks.forEach((task) => {
      if (!task.taskName.includes(searchValue)) {
        task.valid = false;
      }
    });
    showAll.style.display = "block";
  }
  localStorage.setItem("lists", JSON.stringify(listsFromStorage));
  printTasks(listsFromStorage, listsFromStorage[activeListIndex].tasks);
}

// const activeListIndex = localStorage.getItem("activeListIndex");
const list = listsFromStorage[activeListIndex];
if (list && list.tasks) {
  const tasks = list.tasks;
  tasks.forEach((task) => {
    if (task.valid === false) {
      showAll.style.display = "block";
    }
  });
}

showAll.addEventListener("click", showAllTasks);
function showAllTasks() {
  const activeListIndex = localStorage.getItem("activeListIndex") || 0;
  const tasks = listsFromStorage[activeListIndex].tasks;
  tasks.forEach(function (task) {
    if (task.valid == false) {
      task.valid = true;
    }
  });
  localStorage.setItem("lists", JSON.stringify(listsFromStorage));
  printTasks(listsFromStorage, listsFromStorage[activeListIndex].tasks);
  showAll.style.display = "none";
}

const closeDetails = document.getElementById("close");
closeDetails.addEventListener("click", () => {
  const detailsBox = document.querySelector(".details-box");
  detailsBox.style.display = "none";
  document.querySelector(".container").style.gridTemplateColumns = "auto";
});

const sortIcon = document.querySelector(".sort-icon");
const sortOptions = document.querySelector(".sort-options");
const moreOptions = document.querySelector(".more-options");
const listOptions = document.querySelector(".list-options");

sortIcon.addEventListener("click", (event) => {
  event.stopPropagation();
  if (sortOptions.style.display == "none") {
    sortOptions.style.display = "block";
  } else {
    sortOptions.style.display = "none";
  }
  listOptions.style.display = "none";
});

moreOptions.addEventListener("click", (event) => {
  event.stopPropagation();
  sortOptions.style.display = "none";
  if (listOptions.style.display == "none") {
    listOptions.style.display = "block";
  } else {
    listOptions.style.display = "none";
  }
  if (activeListIndex <= 4) {
    listOptions.querySelector(".renameList").style.display = "none";
    listOptions.querySelector(".deleteList").style.display = "none";
  }
});

const sortOpt = document.querySelectorAll(".sort-options > div");
sortOpt.forEach((op) => {
  op.addEventListener("click", (event) => {
    document
      .querySelector(".dueDateSort")
      .querySelector("div")
      .classList.remove("active-sort-mode");
    document
      .querySelector(".creationDateSort")
      .querySelector("div")
      .classList.remove("active-sort-mode");
    document
      .querySelector(".alphabeticalSort")
      .querySelector("div")
      .classList.remove("active-sort-mode");
    const activeListIndex = localStorage.getItem("activeListIndex") || 0;
    let sortby;
    let temp = listsFromStorage[activeListIndex].tasks;
    if (event.target.classList[0] == "dueDateSort") {
      event.target.querySelector("div").classList.add("active-sort-mode");

      sortby = "dueDate";
      // temp.sort((a, b) => {
      //   if (a.dueDate === "" && b.dueDate === "") {
      //     return 0; // both tasks have empty dueDate, so they are equal
      //   } else if (a.dueDate === "") {
      //     return 1; // task a has empty dueDate, so it comes after task b
      //   } else if (b.dueDate === "") {
      //     return -1; // task b has empty dueDate, so it comes after task a
      //   } else {
      //     return a.dueDate.localeCompare(b.dueDate); // compare dueDate strings
      //   }
      // });
      temp.sort((a, b) => {
        if (!a.checked && b.checked) {
          return -1; // a is unchecked, b is checked, so a comes before b
        } else if (a.checked && !b.checked) {
          return 1; // b is unchecked, a is checked, so b comes before a
        } else {
          if (a.dueDate === "" && b.dueDate === "") {
            return 0; // both tasks have empty dueDate, so they are equal
          } else if (a.dueDate === "") {
            return 1; // task a has empty dueDate, so it comes after task b
          } else if (b.dueDate === "") {
            return -1; // task b has empty dueDate, so it comes after task a
          } else {
            return a.dueDate.localeCompare(b.dueDate); // compare dueDate strings
          }
        }
      });
    } else if (event.target.classList[0] == "creationDateSort") {
      event.target.querySelector("div").classList.add("active-sort-mode");
      sortby = "creationDate";
      temp.sort((a, b) => {
        if (!a.checked && b.checked) {
          return -1;
        } else if (a.checked && !b.checked) {
          return 1;
        } else {
          if (a.creationDate === "" && b.creationDate === "") {
            return 0;
          } else if (a.creationDate === "") {
            return 1;
          } else if (b.creationDate === "") {
            return -1;
          } else {
            return a.creationDate.localeCompare(b.creationDate);
          }
        }
      });
    } else if (event.target.classList[0] == "alphabeticalSort") {
      sortby = "alphabetical";
      event.target.querySelector("div").classList.add("active-sort-mode");
      // temp.sort((a, b) => a.taskName.localeCompare(b.taskName));
      temp.sort((a, b) => {
        if (!a.checked && b.checked) {
          return -1; // a is unchecked, b is checked, so a comes before b
        } else if (a.checked && !b.checked) {
          return 1; // b is unchecked, a is checked, so b comes before a
        } else {
          return a.taskName.localeCompare(b.taskName); // compare taskName strings
        }
      });
    }
    // else {
    //   temp.sort((a, b) => new Date(a.creationDate) - new Date(b.creationDate));
    //   sortby = "creation";
    // }
    console.log(sortby);
    printTasks(listsFromStorage, temp);
  });
});

const listOptDivs = document.querySelectorAll(".list-options .main-opt");
const colors = document.querySelector(".colors");
const setTheme = document.querySelector(".setTheme");
const renameList = document.querySelector(".renameList");
const deleteList = document.querySelector(".deleteList");

setTheme.addEventListener("click", (event) => {
  colors.style.display = "flex";
});

const inputForListRename = document
  .querySelector(".current-list")
  .querySelector("input");
renameList.addEventListener("click", (event) => {
  if (activeListIndex > 4) {
    inputForListRename.focus();
  }
});

inputForListRename.addEventListener("input", () => {
  const activeListIndex = localStorage.getItem("activeListIndex") || 0;
  if (activeListIndex > 4) {
    const newListName = inputForListRename.value.trim();
    if (
      newListName != "" &&
      newListName != listsFromStorage[activeListIndex].listName
    ) {
      listsFromStorage[activeListIndex].listName = newListName;
      localStorage.setItem("lists", JSON.stringify(listsFromStorage));
      printLists();
    }
  }
});

function confirmDelete() {
  const confirmation = confirm(
    `Are you sure you want to delete this list?\n"You won't be able to undo this action"`
  );
  if (confirmation === true) {
    const activeListIndex = localStorage.getItem("activeListIndex") || 0;
    if (activeListIndex > 4) {
      listsFromStorage.splice(activeListIndex, 1);
      localStorage.setItem("activeListIndex", 0);
      localStorage.setItem("lists", JSON.stringify(listsFromStorage));
      printLists();
      console.log("List deleted!");
    }
  } else {
    // User clicked cancel, do nothing
    console.log("List deletion cancelled.");
  }
}

deleteList.addEventListener("click", confirmDelete);

const colorsDivs = document.querySelectorAll(".colors div");
colorsDivs.forEach((i) => {
  i.addEventListener("click", (event) => {
    const activeListIndex = localStorage.getItem("activeListIndex") || 0;
    if (event.target.classList[0] == "default") {
      listsFromStorage[activeListIndex].theme = "default";
    } else if (event.target.classList[0] == "red") {
      listsFromStorage[activeListIndex].theme = "red";
    } else if (event.target.classList[0] == "green") {
      listsFromStorage[activeListIndex].theme = "green";
    } else if (event.target.classList[0] == "yellow") {
      listsFromStorage[activeListIndex].theme = "yellow";
    }
    localStorage.setItem("lists", JSON.stringify(listsFromStorage));
    themeChanged();
    printLists();
  });
});

function themeChanged() {
  const activeListIndex =
    parseInt(localStorage.getItem("activeListIndex")) || 0;
  const activeList = listsFromStorage[activeListIndex];
  if (activeList && activeList.theme) {
    if (activeList.theme == "default") {
      document.documentElement.style.setProperty("--main-color", "#19a7ce");
      document.documentElement.style.setProperty("--main-color-alt", "#146c94");
      document.documentElement.style.setProperty(
        "--section-background-alt",
        "#19a7ce0d"
      );
    } else if (activeList.theme == "red") {
      document.documentElement.style.setProperty("--main-color", "#dd5353e0");
      document.documentElement.style.setProperty("--main-color-alt", "#df2e38");
      document.documentElement.style.setProperty(
        "--section-background-alt",
        "#dd53530f"
      );
    } else if (activeList.theme == "green") {
      document.documentElement.style.setProperty("--main-color", "#5f8d4e");
      document.documentElement.style.setProperty("--main-color-alt", "#285430");
      document.documentElement.style.setProperty(
        "--section-background-alt",
        "#5f8d4e17"
      );
    } else if (activeList.theme == "yellow") {
      document.documentElement.style.setProperty("--main-color", "#f2cd5c");
      document.documentElement.style.setProperty("--main-color-alt", "#f2921d");
      document.documentElement.style.setProperty(
        "--section-background-alt",
        "#ffeb3b17"
      );
    }
  }
}

document.addEventListener("click", (event) => {
  const target = event.target;
  if (
    target !== sortIcon &&
    target !== moreOptions &&
    target !== sortOptions &&
    target !== listOptions &&
    target !== setTheme
  ) {
    sortOptions.style.display = "none";
    listOptions.style.display = "none";
    colors.style.display = "none";
  }
});

if (window.screen.width <= 768) {
  document.querySelector(".current-list").classList.add("current-list-small");
  document.querySelector(".right-side").style.padding = "0px";
  document.querySelector(".right-side").style.margin = "30px";
  document.querySelector(".current-list > input").style.width = "200px";
}
