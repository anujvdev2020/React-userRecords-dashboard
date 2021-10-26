import "./styles.css";
import React from "react";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Icon from "@mui/material/Icon";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  FormGroup,
  Label,
  Button,
  Form,
  InputGroup,
  InputGroupAddon,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Progress
} from "reactstrap";

import overlayFactory from "react-bootstrap-table2-overlay";
import { Alert } from "reactstrap";
import SettingsIcon from "@mui/icons-material/Settings";
const BASE_URL = "https://reqres.in/api/users";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      tableData: [],
      isTableDataArrived: false,
      openModal: false,
      name: "",
      email: "",
      type: "",
      user: {}
    };
    window.App = this;
  }

  columns = [
    {
      dataField: "id",
      text: "User ID"
    },
    {
      dataField: "name",
      text: "Name "
    },
    {
      dataField: "email",
      text: "Email"
    },
    {
      dataField: "action",
      text: "Action",
      formatter: (cellContent, row) => (
        <UncontrolledDropdown>
          <DropdownToggle
            className="actionBtn"
            style={{
              border: "0px",

              padding: "0"
            }}
          >
            <Grid item xs={8}>
              <SettingsIcon />
            </Grid>
          </DropdownToggle>

          <DropdownMenu
            style={{
              right: "0px",
              left: "auto",
              boxShadow: "0 0 50px 0 rgba(82,63,105,.15)",
              border: "0px",
              minWidth: "12rem"
            }}
          >
            <DropdownItem
              onClick={() => this.editUser(row.id)}
              style={{ borderBottom: "0px" }}
            >
              <Grid item xs={8}>
                <EditIcon /> Edit
              </Grid>
            </DropdownItem>

            <DropdownItem
              onClick={() => this.deleteUser(row.id)}
              style={{ borderBottom: "0px" }}
            >
              <Grid item xs={8}>
                <DeleteIcon /> Delete
              </Grid>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      )
    }
  ];
  componentWillMount = () => {
    this.getAllUsers();
  };
  getAllUsers = () => {
    axios.get(BASE_URL).then((data) => {
      if (data.data.data.length > 0) {
        let _tableData = data.data.data.map((item) => {
          item.name = item.first_name + " " + item.last_name;
          return item;
        });
        this.setState({
          isTableDataArrived: true,
          tableData: _tableData
        });
      }
    });
  };
  editUser = (id) => {
    this.state.tableData.map((item) => {
      if (item.id == id) {
        this.setState({
          user: item,
          name: item.name,
          email: item.email,
          type: "Edit"
        });
      }
    });

    this.togglePreview();
  };

  deleteUser = (_id) => {
    this.setState({
      type: "Delete"
    });
    axios.delete(BASE_URL + "/" + _id).then((data) => {
      let newData = this.state.tableData.filter((item) => item.id != _id);
      this.setState(
        {
          tableData: newData,
          renderToast: true,
          toastMessage: "User Deleted Successfully",
          toastType: "danger"
        },
        () => this.timeOutToast()
      );
    });
  };

  togglePreview = () => {
    this.setState({
      openModal: !this.state.openModal
    });
  };
  makeApiCall = () => {
    let type = this.state.type;
    if (type == "Add") {
      axios
        .post(BASE_URL, {
          name: this.state.name,
          email: this.state.email
        })
        .then((data) => {
          if (data.status == "201") {
            let newUser = {
              id: data.data.id,
              name: data.data.name,
              email: data.data.email
            };
            let newData = this.state.tableData;
            newData.push(newUser);
            this.setState(
              {
                tableData: newData,
                renderToast: true,
                toastMessage: "User Added Successfully ",
                toastType: "success"
              },
              () => this.timeOutToast()
            );
            this.togglePreview();
          }
        });
    } else if (type == "Edit") {
      axios
        .put(BASE_URL, {
          name: this.state.name,
          email: this.state.email
        })
        .then((data) => {
          if (data.status == "200") {
            let newData = this.state.tableData.map((item) => {
              let user = item;

              if (user.id == this.state.user.id) {
                (user.name = data.data.name), (user.email = data.data.email);
              }

              return user;
            });

            this.setState(
              {
                tableData: newData,
                renderToast: true,

                toastMessage: "User Updated Successfully ",
                toastError: "",
                toastType: "success"
              },
              this.timeOutToast()
            );
            this.togglePreview();
          }
        });
    }
  };

  addUser = () => {
    this.setState({
      name: "",
      email: "",
      avatar: "",
      type: "Add"
    });
    this.togglePreview();
  };
  handleName = (e) => {
    this.setState({
      name: e.target.value
    });
  };
  handleEmail = (e) => {
    this.setState({
      email: e.target.value
    });
  };
  timeOutToast = () => {
    setTimeout(
      function () {
        this.setState({
          renderToast: false,
          toastMessage: "",
          toastError: "",
          toastType: "",
          type: ""
        });
      }.bind(this),
      3000
    );
  };
  render() {
    return (
      <div className="App">
        <>
          {this.state.renderToast ? (
            <Alert
              color={this.state.toastType}
              className="m-2"
              style={{ position: "absolute", width: "25%" }}
            >
              {this.state.toastMessage}
            </Alert>
          ) : (
            ""
          )}
          {this.state.isTableDataArrived ? (
            <>
              <div className="d-flex justify-content-center">
                <div>
                  <h2 className="mt-2">Add Users</h2>
                </div>
                <div>
                  <Box
                    sx={{
                      "& > :not(style)": {
                        m: 2
                      }
                    }}
                    style={{ cursor: "pointer" }}
                    onClick={this.addUser}
                  >
                    <Icon color="primary">add_circle</Icon>
                  </Box>
                </div>
              </div>
              <BootstrapTable
                keyField="id"
                data={this.state.tableData}
                columns={this.columns}
                bordered={true}
                condensed={true}
                overlay={overlayFactory({
                  spinner: true,
                  background: "rgba(192,192,192,0.3)"
                })}
              />
              <Modal isOpen={this.state.openModal} toggle={this.togglePreview}>
                <ModalHeader>
                  {this.state.type == "Edit" ? "User Info" : "Add New  User"}
                </ModalHeader>
                <ModalBody>
                  {this.state.type == "Edit" ? (
                    <div>
                      <img
                        src={this.state.user ? this.state.user.avatar : ""}
                        alr="user-avatar"
                      />
                    </div>
                  ) : (
                    ""
                  )}

                  <FormGroup>
                    <Input
                      placeholder="Name"
                      className="mb-2"
                      value={this.state.name}
                      onChange={(e) => this.handleName(e)}
                    />
                    <Input
                      placeholder="Email"
                      value={this.state.email}
                      onChange={(e) => this.handleEmail(e)}
                    />
                  </FormGroup>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" outline onClick={this.togglePreview}>
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    outline
                    onClick={() => this.makeApiCall()}
                  >
                    {this.state.type}
                  </Button>
                </ModalFooter>
              </Modal>
            </>
          ) : (
            ""
          )}
        </>
      </div>
    );
  }
}
