parasails.registerPage('reservations-overview', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {

    scheduleDisplayDate: undefined,
    scheduleStartsOn: undefined,
    schedule: undefined,

    // For loading & error states
    syncing: '',
    cloudError: '',

  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Default to today's schedule.
    this.scheduleStartsOn = moment().format('YYYY-MM-DD');
    this.scheduleDisplayDate = moment(this.scheduleStartsOn).format('ddd MM/DD');
  },
  mounted: async function() {
    await this._getReservationSchedule();
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    clickPreviousButton: async function() {
      this.scheduleStartsOn = moment(this.scheduleStartsOn).subtract(1, 'days').format('YYYY-MM-DD');
      await this._getReservationSchedule();
      this.scheduleDisplayDate = moment(this.scheduleStartsOn).format('ddd MM/DD');
    },

    clickNextButton: async function() {
      this.scheduleStartsOn = moment(this.scheduleStartsOn).add(1, 'days').format('YYYY-MM-DD');
      await this._getReservationSchedule();
      this.scheduleDisplayDate = moment(this.scheduleStartsOn).format('ddd MM/DD');
    },

    _getReservationSchedule: async function() {
      this.cloudError = '';
      this.syncing = true;
      let schedule = await Cloud.getReservationSchedule.with({
        startsOn: this.scheduleStartsOn
      })
      .tolerate((err)=>{
        this.cloudError = err;
        this.syncing = false;
      });
      if(!this.cloudError) {
        this.schedule = schedule;
        this.syncing = false;
      }
    },
  }
});
