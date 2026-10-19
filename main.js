let API_URL = "https://dummyjson.com/products";

let productForm = document.getElementById("productForm");
let container = document.getElementById("productsContainer");

// Задание 3
function renderProducts(products) {
  container.innerHTML = "";

  if (products.length === 0) {
    let emptyText = document.createElement("p");
    emptyText.textContent = "Товаров нет";
    container.appendChild(emptyText);
    return;
  }

  for (let i = 0; i < products.length; i++) {
    let product = products[i];

    let card = document.createElement("div");
    card.className = "product-card";

    let titleEl = document.createElement("h3");
    titleEl.textContent = product.title;

    let priceEl = document.createElement("p");
    priceEl.textContent = "Цена: " + product.price + " $";

    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Удалить";

    // Задание 2
    deleteBtn.addEventListener("click", function() {
      let isConfirmed = confirm("Точно удалить?");
      if (!isConfirmed) {
        return; 
      }

      deleteBtn.disabled = true;
      deleteBtn.textContent = "Удаление...";

      fetch(API_URL + "/" + product.id, {
        method: "DELETE"
      })
      .then(function(response) {
        if (!response.ok) {
          throw new Error("Не удалось удалить товар");
        }
        return response.json();
      })
      .then(function(data) {
        console.log("Удалено:", data);
        card.remove();
      })
      .catch(function(error) {
        console.log("Ошибка:", error);
        alert("Не удалось удалить товар!");
        deleteBtn.disabled = false;
        deleteBtn.textContent = "Удалить";
      });
    });

    card.appendChild(titleEl);
    card.appendChild(priceEl);
    card.appendChild(deleteBtn);
    container.appendChild(card);
  }
}

function loadProducts() {
  fetch(API_URL)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      renderProducts(data.products.slice(0, 5)); 
    })
    .catch(function(error) {
      console.log("Ошибка:", error);
    });
}

// Задание 1
function createProduct(event) {
  event.preventDefault();

  let titleInput = document.getElementById("productTitle").value;
  let priceInput = document.getElementById("productPrice").value;

  if (titleInput.trim() === "" || priceInput.trim() === "") {
    alert("Заполните поля");
    return;
  }

  let newProduct = {
    title: titleInput,
    price: Number(priceInput)
  };

  fetch(API_URL + "/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newProduct)
  })
  .then(function(response) {
    if (!response.ok) {
      throw new Error("Не удалось добавить товар");
    }
    return response.json();
  })
  .then(function(data) {
    console.log("Добавлено:", data);
    alert("Товар добавлен!");
    productForm.reset();
  })
  .catch(function(error) {
    console.log("Ошибка:", error);
  });
}

productForm.addEventListener("submit", createProduct);

loadProducts();

