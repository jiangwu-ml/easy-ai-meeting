export const roomList = [{id:Math.random(0,1),roomName:'黑木崖'+(+ new Date()),capacity:8,status:1,location:'办公楼4楼，402'},{id:+ new Date(),roomName:'黑木崖'+(+ new Date()),capacity:78,status:0,location:'办公楼4楼，402'}]

// {
//   "id": 0,
//   "roomName": "string", 名称
//   "capacity": 0,   容量 （可容纳人数）
//   "equipment": "string", --设备详情 - 不展示
//   "status": 0,  状态 ，0 在线  1 离线  -1 删除（前端接收不到）
//   "location": "string", 详细位置
//   "district": "string",  街道 - 不展示
//   "city": "string", 城市 - 不展示
//   "country": "string", 国家 -不展示
//   "createdAt": "2024-09-21T08:37:57.276Z",   添加日期 -不展示
//   "updatedAt": "2024-09-21T08:37:57.276Z"   更新时间 -不展示
// }