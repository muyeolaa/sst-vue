<template>
  <div>
    <div id="map" style="width: 100%; height: 700px"></div>
    <button @click="checkpoint">Check Point</button>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  data() {
    return {
      map: null,
    };
  },
  created() {
    // 네이버지도 모듈 로드
    const mapScript = document.createElement('script');
    mapScript.src =
      'https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=801jndukm2';
    mapScript.onload = () => this.initMap();
    document.head.appendChild(mapScript);

    // 네이버지도 서브모듈 로드
    const mapSubScript = document.createElement('script');
    mapSubScript.src = 'https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=801jndukm2&submodules=geocoder';
    document.head.appendChild(mapSubScript);
  },
  methods: {
    initMap() {
      const mapOptions = {
        center: new naver.maps.LatLng(37.5291964, 126.9679056),
        zoom: 12,
        zoomControl: true,
        zoomControlOptions: {
          style: naver.maps.ZoomControlStyle.LARGE,
          position: naver.maps.Position.RIGHT_CENTER,
        },
        minZoom: 7,
      };
      const map = new naver.maps.Map('map', mapOptions);
      this.map = map;

      console.log(this.map);
    },
    checkpoint() {
      naver.maps.Service.geocode({ query: '서울특별시 구로구 경인로 661 2층 260호,261호(신도림동,신도림1차푸르지오)' }, function(status, response) {
      if (status === naver.maps.Service.Status.ERROR) {
          return alert('Something wrong!');
      }
        // 성공 시의 response 처리
        const lat = response.v2.addresses[0].y;
        const lng  = response.v2.addresses[0].x;
        const result = new naver.maps.LatLng(lat, lng);

        var map = new naver.maps.Map('map');

        var marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(lat, lng),
          map: map
        });

        map.setCenter(result);
        map.setZoom(16);
      });
    }
  },
};
</script>

<style></style>
