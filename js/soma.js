class CalendarSoma {
  constructor(date = new Date) {
    this.date = date;
    this.startDate = new Date("28 Apr 2018");
    this.daysPassed = this.daysBetween(this.startDate, this.date);
    this.agniCycleLength = 21;
    this.indraCycleLength = 30;
    this.somaCycleLength = 12;
    this.totalCycleLength = 420;
    this.startDayAgni = 21;
    this.startDayIndra = 30;
    this.startDaySoma = 12;
    this.startDayCycle = 1;
    this.suits = ['wands', 'cups', 'swords', 'pentacles'];
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
  get todayCycle() { return ((this.startDayCycle + this.daysPassed) % this.totalCycleLength); }
  get suit() { return this.suits[(this.soma - 1) % 4]; }
  get tzolkin() { return `${this.soma}.${this.agni}`; }
  toString() { return `${this.soma}.${this.indra}.${this.agni}`; }
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
    this.totalCycleIndra();
    this.totalCycleSoma();
    this.totalCycleAgni();
  }

  clear() {
    $('.totalcycle_indra').html('');
    $('.totalcycle_agni').html('');
    $('.totalcycle_soma').html('');
  }

  somaCard() {
    $('.card_soma').attr('src', `img/tarot/minor/${this.calendar.suit}/${this.calendar.soma}.jpg`);
  }

  indraCard() {
    if (this.calendar.indra < 10) {
      $('.card_indra').attr('src', `img/tarot/major/${this.calendar.indra}.jpg`);
      $('.link_indra').attr('href', `http://psylib.org.ua/books/shmak01/txt0${this.calendar.indra}.htm`);
    } else if (this.calendar.indra == 10) {
      $('.card_indra').attr('src', `img/tarot/major/${this.calendar.indra}.jpg`);
      $('.link_indra').attr('href', `http://psylib.org.ua/books/shmak01/txt${this.calendar.indra}.htm`);
    } else if (this.calendar.indra <= 22) {
      $('.card_indra').attr('src', `img/tarot/major/${this.calendar.indra}.jpg`);
      $('.link_indra').attr('href', `http://psylib.org.ua/books/shmak01/txt${this.calendar.indra}.htm`);
    } else if (this.calendar.indra <= 30) {
      $('.card_indra').attr('src', `img/tarot/blank.jpg`);
      $('.link_indra').attr('href', `http://psylib.org.ua/books/shmak01/txt0${this.calendar.indra - 20}.htm`);
    }
  }

  agniCard() {
    $('.card_agni').attr('src', `img/tarot/major/${this.calendar.agni}.jpg`);
    if (this.calendar.agni < 10) {
      $('.link_agni').attr('href', `http://psylib.org.ua/books/shmak01/txt0${this.calendar.agni}.htm`);
    } else {
      $('.link_agni').attr('href', `http://psylib.org.ua/books/shmak01/txt${this.calendar.agni}.htm`);
    }
  }

  totalCycleIndra() {
    for (var i = 1; i <= this.calendar.totalCycleLength; i++) {
      if (i % 10 == 0) {
        $('.totalcycle_indra').append('<div class="square mr-1 totalcycle_indra_' + i + '"></div>');
      } else {
        $('.totalcycle_indra').append('<div class="square totalcycle_indra_' + i + '"></div>');
      }
    }
    $('.totalcycle_indra_' + this.calendar.todayCycle).addClass('active');
  }
  totalCycleSoma() {
    for (var i = 1; i <= this.calendar.totalCycleLength; i++) {
      if (i % 12 == 0) {
        $('.totalcycle_soma').append('<div class="square mr-1 totalcycle_soma_' + i + '"></div>');
      } else {
        $('.totalcycle_soma').append('<div class="square totalcycle_soma_' + i + '"></div>');
      }
    }
    $('.totalcycle_soma_' + this.calendar.todayCycle).addClass('active');
  }
  totalCycleAgni() {
    for (var i = 1; i <= this.calendar.totalCycleLength; i++) {
      if (i % 21 == 0) {
        $('.totalcycle_agni').append('<div class="square mr-1 totalcycle_agni_' + i + '"></div>');
      } else {
        $('.totalcycle_agni').append('<div class="square totalcycle_agni_' + i + '"></div>');
      }
    }
    $('.totalcycle_agni_' + this.calendar.todayCycle).addClass('active');
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
    console.log(positions);
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

$(function () {
  var calendar = new CalendarView;
  $('#datetimepicker').datetimepicker({
    format: 'd.m.Y',
    inline: true,
    lang: 'ru',
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

  $("button.calendar").toggle(function () {
    $("#datetimepicker").datetimepicker("show");
  }, function () {
    $("#datetimepicker").datetimepicker("hide");
  });
  $('button.xdsoft_today_button').on('click', function () {
    var d = $('#datetimepicker').datetimepicker('getValue');
    soma = new CalendarView(d);
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

  $('body').on('click', 'button.projected_link', function () {
    var d = $(this).find('.projected_date').html();
    soma = new CalendarView(new Date(stringToDate(d)));
    // $('#datetimepicker').datetimepicker("setDate", stringToDate(d));
    $('#datetimepicker').datetimepicker({
      format: 'd.m.Y',
      inline: true,
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
});