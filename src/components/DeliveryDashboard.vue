<template>
  <div class="dashborad-contents">
    <div class="total">
      <div>총 {{ totalDeliveryCount }}건</div>
    </div>
    <div class="incomplete">
      <div class="half">배송예정</div>
      <div class="half" style="color: black">
        {{ deliveryExpectedCount }} 건
      </div>
    </div>
    <div class="complete">
      <div class="half">배송완료</div>
      <div class="half" style="color: black">
        {{ deliveryCompleteCount }} 건
      </div>
    </div>
  </div>
</template>

<script>
import { getDeliveryDashboard } from '@/api/delivery';
import { dateToString } from '@/utils/date';

export default {
  data() {
    return {
      date: new Date(),
      totalDeliveryCount: 0,
      deliveryExpectedCount: 0,
      deliveryCompleteCount: 0,
    };
  },
  async created() {
    const response = await getDeliveryDashboard(dateToString(this.date));

    const data = response.data.data;
    this.totalDeliveryCount = data.totalDeliveryCount;
    this.deliveryExpectedCount = data.deliveryExpectedCount;
    this.deliveryCompleteCount = data.deliveryCompleteCount;
  },
};
</script>

<style scoped>
.dashborad-contents {
  height: 60px;
  position: fixed;
  z-index: 1;
  top: 20px;
  right: 20px;
  bottom: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  justify-content: space-between;
  padding: 0 16px;
}
.total {
  width: 127px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('@/assets/images/top_box.png');
  background-repeat: no-repeat;
  margin-right: 8px;
}
.incomplete {
  width: 167px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('@/assets/images/incomplete_box.png');
  background-repeat: no-repeat;
  margin-right: 8px;
}
.complete {
  width: 167px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('@/assets/images/complete_box.png');
  background-repeat: no-repeat;
  margin-right: 8px;
}
.half {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
