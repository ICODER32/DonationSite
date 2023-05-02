const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Item = require('../models/Item')
const Pickup = require('../models/Pickup')

router.post('/', async (req, res) => {
    const charity = req.cookies.user_id
    const { item_id } = req.body


    try {
        const { user_id, city, image, item_name } = (await Item.findOne({ _id: item_id }))
        const data = new Pickup({
            donator: user_id,
            image,
            item_name,
            item_id,
            charity,
            city
        })
        await data.save()
        const response = await Item.findByIdAndUpdate(item_id, { donation_status: 'Requested' })
        res.redirect('/donations')
    } catch (error) {
        res.redirect('/error')

    }
})


router.post('/update', async (req, res) => {
    const { date, item_id, time1, time2, time3 } = req.body;

    try {
        const response = await Pickup.findByIdAndUpdate(item_id, { pickup_status: 'Confirmation Time', time_slot: [date, time1, time2, time3] })
        res.redirect('/')
    } catch (error) {
        console.log(error)
    }

})
module.exports = router