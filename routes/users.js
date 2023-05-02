const express = require('express')
const { loginUser, signupUser, logout } = require('../controllers/users')
const User = require('../models/User')


const router = express.Router()

router.post('/signup', signupUser)
router.post('/login', loginUser)
router.get('/logout', (req, res) => {
    res.clearCookie('user_id')
    res.clearCookie('user_type')
    res.redirect('/')
})

router.post('/update', async (req, res) => {
    const user_id = req.cookies.user_id
    const { fullname, email, country, phone_num, city, type } = req.body

    try {
        const response = await User.findByIdAndUpdate(user_id, {
            fullname, email, country, phone_num, city, type
        }, { new: true })
        res.clearCookie('user_id')
        res.clearCookie('user_type')
        res.redirect('/')

    } catch (error) {
        res.status(400).redirect('/error')
    }
})

module.exports = router