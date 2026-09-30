// ======================= РАСЧЁТ АВТОКРЕДИТА =======================
document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('calcBtn');
  const resultBox = document.getElementById('result');

  btn.addEventListener('click', calculate);

  function calculate() {
    // 1. Считываем значения
    const price      = parseFloat(document.getElementById('model').value);
    const down       = parseFloat(document.getElementById('downpayment').value) || 0;
    const months     = parseInt(document.getElementById('term').value);
    const annualRate = parseFloat(document.getElementById('rate').value) || 0;

    // 2. Проверки
    if (down >= price) {
      showResult('⚠️ Первоначальный взнос не может быть больше или равен стоимости автомобиля.', false);
      return;
    }
    if (months <= 0) {
      showResult('⚠️ Некорректный срок кредита.', false);
      return;
    }

    // 3. Расчёт аннуитетного платежа
    const creditSum = price - down;                    // сумма кредита
    const monthlyRate = annualRate / 100 / 12;         // месячная ставка

    let monthlyPayment;
    if (monthlyRate === 0) {
      monthlyPayment = creditSum / months;
    } else {
      const k = (monthlyRate * Math.pow(1 + monthlyRate, months)) /
                (Math.pow(1 + monthlyRate, months) - 1);
      monthlyPayment = creditSum * k;
    }

    const totalPaid = monthlyPayment * months + down;  // общая сумма выплат
    const overpay   = totalPaid - price;               // переплата

    // 4. Форматирование
    const fmt = n => n.toLocaleString('ru-RU', { maximumFractionDigits: 0 }) + ' ₽';

    const html = `
      <div>Сумма кредита: <b>${fmt(creditSum)}</b></div>
      <div>Ежемесячный платёж: <span class="total">${fmt(monthlyPayment)}</span></div>
      <div>Всего выплат: <b>${fmt(totalPaid)}</b></div>
      <div>Переплата: <b>${fmt(overpay)}</b></div>
    `;

    showResult(html, true);
  }

  // Показ блока результата с анимацией
  function showResult(html, success) {
    resultBox.classList.remove('show');
    // Форсируем перезапуск анимации
    void resultBox.offsetWidth;
    resultBox.innerHTML = html;
    resultBox.style.borderLeftColor = success ? '#ff4d2d' : '#e0a800';
    resultBox.classList.add('show');
  }
});