// Kiểm tra rỗng
export function isRequired(value) {
  return value.trim() !== "";
}

// Kiểm tra giá sản phẩm là số dương
export function isPositiveNumber(value) {
  return /^\d+(\.\d+)?$/.test(value) && Number(value) > 0;
}

// Kiểm tra link hình ảnh là url (đơn giản)
export function isImageUrl(value) {
  return value.trim() === "" || /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(value);
}

// Hàm validate tổng hợp, trả về object lỗi
export function validateProduct(inputs) {
  const errors = {};

  if (!isRequired(inputs.name)) errors.name = "Tên sản phẩm không được để trống";
  if (!isRequired(inputs.price)) errors.price = "Giá sản phẩm không được để trống";
  else if (!isPositiveNumber(inputs.price)) errors.price = "Giá sản phẩm phải là số dương";
  if (!isRequired(inputs.screen)) errors.screen = "Thông số màn hình không được để trống";
  if (!isRequired(inputs.backCamera)) errors.backCamera = "Thông số Camera Sau không được để trống";
  if (!isRequired(inputs.frontCamera)) errors.frontCamera = "Thông số Camera Trước không được để trống";
  if (!isRequired(inputs.desc)) errors.desc = "Mô tả sản phẩm không được để trống";
  if (!isRequired(inputs.type)) errors.type = "Loại sản phẩm không được để trống";
  if (!isRequired(inputs.image)) errors.image = "Link hình ảnh không được để trống";
  else if (!isImageUrl(inputs.image)) errors.image = "Link hình ảnh không hợp lệ (phải là url hình ảnh)";

  return errors;
}