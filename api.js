const express = require('express');
const app = express.Router();
const {syncAndSeed, Member, Facility, Booking} = require('./db');

module.exports = app;

app.get('/facilities', async (req, res, next) => {
    try{
        const data = await Facility.findAll({include:[Booking]});
        res.send(data);
    }
    catch(err){
        next(err);
    }
    
});

app.get('/bookings', async (req, res, next) => {
    try{
        const data = await Booking.findAll({include:[{model:Member, as: 'booker'}]});
        res.send(data);
    }
    catch(err){
        next(err);
    }
});

app.get('/members', async (req, res, next) => {
    try{
        const data = await Member.findAll({include:[
            {model: Member, as: 'sponsor'},
            {model: Member, as: 'sponsored'}
        ]});

        res.send(data);
    }
    catch(err){
        next(err);
    }
});

syncAndSeed();