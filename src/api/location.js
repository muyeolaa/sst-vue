import { instance } from './index';

/**
 * 위경도 조회
 */
function getLatLng(address) {
  return instance.get('/v1/location/geocode', {
    params: {
      address,
    },
  });
}

export { getLatLng };
