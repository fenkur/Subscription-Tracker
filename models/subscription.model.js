import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription name is required'],
        trim: true,
        minLength: 2,
        maxLength: 50,
    },
    price: {
        type: Number,
        required: [true, 'Subscription price is required'],
        min: [0, 'Subscription price must be greater than 0'],
    },
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP'],
        required: [true, 'Subscription currency is required'],
        default: 'USD',
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
    },
    category: {
        type: String,
        enum: ['Food', 'Health', 'Travel', 'Entertainment', 'Others'],
        required: [true, 'Subscription category is required'],
    },
    paymentMethod: {
        type: String,
        required: [true, 'Subscription payment method is required'],
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'expired'],
        default: 'active',
    },
    startDate: {
        type: Date,
        required: [true, 'Subscription start date is required'],
        validate: {
            validator: (value) => value < new Date(),
            message: 'Start date must be in the past',
        }
    },
    renewalDate: {
        type: Date,
        validate: {
            validator: function (value) {
                return value > this.startDate;
            },
            message: 'Renewal date must be after the start date',
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Subscription must belong to a user'],
        index: true,
    }
}, { timestamps: true }); 

subscriptionSchema.pre('save', function (next) {
    if(!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        };
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.startDate.getDate() + renewalPeriods[this.frequency]);
    }
    // Auto-update the status if renewal date has passed
    if (this.renewalDate < new Date()) {
        this.status = 'expired';
    }
    next();
})

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;