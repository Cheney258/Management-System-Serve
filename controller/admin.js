const db = require("../core/mysql");
const multer = require('multer')
const upload = require('../controller/upload')
const path = require('path')
const fs = require('fs');

class AdminController {

    // 获取全部用户信息
    async getAllUsers(req, res, next) {
        const sql = 'select uid,name,username,xuehao,sex,email,phone,status,role from user'
        try {
            const results = await db.exec(sql, [])
            if (results.length >= 1) {
                res.json({
                    code: 200,
                    message: '数据获取成功',
                    data: results
                })
            } else {
                res.json({
                    code: 400,
                    message: '数据获取失败'
                })
            }
        } catch (error) {
            res.json({
                code: -200,
                message: '服务器异常'
            })
        }
    }

    // 修改用户角色和账号状态
    async change(req, res, next) {
        console.log(req.body)
        const params = [req.body.status, req.body.role, req.body.uid]
        const sql = 'update user set status=?, role = ? where uid = ?'
        try {
            const results = await db.exec(sql, params)
            if (results.affectedRows >= 1) {
                res.json({
                    code: 200,
                    message: '更新成功'
                })
            } else {
                res.json({
                    code: 400,
                    message: '更新失败'
                })
            }
        } catch (error) {
            res.json({
                code: -200,
                message: '服务器异常'
            })
        }
    }

    // 获取全部公告
    async getAllAnnouncement(req, res, next) {
        console.log('11')
        const sql = 'select * from announcement'
        try {
            const results = await db.exec(sql, [])
            if (results.length >= 1) {
                res.json({
                    code: 200,
                    message: '获取数据成功',
                    data: results
                })
            } else {
                res.json({
                    code: 400,
                    message: '数据获取失败'
                })
            }
        } catch (error) {
            res.json({
                code: -200,
                message: '服务器异常'
            })
        }
    }

    // 删除公告
    async deleteAnnouncement(req, res, next) {
        const sql = 'delete from announcement where aid = ?'
        try {
            const results = await db.exec(sql, req.body.aid)
            if (results.affectedRows >= 1) {
                res.json({
                    code: 200,
                    message: '删除成功'
                })
            } else {
                res.json({
                    code: 400,
                    message: '删除失败'
                })
            }
        } catch (error) {
            res.json({
                code: -200,
                message: '服务器异常'
            })
        }
    }

    // 新增公告
    async addAnnouncement(req, res, next) {
        // console.log(req.body)
        const params = [
            req.body.title,
            req.body.content,
            req.body.department,
            req.body.time
        ]
        const sql = 'insert into announcement(`title`,`content`,`department`,`time`) values(?,?,?,?) '
        try {
            const result = await db.exec(sql, params)
            if (result.affectedRows >= 1) {
                res.json({
                    code: 200,
                    message: '添加成功'
                })
            } else {
                res.json({
                    code: 400,
                    message: '添加失败'
                })
            }
        } catch (error) {
            res.json({
                code: -200,
                message: '服务器异常'
            })
        }
    }

    // 修改公告
    async updateAnnouncement(req,res,next){
        const params = [
            req.body.title,
            req.body.content,
            req.body.time,
            req.body.department,
            req.body.aid
        ]
        const sql = 'update announcement set title=?, content=?, time=?, department=? where aid = ?'
        try {
            console.log(params)
            const result = await db.exec(sql,params) 
            if(result.affectedRows >=1){
                res.json({
                    code:200,
                    message:'修改成功'
                })
            }else{
                res.json({
                    code:400,
                    message:'修改失败'
                })
            }
        } catch (error) {
            res.json({
                code:-200,
                message:'服务器异常'
            })
        }
    }

    // 发布公告或撤销
    async uploadOrUndoAnnouncement(req,res,next){
        const params = [req.body.status,req.body.aid]
        const sql = 'update announcement set status = ? where aid = ?'
        try {
            const result = await db.exec(sql,params)
            if(result.affectedRows >= 1){
                res.json({
                    code:200,
                    message:'成功'
                })
            }else{
                res.json({
                    code:400,
                    message:'失败'
                })
            }
        } catch (error) {
            res.json({
                code:-200,
                message:'服务器异常'
            })
        }
    }

