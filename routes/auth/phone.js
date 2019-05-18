import config from '../../config.js';
import twilio from 'twilio';

const accountSid = config.accountSid; // Your Account SID from www.twilio.com/console
const authToken = config.authToken;   // Your Auth Token from www.twilio.com/console

const client = new twilio(accountSid, authToken);

module.exports = (app, Confirm)=>{
    app.post("/phoneAuth", async (req,res) => {
        const phone = req.body.phone;
        let token = Math.floor(Math.random() * 9000) + 1000; //랜덤 네자리수 생성
        let contents = '[ㅁㅆㅁㅌ] 휴대폰 인증을 위해 인증번호 ['+token+']를 입력해 주세요.'
        client.messages.create({
            body: contents,
            to: '+82' + phone,  // Text this number 국가번호 +82
            from: '+12053509816' // From a valid Twilio number
        })
        .then( async (message) => {
            let confirm = await new Confirm({phone: phone, token: token});
            //찾아서 있으면 업데이트 없으면 추가(upsert)
            await Confirm.findOneAndUpdate({phone: phone}, {token: token}, {upsert: true}, (err)=>{
                if(err) {
                    res.status(400).json({"message":"error!"}); 
                } else {
                    console.log(message.sid);
                    res.status(200).json(confirm); 
                }
            });
        },
            (error) => {
                console.error(error);
                res.status(401).json(error);
            }
        )
    })
    .post("/aa", async (req,res) => {
        var result = await Confirm.find()
        res.send(result)
    })

    .post("/phoneAuthCheck", async (req,res) => {
        //인증번호 확인하면 삭제
        await Confirm.findOneAndRemove({phone:req.body.phone, token: req.body.token}, (err, data)=>{
            if (err){            
                res.send(err);
            } else {
                if( data == null){
                    res.status(204).json({message: "인증에 실패하였습니다."});
                }
                else res.status(200).send({message: "성공적으로 인증되었습니다."});
            }
        }); 
    });
}