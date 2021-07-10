const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter the name'],
        trim: true,
        maxLength: [100, 'Length cannot exceed 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please enter the price'],
        maxLength: [5, 'Price cannot exceed 5 digits'],
        default: 0.0
    },
    description: {
        type: String,
        required: [true, 'Please enter the discription'],
    },
    rating: {
        type: String,
        required: [true, 'Please enter the name'],
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, 'Please select the category of the product'],
        enum: {
            values: [
                'Electronics', 'Laptop', 'Camera', 'Accessories', 'Food',
                'Books', 'Cloths/Shoes', 'Beauty/Health', 'Sports', 'Outdoor', 'Home'
            ],
            messsage: 'Please select correct category'
        }
    },
    seller: {
        type: String,
        required: [true, 'Please enter the seller']
    },
    stock: {
        type: String,
        required: [true, 'Please enter product stock'],
        maxLength: [5, 'Cannot be more than 5 digits'],
        default: 0
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            // user
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Product', productSchema);