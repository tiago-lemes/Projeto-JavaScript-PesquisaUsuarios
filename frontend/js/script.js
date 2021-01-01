let arrayUsers = [];
let arrayFindedUsers = [];
let spanCountUsers = null;
let divUsersFinded = null;
let divResultStatiscs = null;
let spanStatistics = null;
let spanCountUsersMen = null;
let spanCountUsersWomen = null;
let spanAverageAges = null;
let spanSumAges = null;
let btnSearch = null;
let inputName = null;
let divWaiting = null;
let divFormSearch = null;
let divContainerResultados = null;

window.addEventListener('load', async () => {
  const showInteraction = (show) => {
    if (show) {
      divWaiting.classList.add('hidden');
      console.log(divWaiting);
      divFormSearch.classList.remove('hidden');
      divContainerResultados.classList.remove('hidden');
    } else {
      divWaiting.classList.remove('hidden');
      divFormSearch.classList.add('hidden');
      divContainerResultados.classList.add('hidden');
    }
  };
  const checkEnableButtonSearch = () => {
    btnSearch.disabled = inputName.value.length === 0;
  };
  const searchUserByName = (name) => {
    showInteraction(false);

    if (name === '') {
      arrayFindedUsers = [];
      render();
    } else {
      arrayFindedUsers = arrayUsers.filter(
        (user) => user.name.toUpperCase().indexOf(name.toUpperCase()) >= 0
      );
    }

    render();
    showInteraction(true);
  };

  const fetchUsers = async () => {
    const res = await fetch(
      //'https://randomuser.me/api/?seed=javascript&results=3000&nat=BR&noinfo'
      'http://localhost:3002/users'
    );
    const json = await res.json();

    arrayUsers = json.map((user) => {
      const { name, gender, dob, picture } = user;

      return {
        name: `${name.first} ${name.last}`,
        gender,
        dateBirth: new Date(dob.date),
        picture: picture.thumbnail,
        age: Math.floor(
          Math.abs(new Date() - new Date(dob.date)) / 31536000000
        ),
      };
    });

    showInteraction(true);
  };

  const render = () => {
    const renderFindedUsers = (array) => {
      divUsersFinded.style.visibility = 'visible';
      divResultStatiscs.style.visibility = 'visible';
      spanCountUsers.textContent = `(${arrayFindedUsers.length}) usuário(s) encontrado(s)`;
      spanStatistics.textContent = 'Estatísticas';

      let usersFindedHTML = '<div>';
      array.forEach((user) => {
        const userHTML = `
        <div class="user">
          <div>
            <img src="${user.picture}" name="${name}" class="img-picture">
          </div>
          <div>
            ${user.name}, ${user.age} anos
          </div>
        </div>
        `;

        usersFindedHTML += userHTML;
      });

      usersFindedHTML += '</div>';

      divUsersFinded.innerHTML = usersFindedHTML;
    };

    const renderNoUsersFinded = () => {
      divUsersFinded.style.visibility = 'hidden';
      divResultStatiscs.style.visibility = 'hidden';
      spanCountUsers.textContent = 'Nenhum usuário filtrado';
      spanStatistics.textContent = 'Nada a ser exibido';
    };

    const renderStatistics = (array) => {
      let sumAges = 0;
      let countMen = 0;
      let countWomen = 0;

      array.forEach((user) => {
        sumAges += user.age;
        if (user.gender === 'male') {
          countMen++;
        } else {
          countWomen++;
        }
      }, 0);

      const averageAge = sumAges / array.length;

      spanCountUsersMen.textContent = countMen;
      spanCountUsersWomen.textContent = countWomen;
      spanAverageAges.textContent = averageAge.toFixed(2);
      spanSumAges.textContent = sumAges;
    };

    // ini render
    if (arrayFindedUsers.length === 0) {
      renderNoUsersFinded();
    } else {
      renderFindedUsers(arrayFindedUsers);
      renderStatistics(arrayFindedUsers);
    }
  };

  const loadObjects = () => {
    const click_btnSearch = () => {
      searchUserByName(inputName.value);
    };

    const keyup_inputName = (event) => {
      if (event.key === 'Enter') {
        searchUserByName(inputName.value);
      }

      checkEnableButtonSearch();
    };

    spanCountUsers = document.querySelector('#spanCountUsers');
    divUsersFinded = document.querySelector('#divUsersFinded');
    spanStatistics = document.querySelector('#spanStatistics');
    divResultStatiscs = document.querySelector('#divResultStatiscs');
    spanCountUsersMen = document.querySelector('#spanCountUsersMen');
    spanCountUsersWomen = document.querySelector('#spanCountUsersWomen');
    spanAverageAges = document.querySelector('#spanAverageAges');
    spanSumAges = document.querySelector('#spanSumAges');
    btnSearch = document.querySelector('#btnSearch');
    inputName = document.querySelector('#inputName');
    divWaiting = document.querySelector('#divWaiting');
    divFormSearch = document.querySelector('#divFormSearch');
    divContainerResultados = document.querySelector('#divContainerResultados');

    const form = document.querySelector('form');
    form.addEventListener('submit', (event) => event.preventDefault());

    btnSearch.addEventListener('click', click_btnSearch);
    inputName.addEventListener('keyup', keyup_inputName);
  };

  //ini onLoad

  loadObjects();

  await fetchUsers();

  checkEnableButtonSearch();

  render();
});
