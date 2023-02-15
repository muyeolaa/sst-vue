import { instance } from './index';

/**
 * 고객사 리스트 조회
 */
function getCustomerList() {
  return instance.get('/v1/customers');
}

/**
 * 고객사 상세 조회
 */
function getCustomer(id) {
  return instance.get(`/v1/customers/${id}`);
}

/**
 * 고객사 등록
 */
function createCustomer(createData) {
  return instance.post('/v1/customers', createData);
}

/**
 * 고객사 리스트 등록
 */
function createCustomerList(createListData) {
  return instance.post('/v1/customers/create-list', createListData);
}

/**
 * 고객사 수정
 */
function updateCustomer(id, updateData) {
  return instance.patch(`/v1/customers/${id}`, updateData);
}

/**
 * 고객사 전체 삭제
 */
function deleteAllCustomers() {
  return instance.delete(`/v1/customers`);
}

export {
  getCustomerList,
  getCustomer,
  createCustomer,
  updateCustomer,
  createCustomerList,
  deleteAllCustomers,
};
