// Usuários cadastrados no sistema
const users = [
    { username: "gabrielgab", password: "gabriel1234" },
    { username: "alemaochefe", password: "alemao1234" },
    { username: "junioradm", password: "junioradm123" },
    { username: "edgardadm", password: "edgardadm123" },
    { username: "julianoadm", password: "julianoadm123" },
    { username: "silvianeadm", password: "silviane123" }
];

// Função de login
function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let errorMessage = document.getElementById("error-message");

    let user = users.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem("loggedIn", "true");
        window.location.href = "consulta.html";
    } else {
        errorMessage.textContent = "Usuário ou senha incorretos!";
    }
}

// Função de logout para sair da página de consulta
function logout() {
    localStorage.removeItem("loggedIn");
    window.location.href = "index.html";
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

 // CODIGO REFERENTE A FUNCIONALIDADE DO BOTÃO DE ORIENTAÇÃO
 document.getElementById("btnOrientacoes").addEventListener("click", function () {
    document.getElementById("manual").classList.add("ativo");
});

document.getElementById("btnFechar").addEventListener("click", function () {
    document.getElementById("manual").classList.remove("ativo");
});