    // 获取赛事类型活动申请
    async getAllGameApply(req,res,next){
        const sql = 'select gid,username,gamename,activityType,class,gametime,description,apptime,gameapp.status from gameapp,user where gameapp.uid = user.uid'
        try {
            const results = await db.exec(sql,[])
            if(results.length >=1){
                res.json({
                    code:200,
                    message:'数据获取成功',
                    data:results
                })
            }else{
                res.json({
                    code:400,
                    message:'数据获取失败'
                })
            }
        } catch (error) {
            res.json({
                code:-200,
                message:'服务器异常'
            })
        }
    }

    // 通过活动申请或驳回申请
    async acceptOrRefuseGameApply(req,res,next){
        // console.log(req.body)
        let params=[
            req.body.status,
            req.body.code,
            req.body.gid
        ]
        const sql = 'update gameapp set status = ?,code=? where gid =? '
        try {
            const result = await db.exec(sql,params)
            if(result.affectedRows >=1){
                res.json({
                    code:200,
                    message:'成功'
                })
            }else{
                res.json({
                    code:400,
                    message:'失败'
                })
            }
        } catch (error) {
            res.json({
                code:-200,
                message:'服务器异常'
            })
        }
    }

    // 删除某条活动申请
    async deleteGameApply(req,res,next){
        const sql = 'delete from gameapp where gid = ? '
        try {
            const result = await db.exec(sql,req.body.gid)
            if(result.affectedRows >= 1){
                res.json({
                    code:200,
                    message:'成功'
                })
            }else{
                res.json({
                    code:400,
                    message:'失败'
                })
            }
        } catch (error) {
            res.json({
                code:-200,
                message:'服务器异常'
            })
        }
    }

    // 器材保修和报废
    async handleEquip(req,res,next){
        const params =[
            req.body.status,
            req.body.eid,
        ]
        const sql = 'update equipment set status = ? where eid =?'
        try {
            const result = await db.exec(sql,params)
            if(result.affectedRows >= 1){
                res.json({
                    code:200,
                    message:'操作成功'
                })
            }else{
                res.json({
                    code:400,
                    message:'操作失败'
                })
            }
        } catch (error) {
            res.json({
                code:-200,
                message:'服务器异常'
            })
        }
    }

    // 添加器材
    async addEquipment(req,res,next){
        let tid
        // 封装函数：添加器材
        const addEquip = async (param) => {
            // console.log(param)
            let sqlStr = 'insert into equipment(`tid`,`eid`,`equipname`) values(?,?,?)'
            try {
                const result = await db.exec(sqlStr,param)
                if(result.affectedRows >= 1){
                    res.json({
                        code:200,
                        message:'添加成功'
                    })
                }else{
                    res.json({
                        code:400,
                        message:'添加失败'
                    })
                }
            } catch (error) {
                console.log('a')
                res.json({
                    code:-200,
                    message:'服务器异常' + error
                })
            }
        }
        // 判断是否有该类型的器材，如果有,获取器材类型ID，直接在equipment添加
        // 如果没有，则先在equip type添加类型
        const sql1 = 'select tid from equiptype where type = ?'
        try {
            const result1 = await db.exec(sql1,req.body.type) //result1[0].tid
            // console.log(result1) 
            if(result1.length >=1){
                tid = result1[0].tid
                let params =[
                    tid,
                    req.body.eid,
                    req.body.equipname
                ]
                addEquip(params)
            }else{
                const params2 = [
                    req.body.type,
                    req.body.compensation
                ]
                // console.log(params2)
                const sql2 = 'insert into equiptype (`type`,`compensation`) values(?,?)'
                try {
                    const result2 = await db.exec(sql2,params2)
                    // console.log(result1)
                    if(result2.affectedRows >=1){  //insertId新插入数据的id
                        tid=result2.insertId
                        let params =[
                            tid,
                            req.body.eid,
                            req.body.equipname
                        ]
                        addEquip(params)
                    }else{
                        res.json({
                            code:400,
                            message:'添加失败'
                        })
                    }
                } catch (error) {
                    console.log('2')
                    res.json({
                        code:-200,
                        message:'服务器异常' + error
                    })
                }
            }
        } catch (error) {
            console.log('1')
            res.json({
                code:-200,
                message:'服务器异常'
            })
        }
        
    }

