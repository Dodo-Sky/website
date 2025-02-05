const $description = document.querySelector('.description');
const $amountSize = document.querySelector('.amountSize');
const $date_inp = document.querySelector('.date-inp');
const validator = new JustValidate('#form');
const $start_time = document.querySelector('.start-time');
const $stop_time = document.querySelector('.stop-time');
const $typeAmount = document.getElementById('typeAmount');
const $holidays = document.getElementById('inputGroupSelect01');

export function validation () {
  const $choiceUnit = document.querySelector('.choiceUnit');
  const $typeAll = document.querySelector('.typeAll');
  const $dayWeek = document.querySelector('.dayWeek');

  validator
    .addField($description, [
      {
        rule: 'required',
        errorMessage: 'Введите описание выплаты',
      },
    ])
    .addField($amountSize, [
      {
        rule: 'required',
        errorMessage: 'Введите размер доплаты',
      },
    ])
    .addField($date_inp, [
      {
        rule: 'required',
        errorMessage: 'Укажите дату начала',
      },
    ])
    .addField($start_time, [
      {
        rule: 'required',
        errorMessage: 'Укажите время начала действия выплаты',
      },
    ])
    .addField($stop_time, [
      {
        rule: 'required',
        errorMessage: 'Укажите время окончания действия выплаты',
      },
    ])
    .addField($typeAmount, [
      {
        validator: (value) => (value !== 'Выберите...' ? true : false),
        errorMessage: 'Укажите тип доплаты',
      },
    ])
    .addField($holidays, [
      {
        validator: (value) => (value !== 'Выберите...' ? true : false),
        errorMessage: 'Укажите оплату в праздничные дни',
      },
    ])
    .addRequiredGroup($choiceUnit, 'Выберите хотя бы одну пиццерию')
    .addRequiredGroup($typeAll, 'Выберите тип сотрудника')
    .addRequiredGroup($dayWeek, 'Выберите день недели');
}
