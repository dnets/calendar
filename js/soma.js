class CalendarSoma {
  constructor(date = new Date) {
    this.date = date;
    this.date.setHours(12,0,0,0);
    this.oldStartDate = new Date("28 Apr 2018");
    this.startDate = new Date("9 Oct 2021");
    this.daysPassed = this.daysBetween(this.startDate, this.date);
    this.agniCycleLength = 21;
    this.indraCycleLength = 30;
    this.indraWaveCycleLength = 60;
    this.somaCycleLength = 12;
    this.eightyFourCycleLength = 84;
    this.totalCycleLength = 420;
    this.startDayAgni = 21;
    this.startDayIndra = 30;
    this.startDayIndraWave = 60;
    this.startDaySoma = 12;
    this.startDayCycle = 1;
    this.suits = ['wands', 'cups', 'swords', 'pentacles'];
    this.directions = ['east', 'north', 'west', 'south'];
  }

  addOrSubtractDays(startingDate, number, add) {
    if (add) {
      return new Date(new Date().setDate(startingDate.getDate() + number));
    } else {
      return new Date(new Date().setDate(startingDate.getDate() - number));
    }
  }

  romanize (num) {
      if (isNaN(num))
          return NaN;
      var digits = String(+num).split(""),
          key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
                "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
                "","I","II","III","IV","V","VI","VII","VIII","IX"],
          roman = "",
          i = 3;
      while (i--)
          roman = (key[+digits.pop() + (i * 10)] || "") + roman;
      return Array(+digits.join("") + 1).join("M") + roman;
  }

  daysBetween(StartDate, EndDate) {
    // The number of milliseconds in all UTC days (no DST)
    const oneDay = 1000 * 60 * 60 * 24;
    // A day in UTC always lasts 24 hours (unlike in other time formats)
    const start = Date.UTC(EndDate.getFullYear(), EndDate.getMonth(), EndDate.getDate());
    const end = Date.UTC(StartDate.getFullYear(), StartDate.getMonth(), StartDate.getDate());
    // so it's safe to divide by 24 hours
    return (start - end) / oneDay;
  }
  get indra() { return ((this.startDayIndra + this.daysPassed) % this.indraCycleLength) + 1; }
  get indraWave() { 
    let current = ((this.startDayIndraWave + this.daysPassed) % this.indraWaveCycleLength + 1); 
    if (current == 30 || current === 31) return 30;
    else if (current == 1 || current === 60) return 1;
    else if (current > 30) {
      return (60 - current + 1);
    } 
    else {
      return current;
    }
  }
  get agni() { return ((this.startDayAgni + this.daysPassed) % this.agniCycleLength) + 1; }
  get soma() { return ((this.startDaySoma + this.daysPassed) % this.somaCycleLength) + 1; }
  get eightyfour() { return ((this.startDayCycle + this.daysPassed) % this.eightyFourCycleLength) || 84; }
  get todayCycle() { return ((this.startDayCycle + this.daysPassed) % this.totalCycleLength) || 420; }
  get somaCycle() { return Math.ceil((this.todayCycle / this.somaCycleLength)) || 20; }
  get indraCycle() { return Math.ceil((this.todayCycle / this.indraCycleLength)) || 14; }
  get indraWaveCycle() { return Math.ceil((this.todayCycle / this.indraWaveCycleLength)) || 14; }
  get agniCycle() { return Math.ceil((this.todayCycle / this.agniCycleLength)) || 21; }
  get eightyFourCycle() { return Math.ceil((this.todayCycle / this.eightyFourCycleLength)) || 84; }
  get suit() { return this.suits[(this.soma - 1) % 4]; }
  get direction() { return this.directions[(this.soma - 1) % 4]; }
  get tzolkin() { return `${this.soma}.${this.agni}`; }
  get currentDate() { return this.date; }
  toString() { return `${this.soma}.${this.romanize(this.indraWave)}.${this.romanize(this.agni)}`; }
}

