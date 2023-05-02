const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    item_name: { type: String, required: true },
    item_type: { type: String, required: true },
    image: { type: String, required: true },
    condition: { type: String, required: true },
    dimensions: { type: String, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    charity_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    city: { type: String },
    country: { type: String },
    donation_status: { type: String, default: "Available" }
});

itemSchema.pre('save', async function (next) {
    try {
        const user = await mongoose.model('User').findById(this.user_id);
        this.city = user.city;
        this.country = user.country;
        next();
    } catch (err) {
        next(err);
    }
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
