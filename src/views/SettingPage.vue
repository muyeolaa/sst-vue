<template>
  <div class="contents">
    <div class="form-wrapper form-wrapper-sm">
      <div style="display: flex; justify-content: space-between">
        <div class="title">거래처 관리</div>
        <div>
          <button
            class="button-create"
            style="height: 40px"
            @click="createCustomerClicked"
          >
            거래처 등록
          </button>
          <button
            class="button-create"
            style="height: 40px"
            @click="exportCustomersExcel"
          >
            거래처 다운로드
          </button>
          <button
            class="button-create"
            style="height: 40px"
            @click="deleteAllCustomers"
          >
            거래처 삭제 (전체)
          </button>
        </div>
      </div>
      <grid
        :cols="customer_cols"
        :rows="customer_rows"
        :auto-width="autoWidth"
        :pagination="pagination"
        :search="search"
        :sort="sort"
      ></grid>

      <div style="display: flex; justify-content: end; margin-top: 16px">
        <UploadCustomerForm></UploadCustomerForm>
      </div>
    </div>
    <div class="form-wrapper form-wrapper-sm">
      <div style="display: flex; justify-content: space-between">
        <div class="title">사용자 관리</div>
        <button class="button-create" @click="createMemberClicked">
          사용자 생성
        </button>
      </div>
      <grid
        :cols="cols"
        :rows="rows"
        :auto-width="autoWidth"
        :pagination="pagination"
        :search="search"
        :sort="sort"
      ></grid>
      <!-- Costomer Modal -->
      <AlertModal v-if="customerShowModal" @close="customerShowModal = false">
        <h2 slot="header">
          <span v-if="customerModalType == 'CREATE'">거래처 등록</span>
          <span v-if="customerModalType == 'EDIT'">거래처 수정</span>
          <button class="button-exit" @click="customerShowModal = false">
            <i class="ion-md-close"></i>
          </button>
        </h2>
        <div slot="body">
          <form @submit.prevent="saveCustomerClicked" class="form">
            <div class="flex justify-center items-center">
              <input hidden id="id" v-model="id" />
              <div style="display: flex">
                <label for="loginId">SAP 코드</label>
                <input id="sapCode" type="text" v-model="sapCode" />
                <!-- <button class="button-normal">중복확인</button> -->
              </div>
              <div style="display: flex">
                <label for="customerName">거래처명</label>
                <input id="customerName" type="text" v-model="customerName" />
                <!-- <button class="button-normal">중복확인</button> -->
              </div>
              <div style="display: flex">
                <label for="address">주소</label>
                <input id="address" type="text" v-model="address" />
              </div>
              <div style="display: flex">
                <label for="zipCode">우편번호</label>
                <input id="zipCode" type="text" v-model="zipCode" />
              </div>
              <div style="display: flex">
                <label for="injManager">영업사원 이름</label>
                <input id="injManager" type="text" v-model="injManager" />
              </div>
              <div style="display: flex">
                <label for="injManagerContact">영업사원 연락처</label>
                <input
                  id="injManagerContact"
                  type="text"
                  maxlength="13"
                  v-model="injManagerContact"
                />
              </div>
              <div style="display: flex">
                <label for="tradeStatus">거래여부</label>
                <input id="tradeStatus" type="text" v-model="tradeStatus" />
              </div>
              <div style="display: flex">
                <label for="remark">비고</label>
                <input id="remark" type="text" v-model="remark" />
              </div>
              <div style="display: flex">
                <label for="lat">위치정보</label>
                <input
                  id="lat"
                  type="text"
                  v-model="lat"
                  style="width: 120px"
                  placeholder="위도"
                />
                <input
                  id="lng"
                  type="text"
                  v-model="lng"
                  style="width: 120px; margin-left: 10px"
                  placeholder="경도"
                />
                <input
                  class="button-normal"
                  type="button"
                  style="width: 100px"
                  @click="locationButtonClicked"
                  value="조회"
                />
              </div>
            </div>
            <div style="display: flex; justify-content: center">
              <button class="button-cancel" @click="customerShowModal = false">
                취소
              </button>
              <button class="button-save">저장</button>
            </div>
          </form>
        </div>
      </AlertModal>
      <!-- Member Modal -->
      <AlertModal v-if="memberShowModal" @close="memberShowModal = false">
        <h2 slot="header">
          <span v-if="memberModalType == 'CREATE'">사용자 추가</span>
          <span v-if="memberModalType == 'EDIT'">사용자 수정</span>
          <button class="button-exit" @click="memberShowModal = false">
            <i class="ion-md-close"></i>
          </button>
        </h2>
        <div slot="body">
          <form @submit.prevent="saveMemberClicked" class="form">
            <div class="flex justify-center items-center">
              <input hidden id="id" v-model="id" />
              <div style="display: flex">
                <label for="loginId">아이디</label>
                <input
                  id="loginId"
                  type="text"
                  v-model="loginId"
                  :disabled="memberModalType == 'EDIT'"
                />
              </div>
              <div style="display: flex">
                <label for="password">비밀번호</label>
                <input id="password" type="password" v-model="password" />
              </div>
              <div style="display: flex">
                <label for="name">이름</label>
                <input id="name" type="text" v-model="name" />
              </div>
              <div style="display: flex">
                <label for="department">소속</label>
                <input id="department" type="text" v-model="department" />
              </div>
              <div style="display: flex">
                <label for="permission">권한</label>
                <select v-model="permission">
                  <option :value="{ type: '사용자' }">사용자</option>
                  <option :value="{ type: '관리자' }">관리자</option>
                </select>
              </div>
              <div style="display: flex">
                <label for="contact">연락처</label>
                <input id="contact" type="text" v-model="contact" />
              </div>
              <div style="display: flex">
                <label for="email">이메일</label>
                <input id="email" type="email" v-model="email" />
              </div>
            </div>
            <div style="display: flex; justify-content: center">
              <button class="button-cancel" @click="memberShowModal = false">
                취소
              </button>
              <button class="button-save">저장</button>
            </div>
          </form>
        </div>
      </AlertModal>
    </div>
  </div>
