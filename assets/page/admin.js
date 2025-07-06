import { Product } from "../../products.js";
import { validateProduct } from "../ultis/validations.js";

const API_URL = "https://684ba39fed2578be881bf196.mockapi.io/product";
const list = document.getElementById("product-list");
const form = document.getElementById("product-form");
const submitBtn = form.querySelector('button[type="submit"]');

let products = [];
let editingId = null; // Lưu id sản phẩm đang cập nhật

function fetchProducts() {
  axios.get(API_URL)
    .then((response) => {
      products = response.data;
      renderProducts();
    })
    .catch(() => alert("Lỗi khi lấy sản phẩm!"));
}

function renderProducts() {
  list.innerHTML = "";
  products.forEach((product) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.price}</td>
      <td><img src="${product.img || product.image}" alt="${product.name}" class="thumb" /></td>
      <td>
        <button type="button" class="btn-update" data-id="${product.id}">Cập nhật sản phẩm</button>
        <button type="button" class="btn-delete" data-id="${product.id}">Xoá Sản phẩm</button>
      </td>
    `;
    list.appendChild(row);
  });

  // Gán sự kiện xoá
  list.querySelectorAll(".btn-delete").forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute("data-id");
      axios.delete(`${API_URL}/${id}`).then(fetchProducts);
    };
  });

  // Gán sự kiện cập nhật
  list.querySelectorAll(".btn-update").forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute("data-id");
      const product = products.find(p => p.id == id);
      if (!product) return;
      // Đổ dữ liệu lên form
      form.name.value = product.name;
      form.price.value = product.price;
      form.screen.value = product.screen;
      form.backCamera.value = product.backCamera;
      form.frontCamera.value = product.frontCamera;
      form.desc.value = product.desc;
      form.type.value = product.type;
      form.image.value = product.img || product.image;
      editingId = id;
      submitBtn.textContent = "Cập nhật";
    };
  });
}

// Thêm/Cập nhật sản phẩm
form.onsubmit = function (e) {
  e.preventDefault();

  // Lấy dữ liệu
  const data = {
    name: form.name.value.trim(),
    price: form.price.value.trim(),
    screen: form.screen.value.trim(),
    backCamera: form.backCamera.value.trim(),
    frontCamera: form.frontCamera.value.trim(),
    desc: form.desc.value.trim(),
    type: form.type.value.trim(),
    image: form.image.value.trim()
  };

  // Xoá lỗi cũ
  document.querySelectorAll(".error").forEach(el => el.textContent = "");

  // Validate
  const errors = validateProduct(data);
  let hasError = false;
  for (let key in errors) {
    document.getElementById(`error-${key}`).textContent = errors[key];
    hasError = true;
  }
  if (hasError) return;

  // Nếu đang cập nhật
  if (editingId) {
    const updatedProduct = new Product(
      editingId,
      data.name,
      data.price,
      data.screen,
      data.backCamera,
      data.frontCamera,
      data.image,
      data.desc,
      data.type
    );
    axios.put(`${API_URL}/${editingId}`, updatedProduct).then(() => {
      form.reset();
      submitBtn.textContent = "Thêm sản phẩm";
      editingId = null;
      fetchProducts();
    });
  } else {
    // Thêm mới
    const newProduct = new Product(
      "",
      data.name,
      data.price,
      data.screen,
      data.backCamera,
      data.frontCamera,
      data.image,
      data.desc,
      data.type
    );
    axios.post(API_URL, newProduct).then(() => {
      form.reset();
      fetchProducts();
    });
  }
};

// Khởi động
fetchProducts();