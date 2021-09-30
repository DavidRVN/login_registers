import React, { useState, useEffect } from "react";
import md5 from "md5";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from "universal-cookie/";
import axios from "axios";
import "../css/Login.css";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";

function Login(props) {
  const cookies = new Cookies();
  const [data, setData] = useState([]);
  const baseUrl = "https://localhost:7220/api/Users";

  const [modalInsertar, setModalInsertar] = useState(false);
  const manejoModal = () => {
    setModalInsertar(!modalInsertar);
  };

  const [getUsers, setUser] = useState({
    username: "",
    password: "",
    email: "",
    id: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...getUsers,
      [name]: value,
    });
  };

  const peticionPost = async () => {
    delete getUsers.id;
    getUsers.password = md5(getUsers.password);
    await axios
      .post(baseUrl, getUsers)
      .then((response) => {
        setData(data.concat(response.data));
        manejoModal();
      })
      .catch((error) => {
        console.log(error);
        alert("El usuario no pudo ser ingresado, revisa el email");
      });
  };

  const iniciarSesion = async () => {
    await axios
      .get(baseUrl + `/${getUsers.username}/${md5(getUsers.password)}`)
      .then((response) => {
        return response.data;
      })
      .then((response) => {
        if (response.length > 0) {
          var respuesta = response[0];
          cookies.set("id", respuesta.id, { path: "/" });
          cookies.set("correo", respuesta.correo, { path: "/" });
          cookies.set("username", respuesta.username, { path: "/" });
          cookies.set("password", respuesta.password, { path: "/" });
          alert("Bienvenido:");
          props.history.push("/Post");
        } else {
          alert("El usuario o la contraseña no son correctos");
        }
      })

      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (cookies.get("id")) {
      props.history.push("/Post");
    }
  }, []);

  return (
    <div className="containerPrincipal">
      <div className="containerLogin">
        <div className="form-group">
          <label>Usuario: </label>
          <br />
          <input
            type="text"
            className="form-control"
            name="username"
            onChange={handleChange}
          />
          <br />
          <label>Contraseña: </label>
          <br />
          <input
            type="password"
            className="form-control"
            name="password"
            onChange={handleChange}
          />
          <br />
          <button className="btn btn-primary" onClick={() => iniciarSesion()}>
            Iniciar Sesión
          </button>
          <br />
          <br />
          <br />
          <button className="btn btn-success" onClick={() => manejoModal()}>
            Ingresar un nuevo usuario
          </button>
        </div>
      </div>
      <Modal isOpen={modalInsertar}>
        <ModalHeader>Insertar registros en base de datos</ModalHeader>
        <ModalBody>
          <label>Correo electrónico:</label>
          <br />
          <input
            type="email"
            className="form-control"
            name="email"
            onChange={handleChange}
          />{" "}
          <br />
          <label>Usuario:</label>
          <br />
          <input
            type="text"
            className="form-control"
            name="username"
            onChange={handleChange}
          />{" "}
          <br />
          <label>Contraseña:</label>
          <br />
          <input
            type="password"
            className="form-control"
            name="password"
            onChange={handleChange}
          />
          <ModalFooter>
            <button className="btn btn-success" onClick={() => peticionPost()}>
              Insertar
            </button>{" "}
            <button className="btn btn-danger" onClick={() => manejoModal()}>
              Cancelar
            </button>
          </ModalFooter>
        </ModalBody>
      </Modal>
    </div>
  );
}
export default Login;
