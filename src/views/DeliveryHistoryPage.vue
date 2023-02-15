<template>
  <div class="contents">
    <div class="form-wrapper form-wrapper-sm">
      <div style="display: flex; justify-content: space-between">
        <span class="title">배송내역</span>
        <v-date-picker v-model="range" is-range @input="refreshDeliveryList">
          <template v-slot="{ inputValue, inputEvents }">
            <div class="flex justify-center items-center" style="height: 60px">
              <label>기간선택</label>
              <input
                :value="inputValue.start"
                v-on="inputEvents.start"
                class="date-picker"
                readonly
              />
              ~
              <input
                :value="inputValue.end"
                v-on="inputEvents.end"
                class="date-picker"
                readonly
              />
              <select v-model="selected">
                <option :value="{ type: 'CUSTOMER_NAME' }">출력납품처명</option>
                <option :value="{ type: 'DELIVERY_CENTER' }">배송센터</option>
                <option :value="{ type: 'DRIVER_NAME' }">기사이름</option>
                <option :value="{ type: 'DELIVERY_STATUS' }">배송상황</option>
              </select>
              <input
                class="input-search"
                type="text"
                value=""
                v-model="query"
              />
              <button class="button-search" @click="searchClicked">
                <i class="ion-md-search"></i>
              </button>
            </div>
          </template>
        </v-date-picker>
      </div>
      <grid
        :cols="cols"
        :rows="rows"
        :auto-width="autoWidth"
        :pagination="pagination"
        :sort="sort"
        :language="language"
      >
      </grid>
      <div style="display: flex">
        <button class="button-save" @click="excelExport">저장</button>
      </div>
    </div>
  </div>
</template>
<script>
import Grid from 'gridjs-vue';
import { getDeliveryList } from '@/api/delivery';
import { dateToString } from '@/utils/date';
import { writeFile, utils } from 'xlsx';

export default {
  data() {
    return {
      selected: { type: 'CUSTOMER_NAME' },
      autoWidth: true,
      pagination: true,
      sort: false,
      cols: [
        { name: 'id', width: '5%', hidden: true },
        { name: '출력납품지명', width: '25%' },
        { name: '배송일자', width: '12%' },
        { name: '제품수', width: '6%' },
        { name: '수량', width: '6%' },
        { name: '시도', width: '10%' },
        { name: '배송센터', width: '6%' },
        { name: '기사이름', width: '6%' },
        { name: '배송상황', width: '10%' },
        { name: '비고', width: '20%' },
        {
          name: '-',
          width: '15%',
          formatter: (cell, row) => {
            return this.$gridjs.h(
              'button',
              {
                onClick: () => {
                  this.moveConfirmation(row.cells[0].data);
                },
              },
              '배송확인서',
            );
          },
        },
      ],
      rows: [],
      language: {
        noRecordsFound: '조회 결과가 없습니다.',
      },
      date: new Date(),
      range: {
        start: new Date(),
        end: new Date(),
      },
      query: '',
    };
  },
  async created() {
    await this.getDeliveryList();
  },
  methods: {
    async getDeliveryList() {
      this.rows = [];

      console.log(this.range.start);

      if (this.range.start == null || this.range.end == null) {
        alert('조회 날짜를 선택해주세요.');
      }

      const response = await getDeliveryList(
        dateToString(this.range.start),
        dateToString(this.range.end),
        this.selected.type,
        this.query,
      );

      const deliveryList = response.data.data;
      for (const delivery of deliveryList) {
        const item = [];
        item.push(delivery.customerSlipNumber);
        item.push(delivery.deliveryToName);
        item.push(delivery.deliveryDate);
        item.push(delivery.productQuantity);
        item.push(delivery.quantity);
        item.push(delivery.city);
        item.push(delivery.deliveryCenter);
        item.push(delivery.driverName);
        item.push(delivery.deliveryStatus);
        item.push(delivery.orderNote);
        this.rows.push(item);
      }
    },
    refreshDeliveryList() {
      console.log('called');
    },
    excelExport() {
      // 엑셀에 들어갈 데이터를 설정
      let data = [];
      data.push([
        '고객사전표번호',
        '출력납품지명',
        '배송일자',
        '제품수',
        '수량',
        '시도',
        '배송센터',
        '기사이름',
        '배송상황',
        '비고',
      ]);
      for (const row of this.rows) {
        data.push(row);
      }

      // 가상의 엑셀 파일을 생성하고 시트에 데이터를 넣습니다
      const book = utils.book_new();
      const deliveryExcel = utils.aoa_to_sheet(data);

      // 엑셀 셀의 크기를 설정
      deliveryExcel['!cols'] = [
        { wpx: 100 },
        { wpx: 220 },
        { wpx: 100 },
        { wpx: 60 },
        { wpx: 80 },
        { wpx: 60 },
        { wpx: 60 },
        { wpx: 60 },
        { wpx: 60 },
        { wpx: 100 },
      ];

      utils.book_append_sheet(book, deliveryExcel, 'DOCTOR');
      writeFile(book, 'delivery_history.xlsx');
    },
    searchClicked() {
      this.getDeliveryList();
    },
    moveConfirmation(data) {
      console.log(data);
      this.$router.push(`/delivery/${data}/confirmation`);
    },
  },
  components: { Grid },
};
</script>

<style scoped>
select {
  margin-left: 12px;
  width: 150px;
  padding: 10px;
  background-color: white;
  border: 0.5px solid lightgray;
  border-radius: 4px;
}
.input-search {
  margin-left: 12px;
  width: 200px;
  padding: 10px;
  background-color: white;
  border: 0.5px solid lightgray;
  border-radius: 4px;
}
.button-search {
  margin-left: 4px;
  padding: 10px 15px;
  background-color: white;
  border: 0.5px solid lightgray;
  border-radius: 4px;
}
.button-search:hover {
  background-color: rgb(233, 233, 233);
}
/* Content Start */
.contents {
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 5px;
  width: 100%;
}
.form-wrapper {
  background: white;
  -webkit-box-shadow: 0 20px 20px rgba(0, 0, 0, 0.08);
  box-shadow: 0 20px 20px rgba(0, 0, 0, 0.08);
  border-radius: 3px;
  padding: 15px 15px;
}
.form-wrapper.form-wrapper-sm {
  max-width: 1300px;
  margin: 40px auto;
}
.form-wrapper-sm .page-header {
  padding: 0px 0 20px;
}
/* Content End */
.title {
  font-size: 1.5rem;
  font-weight: 350;
  padding: 10px;
}
label {
  margin-right: 10px;
}
.date-picker {
  padding: 10px;
  background-color: white;
  border: 0.5px solid lightgray;
  border-radius: 4px;
}
.button-save {
  margin-top: 16px;
  width: 100px;
  padding: 8px;
  margin-left: auto;
  background-color: #5172f6;
  color: white;
}
.button-save:hover {
  background-color: #4268ff;
}
::v-deep(td.gridjs-td) {
  font-size: 0.8rem;
  padding: 6px 10px;
}
::v-deep(.gridjs-th-content) {
  font-size: 0.8rem;
  padding: 6px 10px;
}
::v-deep(th.gridjs-th) {
  font-size: 0.8rem;
  padding: 6px 10px;
}
</style>
