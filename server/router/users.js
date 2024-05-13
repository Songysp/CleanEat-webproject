const express = require('express');
const {validate} = require('../middleware/validator.js');
const { isAuth } = require('../middleware/middleware.js');
const router = express.Router();
const path = require('path');
const userController = require('../controller/users.js');
const {body} = require('express-validator');

// router.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '../public/info/main.html'));
// });



const validateLogin = [
    body('email').trim().isEmail().withMessage('이메일 형식 확인하세요'),
    body('password').trim().isLength({min:4}).withMessage('password는 최소 4자 이상 입력해주세요'),
    validate
]

const validateSignup = [
    ...validateLogin,
    body('name').trim().notEmpty().withMessage('name을 입력하세요'),
    body('email').trim().isEmail().withMessage('이메일 형식 확인하세요'),
    validate
]


router.post('/signup', validateSignup, userController.signup);

router.post('/login', userController.login);

router.get('/login' , (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/login_regist/index.html'));
});

// router.get('/', isAuth, userController.me);
router.get('/', (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        // return res.send('로그인이 필요합니다');
        return res.redirect('/me/login');
    }
    next();
}, isAuth, userController.me);

router.get('/mypage', (req, res) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        // return res.send('로그인이 필요합니다');
        return res.redirect('/me/login');
    }
    res.sendFile(path.join(__dirname, '../../public/info/main.html'));
});


router.use(express.static(path.join(__dirname, '../../public/login_regist')));
router.use(express.static(path.join(__dirname, '../../public/info')));

module.exports = router;