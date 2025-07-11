import { Product } from "./products.js";
import { CartItem } from "./cart__item.js";

const API_URL = "https://684ba39fed2578be881bf196.mockapi.io/product";

let allProducts = []; // Biến sử dụng cho Dropdown-Filter
let cart = [];

axios
  .get(API_URL)
  .then((response) => {
    // response.data là mảng các object sản phẩm (dạng JSON)
    const data = response.data;
    console.log(response.data);

    // Chuyển từng object thành instance của class Product
    const products = data.map(
      (item) =>
        new Product(
          item.id,
          item.name,
          item.price,
          item.screen,
          item.backCamera,
          item.frontCamera,
          item.img,
          item.desc,
          item.type
        )
    );
    allProducts = products;
    // Tiếp tục xử lý: render sản phẩm ra giao diện
    renderProducts(products);
  })
  .catch((error) => {
    console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
  });

// Chức năng hiển thị sản phẩm đã chọn từ dropdown filter

document.getElementById("typeFilter").addEventListener("change", function () {
  const selectedType = this.value;
  let filteredProducts = allProducts;
  if (selectedType !== "all") {
    filteredProducts = allProducts.filter(
      (product) => product.type === selectedType
    );
  }
  renderProducts(filteredProducts);
});

function renderProducts(products) {
  const container = document.getElementById("products");
  if (!container) return;

  container.innerHTML = products
    .map(
      (product) => `
    <div class="product-card">
      <img src="${product.img}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <div class="card__info">
        <p>Giá: ${product.price}</p>
        <p>Màn hình: ${product.screen}</p>
        <p>Camera sau: ${product.backCamera}</p>
        <p>Camera trước: ${product.frontCamera}</p>
        <p>${product.desc}</p>
        <p>Loại: ${product.type}</p>
      </div>
      <button class="btn-add" onclick="addToCart('${product.id}')">Add to Cart</button>
    </div>
  `
    )
    .join("");
}

// Thêm sản phẩm vào giỏ hàng
function showCart() {
  document.getElementById("cart").style.display = "block";
}
window.showCart = showCart;

window.addToCart = function addToCart(id) {
  const product = allProducts.find((p) => p.id === id);
  if (!product) return;

  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.quantity++;
  } else {
    const cartItem = new CartItem(
      product.id,
      product.img,
      product.name,
      1,
      product.price
    );
    cart.push(cartItem);
  }
  localStorage.setItem("cart", JSON.stringify(cart));

  showCart();
  renderCart();
};

function renderCart() {
  const tbody = document.getElementById("cart-body");
  if (!tbody) return;

  tbody.innerHTML = cart
    .map(
      (item) => `
    <tr>
      <td>${item.id}</td>
      <td><img src="${item.img}" width="50" /></td>
      <td>${item.name}</td>
      <td>
        <button onclick="changeQty('${item.id}', -1)">-</button>
        ${item.quantity}
        <button onclick="changeQty('${item.id}', 1)">+</button>
      </td>
      <td>${item.price * item.quantity}</td>
      <td>
      <button onclick="removeItem('${item.id}')">Xoá</button>
    </tr>
  `
    )
    .join("");
  SumTongTien();
}

// lưu giỏ hàng vào localStorage
const savedCart = localStorage.getItem("cart");
if (savedCart) {
  cart = JSON.parse(savedCart);
  renderCart();
}

// Tăng giảm số lượng sản phẩm trong giỏ hàng
window.changeQty = function changeQty(id, num) {
  const prod = cart.find((item) => item.id === id);

  if (!prod) return;
  else {
    {
      prod.quantity += num;
      if (prod.quantity === 0) removeItem(prod.id);
    }
  }
  localStorage.setItem("cart", JSON.stringify(cart));

  showCart();
  renderCart();
};

// Xoá sản phẩm ra khỏi giỏ hàng
window.removeItem = function removeItem(id) {
  if (window.confirm("Bạn có muốn xoá sản phẩm!")) {
    const prod = cart.find((item) => item.id === id);
    if (!prod) return;
    const newCart = cart.filter((item) => item.id !== id);

    cart = newCart;
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }
};

// Render ra tổng tiền khi giỏ hàng thay đổi
function SumTongTien() {
  let tongTien = 0;

  cart.forEach((item) => {
    tongTien += Number(item.price * item.quantity);
  });
  const total = document.getElementById("cart-total");
  total.innerHTML = tongTien;
}

// Đóng giỏ hàng
document.getElementById("close-cart").onclick = function CloseCart() {
  document.getElementById("cart").style.display = "none";
};

// Thanh toán giỏ hàng
document.getElementById("charge-cart").onclick = function ChargeCart() {
  // gán phần thanh toán trực tuyến

  if (window.confirm("Xác nhận thanh toán! ")) {
    const Noti = "Chúc mừng bạn thanh toán thành công!";
    alert(Noti);
    const emptyCart = [];
    cart = emptyCart;
    document.getElementById("cart").style.display = "none";

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }
};
