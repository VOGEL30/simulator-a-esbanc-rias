// Função para criar gráficos de pizza com base nos dados
function renderChart(data, labels, title) {
    const ctx = document.getElementById('chart');
    const chart = new Chart(ctx, {
      type: 'pie', // Gráfico de Pizza
      data: {
        labels: labels,
        datasets: [{
          label: title,
          data: data,
          backgroundColor: ['#00733b', '#004d26', '#ffa500', '#ff6347', '#f0e68c'],
          borderColor: ['#fff', '#fff', '#fff', '#fff', '#fff'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                return `${tooltipItem.label}: R$ ${tooltipItem.raw.toFixed(2)}`;
              }
            }
          }
        }
      }
    });
  }
  
  document.getElementById('calc-type').addEventListener('change', (e) => {
    const calcType = e.target.value;
    document.querySelectorAll('.calc-fields').forEach(field => field.style.display = 'none');
    document.getElementById(`${calcType}-fields`).style.display = 'block';
  });
  
  document.getElementById('simulate').addEventListener('click', () => {
    const calcType = document.getElementById('calc-type').value;
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';
  
    if (calcType === 'consorcio') {
      const totalValue = parseFloat(document.getElementById('total-value').value) || 0;
      const months = parseInt(document.getElementById('months-consorcio').value) || 0;
      const adminFee = parseFloat(document.getElementById('admin-fee').value) / 100 || 0;
      const adminCost = totalValue * adminFee;
      const monthlyPayment = (totalValue + adminCost) / months;
      resultDiv.innerHTML = `
        <p>Parcela mensal: R$ ${monthlyPayment.toFixed(2)}</p>
        <p>Taxa administrativa: R$ ${adminCost.toFixed(2)}</p>
      `;
      renderChart([monthlyPayment, adminCost], ['Parcela Mensal', 'Taxa Administrativa'], 'Simulação de Consórcio');
    } else if (calcType === 'acoes') {
      const bank = document.getElementById('bank-stock').value;
      const investment = parseFloat(document.getElementById('investment').value) || 0;
      const months = parseInt(document.getElementById('months-acoes').value) || 0;
      const rates = { itau: 0.04, bradesco: 0.035, santander: 0.042 };
      let total = investment;
      for (let i = 0; i < months; i++) total *= 1 + rates[bank];
      resultDiv.innerHTML = `<p>Montante final: R$ ${total.toFixed(2)}</p>`;
      renderChart([total, investment], ['Montante Final', 'Investimento Inicial'], 'Simulação de Ações');
    } else if (calcType === 'emprestimo') {
      const loanAmount = parseFloat(document.getElementById('loan-amount').value) || 0;
      const interestRate = parseFloat(document.getElementById('interest-rate').value) / 100 || 0;
      const loanTerm = parseInt(document.getElementById('loan-term').value) || 0;
      const monthlyPayment = loanAmount * (interestRate / (1 - Math.pow(1 + interestRate, -loanTerm)));
      resultDiv.innerHTML = `<p>Parcela mensal: R$ ${monthlyPayment.toFixed(2)}</p>`;
      renderChart([monthlyPayment, loanAmount], ['Parcela Mensal', 'Valor Emprestado'], 'Simulação de Empréstimo');
    } else if (calcType === 'financiamento') {
      const propertyValue = parseFloat(document.getElementById('property-value').value) || 0;
      const downPayment = parseFloat(document.getElementById('down-payment').value) || 0;
      const financingRate = parseFloat(document.getElementById('financing-rate').value) / 100 || 0;
      const financingTerm = parseInt(document.getElementById('financing-term').value) || 0;
      const financedAmount = propertyValue - downPayment;
      const monthlyPayment = financedAmount * (financingRate / (1 - Math.pow(1 + financingRate, -financingTerm)));
      resultDiv.innerHTML = `
        <p>Valor financiado: R$ ${financedAmount.toFixed(2)}</p>
        <p>Parcela mensal: R$ ${monthlyPayment.toFixed(2)}</p>
      `;
      renderChart([monthlyPayment, financedAmount], ['Parcela Mensal', 'Valor Financiado'], 'Simulação de Financiamento');
    }
  });
  
  document.getElementById('clear').addEventListener('click', () => {
    document.getElementById('investment-form').reset();
    document.getElementById('result').innerHTML = '';
    const ctx = document.getElementById('chart');
    if (ctx) {
      const chartInstance = Chart.getChart(ctx);
      if (chartInstance) {
        chartInstance.destroy();  // Remove gráfico ao limpar
      }
    }
  });
  
