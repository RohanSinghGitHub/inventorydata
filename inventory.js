const mongoose = require('mongoose');

const inventorySchema = mongoose.Schema({
        productId: {
                type: String
        },
        quantity: {
                type: String
        }
})


const inventoryModal = mongoose.model("Inventory Details", inventorySchema);

module.exports = inventoryModal;