import mongoose from "mongoose";
import slugify from "slugify";

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "A tour must have a name"],
            unique: true,
            maxlength: [40, "A tour name must have less than 40 characters"],
            minlength: [10, "A tour name must have more than 10 characters"],
            validate: {
                message: "A tour name must have only letters",
                validator: function (val) {
                    const pattern = /^([A-Z][a-z])[\w\s]+$/g;
                    return pattern.test(val);
                },
            },
        },
        duration: {
            type: Number,
            required: [true, "A tour must have a duration"],
        },
        maxGroupSize: {
            type: Number,
            required: [true, "A tour must have a maximum group size"],
        },
        difficulty: {
            type: String,
            required: [true, "A tour must have a difficulty"],
            enum: {
                values: ["easy", "medium", "difficult"],
                message: "Difficulty must be either: easy, medium or difficult.",
            },
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, "Rating must be above 1.0"],
            max: [5, "Rating must be below 5.0"],
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: [true, "A tour must have a price"],
        },
        priceDiscount: {
            type: Number,
            validate: {
                message: "Discount price ({VALUE}) must be less than the regular price",
                validator: function (val) {
                    return val < this.price;
                },
            },
        },
        summary: {
            type: String,
            trim: true,
            required: [true, "A tour must have a summary"],
        },
        description: {
            type: String,
            trim: true,
        },
        imageCover: {
            type: String,
            required: [true, "A tour must have a cover image"],
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        startDates: [Date],
        slug: String,
        isSecret: {
            type: Boolean,
            default: false,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

tourSchema.virtual("durationWeeks").get(function () {
    return this.duration / 7;
});

// "this" no pre-middleware pega o documento que vai ser atualizado/salvo
tourSchema.pre("save", function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// "this" não existe no post, mas o doc funciona como ele
// tourSchema.post("save", function (doc, next) {
//     console.log(doc);
//     next();
// });

// this aqui retorna a query
tourSchema.pre(/^find/, function (next) {
    this.find({ isSecret: { $ne: true } });
    this.start = Date.now();
    next();
});

tourSchema.post(/^find/, function (docs, next) {
    console.log(Date.now() - this.start);
    next();
});

tourSchema.pre("aggregate", function (next) {
    this.pipeline().unshift({ $match: { isSecret: { $ne: true } } });
    console.log(this.pipeline());
    next();
});

export const Tour = mongoose.model("Tour", tourSchema);
