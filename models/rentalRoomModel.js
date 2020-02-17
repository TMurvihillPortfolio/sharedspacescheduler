const mongoose = require('mongoose');
const slugify = require('slugify');

const rentalRoomSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Room name is required.'],
            unique: true,
            maxlength: [40, 'Room name must have less than 41 characters.'],
            validate: {
                validator: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                message:
                    'Room name must contain only letters, numbers, and dashes and must not start with a dash.'
            }
        },
        slug: String,
        size: {
            type: String,
            enum: {
                values: ['sm', 'med', 'lg'],
                message: 'Size must be one of the following: lg, med, sm.'
            }
        },
        roomType: {
            type: String,
            enum: {
                values: [
                    'counselling',
                    'massage',
                    'studio/classroom',
                    'chiropractic',
                    'other'
                ],
                message:
                    'RoomType must be one of the following: counselling, massage, studio/classroom, chiropractic, other '
            }
        },
        width_ft: {
            type: Number
        },
        length_ft: {
            type: Number
        },
        equipment: [],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

rentalRoomSchema.virtual('width_meters').get(function() {
    return (this.width_ft * 0.3048).toFixed(2);
});
rentalRoomSchema.virtual('length_meters').get(function() {
    return (this.length_ft * 0.3048).toFixed(2);
});
rentalRoomSchema.virtual('area_ft').get(function() {
    return (this.length_ft * this.width_ft).toFixed(2);
});
rentalRoomSchema.virtual('area_meters').get(function() {
    return (this.length_meters * this.width_meters).toFixed(2);
});

rentalRoomSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

const RentalRoom = mongoose.model('RentalRoom', rentalRoomSchema);

module.exports = RentalRoom;
