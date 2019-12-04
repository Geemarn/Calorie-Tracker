//http controller mode
const Http = (function() {
  //make http GET request
  async function get(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  //make http POST request
  async function post(url, data) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    return result;
  }

  //make http PUT request
  async function update(url, data) {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    return result;
  }

  //make http DELETE request
  async function DELETE(url) {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "content-type": "application/json"
      }
    });

    const result = (await response) || "resource deleted...";
    return result;
  }

  return {
    getItems: function(url) {
      return get(url);
    },
    postItem: function(url, data) {
      return post(url, data);
    },
    updateItem: function(url, data) {
      return update(url, data);
    },
    deleteItem: function(url, data) {
      return DELETE(url, data);
    }
  };
})();

//Item controller module
const ItemCtrl = (function() {
  return {
    ////get items////
    getItems: function getItems() {
      Http.getItems("http://localhost:3000/items")
        .then(items => {
          if (items.length > 0) {
            UICtrl.showData(items);
          } else {
            UICtrl.noListItem();
          }
        })
        .catch(err => console.log(err));
    },
    ////add item////
    submitItem: function() {
      //item values from DOM
      const nameVal = document.querySelector("#item-name").value;
      const calorieVal = document.querySelector("#item-calories").value;
      const id = document.querySelector("#id").value;

      //item object
      const itemVal = {
        name: nameVal,
        calorie: parseInt(calorieVal)
      };

      //check if there is an input
      if (nameVal !== "" && calorieVal !== "") {
        ///check if there is an id
        if (id === "") {
          //post request to save items
          Http.postItem("http://localhost:3000/items", itemVal)
            .then(data => {})
            .catch(err => console.log(err));
        } else {
          //edit request to save item
          Http.updateItem(`http://localhost:3000/items/${id}`, itemVal)
            .then(data => {})
            .catch(err => console.log(err));
        }
      } else {
        //if no input
        document.querySelector("#item-name").style.borderColor = "red";
        document.querySelector("#item-calories").style.borderColor = "red";
        document.querySelector(".item").textContent = "Input field(s) required";
      }
    },
    ////sum calories////
    sumCals: function() {
      ////get items////
      Http.getItems("http://localhost:3000/items")
        .then(items => {
          let totalCal = 0;
          calorie = parseInt(items.calorie);
          items.forEach(val => {
            totalCal += val.calorie;
          });
          UICtrl.showTotalCal(totalCal);
        })
        .catch(err => console.log(err));
    },
    deleteItem: function(id) {
      //delete item request
      Http.deleteItem(`http://localhost:3000/items/${id}`)
        .then(data => {
          document.querySelector(".edit-text").textContent = "Item deleted....";
          document.querySelector(".edit-text").style.color = "green";
        })
        .catch(err => console.log(err));
    },
    clearItems: function() {
      Http.deleteItem("http://localhost:3000/itemss")
        .then(items => {
          console.log("items cleared....");
        })
        .catch(err => console.log(err));
    }
  };
})();

