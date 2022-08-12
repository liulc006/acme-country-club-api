const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL, {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }} 
);

const Member = conn.define('member', {
    id:{
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING(20)
    }
});

Member.belongsTo(Member, { as: 'sponsor'});
Member.hasMany(Member, {foreignKey: 'sponsorId', as: 'sponsored'});

const Facility = conn.define('facility', {
    id:{
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING(20)
    }
});

const Booking = conn.define('booking', {
    id:{
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        primaryKey: true
    }
});

Booking.belongsTo(Member, {as:'booker'});
Member.hasMany(Booking, {foreignKey: 'bookerId'});
Booking.belongsTo(Facility);
Facility.hasMany(Booking);

const syncAndSeed = async () => {
    console.log('starting');

    conn
        .authenticate()
        .then(() => {
        console.log('Connection has been established successfully.');
        })
        .catch(err => {
        console.error('Unable to connect to the database:', err);
        });

    await conn.sync({force: true});

    const [moe, lucy, ethyl, larry] = await Promise.all([
        Member.create({name: 'moe'}),
        Member.create({name: 'lucy'}),
        Member.create({name: 'ethyl'}),
        Member.create({name: 'larry'})
    ]);

    moe.sponsorId = lucy.id;
    larry.sponsorId = lucy.id;
    ethyl.sponsorId = moe.id;

    await Promise.all([
        moe.save(),
        larry.save(),
        ethyl.save()
    ]);

    const [tennis, pingPong, marbles] = await Promise.all([
        Facility.create({name:'tennis'}),
        Facility.create({name:'ping pong'}),
        Facility.create({name:'marbles'}),
    ]);

    await Promise.all([
        Booking.create({bookerId: lucy.id, facilityId: marbles.id}),
        Booking.create({bookerId: lucy.id, facilityId: marbles.id}),
        Booking.create({bookerId: moe.id, facilityId: tennis.id})
    ]);
};

module.exports = {syncAndSeed, Member, Facility, Booking};