    // 删除器材
    async deleteEquipment(req,res,next){
        const param = [req.body.eid]
        const sql = 'delete from equipment where eid = ?'
        try {
            const result = await db.exec(sql,param)
            if(result.affectedRows >= 1){
                res.json({
                    code:200,
                    message:'删除成功'
                })
            }else{
                res.json({
                    code:400,
                    message:'删除失败'
                })
            }
        } catch (error) {
            res.json({
                code:-200,
                message:'服务器异常'
            })
        }
    }

    // 获取器材申请
    async getEquipRent(req,res,next){
        const sql = 'select * from equiprent,equiptype where equiprent.tid = equiptype.tid'
        try {
            const results = await db.exec(sql,[])
            if(results.length >=0){
                res.json({
                    code:200,
                    message:'数据获取成功',
                    data:results
                })
            }else{
                res.json({
                    code:400,
                    message:'数据获取失败'
                })
            }
        } catch (error) {
            res.json({
                code:-200,
                message:"服务器异常"
            })
        }
    }

    // 获取未出借器材信息
    async getEquipInfo(req,res,next){
        const sql = 'select type,eid,equipname,status,rentstatus,e.tid from equipment as e,equiptype as t where e.tid = t.tid and e.status=0 and e.rentstatus=0'
        try {
            const results = await db.exec(sql,[])
            if(results.length >=0){
                res.json({
                    code:200,
                    message:'数据获取成功',
                    data:results
                })
            }else{
                res.json({
                    code:400,
                    message:'数据获取失败'
                })
            }
        } catch (error) {
            res.json({
                code:-200,
                message:'服务器异常'+error
            })
        }
    }

    // 派发器材给申请人
    async payoutEquip(req,res,next){
        console.log(req.body)
        const param = [
            req.body.rid,
            req.body.eid,
        ]
        const sql = 'update equipment set rid=?,rentstatus = 1 where eid =?'
        try {
            const result = await db.exec(sql,param)
            if(result.affectedRows >=1){
                const params = [
                    req.body.message,
                    req.body.code,
                    req.body.rid
                ]
                const sql = 'update equiprent set status = 1,message=?,code=? where rid=?'
                try {
                    const result0 = await db.exec(sql,params)
                    if(result0.affectedRows >=1){
                        res.json({
                            code:200,
                            message:'添加成功'
                        })
                    }else{
                        res.json({
                            code:-400,
                            message:'添加失败'
                        })
                    }
                } catch (error) {
                    res.json({
                        code:-200,
                        message:'服务器异常'+'2'+error
                    })
                }
            }else{
                res.json({
                    code:400,
                    message:'添加失败'
                })
            }
        } catch (error) {
            res.json({
                code:-200,
                message:'服务器异常'+'1'+error
            })
        }
    }

    // 驳回器材申请
    async disagreedEquipRent(req,res,next){
        const param = [
            req.body.message,
            req.body.rid
        ]
        const sql = 'update equiprent set status = 2, message = ? where rid = ?'
        try {
            const result = await db.exec(sql,param)
            if(result.affectedRows >= 1){
                res.json({
                    code:200,
                    message:'驳回成功'
                })
            }else{
                res.json({
                    code:400,
                    message:'驳回失败'
                })
            }
        } catch (error) {
            res.json({
                code:-200,
                message:'服务器错误'+error
            })
        }
    }

