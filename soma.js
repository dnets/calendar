class CalendarSoma {
  constructor(date = new Date) {
    this.date = date;
    this.startDate = new Date("28 Apr 2018");
    this.daysPassed = this.daysBetween(this.startDate, this.date);
    this.agniCycleLength = 21;
    this.indraCycleLength = 30;
    this.somaCycleLength = 12;
    this.startDayAgni = 21;
    this.startDayIndra = 30;
    this.startDaySoma = 12;
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
  get suit() { return this.suits[(this.soma - 1) % 4]; }
  get tzolkin() { return `${this.soma}.${this.agni}`; }
  toString() { return `${this.soma}.${this.indra}.${this.agni}`; }
}

class CalendarView {
  constructor(date = new Date) {
    this.calendar = new CalendarSoma(date);
    $('.day_indra').text(this.calendar.indra);
    $('.day_agni').text(this.calendar.agni);
    $('.day_soma').text(this.calendar.soma);
    $('.day_tzolkin').text(this.calendar.tzolkin);
    $('.day_calendar').text(this.calendar.toString());
    this.agniCard();
    this.indraCard();
    this.somaCard();
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
    } else if (this.calendar.indra < 20) {
      $('.card_indra').attr('src', `img/tarot/major/${this.calendar.indra - 10}.jpg`);
      $('.link_indra').attr('href', `http://psylib.org.ua/books/shmak01/txt0${this.calendar.indra - 10}.htm`);
    } else if (this.calendar.indra == 20) {
      $('.card_indra').attr('src', `img/tarot/major/${this.calendar.indra - 10}.jpg`);
      $('.link_indra').attr('href', `http://psylib.org.ua/books/shmak01/txt${this.calendar.indra - 10}.htm`);
    } else if (this.calendar.indra < 30) {
      $('.card_indra').attr('src', `img/tarot/major/${this.calendar.indra - 20}.jpg`);
      $('.link_indra').attr('href', `http://psylib.org.ua/books/shmak01/txt0${this.calendar.indra - 20}.htm`);
    } else if (this.calendar.indra == 30) {
      $('.card_indra').attr('src', `img/tarot/major/${this.calendar.indra - 20}.jpg`);
      $('.link_indra').attr('href', `http://psylib.org.ua/books/shmak01/txt${this.calendar.indra - 20}.htm`);
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
}

class ProjectorDate {
  constructor(positions, cycles = 1) {
    if (
      (positions[0] > 12 || positions[1] > 30 || positions[2] > 21)
      ||
      (positions[0] <= 0 || positions[1] <= 0 || positions[2] <= 0)) {
      return { error: true };
    }
    this.dates = [];
    var next_date = new Date();
    var soma_projected = new CalendarSoma(next_date);
    for (var i = cycles; i > 0; i--) {
      this.tries = 0;
      do {
        this.tries++;
        if (this.tries > 840) {
          return { error: true };
        }
        next_date.setDate(next_date.getDate() + 1);
        soma_projected = new CalendarSoma(next_date);
      }
      while (soma_projected.toString() != `${positions[0]}.${positions[1]}.${positions[2]}`);
      this.dates.push(next_date.toDateString());
    }
  }
  get dateList() {
    return this.dates;
  }
}

jQuery.datetimepicker.setLocale('ru');

$(function () {
  var calendar = new CalendarView;
  $('#datetimepicker').datetimepicker({
    format: 'd.m.YH:i',
    inline: true,
    lang: 'ru',
    // theme: 'dark',
    // style: 'position: fixed; top: 5px; right: 5px; box-shadow: none;',
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
    projector = new ProjectorDate([$('#projector_soma').val(), $('#projector_indra').val(), $('#projector_agni').val()], $('#projector_cycles').val());
    $('#projector_results').append('<hr>');
    if (projector.error) {
      $('#projector_results').append('<li>Позиции заданы неверно!</li>');
    } else {
      projector.dateList.forEach(element => {
        $('#projector_results').append('<div class="col">' + element + '</div>');
      });
    }
  });
});