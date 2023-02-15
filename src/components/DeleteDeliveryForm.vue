<template>
  <div>
    <div class="container">
      <h4>배송계획 삭제</h4>
      <div class="delete-content">
        <v-date-picker v-model="date" mode="date">
          <template v-slot="{ inputValue, inputEvents }">
            <label for="picker" style="margin-right: 40px">배송 날짜</label>
            <input
              id="picker"
              class="date-picker"
              :value="inputValue"
              v-on="inputEvents"
            />
          </template>
        </v-date-picker>
        <button class="save-button" @click="deleteClicked">삭제</button>
      </div>
    </div>
  </div>
</template>

<script>
import { dateToString } from '@/utils/date';
import { deleteDeliveryByDate } from '@/api/delivery';

export default {
  data() {
    return {
      date: new Date(),
    };
  },
  methods: {
    async deleteClicked() {
      if (
        confirm(`${dateToString(this.date)}의 배송계획을 삭제하시겠습니까?`)
      ) {
        const response = await deleteDeliveryByDate(dateToString(this.date));
        if (response.status == 200) {
          alert('삭제되었습니다.');
          this.$router.go();
        }
      }
    },
  },
};
</script>

<style scoped>
.container {
  margin: 0 0 20px 0;
  padding: 20px;
  border: 0.5px solid lightgray;
  border-radius: 4px;
  background: white;
}
.delete-content {
  display: flex;
  justify-content: space-between;
}
h4 {
  margin: 0 0 10px 0;
}
input[type='file']::file-selector-button {
  width: 120px;
  height: 30px;
  background: #fff;
  border: 0.5px solid lightgray;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 20px;
}
input[type='file']::file-selector-button:hover {
  background: #42b983;
  color: #fff;
  border: 0px;
}
.save-button {
  padding: 0 30px;
  border-radius: 4px;
  background-color: white;
  border: 0.5px solid lightgray;
}
.save-button:hover {
  background-color: #42b983;
  color: white;
}
.date-picker {
  padding: 10px;
  background-color: white;
  border: 0.5px solid lightgray;
  border-radius: 4px;
}
</style>