    // 器材被借用列表
    async getRecyclingEquipList(req,res,next){
        const sql = 'select m.eid,type,renttime,backtime,username,r.uid,r.rid,m.`status`,phone from equipment as m,equiptype as t,equiprent as r WHERE m.tid = t.tid and m.rid = r.rid AND m.rentstatus = 1 and m.rentstatus != 2'
        try {
            const result = await db.exec(sql,[])
            if(result.length >=0){
                res.json({
                    code:200,
                    message:'获取数据成功',
                    data:result
                })
            }else{
                res.json({
                    code:'400',
                    message:'获取数据失败'
                })
            }
        } catch (error) {
            res.json({
                code:-200,
                message:'服务器异常'
            })
        }
    }

    // 失信处理
    // 先更新该器材借用租用状态未4，过期未归还，在设置用户账号status=2异常
    async dealNoCredit(req,res,next){
        // 失信处理
        const noCredit = async (res,uid) =>{
            const sql = 'update user set status = 2 where uid = ?'
                try {
                    const result = await db.exec(sql,uid)
                    if(result.affectedRows >=1){
                        res.json({
                            code:200,
                            message:'处理成功'
                        })
                    }else{
                        res.json({
                            code:400,
                            message:'处理失败'
                        })
                    }
                } catch (error) {
                    res.json({
                        code:-200,
                        message:'服务器异常2'+error
                    })
                }
        }
        if(req.body.eid){
            const sqlStr = 'update equipment set rentstatus = 2 where eid = ?'
            try {
                const result1 = await db.exec(sqlStr,req.body.eid)
                if(result1.affectedRows >=1){
                    noCredit(res,req.body.uid)
                }else{
                    res.json({
                        code:400,
                        message:'操作失败'
                    })
                }
            } catch (error) {
                res.json({
                    code:-200,
                    message:'服务器异常1'+error
                })
            }
        }else{
            noCredit(res,req.body.uid)
        }
        
        
    }

    // 回收处理
    async recyclingEquip(req,res,next){
        const recycling =async (status) =>{
            const sql = 'update equipment set rentstatus = 0,status=? where eid = ?'
            try {
                const result = await db.exec(sql,[req.body.status,req.body.eid])
                if(result.affectedRows >= 1){
                    res.json({
                        code:200,
                        message:'回收成功'
                    })
                }else{
                    res.json({
                        code:400,
                        message:'回收失败'
                    })
                }
            } catch (error) {
                res.json({
                    code:-200,
                    message:'服务器异常'
                })
            }
        }
        if(req.body.status ==2){
            const sqlStr1 = 'insert into compensation(`rid`) values (?)'
            try {
                const result4 = await db.exec(sqlStr1,req.body.rid) 
                if(result4.affectedRows >=1){
                    recycling(req.body.status)
                }else{
                    res.json({
                        code:400,
                        message:'失败'
                    })
                }
            } catch (error) {
                res.json({
                    code:-200,
                    message:'服务器异常'
                })
            }
        }else{
            recycling(req.body.status)
        }

        
        
    }

    // 获取需赔偿的用户借用订单
    async getCompensation(req,res,next){
        const sql = 'SELECT c.id,user.uid,m.eid,type,user.username,c.`Cstatus`,time,compensation,m.`status` FROM compensation as c,equiprent as r,equiptype as t,equipment as m,user where c.rid=r.rid and r.tid=t.tid and r.uid=user.uid and t.tid = m.tid and m.`status` =2'
        try {
            const result =await db.exec(sql,[])
            if(result.length >=0){
                res.json({
                    code:200,
                    message:'数据获取成功',
                    data:result
                })
            }else{
                result.json({
                    code:400,
                    message:'数据获取失败'
                })
            }
        } catch (error) {
            res.json({
                code:-200,
                message:'服务器异常'
            })
        }
    }

