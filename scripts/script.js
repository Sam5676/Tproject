function changeLanUa(){
    document.querySelector('.header__button_lang_ua').style.opacity = "0.5";
    document.querySelector('.header__button_lang_ru').style.opacity = "1";
}
function changeLanRu(){
    document.querySelector('.header__button_lang_ua').style.opacity = "1";
    document.querySelector('.header__button_lang_ru').style.opacity = "0.5";
}

function showInstruction() {
    if(ValidPhone()) {
        var oldElem = document.querySelector('.input-number-js');
        var newElem = document.querySelector('.main__change-input').content;

        var phoneNum = document.querySelector('.num-notification__phone-number').value;

        document.querySelector('.main').replaceChild(
            newElem.cloneNode(true), oldElem);

        var content = document.querySelector('.main__hidden-instructions').content;

        // Обновление чего-нибудь в DOM шаблона.
        document.querySelector('.tooltip-instructions').appendChild(
            content.cloneNode(true));
        document.querySelector('.main__tooltip-phone-number').innerHTML = phoneNum;

        var oneHalfMinutes = 90,
            display = document.querySelector('.time');
        startTimer(oneHalfMinutes, display);
    }
}

function startTimer(duration, display) {
    var start = Date.now(),
        diff,
        minutes,
        seconds,
        stop = (duration+1)*1000;
    function timer() {
        diff = duration - (((Date.now() - start) / 1000) | 0);

        minutes = (diff / 60) | 0;
        seconds = (diff % 60) | 0;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;
        if (diff <= 0) {

            start = Date.now() + 1000;
        }

        if(diff===0){
            var oldElem = document.querySelector('.main__instruction-timer');
            var newElem = document.querySelector('.call-me').content;

            document.querySelector('.tooltip-instructions').replaceChild(
                newElem.cloneNode(true), oldElem);
        }
    };


    timer();
    // clearInterval(timer);
    setTimeout(function() {
        clearInterval(timeID);
    }, stop);
    var timeID = setInterval(timer, 1000);
}

function callAnimation(){
    document.querySelector('.phone-icon-container-js').classList.add('phone-icon-container');
    document.querySelector('.call').value ="Вас вызывает +380660000023";
}

function ValidPhone() {
    var output;
    var re = /^[\d \+]{11,13}\d$/;
    var myPhone = document.querySelector('.num-notification__phone-number').value;
    var valid = re.test(myPhone);
    if (valid) output = true;
    else output = false;
    console.log(output);
    return output;
}

function showSettings(){
    var oldElem = document.querySelector('.main');
    var newElem = document.querySelector('.grant-rights').content;

    document.querySelector('.main-screen').replaceChild(
        newElem.cloneNode(true), oldElem);

    document.querySelector('.cam-next').style.display="block";
    document.querySelector('.all-pages').style.backgroundImage="none";
}

function requestAccess(){
    var first = document.querySelector('.grant-rights__container');
    var last = document.querySelector('.demo-test').content;

    document.querySelector('.video-container').style.visibility="visible";
    document.querySelector('.cam-next').style.display="none";


// нет необходимости в предварительном removeChild(last)
    document.querySelector('.main-screen').replaceChild(
        last.cloneNode(true), first);

}

function showPreview(){
    var oldElem = document.querySelector('.some-instructions');
    var newElem = document.querySelector('.preview').content;

    document.querySelector('.main-screen').replaceChild(
        newElem.cloneNode(true), oldElem);
}

function letsBegin() {
    var oldElem = document.querySelector('.preview__container');
    var newElem = document.querySelector('.interrogation').content;

    document.querySelector('.main-screen').replaceChild(
        newElem.cloneNode(true), oldElem);

    document.querySelector('.cams-controller').style.display = "block";
    document.querySelector('.videos').style.width = "100%";
}