import _ from 'lodash'

export default {
  data() {
    return {
      /**
       * Helper property used to store the element states.
       * 
       * @private
       * @type {object}
       * @default {}
       */
      state: {
        dirty: false,
        validated: true,
      },

      /**
       * An array containing all the validators of the element.
       * 
       * @type {array}
       * @default []
       */
      Validators: [],

      /**
       * Message bag that contains computed & custom errors & messages.
       * 
       * @type {MessageBag}
       * @default {MessageBag}
       */
      messageBag: {},
    }
  },
  computed: {
    /**
     * Whether the element's value has been modified by the user.
     * 
     * @type {boolean}
     */
    dirty() {
      return this.state.dirty
    },

    /**
     * Whether the element's input has already been validated at least once.
     * 
     * @type {boolean}
     */
    validated() {
      return this.state.validated
    },

    /**
     * Whether the element has any failing rules.
     * 
     * @type {boolean}
     */
    invalid() {
      return _.some(this.Validators, { invalid: true })
    },

    /**
     * Whether the element has any async rules in progress.
     * 
     * @type {boolean}
     */
    pending() {
      return _.some(this.Validators, { pending: true })
    },

    /**
     * Whether the element has an ongoing debounce.
     * 
     * @type {boolean}
     */
    debouncing() {
      return _.some(this.Validators, { debouncing: true })
    },

    /**
     * Whether the element is `pending` or `debouncing`.
     * 
     * @type {boolean}
     */
    busy() {
      return this.pending || this.debouncing
    },

    /**
     * List of errors of failing rules.
     * 
     * @type {array}
     */
    errors() {
      var errors = []

      _.each(this.Validators, (Validator) => {
        if (Validator.failing) {
          errors.push(Validator.message)
        }
      })

      return errors
    },
  },
  methods: {
    
    /**
     * Validates the element.
     * 
     * @public
     * @returns {void}
     */
    validate() {
      if (this.form$.validation === false) {
        return
      }

      if (!this.schema.rules) {
        return
      }

      _.each(this.Validators, (Validator) => {
        Validator.validate()
      })

      this.state.validated = true
    },

    /**
     * Flag the element as dirty.
     * 
     * @public
     * @returns {void}
     */
    dirt() {
      this.state.dirty = true
    },

    /**
     * Set the validated state to false.
     * 
     * @public
     * @returns {void}
     */
    resetValidators() {
      _.each(this.Validators, (Validator) => {
        Validator.reset()
      })

      this.state.validated = !this.schema.rules
    },

    /**
     * Initalizes validators.
     * 
     * @private
     * @returns {void}
     */
    $_initValidation() {
      if (!this.schema.rules) {
        return
      }

      // If the element has rules it does not
      // qualify as validated by default
      this.state.validated = false

      var factory = new this.$laraform.services.validation.validator.make(this, this.form$)

      _.each(factory.makeValidators(this.schema.rules), (Validator) => {
        this.Validators.push(Validator)
      })
    },

    $_initMessageBag() {
      this.messageBag = new this.$laraform.services.messageBag(this)
    }
  },
  created() {
    this.$_initMessageBag()
  },
  mounted() {
    // nextTick is need  because value changes are
    // possible on default settings and loading
    this.$nextTick(() => {
      this.$watch('value', () => {
        this.dirt()
      }, { deep: true })
    })
    
    this.$_initValidation()
  }
}