class CalendarView {
  constructor(date = new Date) {
    this.calendar = new CalendarSoma(date);
    this.clear();
    $('.day_indra_wave').text(this.calendar.romanize(this.calendar.indraWave));
    $('.day_indra').text(this.calendar.romanize(this.calendar.indra));
    $('.day_agni').text(this.calendar.romanize(this.calendar.agni));
    $('.day_soma').text(this.calendar.soma);
    $('.day_tzolkin').text(this.calendar.tzolkin);
    $('.day_calendar').text(this.calendar.toString());
    this.agniCard();
    this.indraCard();
    this.somaCard();
    this.renderTotalCycles(false);
    $('.day_gregorian').text(''+this.calendar.date.toLocaleDateString('ru-RU')+'');
  }

  clear() {
    $('.totalcycle_indra').html('');
    $('.totalcycle_agni').html('');
    $('.totalcycle_soma').html('');
    $('.totalcycle_eightyfour').html('');
    $('.totalcycle_day_today').html('');
  }

  somaCard() {
    $('.card_soma, .card_soma_overview').attr('src', `img/tarot/minor/${this.calendar.suit}/${this.calendar.soma}.jpg`);
    if (this.calendar.soma <= 10) {
      $('.link_soma').attr('href', `http://psylib.org.ua/books/gomeb01/txt15.htm`);
    } else {
      $('.link_soma').attr('href', `http://psylib.org.ua/books/gomeb01/txt14.htm#5`);
    }
  }

  indraCard() {
    console.log(this.calendar.indraWave);
    if (this.calendar.indraWave < 10) {
      $('.card_indra, .card_indra_overview').attr('src', `img/tarot/major/${this.calendar.indraWave}.jpg`);
      $('.link_indra').attr('href', `http://psylib.org.ua/books/shmak01/txt0${this.calendar.indraWave}.htm`);
    } else if (this.calendar.indraWave == 10) {
      $('.card_indra, .card_indra_overview').attr('src', `img/tarot/major/${this.calendar.indraWave}.jpg`);
      $('.link_indra').attr('href', `http://psylib.org.ua/books/shmak01/txt${this.calendar.indraWave}.htm`);
    } else if (this.calendar.indraWave <= 22) {
      $('.card_indra, .card_indra_overview').attr('src', `img/tarot/major/${this.calendar.indraWave}.jpg`);
      $('.link_indra').attr('href', `http://psylib.org.ua/books/shmak01/txt${this.calendar.indraWave}.htm`);
    } else if (this.calendar.indraWave <= 30) {
      $('.card_indra, .card_indra_overview').attr('src', `img/tarot/blank.jpg`);
      $('.link_indra').attr('href', `http://psylib.org.ua/books/shmak01/txt0${this.calendar.indraWave - 20}.htm`);
    }
  }

  agniCard() {
    $('.card_agni, .card_agni_overview').attr('src', `img/tarot/major/${this.calendar.agni}.jpg`);
    if (this.calendar.agni < 10) {
      $('.link_agni').attr('href', `http://psylib.org.ua/books/shmak01/txt0${this.calendar.agni}.htm`);
    } else {
      $('.link_agni').attr('href', `http://psylib.org.ua/books/shmak01/txt${this.calendar.agni}.htm`);
    }
  }


