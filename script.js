// Função para obter itens do banco de dados local (localStorage) ou retornar um array vazio se não houver itens.
const getItensBD = () => JSON.parse(localStorage.getItem("db_items")) ?? [];

// Seleção de elementos do DOM usando querySelector e atribuição a variáveis
const modal = document.querySelector('.modal-container');
const tbody = document.querySelector("tbody");
const btnSalvar = document.querySelector('#btnSalvar');
const incomesSpan = document.querySelector(".incomes");
const expensesSpan = document.querySelector(".expenses");
const totalSpan = document.querySelector(".total");

// Seleção de elementos de entrada do formulário
const sDescricao = document.querySelector('#m-descricao');
const sValor = document.querySelector('#m-valor');
const sTipo = document.querySelector('#m-type');
const sData = document.querySelector('#m-data');
const sCategoria = document.querySelector('#m-categoria');

// Declaração das variáveis "items" e "id"
let items = getItensBD();
let id;

// Função para abrir uma caixa de diálogo para adicionar ou editar um item.
function openModal(edit = false, index = 0) {
  modal.classList.add('active');

  // Evento de clique dentro do modal para fechá-lo se o usuário clicar fora do conteúdo do modal.
  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active');
    }
  };

  // Se a função for chamada para edição de um item existente:
  if (edit) {
    sDescricao.value = items[index].desc;
    sValor.value = items[index].amount;
    sData.value = items[index].date;
    sCategoria.value = items[index].category;
    sTipo.value = items[index].type;
    id = index;
  // Se a função for chamada para adicionar um novo item:
  } else {
    sDescricao.value = '';
    sValor.value = '';
    sData.value = '';
    sCategoria.value = '';
    sTipo.value = '';
  }
}

// Função para calcular o total de entradas (itens do tipo "Entrada")
function calculateTotalIncomes() {
  return items
    .filter((item) => item.type === "Entrada")
    .reduce((total, item) => total + parseFloat(item.amount), 0)
    .toFixed(2);
}

// Função para calcular o total de saídas (itens do tipo "Saída")
function calculateTotalExpenses() {
  return items
    .filter((item) => item.type === "Saída")
    .reduce((total, item) => total + parseFloat(item.amount), 0)
    .toFixed(2);
}

// Função para atualizar o resumo financeiro na página
function updateSummary() {
  const totalIncomes = calculateTotalIncomes();
  const totalExpenses = calculateTotalExpenses();
  const totalItems = (totalIncomes - totalExpenses).toFixed(2);

  // Atualiza os elementos HTML com os valores calculados
  incomesSpan.textContent = totalIncomes;
  expensesSpan.textContent = totalExpenses;
  totalSpan.textContent = totalItems;

  // Armazena os totais no armazenamento local (localStorage)
  localStorage.setItem("totalIncomes", totalIncomes);
  localStorage.setItem("totalExpenses", totalExpenses);
  localStorage.setItem("totalItems", totalItems);
}

// Configuração do evento de clique no botão "Salvar"
btnSalvar.onclick = (e) => {
  e.preventDefault();

  // Obtenção dos valores dos campos do formulário
  const descricao = sDescricao.value;
  const valor = sValor.value;
  const tipo = sTipo.value;
  const data = sData.value;
  const categoria = sCategoria.value;

  // Verificação se todos os campos do formulário estão preenchidos
  if (!descricao || !valor || !tipo || !data || !categoria) {
    return alert("Preencha todos os campos!");
  }

  // Se a variável "id" estiver definida, isso significa que a função está sendo usada para editar um item existente.
  if (id !== undefined) {
    items[id] = {
      desc: descricao,
      amount: Math.abs(valor).toFixed(2),
      type: tipo,
      date: data,
      category: categoria
    };
    id = undefined; // Limpa a variável "id" após a edição.
  // Se a variável "id" não estiver definida, isso significa que a função está sendo usada para adicionar um novo item.
  } else {
    items.push({
      desc: descricao,
      amount: Math.abs(valor).toFixed(2),
      type: tipo,
      date: data,
      category: categoria
    });
  }

  setItensBD();

  loadItens();
  modal.classList.remove('active') 

  updateSummary();
};

// Função para excluir um item da lista com base no índice fornecido.
function deleteItem(index) {
  items.splice(index, 1);
  setItensBD();
  loadItens();
  updateSummary();
}

// Função para inserir um novo item na tabela da página
function insertItem(item, index) {
  let tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${item.desc}</td>
    <td>R$ ${item.amount}</td>
    <td>${item.date}</td>
    <td>${item.category}</td>
   
    <td class="columnType">${
      item.type === "Entrada"
        ? '<i class="bx bxs-chevron-up-circle"></i>'
        : '<i class="bx bxs-chevron-down-circle"></i>'
    }</td>
    <td class="columnAction">
      <button onclick="editItem(${index})"><i class='bx bxs-edit'></i></i></button>
    </td>
    <td class="columnAction">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `;

  tbody.appendChild(tr);
  updateSummary();
}  

// Função para editar um item da lista
function editItem(index) {
  openModal(index);
}

// Função para calcular e atualizar os totais de entradas, saídas e saldo na página
function getTotals() {

  // Filtra os itens para obter um array de valores de entradas como números
  const amountIncomes = items
    .filter((item) => item.type === "Entrada")
    .map((transaction) => Number(transaction.amount));

  // Filtra os itens para obter um array de valores de saídas como números
  const amountExpenses = items
    .filter((item) => item.type === "Saída")
    .map((transaction) => Number(transaction.amount));

  // Calcula o total de entradas somando os valores do array de entradas
  const totalIncomes = amountIncomes
    .reduce((acc, cur) => acc + cur, 0)
    .toFixed(2);

  // Calcula o total de saídas somando os valores do array de saídas e usando Math.abs para garantir que seja positivo
  const totalExpenses = Math.abs(
    amountExpenses.reduce((acc, cur) => acc + cur, 0)
  ).toFixed(2);

  // Calcula o saldo total subtraindo as saídas das entradas
  const totalItems = (totalIncomes - totalExpenses).toFixed(2);

  incomes.innerHTML = totalIncomes;
  expenses.innerHTML = totalExpenses;
  total.innerHTML = totalItems;
}

// Função para salvar os itens no banco de dados local (localStorage)
const setItensBD = () =>
  localStorage.setItem("db_items", JSON.stringify(items));

const categoryFilter = document.querySelector("#categoryFilter");
    
categoryFilter.addEventListener("change", filterItemsByCategory);
    
// Função para filtrar os itens com base na categoria selecionada
function filterItemsByCategory() {
  loadItens(categoryFilter.value); 
}
  
// Função para exibir os itens filtrados na tabela da página
function displayFilteredItems(filteredItems) {
  tbody.innerHTML = "";
  filteredItems.forEach((item, index) => {
    insertItem(item, index);
  });
}

// Função para carregar e exibir os itens na tabela com base na categoria selecionada
function loadItens(selectedCategory = "all") {
    const filteredItems = items.filter((item) => {
      return selectedCategory === "all" || item.category === selectedCategory;
    });
  
    tbody.innerHTML = "";
  
    // Verifica se não há itens filtrados (ou seja, nenhum item corresponde à categoria selecionada)
    if (filteredItems.length === 0) {
      tbody.innerHTML = "<tr><td colspan='6'>Nenhum item encontrado.</td></tr>";
    } else {
      filteredItems.forEach((item, index) => {
        insertItem(item, index);
      });
    }
  
    getTotals();
}

loadItens();
updateSummary();
