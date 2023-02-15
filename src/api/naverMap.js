import axios from 'axios';

function mapDirection15(deliveryList) {
  const headers = {
    'X-NCP-APIGW-API-KEY-ID': '801jndukm2',
    'X-NCP-APIGW-API-KEY': 'TfecULWXegbHGmmeHBsPQkW6MCvO9bhzaQrwSFGA',
  };

  // 출발지
  const start = deliveryList[0].lng + ',' + deliveryList[0].lat;

  // 도착지
  const goal =
    deliveryList[deliveryList.length - 1].lng +
    ',' +
    deliveryList[deliveryList.length - 1].lat;

  // 경유지
  let waypoints = '';
  for (let i = 1; i < deliveryList.length - 1; i++) {
    const item = deliveryList[i];

    if (item.lng != undefined && item.lat != undefined) {
      const location = item.lng + ',' + item.lat;
      waypoints += location;

      if (i != deliveryList.length - 2) {
        waypoints += '|';
      }
    }
  }

  return axios.get(
    'https://naveropenapi.apigw.ntruss.com/map-direction-15/v1/driving',
    {
      headers: headers,
      params: {
        start: start,
        goal: goal,
        waypoints: waypoints,
        option: 'traoptimal',
      },
    },
  );
}

export { mapDirection15 };
