import { instance } from './index';

/**
 * 특정 날짜의 배송 대시보드를 조회합니다.
 */
function getDeliveryDashboard(date) {
  return instance.get('/v1/delivery/dashboard', {
    params: {
      date: date,
    },
  });
}

/**
 * 특정 날짜의 배송 대시보드를 조회합니다.
 */
function getDeliveryList(startDate, endDate, searchType, query) {
  return instance.get('/v1/delivery', {
    params: {
      startDate,
      endDate,
      searchType,
      query,
    },
  });
}

/**
 * 배송기사에 배정된 배송 리스트를 조회합니다.
 */
function getDeliveryListByDriverName(driverName, date) {
  return instance.get(`/v1/delivery/driver/${driverName}`, {
    params: { date },
  });
}

/**
 * 배송 상세 정보를 조회합니다.
 */
function getDelivery(customerSlipNumber) {
  return instance.get(`/v1/delivery/${customerSlipNumber}`);
}

/**
 * 배송과 상품 정보를 삭제합니다.
 */
function deleteDelivery(customerSlipNumber) {
  return instance.delete(`/v1/delivery/${customerSlipNumber}`);
}

/**
 * 날짜별 배송 정보를 삭제합니다.
 */
function deleteDeliveryByDate(date) {
  return instance.delete(`/v1/delivery`, {
    data: {
      date: date,
    },
  });
}

/**
 * 배송 차량의 위치 정보를 조회합니다.
 */
function getDeliveryLocation(carNumber) {
  return instance.get(`/v1/delivery/location/${carNumber}`);
}

/**
 * 배송 상세 정보를 수정합니다.
 */
function updateDelivery(customerSlipNumber, updateData) {
  return instance.patch(`/v1/delivery/${customerSlipNumber}`, updateData);
}

/**
 * 배송 리스트를 업로드합니다.
 */
function uploadDeliveryList(uploadData) {
  return instance.post('/v1/delivery', uploadData);
}

export {
  getDeliveryDashboard,
  getDeliveryList,
  getDeliveryListByDriverName,
  getDelivery,
  deleteDelivery,
  deleteDeliveryByDate,
  getDeliveryLocation,
  updateDelivery,
  uploadDeliveryList,
};
