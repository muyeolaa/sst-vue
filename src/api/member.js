import { instance } from './index';

/**
 * 로그인
 */
function loginUser(loginData) {
  return instance.post('/v1/members/login', loginData);
}

/**
 * 회원 리스트 조회
 */
function getMemberList() {
  return instance.get('/v1/members');
}

/**
 * 회원 상세 조회
 */
function getMember(id) {
  return instance.get(`/v1/members/${id}`);
}

/**
 * 회원 생성
 */
function createMember(createData) {
  return instance.post('/v1/members', createData);
}

/**
 * 회원 수정
 */
function updateMember(id, updateData) {
  return instance.patch(`/v1/members/${id}`, updateData);
}

export { loginUser, getMemberList, getMember, createMember, updateMember };
