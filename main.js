import { Product } from "./products.js";

const API_URL = "https://684ba39fed2578be881bf196.mockapi.io/product";

let allProducts = []; // Biến sử dụng cho Dropdown-Filter

axios.get(API_URL)
  .then(response => {
    // response.data là mảng các object sản phẩm (dạng JSON)
    const data = response.data;
    console.log(response.data)

    // Chuyển từng object thành instance của class Product
    const products = data.map(item => new Product(
      item.id,
      item.name,
      item.price,
      item.screen,
      item.backCamera,
      item.frontCamera,
      item.img,
      item.desc,
      item.type
    ));
    allProducts = products; 
    // Tiếp tục xử lý: render sản phẩm ra giao diện
    renderProducts(products);
  })
  .catch(error => {
    console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
  });

  // Chức năng hiển thị sản phẩm đã chọn từ dropdown filter

  document.getElementById("typeFilter").addEventListener("change", function () {
  const selectedType = this.value;
  let filteredProducts = allProducts;
  if (selectedType !== "all") {
    filteredProducts = allProducts.filter(product => product.type === selectedType);
  }
  renderProducts(filteredProducts);
});

function renderProducts(products) {
  const container = document.getElementById("products");
  if (!container) return;

  container.innerHTML = products.map(product => `
    <div class="product-card">
      <img src="${product.img}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>Giá: ${product.price}</p>
      <p>Màn hình: ${product.screen}</p>
      <p>Camera sau: ${product.backCamera}</p>
      <p>Camera trước: ${product.frontCamera}</p>
      <p>${product.desc}</p>
      <p>Loại: ${product.type}</p>
    </div>
  `).join("");
}

