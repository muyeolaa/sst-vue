<template>
  <div style="width: 100%; height: 100vh">
    <DeliveryDashboard></DeliveryDashboard>
    <div class="delivery-contents" v-if="isShowContent">
      <button class="btn-exit" @click="toggleContent">
        <img :src="require('@/assets/images/exit_button.png')" />
      </button>
      <h2>{{ stringDate }}</h2>
      <grid
        :cols="cols"
        :rows="rows"
        :auto-width="autoWidth"
        :pagination="pagination"
        :search="search"
        :sort="sort"
      ></grid>
      <hr />
      <div>
        <div class="title">배송상태</div>
        <table class="driver-table" style="width: 100%; margin-top: 8px">
          <tr>
            <th width="30%">배송기사</th>
            <th width="30%">연락처</th>
            <th width="30%">차량번호</th>
          </tr>
          <tr>
            <td>{{ this.driverName }}</td>
            <td>{{ this.driverContact }}</td>
            <td>{{ this.carNumber }}</td>
          </tr>
        </table>
        <DeliveryBox :items="deliveryList"></DeliveryBox>
      </div>
    </div>
    <img
      class="open-icon"
      :src="require('@/assets/images/show_icon.png')"
      width="100px"
      @click="toggleContent"
      v-else
    />
    <div id="map" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script>
import Grid from 'gridjs-vue';
import { getDeliveryList, getDeliveryListByDriverName } from '@/api/delivery';
import { dateToString, dateToKrString } from '@/utils/date';
import DeliveryBox from '@/components/DeliveryBox.vue';
import DeliveryDashboard from '@/components/DeliveryDashboard.vue';