    // 处理赔偿完成
    async compensationOver(req,res,next){
        const sql = 'update compensation set Cstatus=1,time=? where id=?'
        try {
            const result = await db.exec(sql,[req.body.time,req.body.id])
            if(result.affectedRows >=1){
                res.json({
                    code:200,
                    message:'处理完成'
                })
            }else{
                res.json({
                    code:400,
                    message:'处理失败'
                })
            }
        } catch (error) {
            res.json({
                code:-200,
                message:'服务器异常'+error
            })
        }
    }

    // 场地申请审核
    async getVenueapp(req,res,next){
        const sql = 'select gid,v.pid,type,v.tid,position,day,period,v.dayid,v.timeid,username,apptime,v.`status`,description from day_table,time, venueapp as v,venueposit as p,venuetype as t,user as u where u.uid=v.uid and p.pid=v.pid and t.tid=v.tid and v.dayid=day_table.id and v.timeid = time.id'
        try {
            const result = await db.exec(sql,[])
            if(result.length >=0){
                res.json({
                    code:200,
                    message:'数据请求成功',
                    data:result
                })
            }else{
                res.json({
                    code:404,
                    message:'数据获取失败'
                })
            }
        } catch (error) {
            res.json({
                code:500,
                message:'服务器内部错误'+error
            })
        }
    }

    // 处理场地申请
    async handlerVenueapp(req,res,next){
        const params = [
            req.body.status,
            req.body.description,
            req.body.gid
        ]
        const sql = 'update venueapp set status=?,description=? where gid=?'
        try {
            const result = await db.exec(sql,params)
            if(result.affectedRows >=1){
                if(req.body.dayid && req.body.timeid&&req.body.pid){
                    const params1 = [
                        req.body.pid,
                        req.body.dayid,
                        req.body.timeid
                    ]
                    console.log(params1)
                    const sqlStr = 'insert into p_d_t_s(pid,did,tid) values((select id from venueposit where pid= ?),?,?)'
                    try {
                        const result1 = await db.exec(sqlStr,params1)
                        if(result1.affectedRows>=1){
                            res.json({
                                code:200,
                                message:'数据更新成功'
                            })
                        }else{
                            res.json({
                                code:201,
                                message:'更新失败'
                            })
                        }
                    } catch (error) {
                        res.json({
                            code:500,
                            message:'服务器内部错误'+error
                        })
                    }
                }
            }else{
                res.json({
                    code:500,
                    message:'数据更新失败'
                })
            }
        } catch (error) {
            res.json({
                code:500,
                message:'服务器错误'
            })
        }
    }

    // 获取场地信息
    async getAllVenueInfo(req,res,next){
        const sql = 'select * from venueposit as p,venuetype as t,chargeperson as c where p.tid = t.tid and p.cid = c.cid'
        try {
            const result = await db.exec(sql,[])
            if(result.length >=0){
                res.json({
                    code:200,
                    messsage:'数据请求成功',
                    data:result
                })
            }else{
                res.json({
                    code:404,
                    message:'数据请求失败'
                })
            }
        } catch (error) {
            res.json({
                code:500,
                message:'服务器错误'
            })
        }
    }

    // 获取场地相关信息
    async getAboutVenInfo(req,res,next){
        const sql1 = 'select * from venuetype'
        const sql2 = 'select * from venueposit'
        const sql3 = 'select * from chargeperson'
        try {
            const result1 = await db.exec(sql1,[])
            const result2 = await db.exec(sql2,[])
            const result3 = await db.exec(sql3,[])
            if(result1.length >=0 &&result2.length >=0&&result2.length >=0){
                res.json({
                    code:200,
                    message:'信息获取成功',
                    data:[result1,result2,result3]
                })
            }else({
                code:404,
                message:'信息获取失败'
            })
        } catch (error) {
            res.json({
                code:500,
                message:'服务器错误'+error
            })
        }
    }