  renderTotalCycles(writeCycles = true) {
    this.somaCard();
    this.indraCard();
    this.agniCard();
    $('.totalcycle_day_today').html('День ' + this.calendar.todayCycle);
    $('.totalcycle_day_positions').html(this.calendar.soma+'.'+this.calendar.indraWave+'.'+this.calendar.agni);
    $('.totalcycle_day_soma').html(this.calendar.soma + ' день ' + this.calendar.somaCycle + ' цикла');
    $('.totalcycle_day_indra').html(this.calendar.indraWave + ' день ' + this.calendar.indraWaveCycle + ' цикла');
    $('.totalcycle_day_agni').html(this.calendar.agni + ' день ' + this.calendar.agniCycle + ' цикла');
    $('.totalcycle_day_eightyfour').html(this.calendar.eightyfour + ' день ' + this.calendar.eightyFourCycle + ' цикла');
    $('#planetarium-btn').attr('href', 'planetarium/embed.html?direction=' + this.calendar.direction +'&date=' + this.calendar.date.toString());
    if (writeCycles) {
    for (var i = 1; i <= this.calendar.totalCycleLength; i++) {
      if (i % 30 == 0) {
        $('.totalcycle_indra').append('<div data-toggle="tooltip" data-placement="top" class="square mr-1 totalcycle_indra_' + i + '"></div><br />');
      } else {
        $('.totalcycle_indra').append('<div data-toggle="tooltip" data-placement="top" class="square totalcycle_indra_' + i + '"></div>');
      }
      if (i % 12 == 0) {
        $('.totalcycle_soma').append('<div data-toggle="tooltip" data-placement="top" class="square mr-1 totalcycle_soma_' + i + '"></div><br />');
      } else {
        $('.totalcycle_soma').append('<div data-toggle="tooltip" data-placement="top" class="square totalcycle_soma_' + i + '"></div>');
      }
      if (i % 21 == 0) {
        $('.totalcycle_agni').append('<div data-toggle="tooltip" data-placement="top" class="square mr-1 totalcycle_agni_' + i + '"></div><br />');
      } else {
        $('.totalcycle_agni').append('<div data-toggle="tooltip" data-placement="top" class="square totalcycle_agni_' + i + '"></div>');
      }
      if (i % 84 == 0) {
        $('.totalcycle_eightyfour').append('<div data-toggle="tooltip" data-placement="top" class="square mr-1 totalcycle_eightyfour_' + i + '"></div><br />');
      } else {
        $('.totalcycle_eightyfour').append('<div data-toggle="tooltip" data-placement="top" class="square totalcycle_eightyfour_' + i + '"></div>');
      }
    }
    $('.totalcycle_eightyfour_' + this.calendar.todayCycle).addClass('active');
    $('.totalcycle_agni_' + this.calendar.todayCycle).addClass('active');
    $('.totalcycle_indra_' + this.calendar.todayCycle).addClass('active');
    $('.totalcycle_soma_' + this.calendar.todayCycle).addClass('active');

      for (var i = 1; i <= this.calendar.totalCycleLength; i++) {
      $(
        '.totalcycle_soma_' + i
        + ', .totalcycle_indra_' + i
        + ', .totalcycle_agni_' + i
        + ', .totalcycle_eightyfour_' + i
      ).attr('data-date', this.calendar.addOrSubtractDays(this.calendar.date, Math.abs(i - this.calendar.todayCycle), i > this.calendar.todayCycle).toLocaleDateString('ru-RU'))
        .attr('data-soma', ((i - 1) % this.calendar.somaCycleLength) + 1)
        // .attr('data-indra', ((i - 1) % this.calendar.indraWaveCycleLength) + 1)
        .attr('data-indra', (function () {
        let current = (((i - 1) % 60) + 1);
        if (current == 30 || current === 31) return 30;
        else if (current == 1 || current === 60) return 1;
        else if (current > 30) {
          return (60 - current + 1);
        } 
        else {
          return current;
        }
        })())
        .attr('data-agni', ((i - 1) % this.calendar.agniCycleLength) + 1)
        .attr('data-eightyfour', ((i - 1) % this.calendar.eightyFourCycleLength) + 1)
        .attr('data-number', i);

      $('.totalcycle_soma_' + i).addClass(
        'side'+ (i % 4)
      );
      $('.totalcycle_soma_' + i).attr('title',
        $('.totalcycle_soma_' + i).data('date') + '\n'
        + 'День ' + i + '\n'
        + $('.totalcycle_soma_' + i).attr('data-soma') + '.'
        + $('.totalcycle_soma_' + i).attr('data-indra') + '.'
        + $('.totalcycle_soma_' + i).attr('data-agni') + '\n'
        + $('.totalcycle_soma_' + i).attr('data-soma') + ' день '
        + (Math.ceil(i / this.calendar.somaCycleLength) || 20) + ' цикла'
      );
      $('.totalcycle_indra_' + i).addClass(
        'side'+ (i % 4)
      );
      $('.totalcycle_indra_' + i).attr('title',
        $('.totalcycle_indra_' + i).data('date') + '\n'
        + 'День ' + i + '\n'
        + $('.totalcycle_indra_' + i).attr('data-soma') + '.'
        + $('.totalcycle_indra_' + i).attr('data-indra') + '.'
        + $('.totalcycle_indra_' + i).attr('data-agni') + '\n'
        + $('.totalcycle_indra_' + i).attr('data-indra') + ' день '
        + (Math.ceil(i / this.calendar.indraWaveCycleLength) || 20) + ' цикла'
      );
      $('.totalcycle_agni_' + i).addClass(
        'side'+ (i % 4)
      );
      $('.totalcycle_agni_' + i).attr('title',
        $('.totalcycle_agni_' + i).data('date') + '\n'
        + 'День ' + i + '\n'
        + $('.totalcycle_agni_' + i).attr('data-soma') + '.'
        + $('.totalcycle_agni_' + i).attr('data-indra') + '.'
        + $('.totalcycle_agni_' + i).attr('data-agni') + '\n'
        + $('.totalcycle_agni_' + i).attr('data-agni') + ' день '
        + (Math.ceil(i / this.calendar.agniCycleLength) || 20) + ' цикла'
        );
      $('.totalcycle_eightyfour_' + i).addClass(
        'side'+ (i % 4)
      );
      $('.totalcycle_eightyfour_' + i).attr('title',
        $('.totalcycle_eightyfour_' + i).data('date') + '\n'
        + 'День ' + i + '\n'
        + $('.totalcycle_eightyfour_' + i).attr('data-soma') + '.'
        + $('.totalcycle_eightyfour_' + i).attr('data-indra') + '.'
        + $('.totalcycle_eightyfour_' + i).attr('data-agni') + '\n'
        + $('.totalcycle_eightyfour_' + i).attr('data-eightyfour') + ' день '
        + (Math.ceil(i / this.calendar.eightyFourCycleLength) || 84) + ' цикла'
        );
      }
    }
  }
}

