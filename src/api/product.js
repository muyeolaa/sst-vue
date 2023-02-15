import { instance } from './index';

/**
 * 상품 리스트를 업로드합니다.
 */
function uploadProductList(uploadData) {
  return instance.post('/v1/product', uploadData);
}

/**
 * 날짜별 상품 정보를 삭제합니다.
 */
function deleteProductByDate(date) {
  return instance.delete(`/v1/product`, {
    data: {
      date: date,
    },
  });
}

export { uploadProductList, deleteProductByDate };
