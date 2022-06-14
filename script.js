const API_URL = "https://bp-marvel-api.herokuapp.com/marvel-characters";
const FORM_BTN = document.querySelector("#formBtn");
const FORM = document.querySelector("#formHeroe");

const on = (selector, handler) => {
  document.addEventListener("click", (e) => {
    if (e.target.closest(selector)) {
      handler(e);
    }
  });
};
//Consultar Heroes
const getHeroes = () => {
  let params = {
    idAuthor: 1,
  };
  axios
    .get(`${API_URL}`, { params })
    .then((res) => {
      const marvelList = document.querySelector("#marvelList");
      const heroes = res.data;
      heroes.forEach((heroe) => {
        marvelList.innerHTML += `<div class="card my-3 bg-dark">
            <div class="row g-3 p-4">
            <div class="col-md-3">
            <img src="${heroe.image}" class="img-fluid rounded-start img-tamano" onerror="this.onerror=null;this.src='https://www.pillar.com.mx/img/categorias/no-disponible.jpg';">
            </div>
            <div class="col-md-7 text-light d-flex flex-column justify-content-center">
            <h2>${heroe.title}</h2>    
            <p>${heroe.body}</p>
            <div class="d-none">
            <span>${heroe._id}</span>
            <span>${heroe.idAuthor}</span>
            </div>
            </div>
            <div class="col-md-2 text-light d-flex flex-column justify-content-center">
            <button class="btn btn-light text-danger my-2 p-3"><i class="fa-solid fa-pencil"></i></button>
            <a class="btn btn-light text-danger my-2 p-3 btnBorrar"><i class="fa-solid fa-trash-can"></i></a>
            </div>
            </div>
            </div>`;
      });
      document.querySelector(".spinner").style.display = "none";
    })
    .catch((err) => {
      console.error(err);
    });
};
//Borrar Heroe
on(".btnBorrar", (e) => {
  const card = e.target.parentNode.parentNode;
  const id = card.childNodes[3].childNodes[5].childNodes[1].innerHTML;
  const idAuthor = card.childNodes[3].childNodes[5].childNodes[3].innerHTML;
  const params = {
    idAuthor,
  };
  Swal.fire({
    title: '',
    text: "Estás seguro que deseas eliminar al heroe?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#ffc107',
    confirmButtonText: 'Eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      axios
      .delete(`${API_URL}/${id}`, { params })
      .then((res) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Eliminado con Exito!',
          showConfirmButton: false,
          timer: 1000
        })
        setTimeout(()=>{
          location.reload();
        },1000)
      })
      .catch((err) => {
        console.error(err);
      });
      
    }
  })
});
//Nuevo Heroe
FORM_BTN.addEventListener("click", (e) => {
  e.preventDefault();
  let image = FORM["heroeImagen"].value;
  let title = FORM["heroeTitulo"].value;
  let body = FORM["heroeDescripcion"].value;

  let imageHelp = document.querySelector("#imagenHelp");
  let titleHelp = document.querySelector("#tituloHelp");
  let bodyHelp = document.querySelector("#descripcionHelp");

  imageHelp.innerHTML = "";
  titleHelp.innerHTML = "";
  bodyHelp.innerHTML = "";

  let isValidated = true;
  //validaciones de los inputs
  let regexUrl =
    /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(
      image
    );
  if (image == null || image == "") {
    imageHelp.innerHTML = "La url de la imagen es obligatoria";
    isValidated = false;
  } else if (!regexUrl) {
    imageHelp.innerHTML = "La url no cumple con los requisitos";
    isValidated = false;
  }
  if (title == null || title == "") {
    titleHelp.innerHTML = "El titulo es obligatorio";
    isValidated = false;
  }

  if (body == null || body == "") {
    bodyHelp.innerHTML = "La descripción es obligatoria";
    isValidated = false;
  }

  if (isValidated) {
    const params = {
      idAuthor: 1,
    };

    const bodyRequest = {
      title,
      body,
      image,
      category: "main",
      idAuthor: 2,
    };

    axios
      .post(`${API_URL}`, bodyRequest, { params })
      .then((res) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Heroe guardado',
          showConfirmButton: false,
          timer: 1000
        })
        setTimeout(()=>{
          location.reload();
        },1000)
      })
      .catch((err) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: `${err.response.data.message}`,
          showConfirmButton: false,
          timer: 1000
        })
      });
  }
});

window.addEventListener("DOMContentLoaded", () => {
  getHeroes();
});
