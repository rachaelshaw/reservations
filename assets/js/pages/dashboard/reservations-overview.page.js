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

    // For the dropdowns in the "create reservation" form
    startTimeOptions: undefined,
    startDateOptions: undefined,
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
    // console.log('schedule »',this.schedule);
    // Build up the options for our dropdown menus.
    this.startTimeOptions = _.keys(this.schedule);
    // console.log('startTimeOptions »',this.startTimeOptions);
    this.startDateOptions = [{value: moment().format('YYYY-MM-DD'), displayName: moment().format('ddd DD/MM')}];
    // We'll allow for booking today + the next 30 days
    while(this.startDateOptions.length <= 30) {
      let previousOption = _.last(this.startDateOptions);
      this.startDateOptions.push({
        value: moment(previousOption.value).add(1, 'days').format('YYYY-MM-DD'),
        displayName: moment(previousOption.value).add(1, 'days').format('ddd DD/MM')
      });
    }
    // console.log('startDateOptions »',this.startDateOptions);
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    clickPreviousButton: async function() {
      this.scheduleStartsOn = moment(this.scheduleStartsOn).subtract(1, 'days').format('YYYY-MM-DD');
      await this._getReservationSchedule();
      this.scheduleDisplayDate = moment(this.scheduleStartsOn).format('ddd DD/MM');
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
