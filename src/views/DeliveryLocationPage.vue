<template>
  <div style="width: 100%; height: 100%">
    <div id="map" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script>
import { getDeliveryLocation } from '@/api/delivery';
export default {
  /* eslint-disable */
  data() {
    return {
      carNumber:  this.$router.currentRoute.params.carNumber,
      lat: 0.0,
      lng: 0.0,
    };
  },
  async created() {
    await this.initData();
    
    await this.importMapScript();
    await this.initMap();
    this.initMarker();

  },
  methods: {
    async initData() {
      const response = await getDeliveryLocation(this.carNumber);
      const data = response.data.data;

      this.lat = data.lat;
      this.lng = data.lng;
    },
    async importMapScript() {
      const script = document.createElement('script');
      script.src =
        'https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=801jndukm2';
      document.head.appendChild(script);
    },
    async initMap() {
      // 네이버 지도 옵션 설정
      var mapOptions = {
        center: new naver.maps.LatLng(this.lat, this.lng),
        zoom: 15,
        zoomControl: true,
        zoomControlOptions: { 
          position: naver.maps.Position.RIGHT_CENTER
        }
      };
      var map = new naver.maps.Map('map', mapOptions);
      this.map = map;
    },
    initMarker() {
      const result = new naver.maps.LatLng(this.lat, this.lng);
      var map = new naver.maps.Map('map');
      var marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(this.lat, this.lng),
        map: map
      });

      map.setCenter(result);
      map.setZoom(16);
    },
  },
};
</script>

<style>
html,body,#app{
 height: 100%;
}
.app-contents {
height: 100%;
}
</style>
