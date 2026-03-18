const API = "http://localhost:3000";

// COMMON API FUNCTION
async function apiRequest(url, method = "GET", body = null){

  const options = {
    method: method,
    headers: {
      "Content-Type":"application/json"
    }
  }

  if(body){
    options.body = JSON.stringify(body)              //get body in json
  }

  const res = await fetch(API + url, options)

  return res.json()
}

// ADDING PRODUCTS

async function addProduct(){

  const name = document.getElementById("name").value
  const price = Number(document.getElementById("price").value)

  await apiRequest("/products/add","POST",{
    product_name:name,
    price:price
  })

  alert("Product Added")

  loadProducts()                   //refresh product
}


async function loadProducts(){

  const data = await apiRequest("/products")

  let rows = ""

  data.forEach(p=>{
    rows += `
    <tr>
      <td>${p.product_id}</td>
      <td>${p.product_name}</td>
      <td>${p.price}</td>
    </tr>`
  })

  document.getElementById("productList").innerHTML = rows
}

if(document.getElementById("productList")){
  loadProducts()
}

// INVENTORY

async function addInventory(){

  const productId = Number(document.getElementById("productId").value)
  const stock = Number(document.getElementById("stock").value)

  await apiRequest("/inventory/add","POST",{
    product_id:productId,
    stock_quantity:stock
  })

  alert("Inventory Added")

  loadInventory()                              //reload inventory
}

async function loadInventory(){

  const data = await apiRequest("/inventory")

  let rows = ""

  data.forEach(i=>{
    rows += `
    <tr>
      <td>${i.product_id}</td>
      <td>${i.product_name}</td>
      <td>${i.stock_quantity}</td>
    </tr>`
  })

  document.getElementById("inventoryList").innerHTML = rows
}

if(document.getElementById("inventoryList")){
  loadInventory()
}

// ORDERS

async function createOrder(){

  const customer = document.getElementById("customer").value
  const product = Number(document.getElementById("product").value)
  const quantity = Number(document.getElementById("quantity").value)

  await apiRequest("/orders/create","POST",{
    customer_name:customer,
    product_id:product,
    quantity:quantity
  })

  alert("Order Created")

  loadOrders()
}

async function loadOrders(){

  const data = await apiRequest("/orders")

  let rows = ""

  data.forEach(o=>{
    rows += `
    <tr>
      <td>${o.order_reference}</td>
      <td>${o.customer_name}</td>
      <td>${o.product_name}</td>
      <td>${o.quantity}</td>
      <td>${o.status}</td>
    </tr>`
  })

  document.getElementById("orderList").innerHTML = rows
}

if(document.getElementById("orderList")){
  loadOrders()
}