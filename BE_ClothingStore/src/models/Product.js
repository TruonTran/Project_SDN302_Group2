const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema(
    {
        size: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            required: true,
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { _id: true }
);

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        discountPrice: {
            type: Number,
            default: 0,
            min: 0,
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },

        images: [
            {
                type: String,
            },
        ],

        variants: [variantSchema],

        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);