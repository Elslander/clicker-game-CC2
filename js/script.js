/* -----Global variables----- */
let name = "";
let place = "";

const $game = document.querySelector('.game');

const $backgroundAudio = document.querySelector('.background__audio');
$backgroundAudio.volume = 0.2;

const growthRate = 1.15; // For upgrade price increase

let droplets = parseFloat(localStorage.getItem('droplets')) || 0;
let income = parseInt(localStorage.getItem('income')) || 0;

// Upgrades
const $dropUpgradeButton = document.querySelector('.droplet__value--upgrade');
let dropletValue = parseInt(localStorage.getItem('dropletValue')) || 1;
let raindropValueUpgradePrice = parseInt(localStorage.getItem('raindropValueUpgradePrice')) || 50;
let raindropValueUpgradeLevel = parseInt(localStorage.getItem('raindropValueUpgradeLevel')) || 0;

const $raindropTimingUpgradeButton = document.querySelector('.raindrop__timing--upgrade');
let raindropTiming = parseInt(localStorage.getItem('raindropTiming')) || 1500; // Starting value for interval
let raindropIntervalId; // To stop or restart the interval
let raindropTimingPrice = parseInt(localStorage.getItem('raindropTimingPrice')) || 75;
let raindropTimingLevel = parseInt(localStorage.getItem('raindropTimingLevel')) || 0;

const $cupUpgradeButton = document.querySelector('.cup__collector--upgrade');
let cupUpgradePrice = parseInt(localStorage.getItem('cupUpgradePrice')) || 100;
let cupUpgradeLevel = parseInt(localStorage.getItem('cupUpgradeLevel')) || 0;

const $raincloudUpgradeButton = document.querySelector('.raincloud__value--upgrade');
let raincloudValue = parseInt(localStorage.getItem('raincloudValue')) || 5;
let raincloudValueUpgradePrice = parseInt(localStorage.getItem('raincloudValueUpgradePrice') || 150);
let raincloudValueUpgradeLevel = parseInt(localStorage.getItem('raincloudValueUpgradeLevel') || 0);

const $bucketUpgradeButton = document.querySelector('.bucket__collector--upgrade');
let bucketUpgradePrice = parseInt(localStorage.getItem('bucketUpgradePrice')) || 200;
let bucketUpgradeLevel = parseInt(localStorage.getItem('bucketUpgradeLevel')) || 0;

const $barrelUpgradeButton = document.querySelector('.barrel__collector--upgrade');
let barrelUpgradePrice = parseInt(localStorage.getItem('barrelUpgradePrice')) || 500;
let barrelUpgradeLevel = parseInt(localStorage.getItem('barrelUpgradeLevel')) || 0;

const $puddleUpgradeButton = document.querySelector('.puddle__collector--upgrade');
let puddleUpgradePrice = parseInt(localStorage.getItem('puddleUpgradePrice')) || 1000;
let puddleUpgradeLevel = parseInt(localStorage.getItem('puddleUpgradeLevel')) || 0;

// Stats
let totalClicks = parseInt(localStorage.getItem('totalClicks')) || 0;
let totalEarnings = parseInt(localStorage.getItem('totalEarnings')) || 0;
let totalClouds = parseInt(localStorage.getItem('totalClouds')) || 0;
let totalUpgrades = parseInt(localStorage.getItem('totalUpgrades')) || 0;
const startTime = Date.now();
let totalPlaytime = 0;

/* -----Other functions----- */
const handleUserInputs = () => {
    name = document.querySelector('#name').value;
    place = document.querySelector('#place').value;

    const $name = document.querySelector('.user__name');
    if (name != "") {
        $name.textContent = name;
    }

    const $place = document.querySelector('.user__place');
    if (place != "") {
        $place.textContent = place;
    }
}

const handleAudioButtonClick = () => {
    const $audioOn = document.querySelector('.audio__on');
    $audioOn.classList.toggle('hidden');
    const $audioOff = document.querySelector('.audio__off');
    $audioOff.classList.toggle('hidden');

    if ($backgroundAudio.paused == true) {
        $backgroundAudio.play();
    }

    if ($backgroundAudio.muted === false) {
        $backgroundAudio.muted = true;
    } else {
        $backgroundAudio.muted = false;
    }
}

