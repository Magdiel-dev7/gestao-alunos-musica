const form = document.getElementById("formAluno");
const lista = document.getElementById("listaAlunos");
const totalEl = document.getElementById("total");
const btnSubmit = document.getElementById("btnSubmit");

// controle de edição
let editandoIndex = null;

// carregar dados
let alunos = JSON.parse(localStorage.getItem("alunos")) || [];

function salvar() {
  localStorage.setItem("alunos", JSON.stringify(alunos));
}

function renderizar() {
  lista.innerHTML = "";

  let total = 0;

  // 🔽 garantir que todos tenham status
  alunos.forEach(aluno => {
    if (aluno.ativo === undefined) {
      aluno.ativo = true;
    }
  });

  // 🔽 ordenar ativos primeiro
  alunos.sort((a, b) => b.ativo - a.ativo);

  alunos.forEach((aluno, index) => {

    if (aluno.ativo) {
      total += aluno.valor;
    }

    const li = document.createElement("li");
    li.className = aluno.ativo ? "ativo" : "inativo";

    li.innerHTML = `
      <div>
        <strong>${aluno.nome}</strong><br>
        R$${aluno.valor} - ${aluno.dia}<br>
        ${aluno.ativo ? "🟢 Ativo" : "🔴 Inativo"}
      </div>

      <div>
        <button onclick="editar(${index})">Editar</button>
        <button onclick="toggle(${index})">
          ${aluno.ativo ? "Desativar" : "Ativar"}
        </button>
        <button class="remover" onclick="remover(${index})">X</button>
      </div>
    `;

    lista.appendChild(li);
  });

  totalEl.innerText = "Total mensal (ativos): R$ " + total;
}

function toggle(index) {
  alunos[index].ativo = !alunos[index].ativo;
  salvar();
  renderizar();
}

function remover(index) {
  alunos.splice(index, 1);
  salvar();
  renderizar();
}

function editar(index) {
  const aluno = alunos[index];

  document.getElementById("nome").value = aluno.nome;
  document.getElementById("valor").value = aluno.valor;
  document.getElementById("dia").value = aluno.dia;

  editandoIndex = index;

  btnSubmit.innerText = "Salvar edição";
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const valor = Number(document.getElementById("valor").value);
  const dia = document.getElementById("dia").value;

  if (editandoIndex !== null) {
    alunos[editandoIndex].nome = nome;
    alunos[editandoIndex].valor = valor;
    alunos[editandoIndex].dia = dia;
  } else {
    alunos.push({ nome, valor, dia, ativo: true });
  }

  salvar();
  renderizar();

  form.reset();
  editandoIndex = null;
  btnSubmit.innerText = "Adicionar";
});

// iniciar
renderizar();

