const router = require('express').Router()
//Bring the user eg function
const { userRegister, userlogin, userAuth, serializedUser, checkRole } = require('../utils/Auth');
//User Reg route
router.post('/register-user', async (req, res) => {
    await userRegister(req.body, 'user', res)
})
//Admin Reg route
router.post('/register-admin', async (req, res) => {
    await userRegister(req.body, 'admin', res)
})

//SuperAdmin Reg route
router.post('/register-super-admin', async (req, res) => {
    await userRegister(req.body, 'superadmin', res)
})

//User login route
router.post('/login-user', async (req, res) => {
    await userlogin(req.body, "user", res);
})

//admin login route
router.post('/login-admin', async (req, res) => {
    await userlogin(req.body, "admin", res);
})

//SuperAdmin login route
router.post('/login-super-admin', async (req, res) => {
    await userlogin(req.body, "superadmin", res);
})

// profile route
router.get('/profile', userAuth, async (req, res) => {
    return res.json(serializedUser(req.user))
})

//userprotected Profile route
router.get('/user-protected', userAuth, checkRole(['user']), async (req, res) => {
    return res.json("hello user")
})

//Admin protected Profile route
router.get('/admin-protected', userAuth, checkRole(['admin']), async (req, res) => {
    return res.json("hello admin")
})

//SuperAdmin protected profile route
router.get('/super-admin-protected', userAuth, checkRole(['superadmin']), async (req, res) => {
    return res.json("hello superadmin")
})


//SuperAdmin and admin profile route
router.post('/super-admin and admin-protected', userAuth, checkRole(['superadmin', 'admin']), async (req, res) => {

})

module.exports = router;