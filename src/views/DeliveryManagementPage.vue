<template>
  <div class="contents">
    <div class="form-wrapper form-wrapper-sm">
      <div style="display: flex; justify-content: space-between">
        <div style="width: 49%">
          <UploadDeliveryForm></UploadDeliveryForm>
        </div>
        <div style="width: 49%">
          <UploadProductForm></UploadProductForm>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between">
        <div style="width: 49%">
          <DeleteDeliveryForm></DeleteDeliveryForm>
        </div>
        <div style="width: 49%">
          <DeleteProductForm></DeleteProductForm>
        </div>
      </div>
      <div>
        <div style="display: flex; justify-content: space-between">
          <span class="title">배송 계획</span>
          <v-date-picker
            v-model="date"
            mode="date"
            @input="refreshDeliveryList"
          >
            <template v-slot="{ inputValue, inputEvents }">
              <label for="picker">조회 날짜</label>
              <input
                id="picker"
                class="date-picker"
                :value="inputValue"
                v-on="inputEvents"
              />
            </template>
          </v-date-picker>
        </div>
        <grid
          :cols="cols"
          :rows="rows"
          :auto-width="autoWidth"
          :pagination="pagination"
          :search="search"
          :sort="sort"
        ></grid>
        <AlertModal v-if="showModal" @close="showModal = false">
          <h2 slot="header">
            <span>배송 계획 수정</span>
            <button class="button-exit" @click="showModal = false">
              <i class="ion-md-close"></i>
            </button>
          </h2>
          <div slot="body">
            <form @submit.prevent="saveClicked" class="form">
              <input
                hidden
                id="customerSlipNumber"
                v-model="customerSlipNumber"
              />
              <div class="flex justify-center items-center">
                <div style="display: flex">
                  <label for="deliveryToName">출력납품처명</label>
                  <input
                    id="deliveryToName"
                    type="text"
                    v-model="deliveryToName"
                  />
                </div>
                <v-date-picker v-model="deliveryDate" mode="date">
                  <template v-slot="{ inputValue, inputEvents }">
                    <div style="display: flex; justify-content: space-between">
                      <label for="deliveryDate">배송일자</label>
                      <input
                        id="deliveryDate"
                        class="date-picker"
                        :value="inputValue"
                        v-on="inputEvents"
                      />
                    </div>
                  </template>
                </v-date-picker>
                <div style="display: flex">
                  <label for="productQuantity">제품수</label>
                  <input
                    id="productQuantity"
                    type="text"
                    v-model="productQuantity"
                  />
                </div>
                <div style="display: flex">
                  <label for="quantity">수량</label>
                  <input id="quantity" type="text" v-model="quantity" />
                </div>
                <div style="display: flex">
                  <label for="city">시도</label>
                  <input id="city" type="text" v-model="city" />
                </div>
                <div style="display: flex">
                  <label for="deliveryCenter">배송센터</label>
                  <input
                    id="deliveryCenter"
                    type="text"
                    v-model="deliveryCenter"
                  />
                </div>
                <div style="display: flex">
                  <label for="driverName">기사이름</label>
                  <input
                    id="driverName"
                    type="driverName"
                    v-model="driverName"
                  />
                </div>
              </div>
              <div style="display: flex; justify-content: center">
                <button class="button-save">저장</button>
              </div>
            </form>
          </div>
        </AlertModal>
      </div>
    </div>
  </div>
</template>

<script>
import Grid from 'gridjs-vue';
import UploadDeliveryForm from '@/components/UploadDeliveryForm.vue';
import {
  getDeliveryList,
  getDelivery,
  deleteDelivery,
  updateDelivery,
} from '@/api/delivery';
import { dateToString } from '@/utils/date';
import AlertModal from '../components/AlertModal.vue';
import UploadProductForm from '@/components/UploadProductForm.vue';
import DeleteDeliveryForm from '@/components/DeleteDeliveryForm.vue';
import DeleteProductForm from '@/components/DeleteProductForm.vue';

