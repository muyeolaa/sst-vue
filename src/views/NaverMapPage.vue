<template>
  <div id="naverMaps">
    <naver-maps
      :width="1000"
      :height="700"
      :mapOptions="mapOptions"
      :initLayers="this.initLayers"
    >
      <naver-polyline
        :path="[
          { lat: 37, lng: 127 },
          { lat: 38, lng: 129 },
        ]"
      />

      <naver-marker
        :lat="37.5095178"
        :lng="126.8877039"
        @click="onMarkerClicked"
        @load="onMarkerLoaded"
      ></naver-marker>
    </naver-maps>
  </div>
</template>

<script>
// 네이버 지도 - https://github.com/Shin-JaeHeon/vue-naver-maps#readme
// 네이버 지도 공식 - https://navermaps.github.io/maps.js.ncp/
// 카카오 지도 - https://yoyostudy.tistory.com/48

/*
주소로 위경도 검색
curl -G "https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode" \
    --data-urlencode "query=서울특별시 구로구 경인로 661" \
    -H "X-NCP-APIGW-API-KEY-ID: 801jndukm2" \
    -H "X-NCP-APIGW-API-KEY: TfecULWXegbHGmmeHBsPQkW6MCvO9bhzaQrwSFGA" -v
*/

export default {
  name: 'naverMap',
  data() {
    return {
      width: 560,
      height: 560,
      info: false,
      marker: null,
      count: 1,
      map: null,
      isCTT: false,
      mapOptions: {
        lat: 37.3595704,
        lng: 127.105399,
        zoom: 14,
        zoomControl: true,
        mapTypeControl: false,
      },
      initLayers: [
        'BACKGROUND',
        'BACKGROUND_DETAIL',
        'POI_KOREAN',
        'TRANSIT',
        'ENGLISH',
        'CHINESE',
        'JAPANESE',
      ],
    };
  },
  computed: {},
  methods: {
    onLoad(map) {
      this.map = map;
    },
    onWindowLoad(that) {
      console.log(that);
    },
    onMarkerClicked(event) {
      console.log(event);
      this.temp();
      this.info = !this.info;
    },
    onMarkerLoaded(vue) {
      this.marker = vue.marker;
    },
    close() {
      this.$parent.closeMap();
      console.log('close map self', this.$parent);
    },
    temp() {
      console.log(this.map);
    },
  },
};
</script>

<style></style>
