 function formatarInscricao() {
            const input = document.getElementById('inscricao');
            let valor = input.value;

            // Remove qualquer caractere que não seja número
            valor = valor.replace(/\D/g, '');

            // Aplica a máscara XX.XXX.XXX.XXXX.XXX
            if (valor.length > 2) valor = valor.replace(/^(\d{2})(\d)/, '$1.$2');
            if (valor.length > 6) valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
            if (valor.length > 9) valor = valor.replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3.$4');
            if (valor.length > 13) valor = valor.replace(/^(\d{2})\.(\d{3})\.(\d{3})\.(\d{4})(\d)/, '$1.$2.$3.$4.$5');
            
            // Atualiza o valor do campo de entrada
            input.value = valor;
        }

async function buscarDados() {
  const inscricao = document.getElementById('search').value; // Correção do ID
  const anos = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
  let resultados = [];

  for (let ano of anos) {
      const url = `tabelas/${ano}.xlsx`; // Certifique-se que este caminho está correto
      try {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Erro ao carregar: ${url}`);

          const data = await response.arrayBuffer();
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          json.forEach(row => {
              if (row[0] && row[0].toString().includes(inscricao)) { // Certifica-se que é string
                  resultados.push({
                      inscricao: row[0],
                      quadra: row[1],
                      lote: row[2],
                      ano: ano,
                      metragem: row[4],
                      utilizacao: row[5],
                      estrutura: row[6],
                  });
              }
          });
      } catch (error) {
          console.error("Erro ao processar:", error);
      }
  }

  exibirResultados(resultados);
}

function exibirResultados(resultados) {
  const tableBody = document.querySelector('#resultTable tbody');
  tableBody.innerHTML = '';

  if (resultados.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5">Nenhum resultado encontrado</td></tr>`;
      return;
  }

  resultados.forEach(resultado => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${resultado.inscricao}</td>
          <td>${resultado.quadra}</td>
          <td>${resultado.lote}</td>
          <td>${resultado.ano}</td>
          <td>${resultado.metragem}</td>
          <td>${resultado.utilizacao}</td>
          <td>${resultado.estrutura}</td>
      `;
      tableBody.appendChild(row);
  });
}
