class CalendarSoma {
  constructor(date = new Date) {
    this.date = date;
    this.startDate = new Date("28 Apr 2018");
    this.daysPassed = this.daysBetween(this.startDate, this.date);
    this.agniCycleLength = 21;
    this.indraCycleLength = 30;
    this.somaCycleLength = 12;
    this.eightyFourCycleLength = 84;
    this.totalCycleLength = 420;
    this.startDayAgni = 21;
    this.startDayIndra = 30;
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
  get agni() { return ((this.startDayAgni + this.daysPassed) % this.agniCycleLength) + 1; }
  get soma() { return ((this.startDaySoma + this.daysPassed) % this.somaCycleLength) + 1; }
  get eightyfour() { return ((this.startDayCycle + this.daysPassed) % this.eightyFourCycleLength) || 84; }
  get todayCycle() { return ((this.startDayCycle + this.daysPassed) % this.totalCycleLength) || 420; }
  get somaCycle() { return Math.ceil((this.todayCycle / this.somaCycleLength)) || 20; }
  get indraCycle() { return Math.ceil((this.todayCycle / this.indraCycleLength)) || 14; }
  get agniCycle() { return Math.ceil((this.todayCycle / this.agniCycleLength)) || 21; }
  get eightyFourCycle() { return Math.ceil((this.todayCycle / this.eightyFourCycleLength)) || 84; }
  get suit() { return this.suits[(this.soma - 1) % 4]; }
  get direction() { return this.directions[(this.soma - 1) % 4]; }
  get tzolkin() { return `${this.soma}.${this.agni}`; }
  toString() { return `${this.soma}.${this.romanize(this.indra)}.${this.romanize(this.agni)}`; }
}

class CalendarView {
  constructor(date = new Date) {
    this.calendar = new CalendarSoma(date);
    this.clear();
    $('.day_indra').text(this.calendar.indra);
    $('.day_agni').text(this.calendar.agni);
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
  }

  indraCard() {
    if (this.calendar.indra < 10) {
      $('.card_indra, .card_indra_overview').attr('src', `img/tarot/major/${this.calendar.indra}.jpg`);
      $('.link_indra').attr('href', `http://psylib.org.ua/books/shmak01/txt0${this.calendar.indra}.htm`);
    } else if (this.calendar.indra == 10) {
      $('.card_indra, .card_indra_overview').attr('src', `img/tarot/major/${this.calendar.indra}.jpg`);
      $('.link_indra').attr('href', `http://psylib.org.ua/books/shmak01/txt${this.calendar.indra}.htm`);
    } else if (this.calendar.indra <= 22) {
      $('.card_indra, .card_indra_overview').attr('src', `img/tarot/major/${this.calendar.indra}.jpg`);
      $('.link_indra').attr('href', `http://psylib.org.ua/books/shmak01/txt${this.calendar.indra}.htm`);
    } else if (this.calendar.indra <= 30) {
      $('.card_indra, .card_indra_overview').attr('src', `img/tarot/blank.jpg`);
      $('.link_indra').attr('href', `http://psylib.org.ua/books/shmak01/txt0${this.calendar.indra - 20}.htm`);
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
    $('.totalcycle_day_positions').html(this.calendar.soma+'.'+this.calendar.indra+'.'+this.calendar.agni);
    $('.totalcycle_day_soma').html(this.calendar.soma + ' день ' + this.calendar.somaCycle + ' цикла');
    $('.totalcycle_day_indra').html(this.calendar.indra + ' день ' + this.calendar.indraCycle + ' цикла');
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
        .attr('data-indra', ((i - 1) % this.calendar.indraCycleLength) + 1)
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
        + (Math.ceil(i / this.calendar.indraCycleLength) || 20) + ' цикла'
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
        // console.log(`Target soma: ${this.target_soma}`);
        // console.log(`Target indra: ${this.target_indra}`);
        // console.log(`Target agni: ${this.target_agni}`);
        // console.log(`Current soma: ${this.soma_projected.soma}`);
        // console.log(`Current indra: ${this.soma_projected.indra}`);
        // console.log(`Current agni: ${this.soma_projected.agni}`);
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



$(document).ready(function () {
  var calendar = new CalendarView;
  $('#datetimepicker').datetimepicker({
    format: 'd.m.Y',
    minDate:'2018/04/28',
    inline: true,
    lang: 'ru',
    yearStart: 2018,
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
  });


  $('body').on('click', 'button.projected_link', function () {
    var d = $(this).find('.projected_date').html();
    calendar = new CalendarView(new Date(stringToDate(d)));
    $('#datetimepicker').datetimepicker({
      format: 'd.m.Y',
      minDate:'2018/04/28',
      inline: true,
      yearStart: 2018,
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
