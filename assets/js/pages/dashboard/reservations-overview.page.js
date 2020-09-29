parasails.registerPage('reservations-overview', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {

    scheduleDisplayDate: undefined,
    scheduleStartsOn: undefined,
    schedule: undefined,

    // For the dropdowns in the "create reservation" form
    partySizeOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    startTimeOptions: undefined,
    startDateOptions: undefined,


    // For loading & error states
    syncing: '',
    cloudError: '',

    // For forms
    formData: { /* … */ },
    formRules: { /* … */ },
    formErrors: { /* … */ },

    // Modal:
    modal: '',
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
    console.log('startTimeOptions »',this.startTimeOptions);
    this.startDateOptions = [{value: moment().format('YYYY-MM-DD'), displayName: moment().format('ddd DD/MM')}];
    // We'll allow for booking today + the next 30 days
    while(this.startDateOptions.length <= 30) {
      let previousOption = _.last(this.startDateOptions);
      this.startDateOptions.push({
        value: moment(previousOption.value).add(1, 'days').format('YYYY-MM-DD'),
        displayName: moment(previousOption.value).add(1, 'days').format('ddd DD/MM')
      });
    }
    console.log('startDateOptions »',this.startDateOptions);
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    clickPreviousButton: async function() {
      await this._changeDay(moment(this.scheduleStartsOn).subtract(1, 'days').format('YYYY-MM-DD'));
    },

    clickNextButton: async function() {
      await this._changeDay(moment(this.scheduleStartsOn).add(1, 'days').format('YYYY-MM-DD'));
    },

    clickBookButton: function(timeSlot) {
      this.formData = {
        guestName: '',
        guestEmailAddress: '',
        partySize: 2,
        startDate: this.scheduleStartsOn,
        startTime: timeSlot,
      };
      this.formRules = {
        guestName: {required: true},
        guestEmailAddress: {required: true, isEmail: true},
        // No need to include partySize, startDate, startTime since
        // they're pre-filled <select> fields and can't be empty.
      };
      this.modal = 'create-reservation';
    },

    submittedCreateReservation: async function(newReservationId) {
      // If reservation is on a day other than the one we're viewing, switch to that day so we can see it;
      // otherwise, add the reservation to the page.
      if(this.formData.startDate !== this.scheduleStartsOn) {
        await this._changeDay(this.formData.startDate);
      } else {
        this.schedule[this.formData.startTime].reservations.push({
          id: newReservationId,
          guestName: this.formData.guestName,
          guestEmailAddress: this.formData.guestEmailAddress,
          partySize: this.formData.partySize,
        });
      }
      this.closeModal();
    },

    closeModal: function() {
      this.modal = '';
      this.cloudError = '';
      this.formData = {};
      this.formRules = {};
      this.formErrors = {};
    },

    _changeDay: async function(startsOn) {
      this.scheduleStartsOn = startsOn;
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