class ProjectorDate {
  constructor(positions, cycles = 1) {
    if (
      (positions[0] > 12 || positions[1] > 30 || positions[2] > 21)
      ||
      (positions[0] < 0 || positions[1] < 0 || positions[2] < 0)) {
      return { error: true };
    }
    this.dates = [];
    this.next_date = new Date();
    this.soma_projected = new CalendarSoma(this.next_date);
    this.dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };

    for (var i = cycles; i > 0; i--) {
      this.tries = 0;
      do {
        this.tries++;
        if (this.tries > 840) {
          return { error: true };
        }
        this.next_date.setDate(this.next_date.getDate() + 1);
        this.soma_projected = new CalendarSoma(this.next_date);
        // Check wildcards
        if (positions[0] == 0) {
          this.target_soma = this.soma_projected.soma;
        } else {
          this.target_soma = positions[0];
        }
        if (positions[1] == 0) {
          this.target_indra = this.soma_projected.indra;
        } else {
          this.target_indra = positions[1];
        }
        if (positions[2] == 0) {
          this.target_agni = this.soma_projected.agni;
        } else {
          this.target_agni = positions[2];
        }
      }
      while (
        (this.target_soma != this.soma_projected.soma) || (this.target_indra != this.soma_projected.indra) || (this.target_agni != this.soma_projected.agni));
      this.dates.push({ positions: `${this.soma_projected.soma}.${this.soma_projected.indra}.${this.soma_projected.agni}`, date: this.next_date.toLocaleDateString('ru-RU') });
    }
  }
  get dateList() {
    return this.dates;
  }
}

jQuery.datetimepicker.setLocale('ru');
const stringToDate = function (dateString) {
  const [dd, mm, yyyy] = dateString.split(".");
  return new Date(`${yyyy}-${mm}-${dd}`);
};

