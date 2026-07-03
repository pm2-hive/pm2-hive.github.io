const debugLog = function() {
  const config = window.MIXPANEL_CONFIG || {};
  if (config.debug) {
    console.log.apply(console, arguments);
  }
};

const form = document.querySelector('form')
const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const successMessage = document.querySelector('.success-message')
const errorMessage = document.querySelector('.error-message')

form.addEventListener('submit', (_e) => {
  _e.preventDefault()

  const dt = {
    fullname: _e.target[0].value + ' ' +_e.target[1].value,
    email: _e.target[2].value,
    company: _e.target[3].value,
    phone: _e.target[4].value,
    process: _e.target[5].value,
    comments: _e.target[6].value
  }

  axios.post('https://pm2automationemgnzyhn-cohorts.functions.fnc.fr-par.scw.cloud', dt).then(res => {
    console.log('Contact inquiry dispatched')
  })

  axios.post('https://pc.cloud.pm2.io/contact', dt).then(res => {
    successMessage.classList.add('active')
    errorMessage.classList.remove('active')
    form.reset()

    if (window.mixpanel && typeof window.mixpanel.track === 'function') {
      window.mixpanel.track('demo_requested');
      debugLog('[Contact Form] Mixpanel event tracked: demo_requested');
    }
  }).catch(err => {
    debugLog('[Contact Form] Error submitting form:', err)
    errorMessage.classList.add('active')
    successMessage.classList.remove('active')
  })
})
