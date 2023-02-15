<template>
  <div>
    <div
      class="container"
      v-for="item in items"
      v-bind:key="item.customerSlipNumber"
    >
      <div class="status-conatiner">
        <img
          v-if="item.deliveryStatus === '배송완료'"
          :src="require('@/assets/images/delivery_complete_icon.png')"
        />
        <img
          v-if="item.deliveryStatus === '배송시작'"
          :src="require('@/assets/images/delivery_next_icon.png')"
        />
        <img
          v-if="item.deliveryStatus === '배송예정'"
          :src="require('@/assets/images/delivery_incomplete_icon.png')"
        />
      </div>
      <div class="customer-container">
        <div class="name">{{ item.deliveryToName }}</div>
        <span class="status" v-if="item.productList.length != 0"
          >{{ item.productList[0].productName }} /
          {{ item.productList[0].originQuantity }}</span
        >
        <div>
          <span class="date">{{ item.deliveryDate }}</span>
          <span class="status">{{ item.deliveryStatus }}</span>
          <br />
          <span class="time" v-if="item.departureTime !== null">
            배송 시작 : {{ item.departureTime }}</span
          >
          <br />
          <span class="time" v-if="item.arrivalTime !== null">
            배송 완료 : {{ item.arrivalTime }}</span
          >
        </div>
        <div v-if="item.deliveryStatus === '배송시작'">
          <span class="status"
            >도착 예정 : {{ item.estimatedArrivalTime }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      require: true,
    },
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  display: inline-flex;
  padding: 16px 16px;
}
.status-conatiner {
  width: 20%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.customer-container {
  width: 80%;
}
.name {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 4px;
}
.date,
.time,
.status {
  font-size: 0.9rem;
  color: gray;
  margin-right: 8px;
}
</style>
