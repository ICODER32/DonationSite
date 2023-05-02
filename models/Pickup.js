const mongoose = require('mongoose');

const pickUpSchema = new mongoose.Schema({
    donator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    charity: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pickup_status: { type: String, required: true },
    item_name: { type: String, required: true },
    item_id: { type: String, required: true },
    image: { type: String, required: true },
    pickup_status: { type: String, required: true, default: 'Requested' },
    time_slot: { type: [String] },
    city: { type: String, required: true },

});



const Pickup = mongoose.model('pickup', pickUpSchema);

module.exports = Pickup;
