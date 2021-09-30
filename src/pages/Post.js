import React, { useState, useEffect } from "react";
import md from "md5";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from "universal-cookie/";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardImg,
  CardText,
  Button,
} from "reactstrap";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";

function Post(props) {
  const cookies = new Cookies();
  const [modalInsertar, setModalInsertar] = useState(false);
  const [data, setData] = useState([]);
  const baseUrl = "https://localhost:7220/api/post";

  var id = cookies.get("id", { path: "/" });
  const [getPost, setPost] = useState({
    title: "",
    contentP: "",
    route_image: "",
    id: "",
    userid: "",
  });

  const manejoModal = () => {
    setModalInsertar(!modalInsertar);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost({
      ...getPost,
      [name]: value,
    });
  };

  const peticionGet = async () => {
    await axios
      .get(baseUrl + "/" + id)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const peticionPost = async () => {
    delete getPost.id;
    getPost.userid = id;
    await axios
      .post(baseUrl, getPost)
      .then((response) => {
        setData(data.concat(response.data));
        manejoModal();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const cerrarSesion = () => {
    cookies.remove("id", { path: "/" });
    cookies.remove("email", { path: "/" });
    cookies.remove("username", { path: "/" });
    cookies.remove("password", { path: "/" });
    alert("Has cerrado sesión");
    props.history.push("/");
  };

  useEffect(() => {
    peticionGet();
  }, []);

  //
  console.log(id);
  return (
    <Container>
      <Row>
        <Col>
          {" "}
          <br />
          <button className="btn btn-success" onClick={() => manejoModal()}>
            Crear un nuevo Post
          </button>
          <h3>Post publicados por: {cookies.get("username", { path: "/" })}</h3>
          <button className="btn btn-danger" onClick={() => cerrarSesion()}>
            Salir
          </button>
        </Col>{" "}
        <br />
        {data.map((post) => (
          <Col md={6}>
            <Card style={{ width: "18rem" }}>
              <CardImg variant="top" src={post.route_image} />
              <CardBody>
                <CardTitle>{post.title}</CardTitle>
                <CardText>{post.contentP}</CardText>
              </CardBody>
            </Card>
          </Col>
        ))}{" "}
        <br />
      </Row>
      <Modal isOpen={modalInsertar}>
        <ModalHeader>Insertar registros en base de datos</ModalHeader>
        <ModalBody>
          <label>Título del post:</label>
          <br />
          <input
            type="text"
            className="form-control"
            name="title"
            onChange={handleChange}
          />{" "}
          <br />
          <label>Contenido del post:</label>
          <br />
          <input
            type="text"
            className="form-control"
            name="contentP"
            onChange={handleChange}
          />{" "}
          <br />
          <label>Ruta de la imagen:</label>
          <br />
          <input
            type="text"
            className="form-control"
            name="route_image"
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
    </Container>
  );
}
export default Post;
