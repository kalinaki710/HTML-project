
      let text = localStorage.getItem("parentInputIDJson");
      let parentInputID = Number(JSON.parse(text));
      if (parentInputID == 0){
        parentInputID = 1;
      }
      text = localStorage.getItem("parentListIDJson");
      let parentListID = Number(JSON.parse(text));
      if (parentListID == 0){
        parentListID = -1;
      }

      text = localStorage.getItem("Json");
      let jsonID = Number(JSON.parse(text));

      //localStorage.clear();
  

      function makeCollapsable(element){
          element.style.display = (element.style.display === "block" ? "none" : "block");
      }

      function tickCheckbox(element, child){
        element.style.background = (element.style.background === "green" ? "#eee" : "green");
        child.checkboxColor = element.style.background
      }

      function Parent(value,inputID, listID, jsonID){
        this.value = value;
        this.inputID = inputID;
        this.listID = listID;
        this.children = [];
        this.jsonID = jsonID;
        this.childIndex = 0;
      }

      function Child(element, input, checkboxColor, quantity){
        this.element = element;
        this.input = input;
        this.checkboxColor = checkboxColor
        this.quantity = quantity
        this.val = ""
      }

      function constructParent(value){
        let parent = new Parent(value,parentInputID.toString(), parentListID.toString(), jsonID.toString());
        parentInputID += 1
        parentListID -= 1
        const parentListIDJson = JSON.stringify(parentListID);
        localStorage.setItem("parentListIDJson", parentListIDJson);
        const parentInputIDJson = JSON.stringify(parentInputID);
        localStorage.setItem("parentInputIDJson", parentInputIDJson);
        parent.getContent = function(){
          return createMarkUpForParent(this.value,this.listID, this.inputID)
        }
        parent.displayAllChildren = function(){
          element = document.getElementById(parent.listID);
          parent.children.forEach(function (item, index) {
            reCreateChild(item,element, parent)
          });

        }
        return parent
      }

      function constructChild(element, input){
        let child = new Child(element, input, "#eee", "0");
        child.makeCheckobox = function(){
          addCheckBox(this.element, this)
        }
        child.addDeleteButton = function(){
          addDeleteBtn(this.element)
        }
        child.addLabel = function(){
          value = document.getElementById(this.input).value;
          this.label = addLabel(this.element, value)
        }
        child.addQuantity =  function(){
          this.quantity = addQuantity(this.element)
        }
        child.addEditButton = function(){
          addEditBtn(this.element, this.label, this.quantity, this, this.childIndex)
        }
        return child
      }

      function createMarkUpForParent(value,listID,inputID){
        return `
          <button type="button" class="button" onclick="makeCollapsable(this.nextElementSibling)">&#9660; ${value}</button>
          <ul class="ListChildItemNonBullets" id="${listID}">
            <input type="text" id="${inputID}" class = "newItemInput"><br>
          </ul>
        `;
      }

      function createParent(value){
        jsonID += 1
        const Json = JSON.stringify(jsonID);
        localStorage.setItem("Json", Json);
        const ul = document.getElementsByClassName("ListParentItemNonBullets")[0]
        const li = document.createElement("li");
        li.classList.add("ListParentItemNonBullets");
        ul.appendChild(li);

        const parent = constructParent(value);
        li.innerHTML= parent.getContent();
        const insertBtn = document.createElement("button");
        insertBtn.classList.add("btn-primary");
        insertBtn.innerHTML = "Insert";
        insertBtn.addEventListener("click",function(){addChildIfPossible(parent)})
        element = document.getElementById(parent.listID);
        element.appendChild(insertBtn);
        const myJSON = JSON.stringify(parent);
        localStorage.setItem(jsonID.toString(), myJSON);
        return parent
      }

      function addCheckBox(newItem, child){
        const checkmarkCircle = document.createElement("span");
        checkmarkCircle.className = "circle";
        checkmarkCircle.style.background = "#eee"
        checkmarkCircle.addEventListener("click",function(){tickCheckbox(checkmarkCircle, child)})
        const checkmarkTick = document.createElement("span");
        checkmarkTick.className = "tick";
        newItem.appendChild(checkmarkCircle);
        newItem.appendChild(checkmarkTick);
      }

        function edit(label, quantity, child, parent, index){
          if (label.style.display != "none"){
            label.style.display = "none";
            textBox = document.createElement("input");
            textBox.type = "input";
            textBox.className = "newItemInput";
            textBox.value = label.innerHTML;
            label.parentNode.insertBefore(textBox, label);
            quantity.style.display = "inline";
            quantity.removeAttribute("readonly");
          }else {
            label.style.display = "inline";
            textBox = label.previousElementSibling;
            label.innerHTML = textBox.value
            textBox.remove();
            if (quantity.value == 0) {
              quantity.style.display = "none";
            }
            quantity.setAttribute("readonly", "true");
            child.val = label.innerHTML
            child.quantity = quantity.value
            parent.children[index] = child
            const myJSON = JSON.stringify(parent);
            localStorage.setItem(parent.jsonID.toString(), myJSON);
          }
        }

        function addEditBtn(newItem, label, quantity, child, parent, index){
          const editButton = document.createElement("button");
          editButton.innerHTML = "Edit";
          editButton.addEventListener("click",function(){edit(label, quantity, child, parent, index)})
          newItem.appendChild(editButton);
        }

        function addChildIfPossible(parent){
          input = document.getElementById(parent.inputID);
          element = document.getElementById(parent.listID);
          if(input.value === ""){
            alert("Enter the list name please!!!");
          }else{
            addChild(parent)
          }
        }

        function addChild(parent){
          parent.childIndex += 1
          input = document.getElementById(parent.inputID);
          element = document.getElementById(parent.listID);
          const newItem = document.createElement("li");
          newItem.classList.add("listItem");
          
          let child = constructChild(newItem, parent.inputID)
          child.addLabel(newItem, input.value)
          child.val = input.value
          child.makeCheckobox()
          child.addQuantity()
          child.addDeleteButton()
          child.addEditButton()
          element.appendChild(newItem)
          parent.children.push(child)
          const myJSON = JSON.stringify(parent);
          localStorage.setItem(parent.jsonID.toString(), myJSON);
          
        }

        function reCreateChild(child, element, parent, index){
          const newItem = document.createElement("li");
          newItem.classList.add("listItem");
          const label = addLabel(newItem, child.val)
          const checkmarkCircle = document.createElement("span");
          checkmarkCircle.className = "circle";
          checkmarkCircle.addEventListener("click",function(){tickCheckbox(checkmarkCircle, child)})
          const checkmarkTick = document.createElement("span");
          checkmarkTick.className = "tick";
          checkmarkCircle.style.background = child.checkboxColor
          newItem.appendChild(checkmarkCircle);
          newItem.appendChild(checkmarkTick);

          const quantity = addQuantity(newItem)
          quantity.value = child.quantity
          if (quantity.value != 0){
            quantity.style.display = "inline"
          }

          addDeleteBtn(newItem)
          addEditBtn(newItem, label, quantity, child, parent, index)
          
          element.appendChild(newItem)
        }

        function addLabel(newItem, value){
          let label = document.createElement("label");
          label.innerHTML = value;
          label.setAttribute("readonly", "true");
          newItem.appendChild(label);
          return label
        }

        function addQuantity(newItem){
          const quantity = document.createElement("input");
          quantity.type = "number";
          quantity.style.display = "none"
          newItem.appendChild(quantity);
          return quantity;
        }

        function addDeleteBtn(newItem){
          const deleteButton = document.createElement("button");
          deleteButton.innerHTML = "Delete";
          deleteButton.onclick = function () {
            newItem.remove();

          };
          newItem.appendChild(deleteButton);
        }


      function addParrentIfPossible(){
        const addInput = document.getElementsByClassName("newListInput")[0];
        if(addInput.value === ""){
          alert("Enter the list name please!!!");
        }
        else{
          createParent(addInput.value)
        }
      }

      function reCreateParent(parent){
        let par = new Parent(parent.value,parent.inputID,parent.listID, parent.jsonID);
        par.children = parent.children
        par.getContent = function(){
          return createMarkUpForParent(this.value,this.listID, this.inputID)
        }
        par.displayAllChildren = function(){
          element = document.getElementById(this.listID);
          par.children.forEach(function (item, index) {
            reCreateChild(item,element, par, index)
          });

        }
        const ul = document.getElementsByClassName("ListParentItemNonBullets")[0]
        const li = document.createElement("li");
        li.classList.add("ListParentItemNonBullets");
        ul.appendChild(li);

        li.innerHTML= par.getContent();
        const insertBtn = document.createElement("button");
        insertBtn.classList.add("btn-primary");
        insertBtn.innerHTML = "Insert";
        insertBtn.addEventListener("click",function(){addChildIfPossible(par)})
        element = document.getElementById(par.listID);
        element.appendChild(insertBtn);
        par.displayAllChildren();
      }

      for (const [key, value] of Object.entries(localStorage)){
        if(key != "parentInputIDJson" && key != "parentListIDJson" && key != "Json"){
          p = JSON.parse(value);
          reCreateParent(p)
        }
       
      }


  
      
  