var Moon = {
  phases: ['new-moon', 'waxing-crescent-moon', 'first-quarter-moon', 'waxing-gibbous-moon', 'full-moon', 'waning-gibbous-moon', 'last-quarter-moon', 'waning-crescent-moon'],
  phaseNames: ['Новолуние', 'Молодая Луна', 'Первая четверть', 'Прибывающая Луна', 'Полнолуние', 'Убывающая Луна', 'Последняя четверть', 'Старая Луна'],
  moonDay: function(moonDate) {
    let year = moonDate.getFullYear();
    let month = moonDate.getMonth() + 1;
    let day = moonDate.getDate();

    // 1. Год (четыре цифры) разделите на 19 и отбросьте целую часть результата. 
    // 2. Эту дробь умножить на 209 и результат округлить до ближайшего целого.
    let lunarDay = Math.round(((year/19) - parseInt(year/19)) * 209); // Harvey formula
    // 3. Прибавить месяц. Если это январь или февраль (1 или 2), то прибавить еще 12.
    lunarDay += month;
    if (month < 3) {
      lunarDay += 12;
    } 
    // Вычесть коэффициент столетия. 
    lunarDay -= 3;
    // 5. Прибавить дату месяца.
    lunarDay += day;
    // 6. Результат поделить на 30 и отбросить целую часть.
    lunarDay /= 30;
    lunarDay = lunarDay - parseInt(lunarDay);
    // 7. Полученную десятичную дробь умножить на 30 и результат округлить до ближайшего целого.
    lunarDay = Math.floor(lunarDay * 30) + 1; 

    return {name: `${lunarDay}й лунный день`};

  },
  phase: function (moonDate) {
    const LUNAR_MONTH = 29.530588853;
    const getJulianDate = (date = new Date()) => {
      const time = date.getTime();
      const tzoffset = date.getTimezoneOffset()
      
      return (time / 86400000) - (tzoffset / 1440) + 2440587.5;
    }
    const normalize = value => {
      value = value - Math.floor(value);
      if (value < 0)
        value = value + 1
      return value;
    }
    const getLunarAgePercent = (date = new Date()) => {
      return normalize((getJulianDate(date) - 2451550.1) / LUNAR_MONTH);
    }
    const getLunarAge = (date = new Date()) => {
      const percent = getLunarAgePercent(date);
      const age = percent * LUNAR_MONTH;
      return age;
    }
    const getLunarPhasePercent = (date = new Date()) => {
      const age = getLunarAgePercent(date) * 100;
      const offsetBase = 3.386319199313448;
      const offset = offsetBase/2;
      const newMoon = 0;
      const firstQuarter = 25;
      const fullMoon = 50;
      const secondQuarter = 75;
      if (age >= 100-offset || age <= newMoon+offset)
        return 0;
      else if (age > newMoon+offset && age < firstQuarter-offset)
        return 1; 
      else if (age >= firstQuarter-offset && age <= firstQuarter+offset)
        return 2; 
      else if (age > firstQuarter+offset && age < fullMoon-offset)
        return 3; 
      else if (age >= fullMoon-offset && age <= fullMoon+offset)
        return 4; 
      else if (age > fullMoon+offset && age < secondQuarter-offset)
        return 5; 
      else if (age >= secondQuarter-offset && age <= secondQuarter+offset)
        return 6; 
      else if (age > secondQuarter+offset && age < 100-offset)
        return 7; 
      return NaN;
    }
    return {age: Moon.moonDay(moonDate).name, filename: Moon.phases[getLunarPhasePercent(moonDate)], name: Moon.phaseNames[getLunarPhasePercent(moonDate)]};
  },
};