//UI controller module
const UICtrl = (function() {
  return {
    showData: function(items) {
      //show data items
      let UIdata = "";
      items.forEach(item => {
        UIdata += `
        <li class="collection-item " id="${item.id}">
            <strong id= "name">${item.name}</strong> - <em>${item.calorie}</em><em class= "green-text text-darken-3"> calories</em>
            <a href="#" class="secondary-content">
              <i class="fa fa-pencil edit-item"></i>
            </a>
          </li>
        `;
      });
      document.querySelector("#item-list").innerHTML = UIdata;
    },
    clearFields: function() {
      (document.querySelector("#item-name").value = ""),
        (document.querySelector("#item-calories").value = "");
    },
    noListItem: function() {
      const listItem = document.querySelector(".no-list-item");
      document.querySelector("#item-list").style.display = "none";
      listItem.innerHTML =
        "<p class= 'red-text text-lighten-2 center padding'>*** You have not added any meal / food item ***</p>";
    },
    showTotalCal: function(totalCal) {
      document.querySelector(".total-calories").textContent = totalCal;
    },
    fillEditForm: function(editItem) {
      document.querySelector("#item-name").value = editItem.name;
      document.querySelector("#item-calories").value = editItem.calories;
      document.querySelector("#id").value = editItem.id;

      //change button on edit
      this.changeEditButton("edit");
    },
    changeEditButton: function(type) {
      const addbtn = document.querySelector(".add-btn");
      const editText = document.querySelector(".edit-text");
      const itemName = document.querySelector("#item-name");
      const itemCalories = document.querySelector("#item-calories");

      if (type === "edit") {
        addbtn.textContent = "UPDATE MEAL";
        addbtn.className = "add-btn btn orange";
        editText.textContent = "edit text";
        editText.style.color = "orange";
        itemName.style.borderColor = "orange";
        itemCalories.style.borderColor = "orange";

        //check if there is already a delete button
        if (!document.querySelector(".delete-btn")) {
          const button = document.createElement("button");
          button.innerHTML = "<i class= 'fa fa-remove'></i>";
          button.className = "delete-btn btn red";
          //add text to button
          button.appendChild(document.createTextNode("DELETE MEAL"));

          //get parent div
          const row = document.querySelector(".row");
          //get tag to insert before
          const backbtn = document.querySelector(".back-btn");

          row.insertBefore(button, backbtn);

          //include back button
          document.querySelector("#back-btn").style.display = "inline-block";
        }
      } else {
        addbtn.innerHTML = '<i class="fa fa-plus"></i> Add Meal';

        //addbtn.textContent = "ADD MEAL";
        addbtn.className = "add-btn btn teal darken-3";
        editText.textContent = "";
        itemName.style.borderColor = "gray";
        itemCalories.style.borderColor = "gray";

        //remove delete button and hide back button
        if (document.querySelector(".delete-btn")) {
          document.querySelector(".delete-btn").remove();
        }
        document.querySelector("#back-btn").style.display = "none";
      }
    },
    goBack: function() {
      this.changeEditButton("addbtn");
      this.clearFields();
    }
  };
})();

//App controller
const App = (function(ItemCtrl, UICtrl) {
  //load event listener
  function LoadEvents() {
    //add / edit data item listener
    document.querySelector(".add-btn").addEventListener("click", submitItem);
    //edit form state listener
    document.querySelector("#item-list").addEventListener("click", editState);
    //delete listener button
    document.querySelector(".row").addEventListener("click", deleteItem);
    //back listener button
    document.querySelector("#back-btn").addEventListener("click", backBtn);
    //clear items listener button
    document.querySelector(".clear-btn").addEventListener("click", clearAll);
  }

  /// get item ////
  function getItems() {
    ItemCtrl.getItems();
  }

  //// add item /////
  function submitItem(e) {
    e.preventDefault();

    //call add items
    ItemCtrl.submitItem();

    //clear input fields
    UICtrl.clearFields();
  }

  //// sum calories and display////
  function sumCalories() {
    //sum calories
    ItemCtrl.sumCals();
  }

  //// edit state fields ////
  function editState(e) {
    if (e.target.classList.contains("edit-item")) {
      const id = e.target.parentElement.parentElement.id;
      const name =
        e.target.parentElement.previousElementSibling.previousElementSibling
          .previousElementSibling.textContent;
      const calories =
        e.target.parentElement.previousElementSibling.previousElementSibling
          .textContent;

      const editItem = {
        id,
        name,
        calories
      };
      UICtrl.fillEditForm(editItem);
    }
  }

  //// delete item ////
  function deleteItem(e) {
    e.preventDefault();
    if (e.target.classList.contains("delete-btn")) {
      const id = e.target.previousElementSibling.previousElementSibling.value;
      ItemCtrl.deleteItem(id);
    }
  }

  /// back button func////
  function backBtn(e) {
    e.preventDefault();
    UICtrl.goBack();
  }

  /// clear button func
  function clearAll(e) {
    e.preventDefault();
    if (confirm("Are you sure you want to delete all menu?"))
      ItemCtrl.clearItems();
  }

  return {
    init: function() {
      getItems();

      //sum calories
      sumCalories();

      //load event listener
      LoadEvents();
    }
  };
})(ItemCtrl, UICtrl);

App.init();
