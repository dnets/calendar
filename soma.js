class Soma {
  constructor(date = new Date) {
    this.date = date;
    this.startDate = new Date("28 Apr 2018");
    this.daysPassed = this.daysBetween(this.startDate, this.date);

    // this.indraCycleLength = 30;
    // this.agniCycleLength = 13;
    // this.somaCycleLength = 20;
    this.agniCycleLength = 21;
    this.indraCycleLength = 30;
    this.somaCycleLength = 12;

    this.startDayAgni = 21;
    this.startDayIndra = 30;
    this.startDaySoma = 12;


    this.directions = ['юг', 'запад', 'север', 'восток'];
    this.elements = ['земля', 'огонь', 'вода', 'воздух'];
    this.suits = ['coins', 'clubs', 'cups', 'swords'];


    $('.day_indra').text(this.indra);
    $('.day_agni').text(this.agni);
    $('.day_soma').text(this.soma);
    $('.day_tzolkin').text(this.tzolkin);
    $('.day_direction').text(this.direction);
    $('.day_element').text(this.element);
    $('.day_calendar').text(this.toString());
    this.agniCard();
    this.indraCard();
    this.somaCard();
  }

  agniCard() {
    $('.card_agni').attr('src', `img/tarot/major_${this.agni}.jpg`);
    if (this.agni <= 10) {
      $('.card_agni_type').text('умопостигаемое');
    } else if (this.agni <= 20) {
      $('.card_agni_type').text('экзистенциональное');
    }
  }

  indraCard() {
    if (this.indra <= 10) {
      $('.card_indra').attr('src', `img/tarot/major_${this.indra}.jpg`);
      $('.card_indra_type').text('умопостигаемое');
    } else if (this.indra <= 20) {
      $('.card_indra').attr('src', `img/tarot/major_${this.indra}.jpg`);
      $('.card_indra_type').text('экзистенциональное');
    } else if (this.indra <= 30) {
      $('.card_indra').attr('src', `img/tarot/major_${this.indra - 20}.jpg`);
      $('.card_indra_type').attr('src', `img/tarot/major_${this.indra}.jpg`);
      $('.card_indra_type').text('физическое');
    }
  }
  somaCard() {
    $('.card_soma').attr('src', `img/tarot/${this.suit}_${this.soma}.jpg`);
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
  get direction() {
    return this.directions[this.soma % 4];
  }
  get element() {
    return this.elements[this.soma % 4];
  }
  get suit() {
    return this.suits[this.soma % 4];
  }
  get tzolkin() {
    return `${this.soma}.${this.agni}`;
  }

  toString() {
    return `${this.soma}.${this.indra}.${this.agni}`;
  }
}

jQuery.datetimepicker.setLocale('ru');

$(function () {
  soma = new Soma;
  $('#datetimepicker').datetimepicker({
    format: 'd.m.YH:i',
    inline: true,
    lang: 'ru',
    // theme: 'dark',
    // style: 'position: fixed; top: 5px; right: 5px; box-shadow: none;',
    timepicker: false,
    onChangeDateTime: function (ct, $i) {
      var d = $('#datetimepicker').datetimepicker('getValue');
      soma = new Soma(d);
    },
    onChangeMonth: function (ct, $i) {
      var d = $('#datetimepicker').datetimepicker('getValue');
      soma = new Soma(d);
    },
    onChangeYear: function (ct, $i) {
      var d = $('#datetimepicker').datetimepicker('getValue');
      soma = new Soma(d);
    }
  });
  $("button.calendar").toggle(function () {
    $("#datetimepicker").datetimepicker("show");
  }, function () {
    $("#datetimepicker").datetimepicker("hide");
  });
  $('button.xdsoft_today_button').on('click', function () {
    var d = $('#datetimepicker').datetimepicker('getValue');
    soma = new Soma(d);
  });
});