</template>

<script>
// Grid click event
// https://github.com/grid-js/gridjs-vue/blob/master/docs/helpers.md

import sha256 from 'crypto-js/sha256';
import Grid from 'gridjs-vue';
import {
  getMemberList,
  getMember,
  createMember,
  updateMember,
} from '@/api/member';
import {
  getCustomerList,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteAllCustomers,
} from '@/api/customer';
import { getLatLng } from '@/api/location';
import UploadCustomerForm from '@/components/UploadCustomerForm';
import AlertModal from '../components/AlertModal.vue';
import { writeFile, utils } from 'xlsx';

export default {
  data() {
    return {
      customerId: 0,
      id: 0,
      loginId: '',
      password: '',
      name: '',
      department: '',
      permission: { type: '사용자' },
      contact: '',
      email: '',
      memberModalType: '',
      memberShowModal: false,
      sapCode: '',
      customerName: '',
      address: '',
      addressDetail: '',
      zipCode: '',
      injManager: '',
      injManagerContact: '',
      tradeStatus: '',
      remark: '',
      lat: 0.0,
      lng: 0.0,
      customerModalType: '',
      customerShowModal: false,
      autoWidth: true,
      pagination: true,
      search: true,
      sort: false,
      cols: [
        { name: 'id', width: '5%', hidden: true },
        { name: '아이디', width: '15%' },
        { name: '이름', width: '10%' },
        { name: '소속', width: '10%' },
        { name: '권환', width: '10%' },
        { name: '연락처', width: '12%' },
        { name: '이메일', width: '15%' },
        { name: '등록일시', width: '20%' },
        {
          name: '수정',
          width: '10%',
          formatter: (cell, row) => {
            return this.$gridjs.h(
              'button',
              {
                onClick: () => {
                  this.editMemberClicked(row.cells[0].data);
                },
              },
              '수정',
            );
          },
        },
      ],
      rows: [],
      customer_cols: [
        { name: 'id', width: '5%', hidden: true },
        { name: 'SAP 코드', width: '8%' },
        { name: '거래처명', width: '17%' },
        { name: '주소', width: '38%' },
        { name: '우편번호', width: '8%' },
        { name: '영업사원', width: '8%' },
        { name: '전화번호', width: '12%' },
        { name: '거래여부', width: '8%' },
        { name: '비고', width: '10%' },
        {
          name: '수정',
          width: '8%',
          formatter: (cell, row) => {
            return this.$gridjs.h(
              'button',
              {
                onClick: () => {
                  this.editCustomerClicked(row.cells[0].data);
                },
              },
              '수정',
            );
          },
        },
      ],
      customer_rows: [],
    };
  },
  components: {
    Grid,
    AlertModal,
    UploadCustomerForm,
  },
  async created() {
    this.initMembers();
    this.initCustomers();
  },
  methods: {
    async importDaumAddressScript() {
      const script = document.createElement('script');
      script.src =
        '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      document.head.appendChild(script);
    },
    async initCustomers() {
      const { data } = await getCustomerList();
      const customerList = data.data;
      this.customer_rows = [];
      for (const customer of customerList) {
        const item = [];
        item.push(customer.id);
        item.push(customer.sapCode);
        item.push(customer.customerName);
        item.push(customer.address);
        item.push(customer.zipCode);
        item.push(customer.injManager);
        item.push(customer.injManagerContact);
        item.push(customer.tradeStatus);
        item.push(customer.remark);
        this.customer_rows.push(item);
      }
    },
    async initMembers() {
      const { data } = await getMemberList();
      const userList = data.data;
      this.rows = [];
      for (const user of userList) {
        const item = [];
        item.push(user.id);
        item.push(user.loginId);
        item.push(user.name);
        item.push(user.department);
        item.push(user.permission);
        item.push(user.contact);
        item.push(user.email);
        item.push(user.createdAt);
        this.rows.push(item);
      }
    },
    async editCustomerClicked(id) {
      this.initCustomerModal();

      const { data } = await getCustomer(id);
      const customer = data.data;

      this.customerId = customer.id;
      this.sapCode = customer.sapCode;
      this.customerName = customer.customerName;
      this.address = customer.address;
      this.zipCode = customer.zipCode;
      this.injManager = customer.injManager;
      this.injManagerContact = customer.injManagerContact;
      this.tradeStatus = customer.tradeStatus;
      this.remark = customer.remark;
      this.lat = customer.lat;
      this.lng = customer.lng;

      this.customerModalType = 'EDIT';
      this.customerShowModal = !this.customerShowModal;
    },
    async editMemberClicked(id) {
      this.initMemberModal();

      const { data } = await getMember(id);
      const user = data.data;

      this.id = user.id;
      this.loginId = user.loginId;
      this.password = user.password;
      this.name = user.name;
      this.department = user.department;

      console.log(user);

      if (user.permission == '사용자') {
        this.permission = { type: '사용자' };
      } else if (user.permission == '관리자') {
        this.permission = { type: '관리자' };
      }

      this.contact = user.contact;
      this.email = user.email;

      this.memberModalType = 'EDIT';
      this.memberShowModal = !this.memberShowModal;
    },
    createMemberClicked() {
      this.initMemberModal();
      this.memberModalType = 'CREATE';
      this.memberShowModal = !this.memberShowModal;
    },
    createCustomerClicked() {
      this.initCustomerModal();
      this.customerModalType = 'CREATE';
      this.customerShowModal = !this.customerShowModal;
    },
    initMemberModal() {
      this.id = 0;
      this.loginId = '';
      this.password = '';
      this.name = '';
      this.department = '';
      this.permission = { type: '사용자' };
      this.contact = '';
      this.email = '';
    },
    initCustomerModal() {
      this.sapCode = '';
      this.customerName = '';
      this.address = '';
      this.zipCode = '';
      this.injManager = '';
      this.injManagerContact = '';
      this.tradeStatus = '';
      this.remark = '';
      this.lat = 0.0;
      this.lng = 0.0;
    },
    isValidCustomerData() {
      if (this.sapCode == '') {
        alert('SAP 코드를 입력해주세요.');
        return false;
      }

      if (this.customerName == '') {
        alert('거래처명을 입력해주세요.');
        return false;
      }

      if (this.address == '') {
        alert('주소를 입력해주세요.');
        return false;
      }

      if (this.zipCode == '') {
        alert('우편번호를 입력해주세요.');
        return false;
      }

      if (this.injManager == '') {
        alert('영업사원명을 입력해주세요.');
        return false;
      }

      if (this.injManagerContact == '') {
        alert('영업사원 연락처를 입력해주세요.');
        return false;
      }

      if (this.tradeStatus == '') {
        alert('거래여부를 입력해주세요.');
        return false;
      }

      if (this.lat == 0.0 || this.lng == 0.0) {
        alert('주소를 입력하시고, 위치정보의 조회버튼을 클릭해주세요.');
        return false;
      }

      return true;
    },
    isValidMemberData(type) {
      if (this.loginId == '') {
        alert('아이디를 입력해주세요.');
        return false;
      }

      // 계정을 생성할 경우에만 비밀번호 체크를 합니다.
      if (type == 'CREATE') {
        if (this.password == '') {
          alert('비밀번호를 입력해주세요.');
          return false;
        }
      }

      if (this.name == '') {
        alert('이름을 입력해주세요.');
        return false;
      }
      if (this.department == '') {
        alert('소속을 입력해주세요.');
        return false;
      }
      if (this.contact == '') {
        alert('연락처를 입력해주세요.');
        return false;
      }
      if (this.email == '') {
        alert('이메일을 입력해주세요.');
        return false;
      }
      return true;
    },
    async locationButtonClicked() {
      if (this.address.length == 0) {
        alert('주소를 입력해주세요.');
        return;
      }
      const response = await getLatLng(this.address);
      if (response.status == 200) {
        const data = response.data.data;
        console.log(data);
        this.lat = data.lat;
        this.lng = data.lng;
      } else {
        const message = response.response.data.message;
        console.log(message);
        alert(message);
      }
    },
    async saveCustomerClicked() {
      if (this.customerModalType == 'CREATE') {
        if (this.isValidCustomerData()) {
          try {
            await createCustomer({
              sapCode: this.sapCode,
              customerName: this.customerName,
              address: this.address,
              zipCode: this.zipCode,
              injManager: this.injManager,
              injManagerContact: this.injManagerContact,
              tradeStatus: this.tradeStatus,
              remark: this.remark,
              lat: this.lat,
              lng: this.lng,
            });

            alert('거래처가 등록되었습니다.');
            this.customerShowModal = !this.customerShowModal;
            this.initCustomers();
          } catch (error) {
            alert(error.response.data.message);
          }
        }
      } else if (this.customerModalType == 'EDIT') {
        if (this.isValidCustomerData()) {
          try {
            const response = await updateCustomer(this.customerId, {
              sapCode: this.sapCode,
              customerName: this.customerName,
              address: this.address,
              zipCode: this.zipCode,
              injManager: this.injManager,
              injManagerContact: this.injManagerContact,
              tradeStatus: this.tradeStatus,
              remark: this.remark,
              lat: this.lat,
              lng: this.lng,
            });
            console.log(response);

            this.customerShowModal = !this.customerShowModal;
            this.initCustomers();
          } catch (error) {
            console.log(error);
            alert(error.response.data.message);
          }
        }
      }
    },
    async saveMemberClicked() {
      if (this.memberModalType == 'CREATE') {
        if (this.isValidMemberData('CREATE')) {
          try {
            const { data } = await createMember({
              loginId: this.loginId,
              password: String(sha256(this.password)),
              name: this.name,
              department: this.department,
              permission: this.permission.type,
              contact: this.contact,
              email: this.email,
            });
            console.log(data);

            this.memberShowModal = !this.memberShowModal;
            this.initMembers();
          } catch (error) {
            alert(error.response.data.message);
          }
        }
      } else if (this.memberModalType == 'EDIT') {
        if (this.isValidMemberData('UPDATE')) {
          let sha256Password = '';

          if (this.password != '' && this.password != undefined) {
            sha256Password = String(sha256(this.password));
          }

          try {
            const { data } = await updateMember(this.id, {
              loginId: this.loginId,
              password: sha256Password,
              name: this.name,
              department: this.department,
              permission: this.permission.type,
              contact: this.contact,
              email: this.email,
            });
            console.log(data);

            this.memberShowModal = !this.memberShowModal;
            this.initMembers();
          } catch (error) {
            alert(error.response.data.message);
          }
        }
      }
    },
    async exportCustomersExcel() {
      const { data } = await getCustomerList();
      const customers = data.data;

      // 엑셀에 들어갈 데이터를 설정
      let excelData = [];
      excelData.push([
        '고객 ID',
        'SAP 코드',
        '거래처명',
        '주소',
        '우편번호',
        '영업사원',
        '전화번호',
        '거래여부',
        '비고',
        '위도',
        '경도',
      ]);

      for (const customer of customers) {
        excelData.push([
          customer.id,
          customer.sapCode,
          customer.customerName,
          customer.address,
          customer.zipCode,
          customer.injManager,
          customer.injManagerContact,
          customer.tradeStatus,
          customer.remak,
          customer.lat,
          customer.lng,
        ]);
      }

      // 가상의 엑셀 파일을 생성하고 시트에 데이터를 넣습니다
      const book = utils.book_new();
      const customerExcel = utils.aoa_to_sheet(excelData);

      // 엑셀 셀의 크기를 설정
      customerExcel['!cols'] = [
        { wpx: 70 },
        { wpx: 100 },
        { wpx: 100 },
        { wpx: 120 },
        { wpx: 80 },
        { wpx: 60 },
        { wpx: 80 },
        { wpx: 60 },
        { wpx: 60 },
        { wpx: 50 },
        { wpx: 50 },
      ];

      utils.book_append_sheet(book, customerExcel, '거래처');
      writeFile(book, 'customer_list.xlsx');
    },
    async deleteAllCustomers() {
      // 거래처 전체 삭제
      if (confirm('[경고] 거래처를 전체 삭제하시겠습니까?')) {
        try {
          await deleteAllCustomers();
          alert('거래처 데이터가 작제되었습니다.');
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
.form {
  width: 100%;
}
.form label {
  width: 120px;
  margin-bottom: 0.5rem;
  font-size: 90%;
  display: flex;
  align-items: center;
}
.form input {
  font-family: inherit;
  font-size: 90%;
  width: 250px;
  border: 1px solid #dae1e7;
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 10%);
  padding: 0.6rem 0.5rem;
}
select {
  width: 250px;
  padding: 10px;
  background-color: white;
  border: 0.5px solid lightgray;
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 10%);
  margin-bottom: 1rem;
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
  width: 30%;
  background-color: #5172f6;
  color: white;
  padding: 10px;
}
.button-normal {
  width: 100px;
  background-color: #5172f6;
  color: white;
  margin-left: 8px;
  margin-bottom: 16px;
}

.button-save:hover,
.button-create:hover {
  background-color: #3e63f7;
}
.button-create {
  padding: 0 20px;
  margin: 4px;
  background-color: #5172f6;
  color: white;
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
