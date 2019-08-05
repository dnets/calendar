// Moon phase
function setState(value, showCircle, showRect) {

  let circle = document.getElementById('layoverCircle');
  let rect = document.getElementById('layoverRectangle');

  circle.style.display = showCircle ? "block" : "none";
  rect.style.display = showRect ? "block" : "none";

  if (showRect) rect.style.transform = value
  if (showCircle) circle.setAttribute("cx", value);
}

function getMoonPhase(year, month, day) {
  var c = e = jd = b = 0;

  if (month < 3) {
    year--;
    month += 12;
  }
  ++month;
  c = 365.25 * year;
  e = 30.6 * month;
  jd = c + e + day - 694039.09; //jd is total days elapsed
  jd /= 29.5305882; //divide by the moon cycle
  b = parseInt(jd); //int(jd) -> b, take integer part of jd
  jd -= b; //subtract integer part to leave fractional part of original jd
  b = Math.round(jd * 8); //scale fraction from 0-8 and round
  if (b >= 8) {
    b = 0; //0 and 8 are the same so turn 8 into 0
  }


  // 0 => New Moon 37.5 [show circle, hide rect]
  // 1 => Waxing Crescent Moon 50.5 [show circle, hide rect]
  // 2 => Quarter Moon //translateX(50%), [display rect, hide circle]
  // 3 => Waxing Gibbous Moon 70.5 [show circle, hide rect]
  // 4 => Full Moon [hide circle and rect]
  // 5 => Waning Gibbous Moon, -15.5 [show circle, hide rect]
  // 6 => Last Quarter Moon //transform: translateX(-50%) [display rect, hide circle]
  // 7 => Waning Crescent Moon 30.5 [show circle, hide rect]

  return b;
}

let d = new Date();
let i = 0;
let callback = function () {
  let phase = getMoonPhase(d.getFullYear(), d.getMonth() + 1, d.getDate() + i)
  if (phase == 0) {
    setState(37.5, true, false);
    $('.phase').text('Новолуние');
  }
  if (phase == 1) {
    setState(50.5, true, false);
    $('.phase').text('Молодая Луна');
  }
  if (phase == 2) {
    setState("translateX(50%)", false, true);
    $('.phase').text('Первая Четверть');
  }
  if (phase == 3) {
    setState(70.5, true, false);
    $('.phase').text('Прибывающая луна');
  }
  if (phase == 4) {
    setState(NaN, false, false);
    $('.phase').text('Полнолуние');
  }
  if (phase == 5) {
    setState(-15.5, true, false);
    $('.phase').text('Убывающая Луна');
  }
  if (phase == 6) {
    setState("translateX(-50%)", false, true);
    $('.phase').text('Последняя Четверть');
  }
  if (phase == 7) {
    setState(30.5, true, false);
    $('.phase').text('Старая Луна');
  }
  setTimeout(callback, 1000);
};
callback();

function startTime() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById('txt').innerHTML =
    h + ":" + m + ":" + s;
  var t = setTimeout(startTime, 500);
}
function checkTime(i) {
  if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
  return i;
}

$(function () {

  // Create Mayan calendar and pass it a canvas object
  var renderer = new Mayan.Renderer(document.getElementById('stela'));

  var tzolkin_days = Mayan.tzolkin_days;
  // Update the calendar with a count (number of days since Mayan creation date)
  var updateCount = function (count) {

    // Update target date for transitioning
    renderer.targetCal.setFromCount(count);

    // Update slider tooltip
    var text = mayan_days_to_gregorian_str(count);
    sliderTooltip.options.title = text;
    refreshTooltip(sliderTooltip);

    console.log(renderer.targetCal);
    var date_now = new Date;
    $('.gregorian').text(date_now.toDateString());
    $('.long').text(renderer.targetCal.baktun + '.' + renderer.targetCal.katun + '.' + renderer.targetCal.tun + '.' + renderer.targetCal.winal + '.' + renderer.targetCal.kin);
    $('.tzolkin').text(renderer.targetCal.tzolkin.day + '.' + renderer.targetCal.tzolkin.num + ' (' + tzolkin_days[renderer.targetCal.tzolkin.day] + ')');
    $('.haab').text(renderer.targetCal.haab.day + '.' + renderer.targetCal.haab.month + ' (' + renderer.haab_months[renderer.targetCal.haab.month] + ')');
    $('.lord').text(renderer.targetCal.lords.lord);
    // Wrap every letter in a span
    var textWrapper = document.querySelector('.long');
    textWrapper.innerHTML = textWrapper.textContent.replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>");
  };


  // Create an initial Mayan count representing today's date
  var initialCount = gregorian_to_mayan_days.apply(null, todaysdate());

  // Initialize the slider
  $('#slider').slider({
    min: 1000000,
    max: 2880000,
    step: 1,
    slide: function (evt, ui) { updateCount(ui.value); },
    change: function (evt, ui) { updateCount(ui.value); },
    value: initialCount,
  });

  // Initialize the slider tooltip
  var sliderHandle = $('#slider .ui-slider-handle');
  sliderHandle.tooltip({ title: ' ', trigger: "manual", placement: "bottom" });
  sliderHandle.tooltip("show");
  var sliderTooltip = sliderHandle.data('tooltip');

  // Set the initial date
  updateCount(initialCount);

  // Load all the glyph images and start animation when done
  Mayan.loadGlyphs(function () {
    renderer.stela.updateCanvasSize();
    requestAnimationFrame(function () { renderer.render(); });
  });

  // Custom
});