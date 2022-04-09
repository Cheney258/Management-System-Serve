const db = require("../core/mysql");
const moment = require("moment");
const md5 = require("md5");
const config = require('../mysql/config')
const multer = require('multer')
const upload = require('../controller/upload')
const path = require('path')
const fs = require('fs');
// json web token
const jwt = require("jwt-simple");



class UserController {

    //post 注册的
    async register(req, res, next) {

        let insertSql = 'INSERT INTO user(`name`,`xuehao`,`pwd`,`sex`,`email`,`phone`)VALUES(?,?,?,?,?,?) ; ';
        let params = [
            req.body.username,
            req.body.xuehao,
            md5(req.body.password + config.key),
            req.body.sex,
            req.body.email,
            req.body.phone
        ];

        try {
            let result = await db.exec(insertSql, params);
            if (result && result.affectedRows >= 1) {
                res.json({
                    code: 200,
                    message: "注册成功",
                })
            } else {
                res.json({
                    code: 400,
                    message: "注册失败",
                })
            }

        } catch (error) {
            res.json({
                code: -200,
                message: "服务器异常",
                error
            })
        }
    }
    // 登录
    async login(req, res, next) {

        let loginSql = "SELECT uid FROM user WHERE name=? AND pwd=? AND role=?;";
        
        let params = [
            req.body.username,
            //md5的2次加密
            md5(req.body.password + config.key),
            req.body.role
        ]
        // console.log(req)
        try {
            let result = await db.exec(loginSql, params);

            if (result && result.length >= 1) {
                
                res.json({
                    code: 200,
                    message: "登录成功",
                    data:result[0],
                    token: createToken(result[0])
                })
            } else {
                res.json({
                    code: 400,
                    message: "用户名或密码错误",
                })
            }
        } catch (error) {
            res.json({
                code: -200,
                message: "登录失败",
                error
            })
        }


        function createToken(data) {

            return jwt.encode({
                exp: Date.now() + (1000 * 60 * 60 * 24),
                info: data
            }, config.tokenKey);

        }

    }

    // 获取用户信息
    async getInfo(req,res,next) {
        const token = req.headers['token']
        // console.log(token)
        const result = jwt.decode(token,config.tokenKey)
        // console.log(result)
        const uid = result.info.uid
        let sql = 'select name,username,xuehao,sex,email,phone,uid,status,avatar from user where uid=?'
        try {
            let result = await db.exec(sql,uid)
            if(result.length >= 1){
                result[0].avatar = `http://127.0.0.1:8090/api/getAvatarImg?`+result[0].avatar
                let content = {
                    code:200,
                    message:'获取用户信息成功',
                    data:result[0]
                }
                res.send(content)
            }else{
                res.json({
                    code: 400,
                    message:'获取用户信息失败'
                })
            }
        } catch (error) {
            res.json({
                code:-200,
                message:'服务器异常'+error
            })
        }
        
    }

    // 更新用户数据
    async updateInfo(req,res,next) {
        // console.log('111')
        
        const sql = 'select * from user where uid=? and pwd=?'
        // console.log(req.body.password,req.body.uid)
        
        const params2 = [req.body.uid,md5(req.body.password + config.key)]
        try {
            let result = await db.exec(sql,params2)
            console.log(result)
            if(result.length >= 1) {
                const sqlStr = 'update user set name=?, xuehao=?, pwd=?, sex=?, email=?, phone=? where uid=?'
                let params = [
                    req.body.username,
                    req.body.xuehao,
                    md5(req.body.password2 + config.key),
                    req.body.sex,
                    req.body.email,
                    req.body.phone,
                    req.body.uid
                ];
                console.log(params)
                try {
                    let results = await db.exec(sqlStr,params)
                    if(results.affectedRows >= 1) {
                        res.json({
                            code:200,
                            message:'更新成功！'
                        })
                    }else{
                        res.json({
                            code: 400,
                            message:'未知错误'
                        })
                    }
                } catch (error) {
                    res.json({
                        code:-200,
                        message:'更新失败！'
                    })
                }
            }else{
                res.json({
                    code: 400,
                    message:'原密码错误！'
                })
            }
        } catch (error) {
            res.json({
                code:-200,
                message:'服务器异常！'
            })
        }
    }