    // 更新场地信息
    async updateVenueInfo(req,res,next){
        const params = [
            req.body.pid,
            req.body.tid,
            req.body.position,
            req.body.cid,
            req.body.status,
            req.body.id
        ]
        const sql ='update venueposit set pid=?,tid=?,position=?,cid=?,status=? where id=?'
        try {
            const result = await db.exec(sql,params)
            if(result.affectedRows>=1){
                res.json({
                    code:200,
                    message:'数据更新成功'
                })
            }else{
                res.json({
                    code:404,
                    message:'请求失败'
                })
            }
        } catch (error) {
            res.json({
                code:500,
                message:'服务器错误'
            })
        }
    }

    // 新增场地
    async addVenue(req,res,next){
        let addVenueInfo = async (res,params) =>{
            // console.log(params)
            const sql = 'insert into venueposit(`pid`,tid,`position`,cid,`status`) values(?,?,?,?,?)'
            try {
                const result = await db.exec(sql,params)
                if(result.affectedRows >=1){
                    res.json({
                        code:200,
                        message:'数据更新成功'
                    })
                }else{
                    res.json({
                        code:404,
                        message:'请求失败'
                    })
                }
            } catch (error) {
                res.json({
                    code:500,
                    message:'服务器错误'+error
                })
            }
        }
        if(req.body.type!=''){
            const sqlStr = 'insert into venuetype(`type`) values(?)'
            try {
                const result1 = await db.exec(sqlStr,req.body.type)
                if(result1.affectedRows >=1){
                    req.body.tid = result1.insertId
                    const params1 = [
                        req.body.pid,
                        req.body.tid,
                        req.body.position,
                        req.body.cid,
                        req.body.status
                    ]
                    addVenueInfo(res,params1)
                }
            } catch (error) {
                
            }
        }else{
            const params2 = [
                req.body.pid,
                req.body.tid,
                req.body.position,
                req.body.cid,
                req.body.status
            ]
            // console.log(111)
            addVenueInfo(res,params2)
            
        }
    }

    // 删除场地信息
    async deleteVenue(req,res,next){
        const sql = 'delete from venueposit where id = ? '
        try {
            const result = await db.exec(sql,req.body.id)
            if(result.affectedRows >=1){
                res.json({
                    code:200,
                    message:'请求成功'
                })
            }else{
                res.json({
                    code:401,
                    message:'请求失败'
                })
            }
        } catch (error) {
            res.json({
                code:500,
                message:'服务器内部错误'
            })
        }
    }

    // 获取特殊场地信息
    async getSpecialVenueInfo(req,res,next){
        const sql = 'select s.id,use_type,p.tid,p.pid,s.per_id,w.id as wid,type,position,class,period,use_class from special_venue as s,venuetype as t,venueposit as p,`week` as w,time as per where s.tid=t.tid and p.pid=s.pid and w.id = s.wid and per.id = s.per_id'
        try {
            const result = await db.exec(sql,[])
            if(result.length >=0){
                res.json({
                    code:200,
                    message:'获取数据成功',
                    data:result
                })
            }else{
                res.json({
                    code:401,
                    message:'获取数据失败'
                })
            }
        } catch (error) {
            res.json({
                code:500,
                message:'服务器内部错误'+error
            })
        }
    }

    // 获取周时间和时间段
    async getWeekAndPeriod(req,res,next){
        const sql = 'select * from week'
        const sql1 = 'select * from time'
        try {
            const result = await db.exec(sql,[])
            const result1 = await db.exec(sql1,[])
            if(result.length>=0&&result1.length>=0){
                res.json({
                    code:200,
                    message:'数据获取成功',
                    data:[result,result1]
                })
            }else{
                res.json({
                    code:200,
                    message:'数据获取失败'
                })
            }
        } catch (error) {
            res.json({
                code:500,
                message:'服务器内部错误'
            })
        }
    }

