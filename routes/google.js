const express = require('express');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');

//const JWTStrategy   = passportJWT.Strategy;
//const ExtractJWT = passportJWT.ExtractJwt;


const { Users } = require('../models/index')

// 라우팅 위한 express 미들웨어. 경로로 마운팅
const router = express.Router();

let id;
let email;

const googleConfig= {
    clientID: process.env.GOOGLE_CLIENTID,
    clientSecret: process.env.GOOGLE_CLIENTSECRET,
    callbackURL: "http://localhost:5000/auth/google/callback"
}

if(googleConfig.clientID){
    passport.use(new GoogleStrategy(googleConfig, 
        // 받아온 인증 토큰, 토큰을 리프레시하여 새롭게 받아온 토큰, 이용자의 프로필정보, 세션에 저장하는 함수 순으로 구성됨
        function(accessToken,refreshToken,profile,done){
            console.log(accessToken);
            console.log(profile.emails);
            // user의 이메일을 등록하고 토큰을 발급해준다
            // user가 이미 존재하면 토큰만 발급
           
            return done(null, profile);
        
        })
    )

}

// 로그인을 요청 할 링크 passport를 통해 로그인 요청이 전송된다.
// authType: rerequest -> 매번 로그인 할 때마다  email을 요청하는 것
router.get('/', passport.authenticate('google', {
   session: false ,authType: 'rerequest', scope: ['profile', 'email']

})
);

// 검증을 마치고 난 결과를 전송해주는 주소
// 토큰을 생성해줘야 한다.
router.get('/callback', passport.authenticate('google', { session: false }), function(req, res) {
    //res.redirect('/');

    Users.
    findOrCreate({
        where: {
            email: req.user.emails[0].value,
        },
        defaults: {
            password: req.id,
        },
    })
    .then(async([user,created]) => {
        const data = await user.get({ plain: true });
        console.log(data);

        id = data.id
        email = data.email
        const payload = { id: id, email: email }
        const token = jwt.sign(payload,process.env.JWT_SECRET,
        { // 토큰 유지 기간 설정 10s' 테스트 완료
            expiresIn: "1 days"
        });
        console.log(token);
        res.status(200).json({  message: 'Successful' ,id: id,email: email, token: token });
    }).catch((err) => {
        res.status(404).json({ err : err.message })
    })

});


// // 세션을 사용하지 않기 때문에 필요하지 않을 듯?
// // 세션에 저장하는 역할
//  passport.serializeUser(function(user, done) {
//      done(null, user);
//    });
//   // 세션 정보가 유효한지 검사하는 역할
//    passport.deserializeUser(function(user, done) {
//      done(null, user);
//    });

module.exports = router;