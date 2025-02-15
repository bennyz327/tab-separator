document.addEventListener("DOMContentLoaded", function() {
        
  const $toggleSwitch = document.querySelector('.js-theme-switcher input[type="checkbox"]');
  const $tabInput = document.querySelector('.js-tab-input');
  const $tabInputCustom = document.querySelector('.js-tab-input-custom');
  const $tabSamples = document.querySelectorAll('.js-tab-sample');
  const $defaultRadios = document.querySelectorAll('input[name="default"]');

  
  const detectTheme = () => {
    let currentTheme = 'light';
      
    if(localStorage.getItem("theme")){
        if(localStorage.getItem("theme") == "dark"){
          currentTheme = "dark";
        }
    } else if (!window.matchMedia) {
        return false;
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        currentTheme = "dark";
    }

    if (currentTheme=="dark") {
        document.documentElement.setAttribute("data-theme", "dark");
    }

    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);        
        if (currentTheme === 'dark') {
            $toggleSwitch.checked = true;
        }
    }
  }

  const tabChange = (e) => {
    console.log('TabChange');
    const newTitle = e.target.value;

    // also renew url params
    document.title = newTitle;
    const params = new URLSearchParams(window.location.search);
    params.set('last', newTitle);

    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  }

  const customChange = (e) => {
    console.log('customChange');
    if (e.target.value && e.target.value !== "") {
      $tabInput.value = e.target.value;
      $tabInput.dispatchEvent(new Event('change', { 'bubbles': true }))
      localStorage.setItem('custom', e.target.value);
    }
  }
  
  const switchTheme = (e) => {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {        
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }    
  }

  const pickSample = (e) => {
    console.log('pickSample');
    // $tabInput.value = `${$tabInput.value}${e.target.textContent}`;
    $tabInput.value = `${e.target.textContent}`;
    $tabInput.dispatchEvent(new Event('change', { 'bubbles': true }))
  }

  const pickDefault = (e) => {
    console.log('pickDefault');
    $ctarget = e.target;
    if ($ctarget.checked && $ctarget.value === 'custom')  {
      localStorage.setItem('default', 'custom');
      $tabInputCustom.disabled = false;
      $tabInputCustom.dispatchEvent(new Event('change', { 'bubbles': true }))
      $tabInputCustom.focus();
    } else if ($ctarget.checked && $ctarget.value === 'random')  {
      localStorage.setItem('default', 'random');
      $tabInputCustom.disabled = true;
    }
  }

  const checkDefault = () => {
    $tabInputCustom.value = localStorage.getItem('custom') || '';
    if (localStorage.getItem("default") && localStorage.getItem("default") === "custom") {
      Array.from($defaultRadios).find(node => node.value === "custom").checked = true;
      Array.from($defaultRadios).find(node => node.value === "custom").dispatchEvent(new Event('change', { 'bubbles': false }));
      $tabInputCustom.dispatchEvent(new Event('change', { 'bubbles': true }))
    } else {
      $tabSamples[Math.floor(Math.random() * $tabSamples.length)].dispatchEvent(new Event('click', { 'bubbles': false }))
      localStorage.setItem('default', 'random');
      Array.from($defaultRadios).find(node => node.value === "random").checked = true;
    }
  }

  const checkParams = () => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('custom')) {
      console.log('custom mode');
      $tabInput.value = params.get('custom');
      $tabInput.dispatchEvent(new Event('change', { 'bubbles': true }))
    } else if (params.get('last')) {
      console.log('last mode');
      const last = params.get('last')
      localStorage.setItem('default', 'custom');
      $tabInput.value = last
    } else {
      console.log('no mode');
      localStorage.removeItem('custom');
      localStorage.setItem('default', 'random');
      $tabInputCustom.disabled = true;
    }
  }

  /**
   * Delegate Events 
   */
  $toggleSwitch.addEventListener('change', switchTheme, false);
  $tabInput.addEventListener('keyup', tabChange, false);
  $tabInput.addEventListener('change', tabChange, false);
  $tabInputCustom.addEventListener('keyup', customChange, false);
  $tabInputCustom.addEventListener('change', customChange, false);
  $tabSamples.forEach(($elm) => {
    $elm.addEventListener('click', pickSample, false);
  });

  $defaultRadios.forEach(($elm) => {
    $elm.addEventListener('change', pickDefault, false);
  });


  detectTheme();
  checkParams();
  checkDefault();
  $tabInput.focus();
  
  
});