    // 新增特殊场地
    async addSpecialVenue(req,res,next){
        const params =[
            req.body.use_type,
            req.body.tid,
            req.body.pid,
            req.body.wid,
            req.body.per_id,
            req.body.use_class
        ]
        const sql ='insert into special_venue(`use_type`,`tid`,`pid`,`wid`,`per_id`,`use_class`) values(?,?,?,?,?,?)'
        try {
            const result =await db.exec(sql,params)
            if(result.affectedRows >=1){
                res.json({
                    code:200,
                    message:'数据更新成功'
                })
            }else{
                res.json({
                    code:401,
                    message:'数据更新失败'
                })
            }
        } catch (error) {
            res.json({
                code:500,
                message:'服务器内部错误'
            })
        }
    }

    // 删除特殊场地信息
    async deleteSpeciaVenueInfo(req,res,next){
        const sql = 'delete from special_venue where id = ? '
        try {
            const result = await db.exec(sql,req.body.id)
            if(result.affectedRows >=1){
                res.json({
                    code:200,
                    message:'数据删除成功'
                })
            }else{
                res.json({
                    code:401,
                    message:'数据删除失败'
                })
            }
        } catch (error) {
            res.json({
                code:500,
                message:'服务器内部错误'
            })
        }
    }

    // 更新特殊场地信息
    async updateSpeciaVenueInfo(req,res,next){
        const params = [
            req.body.use_type,
            req.body.tid,
            req.body.pid,
            req.body.wid,
            req.body.per_id,
            req.body.use_class,
            req.body.id
        ]
        const sql = 'update special_venue set use_type=?, tid=?, pid=?, wid=?, per_id=?, use_class=? where id=?'
        try {
            const result = await db.exec(sql,params)
            if(result.affectedRows >=1){
                res.json({
                    code:200,
                    message:'数据更新成功'
                })
            }else{
                res.json({
                    code:401,
                    message:'数据更新失败'
                })
            }
        } catch (error) {
            res.json({
                code:500,
                message:'服务器内部错误'+error
            })
        }
    }

    // 新增活动
    async addActivity(req,res,next){
        const params = [
            req.body.activityName,
            req.body.activityType,
            req.body.department,
            req.body.dateTime,
            req.body.des,
            req.body.status
        ]
        const sql = 'insert into activity (activityName,activityType,department,dateTime,des,status) values(?,?,?,?,?,?)'
        try {
            const result = await db.exec(sql,params)
            if(result.affectedRows >=1){
                res.json({
                    code:200,
                    message:'数据更新成功'
                })
            }else{
                res.json({
                    code:401,
                    message:'数据更新失败'
                })
            }
        } catch (error) {
            res.json({
                code:500,
                message:'服务器内部错误'
            })
        }
    }

    // 获取全部全部活动
    async getAllActivityList(req,res,next){
        const sql = 'select * from activity'
        try {
            const result = await db.exec(sql,[])
            if(result.length>=0){
                res.json({
                    code:200,
                    messge:'获取数据成功',
                    data:result
                })
            }else{
                res.josn({
                    code:401,
                    message:'数据获取失败'
                })
            }
        } catch (error) {
            res.json({
                code:500,
                message:'服务器内部错误'
            })
        }
    }

    // 修改活动信息
    async updateActivityInfo(req,res,next){
        const params = [
            req.body.activityName,
            req.body.activityType,
            req.body.department,
            req.body.dateTime,
            req.body.des,
            req.body.status,
            req.body.id
        ]
        const sql = 'update activity set activityName=?,activityType=?,department=?,dateTime=?,des=?,status=? where id=?'
        try {
            let result = await db.exec(sql,params)
            if(result.affectedRows >=1){
                res.json({
                    code:200,
                    message:'数据更新成功'
                })
            }else{
                res.json({
                    code:401,
                    message:'数据更新失败'
                })
            }
        } catch (error) {
            res.json({
                code:500,
                message:'服务器内部错误'+error
            })
        }
    }