const rainCloud = () => {
    const $rainCloud = document.createElement('div');
    const minLeft = window.innerWidth * 0.20;
    const maxLeft = window.innerWidth * 0.75;
    const minTop = window.innerHeight * 0.25;
    const maxTop = window.innerHeight * 0.75;

    $rainCloud.style.left = `${randomNumber(minLeft, maxLeft)}px`;
    $rainCloud.style.top = `${randomNumber(minTop, maxTop)}px`;
    $rainCloud.classList.add('raincloud');
    $game.appendChild($rainCloud);

    setTimeout(() => {
        $rainCloud.remove();
    }, 5000);
}

const handleRaincloudClick = event => {
    if (event.target.classList.contains('raincloud')) {
        event.target.remove();

        droplets += raincloudValue;
        totalEarnings += raincloudValue;
        totalClouds += 1;

        updateAllText();

        playRaincloudSoung();
    }
}

const playRaincloudSoung = () => {
    const cloudSound = new Audio('assets/loud-thunder-192165.mp3');
    cloudSound.volume = 0.4;
    if ($backgroundAudio.muted === true) {
        cloudSound.muted = true;
    }
    cloudSound.play();
}

// Raindrop creation + click action
const rainDrop = () => {
    // Create raindrop (div)
    const $rainDrop = document.createElement('div');
    const min = window.innerWidth * 0.19;
    const max = window.innerWidth * 0.76;
    $rainDrop.style.left = `${randomNumber(min, max)}px`;
    $rainDrop.classList.add('raindrop');
    $game.appendChild($rainDrop);

    // Make the raindrop fall
    let speed = randomNumber(1.5, 3.5);
    let position = 0;

    function fall() {
        position += speed;
        $rainDrop.style.top = `${position}px`;

        if (position < window.innerHeight) {
            requestAnimationFrame(fall);
        } else {
            $rainDrop.remove();
        }
    }

    fall();

    console.log(raindropTiming);
}

const handleRaindropClick = event => {
    if (event.target.classList.contains('raindrop')) {
        event.target.remove();

        droplets += dropletValue;
        totalEarnings += dropletValue;
        totalClicks += 1;
        updateAllText();

        playRaindropSoung();
    }
}

const playRaindropSoung = () => {
    const dropSound = new Audio('assets/water-drip-45622.mp3');
    dropSound.volume = 0.4;
    if ($backgroundAudio.muted === true) {
        dropSound.muted = true;
    }
    dropSound.play();
}

const handleDropValueUpgradeClick = () => {
    if (droplets >= raindropValueUpgradePrice) {
        droplets -= raindropValueUpgradePrice;

        dropletValue += 1;
        raindropValueUpgradeLevel += 1;
        raindropValueUpgradePrice = Math.round(50 * Math.pow(growthRate, raindropValueUpgradeLevel));

        totalUpgrades += 1;
    }

    updateAllText();
}

const handleRaindropTimingUpgradeClick = () => {
    if (raindropTiming > 200) {
        if (droplets >= raindropTimingPrice) {
            droplets -= raindropTimingPrice;

            raindropTimingLevel += 1;
            raindropTimingPrice = Math.round(75 * Math.pow(growthRate, raindropTimingLevel));
            raindropTiming -= 100;

            totalUpgrades += 1;

            startRaindropInterval(); // <-- THIS restarts the interval with new timing
        }
    }

    updateAllText();
}

const handleCupUpgradeClick = () => {
    let cupCollecting = 1;

    if (droplets >= cupUpgradePrice) {
        droplets -= cupUpgradePrice;

        cupUpgradeLevel += 1;
        cupUpgradePrice = Math.round(100 * Math.pow(growthRate, cupUpgradeLevel));

        totalUpgrades += 1;
        income += cupCollecting;
    }

    updateAllText();
}

const handleRaincloudValueUpgradeClick = () => {
    if (droplets >= raincloudValueUpgradePrice) {
        droplets -= raincloudValueUpgradePrice;

        raincloudValue += 5;
        raincloudValueUpgradeLevel += 1;
        raincloudValueUpgradePrice = Math.round(150 * Math.pow(growthRate, raincloudValueUpgradeLevel));
    }

    updateAllText();
}