$(document).ready(function () {
  var calendar = new CalendarView;
  var currentMoonPhase = Moon.phase(calendar.calendar.currentDate);
  $('.moon-phase').attr('src', `img/moon/${currentMoonPhase.filename}.png`);
  $('.moon-phase-text').text(currentMoonPhase.name);
  $('.moon-day-text').text(currentMoonPhase.age);
  $('#datetimepicker').datetimepicker({
    format: 'd.m.Y',
    minDate:'2021/10/09',
    inline: true,
    lang: 'ru',
    yearStart: 2021,
    timepicker: false,
    onChangeDateTime: function (ct, $i) {
      var d = $('#datetimepicker').datetimepicker('getValue');
      calendar = new CalendarView(d);
      var currentMoonPhase = Moon.phase(calendar.calendar.currentDate);
      $('.moon-phase').attr('src', `img/moon/${currentMoonPhase.filename}.png`);
      $('.moon-phase-text').text(currentMoonPhase.name);
      $('.moon-day-text').text(currentMoonPhase.age);
    },
    onChangeMonth: function (ct, $i) {
      var d = $('#datetimepicker').datetimepicker('getValue');
      calendar = new CalendarView(d);
      var currentMoonPhase = Moon.phase(calendar.calendar.currentDate);
      $('.moon-phase').attr('src', `img/moon/${currentMoonPhase.filename}.png`);
      $('.moon-phase-text').text(currentMoonPhase.name);
      $('.moon-day-text').text(currentMoonPhase.age);
    },
    onChangeYear: function (ct, $i) {
      var d = $('#datetimepicker').datetimepicker('getValue');
      calendar = new CalendarView(d);
      var currentMoonPhase = Moon.phase(calendar.calendar.currentDate);
      $('.moon-phase').attr('src', `img/moon/${currentMoonPhase.filename}.png`);
      $('.moon-phase-text').text(currentMoonPhase.name);
      $('.moon-day-text').text(currentMoonPhase.age);
    }
  });

  $('#overview-btn').on('click', function () {
    calendar.clear();
    calendar.renderTotalCycles();
    $('[data-toggle="tooltip"]').tooltip({ });
  });
  $('#projector_submit').on('click', function () {
    $('#projector_results').html('');
    projector = new ProjectorDate([parseInt($('#projector_soma').val()), parseInt($('#projector_indra').val()), parseInt($('#projector_agni').val())], parseInt($('#projector_cycles').val()));
    $('#projector_results').append('<hr>');
    if (projector.error) {
      $('#projector_results').append('<li>Позиции заданы неверно!</li>');
    } else {
      projector.dateList.forEach(element => {
        $('#projector_results').append('<button class="btn btn-light mx-3 mb-3 projected_link"><div><strong>' + element.positions + '</strong></div>' + '<span class="projected_date">' + element.date + '</span></div></button>');
      });
    }
  });


  $('button.xdsoft_today_button').on('click', function () {
    var d = $('#datetimepicker').datetimepicker('getValue');
    calendar = new CalendarView(d);
    var currentMoonPhase = Moon.phase(calendar.calendar.currentDate);
    $('.moon-phase').attr('src', `img/moon/${currentMoonPhase.filename}.png`);
    $('.moon-phase-text').text(currentMoonPhase.name);
    $('.moon-day-text').text(currentMoonPhase.age);
  });


  $('body').on('click', 'button.projected_link', function () {
    var d = $(this).find('.projected_date').html();
    calendar = new CalendarView(new Date(stringToDate(d)));
    $('#datetimepicker').datetimepicker({
      format: 'd.m.Y',
      minDate:'2021/10/09',
      inline: true,
      yearStart: 2021,
      lang: 'ru',
      value: stringToDate(d),
      timepicker: false,
      onChangeDateTime: function (ct, $i) {
        var d = $('#datetimepicker').datetimepicker('getValue');
        calendar = new CalendarView(d);
      },
      onChangeMonth: function (ct, $i) {
        var d = $('#datetimepicker').datetimepicker('getValue');
        calendar = new CalendarView(d);
      },
      onChangeYear: function (ct, $i) {
        var d = $('#datetimepicker').datetimepicker('getValue');
        calendar = new CalendarView(d);
      }
    });
    $('#projector_modal').modal('hide');
  });
  $('body').on('show.bs.tooltip', '.square', function () {
    var suits = ['pentacles', 'wands', 'cups', 'swords'];
    $('.card_soma_overview').attr('src', `img/tarot/minor/${suits[($(this).data('number') % 4)] }/${$(this).data('soma')}.jpg`);

    if ($(this).data('indra') < 10) {
      $('.card_indra_overview').attr('src', `img/tarot/major/${$(this).data('indra')}.jpg`);
    } else if ($(this).data('indra') == 10) {
      $('.card_indra_overview').attr('src', `img/tarot/major/${$(this).data('indra')}.jpg`);
    } else if ($(this).data('indra') <= 22) {
      $('.card_indra_overview').attr('src', `img/tarot/major/${$(this).data('indra')}.jpg`);
    } else if ($(this).data('indra') <= 30) {
      $('.card_indra_overview').attr('src', `img/tarot/blank.jpg`);
    }

    $('.card_agni_overview').attr('src', `img/tarot/major/${$(this).data('agni')}.jpg`);
    $('.totalcycle_day_today').html('День ' + $(this).data('number'));
    $('.totalcycle_day_positions').html($(this).data('soma')+'.'+$(this).data('indra')+'.'+$(this).data('agni'));
  });
  $('body').on('hide.bs.tooltip', '.square', function () {
    calendar.renderTotalCycles(false);
  });
});
