const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Item = require('../models/Item')
const Pickup = require('../models/Pickup')

router.get('/', (req, res) => {
    const user_id = req.cookies.user_id;
    if (user_id) {
        res.redirect('/profile')
    }
    res.render('index')
})

router.get('/login', (req, res) => {
    const user_id = req.cookies.user_id;
    if (user_id) {
        res.redirect('/profile')
    }
    res.render('login')

})
router.get('/signup', (req, res) => {
    const user_id = req.cookies.user_id;
    if (user_id) {
        res.redirect('/profile')
    }
    res.render('signup')

})
router.get('/donations', async (req, res) => {
    const user_type = req.cookies.user_type
    const user_id = req.cookies.user_id
    try {
        let data;
        if (user_type === 'Donator') {

            data = await Pickup.find({ donator: user_id })

        } else {
            data = await Pickup.find({ charity: user_id })
        }
        res.render('donations', {
            user_type,
            data
        })
    } catch (error) {

    }


})
router.get('/items', async (req, res) => {
    const user_id = req.cookies.user_id;
    try {
        const data = await Item.find({ donation_status: { $ne: 'Requested' } });
        res.render('items', {
            data,
            user_id
        });
    } catch (error) {
        res.redirect('/error');
    }
});


router.get('/profile', async (req, res) => {
    const user_id = req.cookies.user_id
    try {
        if (user_id) {
            const user = await User.findOne({ _id: user_id })
            const { fullname, email, phone_num, type, country, city } = user
            res.render('profile', {
                fullname,
                email, phone_num, city, country, type
            })
        } else {
            res.redirect('/login')
        }
    } catch (error) {
        res.redirect('/error')
    }

})


router.get('/item/:id', async (req, res) => {
    const id = req.params.id
    const user_id = req.cookies.user_id
    try {
        const data = await Item.findOne({ _id: id })
        let own_item = user_id == data.user_id
        const username = (await User.findOne({ _id: data.user_id })).fullname
        res.render('item-details', { data, username, own_item })
    } catch (error) {
        res.status(400).redirect('/error')
    }
})

router.get('/upload', (req, res) => {
    res.render('upload-item')
})

router.get('/request/:id', async (req, res) => {
    const id = req.params.id
    const { donator, charity, item_name, city, image } = await Pickup.findOne({ _id: id })
    const { country, fullname } = await User.findOne({ _id: donator })

    res.render('request', { image, city, country, fullname, item_name, id })
})

router.get('/accept/:id', async (req, res) => {
    const id = req.params.id;
    await Pickup.findByIdAndUpdate(id, { pickup_status: 'Accepted' })
    res.redirect('/')
})
router.get('/reject/:id', async (req, res) => {
    const id = req.params.id

    try {
        const { item_id } = await Pickup.findOne({ _id: id })

        await Item.findByIdAndUpdate(item_id, { donation_status: 'Available' })
        await Pickup.findByIdAndDelete(id)
        res.redirect('/donations')
    } catch (error) {
        res.status(404).redirect('/error')
    }


})
router.get('/confirmslot/:id', async (req, res) => {
    const id = req.params.id
    const { image, donator, _id } = await Pickup.findOne({ _id: id })
    const { fullname, city, country } = await User.findOne({ _id: donator })
    res.render('send_timeslots', {
        image, fullname, country, city, _id
    })
})

router.get('/confirmTime/:id', async (req, res) => {
    try {
        const id = req.params.id
        const { time_slot, image, donator } = await Pickup.findById(id)
        const { fullname, country, city } = await User.findOne({ _id: donator })

        res.render('select_timeslots', {
            date: time_slot[0],
            time1: time_slot[1],
            time2: time_slot[2],
            time3: time_slot[3],
            image,
            fullname,
            country,
            city, id
        })
    } catch (error) {
        res.redirect('/error')
    }

})

router.get('/final/:id', async (req, res) => {
    const id = req.params.id
    try {
        await Pickup.findByIdAndUpdate(id, { time_slot: [date] }, { new: true })

        res.status(200).send('ok')
    } catch (error) {
        res.redirect('/error')
    }
})
router.get('/finalScreeen/:id', async (req, res) => {

    const id = req.params.id
    const { donator, time_slot } = await Pickup.findByIdAndUpdate(id, { pickup_status: "Ready to Pickup" }, { new: true })
    const { fullname, city, country } = await User.findOne({ _id: donator })
    res.render('final_screen', {
        fullname, city, country, time: time_slot[0], date: time_slot[2]
    })
})
module.exports = router