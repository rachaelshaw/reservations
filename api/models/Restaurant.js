/**
 * Restaurant.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    name: {
      type: 'String',
      required: true,
    },

    tz: {
      type: 'string',
      required: true,
      description: 'The time zone in which this restaurant\'s reservations are booked.',
      custom: (tz) => require('moment-timezone').tz.names().includes(tz),
      moreInfoUrl: 'https://en.wikipedia.org/wiki/List_of_tz_database_time_zones',
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
    reservationAvailability: {
      type: 'json',
      description: 'A dictionary representing the total reservations available in each 15-minute time slot of the day.',
      // e.g.
      // {
      //   '12:00am': 0,
      //   '12:15am': 0,
      //   '12:30am': 0,
      //   …
      //   '12:00pm': 3,
      //   '12:15pm': 3,
      //   '12:30pm': 3,
      //   …
      // }
    }

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    // n/a

  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeCreate: function (valuesToSet, proceed) {
    // Build up the default `reservationAvailability`
    let availability = {};
    let hour = 0;
    let minutes = 0;
    while(hour < 24) {
      let key = `${_.padLeft(''+hour, 2, '0')}:${minutes === 0? '00' : minutes}`;
      availability[key] = 0;
      if(minutes === 45) {
        hour++;
        minutes = 0;
      } else {
        minutes += 15;
      }
    }
    valuesToSet.reservationAvailability = availability;
    return proceed();
  }

};