export default {
  /* eslint-disable */
  data() {
    return {
      isShowContent: true,
      map: Object,
      autoWidth: true,
      pagination: true,
      search: true,
      sort: false,
      cols: [
        {
          name: '-',
          width: '15%',
          formatter: (cell, row) => {
            return this.$gridjs.h(
              'button',
              {
                onClick: () => {
                  this.getDeliveryListByDriver(row.cells[5].data);
                },
              },
              '상세',
            );
          },
        },
        { name: '출력납품처명', width: '35%' },
        { name: '주문번호', width: '20%' },
        { name: '차량번호', width: '15%' },
        { name: '배송센터', width: '10%' },
        { name: '배송기사', width: '10%' },
        { name: '배송상황', width: '13%' },
      ],
      rows: [],
      date: new Date(),
      stringDate: dateToKrString(new Date()),
      driverName: '-',
      driverContact: '-',
      carNumber: '-',
      deliveryList: [],
      polyline: null,
      markerList: [],
      driverMarker: Object(),
    }
  },
  components: { Grid, DeliveryBox, DeliveryDashboard },
  async created() {
    
    await this.importMapScript();
    await this.initMap();

    // 데이터 초기화
    this.getDeliveryList();
  },
  methods: {
    async importMapScript() {
      const script = document.createElement('script');
      script.src =
        'https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=801jndukm2';
      document.head.appendChild(script);
    },
    async initMap() {
      // 네이버 지도 옵션 설정
      var mapOptions = {
        center: new naver.maps.LatLng(37.5095194, 126.8877016),
        zoom: 15,
        zoomControl: true,
        zoomControlOptions: { 
          position: naver.maps.Position.RIGHT_CENTER
        }
      };
      var map = new naver.maps.Map('map', mapOptions);
      this.map = map;
    },
    setDriverMarker(lat, lng) {
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(lat, lng),
        map: this.map,
        icon: {
            url: require('@/assets/images/current_marker_icon.png'),
            size: new naver.maps.Size(70, 70),
            origin: new naver.maps.Point(0, 0),
            anchor: new naver.maps.Point(25, 26)
        }
      });

      this.markerList.push(marker);
    },
    setDeliveryMarker(deliveryList) {
      for (const delivery of deliveryList) {

        let url = require('@/assets/images/expect_marker_icon.png');
        if (delivery.deliveryStatus == '배송완료') {
          url = require('@/assets/images/complete_marker_icon.png');
        } else if (delivery.deliveryStatus == '배송시작') {
          url = require('@/assets/images/delivery_next_large_icon.png');
        }

        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(delivery.lat, delivery.lng),
          map: this.map,
          icon: {
              url: url,
              size: new naver.maps.Size(70, 70),
              origin: new naver.maps.Point(0, 0),
              anchor: new naver.maps.Point(25, 26)
          }
        });

        var contentString = [
          '<div style="text-align:center;padding:0 10px;">',
          '   <h5 class="marker-name">'+ delivery.deliveryToName  +'</h5>',
          '</div>'
        ].join('');

        const infowindow = new naver.maps.InfoWindow({
          content: contentString
        });

        const map = this.map;
        naver.maps.Event.addListener(marker, "click", function(e) {
          if (infowindow.getMap()) {
            infowindow.close();
          } else {
            infowindow.open(map, marker);
          }
        });

        this.markerList.push(marker);

        // break;
      }
    },
    clearMarker() {
      for (const marker of this.markerList) {
        marker.setMap(null);
      }

      console.log(this.driverMarker);
    
    },  
    async getDeliveryList() {
      this.rows = [];

      const response = await getDeliveryList(dateToString(this.date), dateToString(this.date));

      const deliveryList = response.data.data;
      for (const delivery of deliveryList) {
        const item = [];
        item.push(delivery.customerSlipNumber);
        item.push(delivery.deliveryToName);
        item.push(delivery.customerSlipNumber);
        item.push(delivery.carNumber);
        item.push(delivery.deliveryCenter);
        item.push(delivery.driverName);
        item.push(delivery.deliveryStatus)

        this.rows.push(item);
      }

      this.setDeliveryMarker(deliveryList);
    },
    async getDeliveryListByDriver(data) {
      const response = await getDeliveryListByDriverName(data, dateToString(this.date));
      // console.log(response.data.data);

      this.clearMarker();
  
      // 기사 정보 설정
      const driver = response.data.data.driver;
      this.driverName = driver.driverName;
      this.driverContact = driver.contact;
      this.carNumber = driver.carNumber;
      console.log('lat = ' + driver.lat + ', lng = ' + driver.lng);
      this.map.panTo(new naver.maps.LatLng(driver.lat, driver.lng));
      this.setDriverMarker(driver.lat, driver.lng);

      // 배송지 리스트 설정
      const deliveryList = response.data.data.deliveryList;
      this.deliveryList = deliveryList;

      console.log(deliveryList);

      // this.clearMarker();
      this.setDeliveryMarker(deliveryList);

      // 경로 찍기
      const directions = response.data.data.directions;
      let path = [];
      if (directions.code == 0) {
        const pathList = directions.route.traoptimal[0].path;
      
        for (let i = 0; i < pathList.length; i++) {
          const item = pathList[i];
          const a = new naver.maps.LatLng(item[1], item[0])
          path.push(a);
        }
      }
      
      if (this.polyline != null) {
        this.polyline.setMap(null);
      }
    
      this.polyline = new naver.maps.Polyline({
          map: this.map,
          path: path,
          strokeWeight: 8,
          strokeColor: '#5347AA',
      });
    },
    toggleContent() {
      this.isShowContent = !this.isShowContent;
    }
  },
};
</script>

<style scoped>
.delivery-contents {
  position: fixed;
  left: 80px;
  top: 50px;
  z-index: 1;
  background-color: white;
  width: 40%;
  min-height: 60%;
  max-height: 90%;
  border-radius: 8px;
  box-shadow: 5px 10px 5px rgba(21, 21, 21, 0.15);
  overflow: scroll;
  padding: 20px;
}
.open-icon {
  position: fixed;
  left: 80px;
  top: 80px;
  width: 25px;
  height: 25px;
  z-index: 1;
}
.btn-exit {
  position: absolute;
  right: 20px;
  top: 20px;
  border: 0;
  padding: 12px;
}
::v-deep(td.gridjs-td) {
  font-size: 0.7rem;
  padding: 6px 12px;
}
::v-deep(th.gridjs-th) {
  font-size: 0.7rem;
  padding: 6px 10px;
}
::v-deep(.marker-content) {
  border-radius: 32px;
}
.title {
  margin-top: 16px;
  font-size: 1.2rem;
  font-weight: 500;
}
hr {
  margin-top: 32px;
  border-top: 0.5px solid #bbb;
}

table, th, td {
  border: 0.5px solid lightgray;
  border-collapse: collapse;
  text-align: center;
  padding: 8px 12px;
  font-size: 0.8rem;
}
table th {
  background-color: rgb(245, 245, 245);
}
.marker-name {
  font-size: 1.5rem;
}
</style>