export default {
  components: {
    Grid,
    UploadDeliveryForm,
    AlertModal,
    UploadProductForm,
    DeleteDeliveryForm,
    DeleteProductForm,
  },
  data() {
    return {
      autoWidth: true,
      pagination: true,
      search: true,
      sort: false,
      cols: [
        { name: '고객전표번호' },
        { name: '출력납품지명', width: '24%' },
        { name: '배송일자', width: '9%' },
        { name: '제품수', width: '3%' },
        { name: '수량', width: '4%' },
        { name: '시도', width: '10%' },
        { name: '배송센터', width: '8%' },
        { name: '기사이름', width: '8%' },
        { name: '연락처', width: '10%' },
        { name: '차량번호', width: '10%' },
        {
          name: '-',
          width: '8%',
          formatter: (cell, row) => {
            return this.$gridjs.h(
              'button',
              {
                onClick: () => {
                  this.editClicked(row.cells[0].data);
                },
              },
              '수정',
            );
          },
        },
        {
          name: '-',
          width: '8%',
          formatter: (cell, row) => {
            return this.$gridjs.h(
              'button',
              {
                onClick: () => {
                  console.log(row.cells[1].data);
                  if (
                    confirm(
                      `${row.cells[1].data}의 배송계획을 삭제하시겠습니까?`,
                    )
                  ) {
                    this.deleteClicked(row.cells[0].data);
                  }
                },
              },
              '삭제',
            );
          },
        },
      ],
      rows: [],
      date: new Date(),
      showModal: false,
      customerSlipNumber: '',
      deliveryToName: '',
      deliveryDate: new Date(),
      productQuantity: 0,
      quantity: 0,
      city: '',
      deliveryCenter: '',
      driverName: '',
    };
  },
  async created() {
    await this.getDeliveryList();
  },
  methods: {
    refreshDeliveryList() {
      this.getDeliveryList();
    },
    async getDeliveryList() {
      this.rows = [];

      const response = await getDeliveryList(
        dateToString(this.date),
        dateToString(this.date),
        '',
        '',
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
        item.push(delivery.driverContact);
        item.push(delivery.carNumber);

        this.rows.push(item);
      }
    },
    async editClicked(data) {
      // 배송 정보 조회
      const response = await getDelivery(data);
      console.log(response);

      const delivery = response.data.data.delivery;
      this.customerSlipNumber = data;
      this.deliveryToName = delivery.deliveryToName;
      this.deliveryDate = new Date(delivery.deliveryDate);
      this.productQuantity = delivery.productQuantity;
      this.quantity = delivery.quantity;
      this.city = delivery.city;
      this.deliveryCenter = delivery.deliveryCenter;
      this.driverName = delivery.driverName;

      this.showModal = !this.showModal;
    },
    async deleteClicked(data) {
      const response = await deleteDelivery(data);
      console.log(response);

      this.refreshDeliveryList();
    },
    async saveClicked() {
      const updateData = {
        deliveryToName: this.deliveryToName,
        deliveryDate: this.deliveryDate,
        productQuantity: this.productQuantity,
        quantity: this.quantity,
        city: this.city,
        deliveryCenter: this.deliveryCenter,
        driverName: this.driverName,
      };

      const response = await updateDelivery(
        this.customerSlipNumber,
        updateData,
      );
      console.log(response.data);
      this.showModal = !this.showModal;
      this.refreshDeliveryList();
    },
  },
};
</script>

<style scoped>
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
  font-weight: 500;
}
label {
  margin-right: 10px;
}
.form {
  width: 100%;
}
.form label {
  width: 150px;
  margin-bottom: 0.5rem;
  font-size: 110%;
  display: flex;
  align-items: center;
}
.form input {
  font-family: inherit;
  font-size: 90%;
  width: 100%;
  border: 1px solid #dae1e7;
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 10%);
  padding: 0.6rem 0.5rem;
}
.date-picker {
  padding: 10px;
  background-color: white;
  border: 0.5px solid lightgray;
  border-radius: 4px;
}
.button-exit {
  border: 0;
}
.button-cancel {
  width: 30%;
  margin-right: 12px;
  padding: 10px;
}
.button-save {
  width: 40%;
  background-color: #04aa6d;
  color: white;
  padding: 10px;
}
.button-save:hover,
.button-create:hover {
  background-color: #02784c;
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