const handleBucketUpgradeClick = () => {
    let bucketCollecting = 5;

    if (droplets >= bucketUpgradePrice) {
        droplets -= bucketUpgradePrice;

        bucketUpgradeLevel += 1;
        bucketUpgradePrice = Math.round(200 * Math.pow(growthRate, bucketUpgradeLevel));

        totalUpgrades += 1;
        income += bucketCollecting;
    }

    updateAllText();
}

const handleBarrelUpgradeClick = () => {
    let barrelCollecting = 10;

    if(droplets >= barrelUpgradePrice) {
        droplets -= barrelUpgradePrice;

        barrelUpgradeLevel += 1;
        barrelUpgradePrice = Math.round(500 * Math.pow(growthRate, barrelUpgradeLevel));

        totalUpgrades += 1;
        income += barrelCollecting;
    }

    updateAllText();
}
const handlePuddleUpgradeClick = () => {
    let puddleCollecting = 20;

    if(droplets >= puddleUpgradePrice) {
        droplets -= puddleUpgradePrice;

        puddleUpgradeLevel += 1;
        puddleUpgradePrice = Math.round(1000 * Math.pow(growthRate, puddleUpgradeLevel));

        totalUpgrades += 1;
        income += puddleCollecting;
    }

    updateAllText();
}

const passiveIncome = () => {
    droplets += income;
    totalEarnings += income;

    updateAllText();
}

/* -----Init function----- */
const init = () => {
    updateAllText();
    showTutorialPopup();

    const $inputs = document.querySelectorAll('.form__input');
    $inputs.forEach($input => $input.addEventListener('input', handleUserInputs));

    const $audioButton = document.querySelector('.functions__audio');
    $audioButton.addEventListener('click', handleAudioButtonClick);

    clickables();
    setInterval(passiveIncome, 1000);
    setInterval(checkTrophies, 100);
    setInterval(checkEnoughDroplets, 100);

    handleUpgradePurchase();
    handleMenuItemClick();
}

const clickables = () => {
    setInterval(rainCloud, 60000);
    document.body.addEventListener('click', handleRaincloudClick);

    startRaindropInterval();
    document.body.addEventListener('click', handleRaindropClick);
}

const showTutorialPopup = () => {
    const $instructionsButton = document.querySelector('#trigger--instructions');

    if (localStorage.length === 0) {
        $instructionsButton.click();
    }
}

const handleUpgradePurchase = () => {
    $dropUpgradeButton.addEventListener('click', handleDropValueUpgradeClick);
    $raindropTimingUpgradeButton.addEventListener('click', handleRaindropTimingUpgradeClick);
    $cupUpgradeButton.addEventListener('click', handleCupUpgradeClick);
    $raincloudUpgradeButton.addEventListener('click', handleRaincloudValueUpgradeClick);
    $bucketUpgradeButton.addEventListener('click', handleBucketUpgradeClick);
    $barrelUpgradeButton.addEventListener('click', handleBarrelUpgradeClick);
    $puddleUpgradeButton.addEventListener('click', handlePuddleUpgradeClick);
}

const handleMenuItemClick = () => {
    const $saveButton = document.querySelector('.save__progress');
    $saveButton.addEventListener('click', () => { saveProgress(); });

    const $resetButton = document.querySelector('.reset__progress');
    $resetButton.addEventListener('click', () => { resetProgress(); });
}

/* -----Usefull functions----- */
// This clears the interval before restarting it with the new timing.
const startRaindropInterval = () => {
    clearInterval(raindropIntervalId);
    raindropIntervalId = setInterval(rainDrop, raindropTiming);
}

const randomNumber = (min, max) => {
    return Math.random() * (max - min) + min;
}

const checkSessionPlaytime = () => {
    const now = Date.now();
    return Math.round((now - startTime) / 1000);
}

const checkPlaytime = () => {
    const sessionTime = checkSessionPlaytime();
    let savedPlaytime = parseInt(localStorage.getItem('totalPlaytime')) || 0;
    totalPlaytime = savedPlaytime + sessionTime;
    return totalPlaytime;
}

const formatTime = (seconds) => {
    const hours = ((Math.floor(seconds / 3600)).toString()).padStart(2, '0');
    const minutes = ((Math.floor((seconds % 3600) / 60)).toString()).padStart(2, 'O');
    const secs = ((seconds % 60).toString()).padStart(2, '0');

    return `${hours} hrs ${minutes} mins ${secs} secs`;
}

