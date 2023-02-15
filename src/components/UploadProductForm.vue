<template>
  <div>
    <div class="container">
      <h4>배송물품 업로드</h4>
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
import { uploadProductList } from '@/api/product';

export default {
  data() {
    return {
      currentDate: getTodayDate(),
      productList: [],
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
        console.log(row);

        row[1] = excelDateToString(row[1]);

        for (let i = 0; i < row.length; i++) {
          if (row[i] == undefined || row[i] == null) {
            row[i] = '';
          }

          console.log(`${i} = ${row[i]}`);
        }

        const item = {
          no: row[0],
          releaseDate: row[1],
          productCode: row[2],
          productName: row[3],
          productGrade: row[4],
          expirationDate: row[5],
          lotNumber: row[6],
          originQuantity: row[7],
          expectedQuantity: row[8],
          instructionQuantity: row[9],
          inspectionQuantity: row[10],
          releaseQuantity: row[11],
          deleteQuantity: row[12],
          productNote: row[13],
          orderCategory: row[14],
          orderStatus: row[15],
          deliveryToCode: row[16],
          customerCode: row[17],
          deliveryToName: row[18],
          deliveryDepartment: row[19],
          acceptable: row[20],
          deliveryCategory: row[21],
          slipNumber: row[22],
          customerLineNumber: row[23],
          expectedNumber: row[24],
          lineNumber: row[25],
          confirmationNumber: row[26],
          shipper: row[27],
        };

        console.log(item);

        this.productList.push(item);
      }
    },
    async saveDelivery() {
      const uploadData = {
        productList: this.productList,
      };
      try {
        await uploadProductList(uploadData);
        alert('배송물품이 업로드되었습니다.');

        this.productList = [];
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
  margin: 20px 0 40px 0;
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
