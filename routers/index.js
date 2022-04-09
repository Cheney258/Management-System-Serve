const express = require("express");
const user = require('../controller/user')
const admin = require('../controller/admin')
let router = express.Router();



//登录
router.post("/login", user.login);

//注册
router.post("/reg", user.register);

// 获取用户信息
router.get('/getInfo',user.getInfo)

// 更新用户信息
router.post('/updateinfo',user.updateInfo)

// 上传用户头像
router.post('/uploadAvatar',user.uploadAvatar)

// 获取用户头像
router.get('/getAvatarImg',user.getAvatar)

// 获取用户活动申请记录
router.post('/myapply',user.myApply)

// 获取用户场地申请记录
router.post('/getfieldapply',user.fieldApply)

// 获取用户器材申请记录
router.post('/getequipapply',user.equipApply)

// 添加活动申请
router.post('/addgame',user.addGame)

// 获取场地信息
router.get('/getvenueinfo',user.getVenueInfo)

// 获取可预约日期
router.get('/getDateDay',user.getDateDay)

// 获取某一地点某一天可预约的时间段
router.post('/getTimePeriod',user.getTimePeriod)

// 审查审批号，返回数据
router.post('/checkcode',user.check)

// 获取场地类型
router.get('/getvenuetypeandname',user.getVenueType)

// 获取对应类型场地的全部位置
router.post('/getpositionlist',user.getPosition)

// 提交场地申请
router.post('/subvenueapply',user.submitApply)

// 获取器材类型和名称
router.get('/getequip',user.getEquip)

// 提交器材申请
router.post('/subequipapply',user.subEquipApp)

// 取消申请
router.post('/cancelapply',user.cancelApply)

// 获取全部比赛详情
router.get('/getgamelist',user.getGameList)

// 获取全部器材信息
router.get('/getequiplist',user.getEquipList)

// 获取公告
router.get('/getannouncement',user.getAnnouncement)

// 提交留言
router.post('/subMessage',user.subMessage)

// 获取个人留言数据
router.post('/getMessageList',user.getMessageList)

// 撤销留言
router.post('/deletesMessage',user.deletesMessage)

// 回复已读
router.post('/readedMessage',user.readedMessage)

// 获取用户未读取留言回复的条数
router.post('/getNoReadedNum',user.getNoReadedNum)

// 获取未读公告
router.post('/getNoReadedAnnoun',user.getNoReadedAnnoun)

// 公告已读
router.post('/readedAnnouncement',user.readedAnnouncement)

// ----------------------------------------------------------------------------------------

// 管理端路由
router.post('/getallusers',admin.getAllUsers)

// 更行用户角色和账号状态
router.post('/updateroleAndstatus',admin.change)

// 获取公告
router.get('/getallannouncement',admin.getAllAnnouncement)

// 删除公告
router.post('/deleteannounce',admin.deleteAnnouncement)

// 新增公告
router.post('/addannouncement',admin.addAnnouncement)

// 修改公告
router.post('/updateannouncement',admin.updateAnnouncement)

// 发布或撤销公告
router.post('/uploadOrUndoAnnounce',admin.uploadOrUndoAnnouncement)

// 获取全部活动申请
router.get("/getallgameapply",admin.getAllGameApply)

// 通过或驳回申请
router.post('/acceptOrRefuseGameApply',admin.acceptOrRefuseGameApply)

// 删除某条申请
router.post('/deletegameapply',admin.deleteGameApply)

// 获取某一场地的某一天的可预约时间
// router.get('/getvenueusetime',admin.getVenueUsetime)

// 器材保修或报废
router.post('/handleequip',admin.handleEquip)

// 添加器材
router.post('/addequipment',admin.addEquipment)

// 删除器材
router.post('/deleteequipment',admin.deleteEquipment)

// 或、获取器材申请
router.get('/getequiprent',admin.getEquipRent)

// 获取未出借的器材信息
router.get('/getequipinfo',admin.getEquipInfo)

// 派发器材给申请人
router.post('/payoutequip',admin.payoutEquip)

// 驳回器材申请
router.post('/disEquipRent',admin.disagreedEquipRent)

// 器材回收
router.get('/getrecyclingEquiplist',admin.getRecyclingEquipList)

// 失信处理
router.post('/dealNoCredit',admin.dealNoCredit)

// 回收处理
router.post('/recyclingequip',admin.recyclingEquip)

// 获取需要赔偿的数据
router.get('/getcompensation',admin.getCompensation)

// 赔偿处理完成
router.post('/compensationover',admin.compensationOver)

// 获取场地申请数据
router.get('/getVenueapp',admin.getVenueapp)

// 处理场地申请
router.post('/handlerVenApply',admin.handlerVenueapp)

// 获取场地信息
router.get('/getAllVenueInfo',admin.getAllVenueInfo)

// 获取场地相关信息
router.get('/getAboutVenInfo',admin.getAboutVenInfo)

// 更改场地信息
router.post('/updateVenueInfo',admin.updateVenueInfo)

// 新增场地
router.post('/addVenueInfo',admin.addVenue)

// 删除场地
router.post('/deleteVenueInfo',admin.deleteVenue)

// 获取特殊场地信息
router.get('/getSpecialVenueInfo',admin.getSpecialVenueInfo)

// 获取周日期和天时间段
router.get('/getWeekAndPeriod',admin.getWeekAndPeriod)

// 新增特殊场地
router.post('/addSpecialVenue',admin.addSpecialVenue)

// 删除特殊场地信息
router.post('/deleteSpeciaVenueInfo',admin.deleteSpeciaVenueInfo)

// 更新特殊场地信息
router.post('/updateSpeciaVenueInfo',admin.updateSpeciaVenueInfo)

// 新增活动
router.post('/addActivity',admin.addActivity)

// 获取全部活动
router.get('/getAllActivityList',admin.getAllActivityList)

// 更新活动信息
router.post('/updateActivityInfo',admin.updateActivityInfo)

// 删除活动
router.post('/deleteActivity',admin.deleteActivity)

// 上传活动图片
router.post('/uploadActivityImg',admin.uploadActivityImg)

// 获取首页图片地址
router.get('/getIndexImgUrl',admin.getIndexImgUrl)

// 读取图片
router.get('/getindexImg',admin.getindexImg)

// 获取全部留言数据
router.get('/getAllMessage',admin.getAllMessage)

// 回复留言
router.post('/replyMessage',admin.replyMessage)


module.exports = router;