/* -----Update Text----- */
const updateAllText = () => {
    updateBalanceText();
    updateUpgradeText();
    updateStatisticsText();
}

const updateBalanceText = () => {
    const $balanceAmount = document.querySelector('.amount__number');
    $balanceAmount.textContent = `${droplets.toString()}`;

    const $passiveIncome = document.querySelector('.top__passive');
    if (income == 1) {
        $passiveIncome.textContent = `${income} drop per second`
    } else {
        $passiveIncome.textContent = `${income} drops per second`
    }
}

const updateUpgradeText = () => {
    const $dropletValue = document.querySelector('.top__click');
    $dropletValue.textContent = `${dropletValue.toString()} per click`;
    const $raindropValueUpgradePrice = document.querySelector('.droplet__value--price');
    $raindropValueUpgradePrice.textContent = `${raindropValueUpgradePrice} drops`;
    const $raindropValueUpgradeLevel = document.querySelector('.droplet__value--level');
    $raindropValueUpgradeLevel.textContent = `lvl ${raindropValueUpgradeLevel}`;

    const $raindropTimingPrice = document.querySelector('.raindrop__timing--price');
    $raindropTimingPrice.textContent = `${raindropTimingPrice} drops`;
    const $raindropTimingLevel = document.querySelector('.raindrop__timing--level');
    if (raindropTiming > 200) {
        $raindropTimingLevel.textContent = `lvl ${raindropTimingLevel}`;
    } else {
        $raindropTimingLevel.textContent = `lvl MAX`;
        $raindropTimingPrice.textContent = `--- drops`;
    }

    const $cupUpgradePrice = document.querySelector('.cup__collector--price');
    $cupUpgradePrice.textContent = `${cupUpgradePrice} drops`;
    const $cupUpgradeLevel = document.querySelector('.cup__collector--level');
    $cupUpgradeLevel.textContent = `lvl ${cupUpgradeLevel}`;

    const $raincloudValueUpgradePrice = document.querySelector('.raincloud__value--price');
    $raincloudValueUpgradePrice.textContent = `${raincloudValueUpgradePrice} drops`;
    const $raincloudValueUpgradeLevel = document.querySelector('.raincloud__value--level')
    $raincloudValueUpgradeLevel.textContent = `lvl ${raincloudValueUpgradeLevel}`;

    const $bucketUpgradePrice = document.querySelector('.bucket__collector--price');
    $bucketUpgradePrice.textContent = `${bucketUpgradePrice} drops`;
    const $bucketUpgradeLevel = document.querySelector('.bucket__collector--level');
    $bucketUpgradeLevel.textContent = `lvl ${bucketUpgradeLevel}`;

    const $barrelUpgradePrice = document.querySelector('.barrel__collector--price');
    $barrelUpgradePrice.textContent = `${barrelUpgradePrice} drops`;
    const $barrelUpgradeLevel = document.querySelector('.barrel__collector--level');
    $barrelUpgradeLevel.textContent = `lvl ${barrelUpgradeLevel}`;
    
    const $puddleUpgradePrice = document.querySelector('.puddle__collector--price');
    $puddleUpgradePrice.textContent = `${puddleUpgradePrice} drops`;
    const $puddleUpgradeLevel = document.querySelector('.puddle__collector--level');
    $puddleUpgradeLevel.textContent = `lvl ${puddleUpgradeLevel}`;
}

const updateStatisticsText = () => {
    const $totalClicks = document.querySelector('.clicks__number');
    const $totalEarnings = document.querySelector('.earnings__number');
    const $totalClouds = document.querySelector('.clouds__number');
    const $totalUpgrades = document.querySelector('.upgrades__number');
    const $totalPlaytime = document.querySelector('.playtime__number');

    if (totalClicks == 1) {
        $totalClicks.textContent = `${totalClicks} click`;
    } else {
        $totalClicks.textContent = `${totalClicks} clicks`;
    }

    if (totalEarnings == 1) {
        $totalEarnings.textContent = `${totalEarnings} drop`;
    } else {
        $totalEarnings.textContent = `${totalEarnings} drops`;
    }

    if (totalClouds == 1) {
        $totalClouds.textContent = `${totalClouds} cloud`;
    } else {
        $totalClouds.textContent = `${totalClouds} clouds`;
    }

    if (totalUpgrades == 1) {
        $totalUpgrades.textContent = `${totalUpgrades} upgrade`;
    } else {
        $totalUpgrades.textContent = `${totalUpgrades} upgrades`;
    }

    totalPlaytime = checkPlaytime().toString();
    $totalPlaytime.textContent = formatTime(totalPlaytime);
}

