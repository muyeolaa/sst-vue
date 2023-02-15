<template>
  <div>
    <div class="container">
      <h4>배송계획 업로드</h4>
      <div class="upload-content">
        <input
          type="file"
          @change="importExcel"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        />
        <button class="save-button" @click="saveDelivery">저장</button>
      </div>
    </div>
  </div>
</template>

<script>
import { read, utils } from 'xlsx';
import { excelDateToString, getTodayDate } from '@/utils/date';
import { uploadDeliveryList } from '@/api/delivery';

export default {
  data() {
    return {
      currentDate: getTodayDate(),
      deliveryList: [],
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

        // 엑셀에서 사용하는 날짜 일련 번호를 문자로 변환합니다.
        // ex) 44691 -> 2022-04-10
        row[4] = excelDateToString(row[4]);
        row[10] = excelDateToString(row[10]);
        row[29] = excelDateToString(row[29]);

        const item = {
          no: row[0],
          invoiceCheck: row[1],
          issueCount: row[2],
          parcelLabelNumber: row[3],
          forwardingDate: row[4],
          geoyoungSlipNumber: row[5],
          customerSlipNumber: row[6],
          deliveryToCode: row[7],
          sapCode: row[8],
          deliveryToName: row[9],
          deliveryDate: row[10],
          normalQuantity: row[11],
          jungeunQuantity: row[12],
          refrigeratedQuantity: row[13],
          biologicalQuantity: row[15],
          frozenQuantity: row[16],
          unissuedStorage: row[17],
          deliveryCategory: row[18],
          selectAddress: row[19],
          zipCode: row[20],
          city: row[21],
          deliveryCenter: row[22],
          deliveryAddress: row[23],
          contact: row[24],
          note: row[25],
          productQuantity: row[26],
          quantity: row[27],
          orderNote: row[28],
          finalLabelIssuanceDate: row[29],
          registrationDatetime: row[30],
          registrant: row[31],
          modifyDatetime: row[32],
          modifier: row[33],
          companyCode: row[34],
          warehouseCode: row[35],
          driverName: row[36],
        };

        console.log(item);

        this.deliveryList.push(item);
      }
    },
    async saveDelivery() {
      const uploadData = {
        deliveryList: this.deliveryList,
      };
      try {
        await uploadDeliveryList(uploadData);
        alert('배송 계획이 업로드되었습니다.');

        this.deliveryList = [];
        this.$router.go();
      } catch (error) {
        alert(error.response.data.message);
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