    // 上传用户头像
    uploadAvatar(req,res,next){
        const multipleFile = upload.array('avatar',1)
        let uid = parseInt(req.headers['uid'])
        multipleFile(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                console.log('---errMulterError---', err);
            } else if (err) {
                console.log('---err---', err);
            }
            
            for (let i = 0; i < req.files.length; i++) {
                let sql = "update user set avatar=? where uid = ?"
                // 重新设置存储在数据库的 url 地址，去掉前面的public字符串方便读取
                let destination = req.files[i].destination.substring(14)
                let url = `${destination}${req.files[i].filename}`
                // console.log(url)
                let params = [ url, uid ]
                try {
                    const result = await db.exec(sql,params)
                    if(result.affectedRows >=1){
                        res.json({
                        code:200,
                        message:'更新成功',
                        })
                    }else{
                        res.json({
                            code:400,
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
                
            
    
            
    
        })
    }

    // 获取用户头像
    getAvatar(req,res,next){
        const pathStr = path.join(path.resolve(__dirname,'../avatar'), req.url.substring(14))
        fs.stat(pathStr,(err,stat)=>{  //判断文件是否存在
            if(err){      //判断过程出错
                let moren = fs.createReadStream(path.resolve(__dirname,'../avatar/moren.png'))
                return  moren.pipe(res);
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

    // 获取用户活动申请记录
    async myApply(req,res,next) {
        // console.log(req.body)
        let params = req.body.uid
        // console.log(params)
        let sql = 'SELECT gid,gamename,gametype,activityType,class,gametime,description,apptime,status,code FROM gameapp WHERE gameapp.uid =?'
            try {
                let result = await db.exec(sql,params)
                if(result.length >=0 ){
                    res.json({
                        code:200,
                        message:'success',
                        data:result
                    })
                }else{
                    res.json({
                        code:400,
                        message:'获取失败'
                    })
                }
            } catch (error) {
                res.json({
                    code:-200,
                    message:'服务器异常'
                })
            }
            
        
    }

    // 获取用户场地申请记录
    async fieldApply(req,res,next){
        const sql = 'select vid,gid,type,position,day_table.day,time.period,apptime,venueapp.`status` from venuetype,venueposit,venueapp,day_table,time where venuetype.tid = venueapp.tid and venueapp.pid = venueposit.pid and uid=? and venueapp.dayid=day_table.id and venueapp.timeid=time.id'
        try {
            const results = await db.exec(sql,req.body.uid)
            if(results.length>=0){
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

    // 获取用户器材申请记录
    async equipApply(req,res,next){
        const sql = 'select * from equiprent,equiptype where uid=? and equiprent.tid = equiptype.tid'
        try {
            const result = await db.exec(sql,req.body.uid)
            if(result.length >= 0){
                res.json({
                    code:200,
                    message:'获取数据成功',
                    data:result
                })
            }else{
                res.json({
                    code:400,
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

    // 添加活动申请
    async addGame(req,res,next){
        console.log(req.body)
        const sql = 'INSERT INTO gameapp(`uid`,`gid`,`gamename`,`activityType`,`gametype`,`apptime`,`gametime`,`description`,`class`)VALUES(?,?,?,?,?,?,?,?,?)'
        const params = [
            req.body.uid,
            req.body.gameId,
            req.body.gameName,
            req.body.activityType,
            req.body.gametype,
            req.body.apptime,
            req.body.gameTime,
            req.body.description,
            req.body.class
        ]
        // console.log(params)
        try {
            let result = await db.exec(sql,params)
            if(result && result.affectedRows >= 1) {
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
            // console.log(error)
            res.json({
                code:-200,
                message:'服务器异常'
            })
        }
    }

    // 获取场地信息
    async getVenueInfo(req,res,next){
        const sql = 'select * from venueposit, venueType where venueposit.tid = venueType.tid'
        try {
            const result = await db.exec(sql,[])
            if(result.length >= 0){
                res.json({
                    code:200,
                    message:'信息获取成功',
                    data:result
                })
            }else{
                res.json({
                    code:400,
                    message:'信息获取失败'
                })
            }
        } catch (error) {
            res.json({
                code: -200,
                message:'服务器异常'
            })
        }
    }

    // 审查审批号，返回活动申请信息
    async check(req,res,next){
        // console.log(req.body)
        const code = req.body.code
        const sql = 'select * from gameapp where code = ?'
        try {
            const results = await db.exec(sql,code)
            if(results.length >= 1){
                // console.log(moment(results[0].gametime).add(7, 'days')+'---'+moment())
                // console.log(moment(results[0].checktime).add(7, 'days')+'---'+moment())
                // console.log(moment(results[0].gametime).add(7, 'days')<moment())
                // console.log(moment(results[0].checktime).add(7, 'days')<moment())
                // console.log(results)
                if(moment(results[0].gametime).add(7, 'days')<moment() || moment(results[0].checktime).add(7, 'days')<moment()){
                    res.json({
                        code:202,
                        message:'该审批号已过期'
                    })
                }else{
                    if(results[0].codestatus ==0){
                        res.json({
                            code:200,
                            message:'存在审批号',
                            data:results[0]
                        })
                    }else{
                        res.json({
                            code:201,
                            message:'该审批号已使用'
                        })
                    }              
                }
            }else{
                res.json({
                    code: 404,
                    message:'不存在审批号'
                })
            }
        } catch (error) {
            res.json({
                code: 500,
                message:'服务器错误'+error
            })
        }
    }

    // 获取场地类型
    async getVenueType(req,res,next){
        // console.log(111)
        const sql = 'select * from venuetype'
        try {
            let results = await db.exec(sql,[])
            if(results.length >= 0){
                res.json({
                    code:200,
                    message:'成功',
                    data:results
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

    // 获取对应类型场地的位置列表
    async getPosition(req,res,next){
        // console.log(req.body)
        const params = req.body.tid
        const sql = 'select pid,position from venueposit where tid = ?'
        try {
            const results = await db.exec(sql,params)
            if(results.length >= 0 ){
                res.json({
                    code:200,
                    message:'获取数据成功',
                    data:results
                })
            }else{
                res.json({
                    code:400,
                    message:'获取数据失败'
                })
            }
        } catch (error) {
            res.json({
                code:-200,
                message:'服务器错误'
            })
        }
    }

    // 提交场地申请
    async submitApply(req,res,next){
        const params = [
            req.body.uid,
            req.body.gid,
            req.body.tid,
            req.body.pid,
            req.body.day,
            req.body.time,
            req.body.apptime,
        ]
        console.log(params)
        const sql = 'INSERT INTO venueapp(`uid`,`gid`,`tid`,`pid`,`dayid`,`timeid`,`apptime`)VALUES(?,?,?,?,?,?,?) ; '
        try {
            let result = await db.exec(sql,params)
            if(result.affectedRows >= 1){
                const params2 = [
                    req.body.pid,
                    req.body.day,
                    req.body.time
                ]
                const sqlStr = 'insert into p_d_t_s(`pid`,`did`,`tid`) values((select p.id from venueposit as p where p.pid=?),?,?)'
                try {
                    const results = await db.exec(sqlStr,params2)
                    if(results.affectedRows >=1){
                        try {
                            const sqlStr2 = 'update gameapp set codestatus=1 where gid=?'
                            let result1 = await db.exec(sqlStr2,req.body.gid)
                            if(result1.affectedRows >=1){
                                res.json({
                                    code:200,
                                    message:'提交成功'
                                })
                            }else{
                                res.json({
                                    code:400,
                                    message:'提交失败'
                                })
                            }
                        } catch (error) {
                            res.json({
                                code:500,
                                message:'服务器内部错误'
                            })
                        }
                    }else{
                        res.json({
                            code:400,
                            message:'提交失败'
                        })
                    }
                } catch (error) {
                    res.json({
                        code:500,
                        message:"服务器内部出错"+error
                    })
                }
                
            }else{
                res.json({
                    code:400,
                    message:'提交失败'
                })
            }
        } catch (error) {
            res.json({
                code:500,
                message:'服务器异常',
                data:error
            })
        }
    }

    // 获取器材类型和器材名称
    async getEquip(req,res,next){
        const sql = 'select eid,type,equipname,equipment.tid from equipment,equiptype where status = 0 and rentstatus = 0 and equipment.tid = equiptype.tid'
        try {
            const results = await db.exec(sql,[])
            if(results.length >= 0){
                res.json({
                    code:200,
                    message:'数据返回成功',
                    data:results
                })
            }else{
                res.json({
                    code:400,
                    message:'数据返回失败'
                })
            }
        } catch (error) {
            res.json({
                code:-200,
                message:'服务器错误'+error
            })
        }
    }

    // 提交器材申请
    async subEquipApp(req,res,next){
        const params = [
            req.body.uid,
            req.body.realname,
            req.body.xuehao,
            req.body.phone,
            req.body.tid,
            req.body.num,
            req.body.start,
            req.body.end
        ]
        const sql = 'INSERT INTO equiprent(`uid`,`username`,`xuehao`,`phone`,`tid`,`amount`,`renttime`,`backtime`)VALUES(?,?,?,?,?,?,?,?)'
        try {
            let results = await db.exec(sql,params)
            if(results.affectedRows >=1 ){
                res.json({
                    code:200,
                    message:'器材申请提交成功'
                })
            }else{
                res.json({
                    code:400,
                    message:'器材申请提交成功'
                })
            }
        } catch (error) {
            res.json({
                code:-200,
                message:'服务器异常' + error
            })
        }
    }

    // 取消申请
    cancelApply(req,res,next){
        const cancel = async (sql,param) =>{
            try {
                const result = await db.exec(sql,param)
                if(result.affectedRows>=1){
                    res.json({
                        code:200,
                        message:'取消成功'
                    })
                }else{
                    res.json({
                        code:400,
                        message:'取消失败'
                    })
                }
            } catch (error) {
                res.json({
                    code:-200,
                    message:'服务器异常'
                })
            }
        }
        if(req.body.rid){   //取消器材申请
            const sqlStr1 = 'update equiprent set status = 3 where rid=?'
            cancel(sqlStr1,req.body.rid)
        }else if(req.body.gid && req.body.vid==''){   //取消活动申请
            const sqlStr2 = 'update gameapp set status = 3 where gid=?'
            cancel(sqlStr2,req.body.gid)
        }else{   // 取消场地申请
            const sqlStr3 = 'update venueapp set status = 3 where vid=?'
            console.log(111)
            cancel(sqlStr3,req.body.vid).then(async () =>{
                const sqlStr4 = 'update gameapp set codestatus = 0 where gid=?'
                try {
                    let data = await db.exec(sqlStr4,req.body.gid)
                    if(data.affectedRows>=1){
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
                    res.end(JSON.stringify({
                        code:500,
                        message:'服务器内部错误'+error
                    }))
                }
            })
        }
    }

    // 查询：获取全部比赛信息
    async getGameList(req,res,next){
        const sql = 'select gameapp.gid,gamename,gametype,class,gameapp.gametime,position from gameapp,venueapp,venueposit where gameapp.activityType ="比赛" and venueapp.`status`<=1 and venueapp.pid = venueposit.pid and gameapp.gid = venueapp.gid'
        try {
            const results = await db.exec(sql,[])
            if(results.length >= 0 ){
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
                message:'服务器异常'+error,
            })
        }
    }

    // 查询：获取全部器材信息
    async getEquipList(req,res,next){
        const sql = 'select * from equipment,equiptype where equipment.tid = equiptype.tid'
        try {
            const results = await db.exec(sql,[])
            if(results.length >= 0 ){
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

    // 获取已发布公告
    async getAnnouncement(req,res,next){
        const sql = 'select * from announcement where status = 1'
        try {
            const results = await db.exec(sql,[])
            if(results.length >=0){
                res.json({
                    code:200,
                    message:'获取数据成功',
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

    // 获取最近七天日期
    async getDateDay(req,res,next){
        const sql = 'select * from day_table where id order by id desc limit 7;'
        try {
            const result = await db.exec(sql,[])
            if(result.length>=0){
                res.json({
                    code:200,
                    message:'获取数据成功',
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
                message:'服务器内部错误'
            })
        }
    }

    // 获取某个地点某天可预约的时间段
    async getTimePeriod(req,res,next){
        // console.log(111)
        const params = [req.body.did,req.body.pid]
        // console.log(params)
        const sql = "SELECT * from time where id not in (SELECT m.tid from p_d_t_s as m where m.did = ? and m.pid = (SELECT id from venueposit where pid=?))"
        try {
            const result = await db.exec(sql,params)
            if(result.length >=0){
                // console.log(111)
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
                message:'服务器内部错误'
            })
        }
    }

    // 提交留言
    async subMessage(req,res,next){
        let params = [
            req.body.uid,
            req.body.message,
            req.body.time
        ]
        let sql = 'insert into message(uid,content,time) values(?,?,?)'
        try {
            let result = await db.exec(sql,params)
            if(result.affectedRows >=1){
                res.json({
                    code:200,
                    message:'数据插入成功'
                })
            }else{
                res.json({
                    code:401,
                    message:'数据插入失败'
                })
            }
        } catch (error) {
            res.json({
                code:500,
                message:'服务器内部错误'+error
            })
        }
    }

    // 获取个人留言记录
    async getMessageList(req,res,next){
        let sql = 'select * from message where uid=?'
        // console.log(req.body.uid)
        try {
            let result = await db.exec(sql,req.body.uid)
            if(result.length>=0){
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

    // 删除
    async deletesMessage(req,res,next){
        let sql = 'delete from message where id =?'
        try {
            let result = await db.exec(sql,req.body.id)
            if(result.affectedRows >=1){
                res.json({
                    code:200,
                    message:'撤销成功'
                })
            }else{
                res.json({
                    code:401,
                    message:'撤销失败'
                })
            }
        } catch (error) {
            res.json({
                code:500,
                message:'服务器内部错误'
            })
        }
    }

    // 已读消息
    async readedMessage(req,res,next){
        let sql = 'update message set status = 1 where id=?'
        try {
            let result = await db.exec(sql,req.body.id)
            if(result.affectedRows >=1){
                res.json({
                    code:200,
                    message:'数据更新成功'
                })
            }else{
                res.json({
                    code:401,
                    message:'数据更更新失败'
                })
            }
        } catch (error) {
            res.json({
                code:500,
                message:'服务器内部错误'
            })
        }
    }

    // 获取留言已回复未读 的条数
    async getNoReadedNum(req,res,next){
        let sql = 'select * from message where uid=? and status = 0'
        try {
            let result = await db.exec(sql,req.body.uid)
            if(result.length >=0){
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
                message:'服务器内部错误'
            })
        }
    }

    // 获取未读公告
    async getNoReadedAnnoun(req,res,next){
        let sql = "SELECT * from announcement where announcement.aid not in (SELECT ann_id FROM user_readed as r where r.uid = ?) and `status`=1"
        try {
            let result = await db.exec(sql,req.body.uid)
            if(result.length >=0){
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

    // 公告已读
    async readedAnnouncement(req,res,next){
        let params =[req.body.uid,req.body.aid]
        let sql = 'REPLACE into user_readed (uid,ann_id) values(?,?)'
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


module.exports = new UserController();