/* -----Check Trophies----- */
const checkTrophies = () => {
    const $firstDrop = document.querySelector('#first__drop');
    if (totalEarnings >= 1) {
        $firstDrop.classList.remove('hidden');
    }
    const $rainBeginner = document.querySelector('#rain__beginner');
    if (totalEarnings >= 100) {
        $rainBeginner.classList.remove('hidden');
    }
    const $firstPurchase = document.querySelector('#first__purchase');
    if (totalUpgrades >= 1) {
        $firstPurchase.classList.remove('hidden');
    }
    const $dancingRain = document.querySelector('#dancing__rain');
    if (totalPlaytime >= 300) {
        $dancingRain.classList.remove('hidden');
    }
    const $dropMaster = document.querySelector('#drop__master');
    if (totalEarnings >= 1000) {
        $dropMaster.classList.remove('hidden');
    }
    const $upgradeEnthusiast = document.querySelector('#upgrade__enthusiast');
    if (totalUpgrades >= 10) {
        $upgradeEnthusiast.classList.remove('hidden');
    }
    const $idleIncome = document.querySelector('#idle__income');
    if (income >= 1000) {
        $idleIncome.classList.remove('hidden');
    }
    const $waterTycoon = document.querySelector('#water__tycoon');
    if (totalEarnings >= 10000) {
        $waterTycoon.classList.remove('hidden');
    }
    const $persistentBarrel = document.querySelector('#persitent__barrel');
    if (totalPlaytime >= 1800) {
        $persistentBarrel.classList.remove('hidden');
    }
    const $monsoonMogul = document.querySelector('#monsoon__mogul');
    if (totalEarnings >= 1000000) {
        $monsoonMogul.classList.remove('hidden');
    }
    const $raindropOverlord = document.querySelector('#raindrop__overlord');
    if (totalEarnings >= 1000000000) {
        $raindropOverlord.classList.remove('hidden');
    }
}

/* -----Check if balance is sufficient to buy uograde----- */
function checkEnoughDroplets() {
    raindropValueUpgradeClickable();
    raindropTimingCheck();
    cupUpgradeClickable();
    raincloudValueUpgradeClickable();
    bucketUpgradeClickable();
    barrelUpgradeClickable();
    puddleUpgradeClickable();
}

const raindropValueUpgradeClickable = () => {
    if (droplets < raindropValueUpgradePrice) {
        $dropUpgradeButton.classList.add('upgrade__purchase--bad');
        $dropUpgradeButton.classList.remove('upgrade__purchase--good');
    }
    if (droplets >= raindropValueUpgradePrice) {
        $dropUpgradeButton.classList.remove('upgrade__purchase--bad');
        $dropUpgradeButton.classList.add('upgrade__purchase--good');
    }
}

const raindropTimingCheck = () => {
    if (raindropTiming > 200) {
        raindropTimingUpgradeClickable();
    } else {
        $raindropTimingUpgradeButton.classList.add('upgrade__purchase--bad');
        $raindropTimingUpgradeButton.classList.remove('upgrade__purchase--good');
    }
}

const raindropTimingUpgradeClickable = () => {
    if (droplets < raindropTimingPrice) {
        $raindropTimingUpgradeButton.classList.add('upgrade__purchase--bad');
        $raindropTimingUpgradeButton.classList.remove('upgrade__purchase--good');
    }
    if (droplets >= raindropTimingPrice) {
        $raindropTimingUpgradeButton.classList.remove('upgrade__purchase--bad');
        $raindropTimingUpgradeButton.classList.add('upgrade__purchase--good');
    }
}

