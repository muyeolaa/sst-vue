<template>
  <div>
    <div class="container">
      <h4>거래처 업로드</h4>
      <div class="upload-content">
        <input
          type="file"
          @change="importExcel"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        />
        <button class="save-button" @click="saveCustomers">저장</button>
      </div>
    </div>
  </div>
</template>

<script>
import { read, utils } from 'xlsx';
import { getTodayDate } from '@/utils/date';
import { createCustomerList } from '@/api/customer';

export default {
  data() {
    return {
      currentDate: getTodayDate(),
      customerList: [],
    };
  },
  methods: {
    /**
     * 엑셀 파일을 가져옵니다
     */
    async importExcel(event) {
      const file = event.target.files[0];

      if (file !== undefined) {
        const data = await read(await file.arrayBuffer());
        const sheetName = data.SheetNames[0];
        const rows = utils.sheet_to_json(data.Sheets[sheetName], { header: 1 });

        this.convertData(rows);
      }
    },

    /**
     * 엑셀 데이터를 서버에 저장하기 위한 Object 형식으로 변환합니다.
     */
    convertData(rows) {
      for (let index = 1; index < rows.length; index++) {
        const row = rows[index];

        if (row[8] == undefined) {
          row[8] = '';
        }

        const item = {
          id: row[0],
          sapCode: row[1],
          customerName: row[2],
          address: row[3],
          zipcode: row[4],
          injManager: row[5],
          injManagerContact: row[6],
          tradeStatus: row[7],
          remark: row[8],
          lat: row[9],
          lng: row[10],
        };

        this.customerList.push(item);
      }
    },
    async saveCustomers() {
      if (confirm('[주의] 거래처롤 업로드하시겠습니까?')) {
        try {
          await createCustomerList(this.customerList);
          alert('거래처가 업로드되었습니다.');
          this.customerList = [];
          this.$router.go();
        } catch (error) {
          alert(error.response.data.message);
        }
      }
    },
  },
};
</script>

<style scoped>
.container {
  margin: 20px 0 10px 0;
  padding: 20px;
  border: 0.5px solid lightgray;
  border-radius: 4px;
  background: white;
}
.upload-content {
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
</style>
