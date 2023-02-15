<template>
  <div class="contents">
    <div class="contents-wrapper">
      <h1 class="title">배송확인서</h1>
      <div style="display: flex; margin-top: 32px">
        <label for="deliveryDate">납품완료일</label>
        <input type="text" id="deliveryDate" v-model="deliveryDate" disabled />
        <label for="driverName">담당기사</label>
        <input type="text" id="driverName" v-model="driverName" disabled />
        <label for="carNumber">차량번호</label>
        <input type="text" id="carNumber" v-model="carNumber" disabled />
        <label for="deliveryCenter">배송센터</label>
        <input
          type="text"
          id="deliveryCenter"
          v-model="deliveryCenter"
          disabled
        />
      </div>
      <div class="middle-contents">
        <div class="detail-container">
          <table style="width: 100%">
            <tr>
              <td class="table-title">납품처</td>
              <td colspan="3">
                {{ this.deliveryToName }}
              </td>
            </tr>
            <tr>
              <td class="table-title">주소</td>
              <td colspan="3">
                {{ this.deliveryAddress }}
              </td>
            </tr>
            <tr>
              <td class="table-title">연락처</td>
              <td colspan="3">
                {{ this.contact }}
              </td>
            </tr>
            <tr>
              <td class="table-title">특이사항</td>
              <td colspan="3">
                {{ this.uniqueness }}
              </td>
            </tr>
            <tr>
              <td class="table-title">비고</td>
              <td colspan="3">
                {{ this.orderNote }}
              </td>
            </tr>
            <tr>
              <td class="table-title">주문번호</td>
              <td colspan="3">
                {{ this.customerSlipNumber }}
              </td>
            </tr>
            <tr>
              <td class="table-title" colspan="1">제품수</td>
              <td colspan="1">
                {{ this.productQuantity }}
              </td>
              <td class="table-title" colspan="1">수량</td>
              <td colspan="1">
                {{ this.quantity }}
              </td>
            </tr>
            <tr>
              <td class="table-title" colspan="1" style="width: 25%">
                배송출발
              </td>
              <td colspan="1" style="width: 25%">
                {{ this.departureTime }}
              </td>
              <td class="table-title" colspan="1" style="width: 25%">
                배송완료
              </td>
              <td colspan="1" style="width: 25%">
                {{ this.arrivalTime }}
              </td>
            </tr>
          </table>
        </div>
        <div class="map-container">
          <span class="sub-title">배송위치</span>
          <div id="map" style="width: 100%; height: 95%"></div>
        </div>
      </div>
      <div style="display: inline-flex; margin-top: 32px">
        <div style="margin-right: 32px" v-if="signImageUrl !== ''">
          <div class="sub-title">서명</div>
          <a :href="this.signImageUrl" target="_blank">
            <img
              width="100"
              height="200"
              :src="this.signImageUrl"
              style="margin-right: 16px"
            />
          </a>
        </div>
        <div v-if="deliveryImageUrlList !== []">
          <div class="sub-title">배송 사진</div>
          <a
            v-for="image in this.deliveryImageUrlList"
            v-bind:key="image"
            :href="image"
            target="_blank"
          >
            <img width="100" height="200" :key="image" :src="image" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { getDelivery } from '@/api/delivery';


export default {
  data() {
    return {
      customerSlipNumber:  this.$router.currentRoute.params.customerSlipNumber,
      deliveryToName: '',
      deliveryAddress: '',
      deliveryCenter: '',
      deliveryDate: '',
      contact: '',
      uniqueness: '',
      orderNote: '',
      productQuantity: 0,
      quantity: 0,
      departureTime: '',
      arrivalTime: '',
      signImageUrl: '',
      deliveryImageUrlList: [],
      lat: 0.0,
      lng: 0.0,
      driverContact: '',
      driverName: '',
      carNumber: '',
    };
  },
  created() {
    // 네이버지도 모듈 로드
    const mapScript = document.createElement('script');
    mapScript.src =
      'https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=801jndukm2';
    mapScript.onload = () => this.initMap();
    document.head.appendChild(mapScript);

    // 배송 정보 조회
    this.initData();
  },
  methods: {
    async initData(){
      const response = await getDelivery(this.customerSlipNumber);
      const data = response.data.data
      // console.log(data);

      // 배송 관련
      const delivery = data.delivery;
      console.log(delivery);

      this.deliveryToName = delivery.deliveryToName;
      this.deliveryAddress = delivery.deliveryAddress;
      this.deliveryCenter = delivery.deliveryCenter;
      this.deliveryDate = delivery.deliveryDate;
      this.contact = delivery.contact;
      this.uniqueness = delivery.uniqueness;
      this.orderNote = delivery.orderNote;
      this.productQuantity = delivery.productQuantity;
      this.quantity = delivery.quantity;
      this.departureTime = delivery.departureTime;
      this.arrivalTime = delivery.arrivalTime;

      // 기사 관련
      this.driverContact = delivery.driverContact;
      this.driverName = delivery.driverName;
      this.carNumber = delivery.carNumber;

      // 이미지 관련
      this.signImageUrl = data.signImageUrl;
      this.deliveryImageUrlList = data.deliveryImageUrlList;

      

      this.lat = data.delivery.lat;
      this.lng = data.delivery.lng;

      this.initMarker();
    },
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

<style scoped>
.contents {
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 5px;
  width: 100%;
}
.contents-wrapper {
  background: white;
  -webkit-box-shadow: 0 20px 20px rgba(0, 0, 0, 0.08);
  box-shadow: 0 20px 20px rgba(0, 0, 0, 0.08);
  border-radius: 3px;
  padding: 15px 15px;
  max-width: 1300px;
  margin: 40px auto;
}
.title {
  text-align: left;
}
.table-title {
  text-align: center;
  background-color: #f5f5f5;
}
.middle-contents {
  display: inline-flex;
  width: 100%;
  margin-top: 16px;
}
.bottom-contents {
  display: inline-flex;
  width: 100%;
  margin-top: 16px;
}
.detail-container {
  width: 70%;
  padding-right: 32px;
}
.map-container {
  width: 30%;
}
.sub-title {
  font-size: 1.2rem;
}
td {
  padding: 10px;
}
label {
  margin-left: 16px;
  margin-right: 16px;
  display: flex;
  align-items: center;
}
input {
  font-family: inherit;
  font-size: 90%;
  border: 1px solid #dae1e7;
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 10%);
  padding: 0.6rem 0.5rem;
}
table, th, td {
  border: 0.5px solid lightgray;
  border-collapse: collapse;
}
img {
  margin-right: 16px;
}
</style>