const cupUpgradeClickable = () => {
    if (droplets < cupUpgradePrice) {
        $cupUpgradeButton.classList.add('upgrade__purchase--bad');
        $cupUpgradeButton.classList.remove('upgrade__purchase--good');
    }
    if (droplets >= cupUpgradePrice) {
        $cupUpgradeButton.classList.remove('upgrade__purchase--bad');
        $cupUpgradeButton.classList.add('upgrade__purchase--good');
    }
}

const raincloudValueUpgradeClickable = () => {
    if (droplets < raincloudValueUpgradePrice) {
        $raincloudUpgradeButton.classList.add('upgrade__purchase--bad');
        $raincloudUpgradeButton.classList.remove('upgrade__purchase--good');
    }
    if (droplets >= raincloudValueUpgradePrice) {
        $raincloudUpgradeButton.classList.remove('upgrade__purchase--bad');
        $raincloudUpgradeButton.classList.add('upgrade__purchase--good');
    }
}

const bucketUpgradeClickable = () => {
    if (droplets < bucketUpgradePrice) {
        $bucketUpgradeButton.classList.add('upgrade__purchase--bad');
        $bucketUpgradeButton.classList.remove('upgrade__purchase--good');
    }
    if (droplets >= bucketUpgradePrice) {
        $bucketUpgradeButton.classList.remove('upgrade__purchase--bad');
        $bucketUpgradeButton.classList.add('upgrade__purchase--good');
    }
}

const barrelUpgradeClickable = () => {
    if(droplets < barrelUpgradePrice) {
        $barrelUpgradeButton.classList.add('upgrade__purchase--bad');
        $barrelUpgradeButton.classList.remove('upgrade__purchase--good');
    }
    if(droplets >= barrelUpgradePrice) {
        $barrelUpgradeButton.classList.remove('upgrade__purchase--bad');
        $barrelUpgradeButton.classList.add('upgrade__purchase--good');
    }
}

const puddleUpgradeClickable = () => {
    if(droplets < puddleUpgradePrice) {
        $puddleUpgradeButton.classList.add('upgrade__purchase--bad');
        $puddleUpgradeButton.classList.remove('upgrade__purchase--good');
    }
    if(droplets >= puddleUpgradePrice) {
        $puddleUpgradeButton.classList.remove('upgrade__purchase--bad');
        $puddleUpgradeButton.classList.add('upgrade__purchase--good');
    }
}

/* -----save & reset----- */
const saveProgress = () => {
    localStorage.setItem('droplets', droplets);
    localStorage.setItem('income', income);

    // Upgrades
    localStorage.setItem('dropletValue', dropletValue);
    localStorage.setItem('raindropValueUpgradePrice', raindropValueUpgradePrice);
    localStorage.setItem('raindropValueUpgradeLevel', raindropValueUpgradeLevel);

    localStorage.setItem('raindropTimingPrice', raindropTimingPrice);
    localStorage.setItem('raindropTimingLevel', raindropTimingLevel);
    localStorage.setItem('raindropTiming', raindropTiming);

    localStorage.setItem('cupUpgradePrice', cupUpgradePrice);
    localStorage.setItem('cupUpgradeLevel', cupUpgradeLevel);

    localStorage.setItem('raincloudValue', raincloudValue);
    localStorage.setItem('raincloudValueUpgradePrice', raincloudValueUpgradePrice);
    localStorage.setItem('raincloudValueUpgradeLevel', raincloudValueUpgradeLevel);

    localStorage.setItem('bucketUpgradePrice', bucketUpgradePrice);
    localStorage.setItem('bucketUpgradeLevel', bucketUpgradeLevel);

    localStorage.setItem('barrelUpgradePrice', barrelUpgradePrice);
    localStorage.setItem('barrelUpgradeLevel', barrelUpgradeLevel);
    
    localStorage.setItem('puddleUpgradePrice', puddleUpgradePrice);
    localStorage.setItem('puddleUpgradeLevel', puddleUpgradeLevel);

    // Statistics
    localStorage.setItem('totalUpgrades', totalUpgrades);
    localStorage.setItem('totalClicks', totalClicks);
    localStorage.setItem('totalEarnings', totalEarnings);
    localStorage.setItem('totalPlaytime', totalPlaytime);
    localStorage.setItem('totalClouds', totalClouds);
}

const resetProgress = () => {
    localStorage.clear();
    location.reload();
}

/* -----Call init----- */
init();