    // 删除活动
    async deleteActivity(req,res,next){
        const sql = 'delete from activity where id = ?'
        try {
            const result = await db.exec(sql,req.body.id)
            if(result.affectedRows >=1){
                res.json({
                    code:200,
                    message:'删除数据成功'
                })
            }else{
                res.json({
                    code:401,
                    message:'删除数据失败'
                })
            }
        } catch (error) {
            res.json({
                code:500,
                message:'服务器内部错误'+error
            })
        }
    }

    // 上传首页图片
    uploadActivityImg(req,res,next){
        const multipleFile = upload.array('activity',6)
        // let uid = parseInt(req.headers['uid'])
        multipleFile(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                console.log('---errMulterError---', err);
            } else if (err) {
                console.log('---err---', err);
            }

            try {
                let result
                for (let i = 0; i < req.files.length; i++) {
                    // 重新设置存储在数据库的 url 地址，去掉前面的public字符串方便读取
                    let destination = req.files[i].destination
                    let url = `${destination}/${req.files[i].filename}`
                    
                    let params = [ url]
                    let sql = "insert into home_img(imgurl) values(?)"
                    result = await db.exec(sql,params)
                }
                if(result.affectedRows>=1){
                    res.json({
                        code:200,
                        message:'上传成功'
                    })
                }else{
                    res.json({
                        code:'401',
                        message:'上传失败'
                    })
                }
            } catch (error) {
                res.json({
                    code:500,
                    message:'服务器内部错误'
                })
            }
            
            
                
            
    
            
    
        })
    }

    // 获取首页图片地址
    async getIndexImgUrl(req,res,nect){
        let sql = 'select * from home_img order by id desc limit 6'
        try {
            let result = await db.exec(sql,[])
            // console.log(result)
            if(result.length>=0){
                result.forEach(item => {
                    item.imgurl = `http://127.0.0.1:8090/api/getindexImg?` + item.imgurl
                });
                // console.log(result)
                res.json({
                    code:200,
                    message:'数据获取成功',
                    data:result
                })
            }else{
                res.json({
                    code:404,
                    message:'数据获取失败'
                })
            }
        } catch (error) {
            res.json({
                code:500,
                message:'服务器内部错误'+error
            })
        }
    }

    // 读取首页图片api
    async getindexImg(req,res,next){
        const pathStr = path.join(path.resolve(__dirname,'../activity'), req.url.substring(21))
        // console.log(req.url)
        // console.log(pathStr)
        fs.stat(pathStr,(err,stat)=>{  //判断文件是否存在
            if(err){      //判断过程出错
                
                return  console.log(err);
            }
            let exsit = stat.isFile();   //回调，返回true||false
            if(exsit){                  //存在：true,将文件处理成文件流发送到客户端
                let data = fs.createReadStream(pathStr)
                data.pipe(res);
            }else{                         //不存在：返回默认图片
                let moren = fs.createReadStream(path.resolve(__dirname,'../avatar/moren.png'))
                moren.pipe(res)
            }
        })
    }

    // 获取全部留言信息
    async getAllMessage(req,res,next){
        let sql = 'select user.uid,content,time,reply,message.status,username,xuehao,message.id from message,user where message.uid=user.uid'
        try {
            let result = await db.exec(sql,[])
            if(result.length>=0){
                res.json({
                    code:200,
                    message:'获取数据成功',
                    data:result
                })
            }else{
                res.json({
                    code:404,
                    message:'获取数据失败'
                })
            }
        } catch (error) {
            res.json({
                code:500,
                message:'服务器内部错误'+error
            })
        }
    }

    // 回复留言
    async replyMessage(req,res,next){
        const params = [req.body.reply,req.body.id]
        // console.log(params)
        let sql = 'update message set reply=?,status=0 where id=?'
        try {
            let result = await db.exec(sql,params)
            if(result.affectedRows >=1){
                res.json({
                    code:200,
                    message:'数据更新成功'
                })
            }else{
                res.json({
                    code:401,
                    message:'数据更新失败'
                })
            }
        } catch (error) {
            res.json({
                code:500,
                message:'服务器内部错误'+error
            })
        }
    }
}



module.exports = new AdminController();