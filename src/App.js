import React, { Component } from "react";
import Axios from "axios";

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import { URL_API } from "./supports/URL";
import numeral from "numeral";

class App extends Component {
  state = {
    idAddRecipe: 1,
    jumlahBuah: 0,
    materialChoosed: null,
    detailSelected: null,
    loading: false,
    loadingData: false,
    data: [],
    renderulang: false,
    renderulang1: false,

    editnominal: 0,
    updatedvalue: [null, null],

    openModal: false,
    openModalRecipe: false,
    idRecipeSelected: null,
    titleRecipeSelected: null,
    detailRecipeItem: [],
    finishloaddetail: false,
    loaddetails: false,
  };

  componentDidMount() {
    document.title = "Nutrition Calculation";

    Axios.get(URL_API + "/item/getItem")
      .then((res) => {
        this.setState({
          dataAwal: res.data,
        });
        console.log(this.state.dataAwal);
      })
      .catch((err) => {
        console.log(err);
      });

    Axios.get(URL_API + "/recipe/getrecipe")
      .then((res) => {
        this.setState({
          data: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  renderAddRecipe = () => {
    return (
      <Modal
        isOpen={this.state.openModal}
        toggle={this.toggle}
        style={{ maxWidth: "1366px" }}
      >
        <ModalHeader toggle={this.toggle}>Add Recipe</ModalHeader>
        <ModalBody style={{ overflowX: "auto" }}>
          <div className="container">
            <div className="row">
              <div className="col-12">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Masukkan Nama Recipe"
                  ref={(NamaRecipe) => (this.NamaRecipe = NamaRecipe)}
                />
              </div>
              <div className="col-12">
                <Button
                  className="btn btn-secondary"
                  onClick={() =>
                    this.setState({ jumlahBuah: this.state.jumlahBuah + 1 })
                  }
                >
                  Tambah Bahan
                </Button>
              </div>
            </div>
          </div>

          <table class="table mt-5">
            <thead class="thead-dark">
              <tr>
                <th scope="col">No</th>
                <th scope="col">Material Name</th>
                <th scope="col">Weight (gram)</th>
                <th scope="col">Calorie</th>
                <th scope="col">Protein</th>
                <th scope="col">TotalFat</th>
                <th scope="col">Saturated</th>
                <th scope="col">MUFA</th>
                <th scope="col">PUFA</th>
                <th scope="col">Carbo</th>
                <th scope="col">Fiber</th>
                <th scope="col">Price</th>
              </tr>
            </thead>
            <tbody>{this.renderJumlahBuah()}</tbody>
            <tfoot>{this.renderTotal()}</tfoot>
          </table>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={this.saveRecipe}>
            Save
          </Button>{" "}
          <Button color="danger" onClick={this.toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  renderDetailRecipe = () => {
    if (this.state.finishloaddetail) {
      return (
        <Modal
          isOpen={this.state.openModalRecipe}
          toggle={this.toggle}
          style={{ maxWidth: "1366px" }}
        >
          <ModalHeader toggle={this.toggle}>Detail Recipe</ModalHeader>
          <ModalBody style={{ overflowX: "auto" }}>
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <h4>Nama Recipe: {this.state.titleRecipeSelected}</h4>
                </div>
              </div>
            </div>

            <table class="table mt-5">
              <thead class="thead-dark">
                <tr>
                  <th scope="col">Material</th>
                  <th scope="col">Weight / gram</th>
                  <th scope="col">Calorie (kcal)</th>
                  <th scope="col">Protein / gram</th>
                  <th scope="col">Total Fat</th>
                  <th scope="col">Saturated</th>
                  <th scope="col">MUFA</th>
                  <th scope="col">PUFA</th>
                  <th scope="col">Carbohydrate</th>
                  <th scope="col">Fiber</th>
                  <th scope="col">Price</th>
                  <th scope="col">Source</th>
                  <th scope="col">Edit</th>
                  <th scope="col">Delete</th>
                </tr>
              </thead>
              <tbody>{this.renderDetailRecipeItem()}</tbody>
              <tfoot>{this.renderTotalResDetail()}</tfoot>
            </table>
          </ModalBody>
          <ModalFooter>
            {/* <Button color="primary" onClick={this.toggle}>Save</Button>{' '} */}
            <Button color="danger" onClick={this.toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      );
    }
  };

  deleteRecipeItem = (id, bahan) => {
    let bool = window.confirm(`Apakah anda ingin menghapus bahan ${bahan} ?`);
    if (bool) {
      Axios.get(URL_API + "/recipe/deleterecipedetail/" + id)
        .then((res) => {
          if (res.status === 200) {
            Axios.get(URL_API + "/recipe/getrecipedetail/" + id)
              .then((res) => {
                console.log(res.data);
                this.setState({
                  openModalRecipe: false,
                });
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  renderDetailRecipeItem = () => {
    if (this.state.detailRecipeItem.length !== 0) {
      console.log(this.state.detailRecipeItem);

      var jsx = this.state.detailRecipeItem.map((val, index) => {
        console.log("map " + index);

        if (this.state.editRecipeDetail === val.id) {
          // Ketika edit detail, maka state tidak berubah

          return (
            <tr key={index}>
              <td>{val.material}</td>
              <td>
                <input
                  type="number"
                  defaultValue={val.gram}
                  maxLength={4}
                  className="form-control"
                  placeholder="Masukkan berat buah"
                  ref={`gramdetail${index}`}
                  onChange={() => this.setState({ renderulang1: true })}
                  min="1"
                  max="999"
                />
              </td>
              <td>
                {!val.material
                  ? null
                  : `${(val.calorie * this.refs[`gramdetail${index}`].value)
                      .toFixed(5)
                      .replace(/[.]/g, ",")}`}
              </td>
              <td>
                {!val.material
                  ? null
                  : `${(val.protein * this.refs[`gramdetail${index}`].value)
                      .toFixed(5)
                      .replace(/[.]/g, ",")}`}
              </td>
              <td>
                {!val.material
                  ? null
                  : `${(val.totalFat * this.refs[`gramdetail${index}`].value)
                      .toFixed(5)
                      .replace(/[.]/g, ",")}`}
              </td>
              <td>
                {!val.material
                  ? null
                  : `${(val.saturated * this.refs[`gramdetail${index}`].value)
                      .toFixed(5)
                      .replace(/[.]/g, ",")}`}
              </td>
              <td>
                {!val.material
                  ? null
                  : `${(val.mufa * this.refs[`gramdetail${index}`].value)
                      .toFixed(5)
                      .replace(/[.]/g, ",")}`}
              </td>
              <td>
                {!val.material
                  ? null
                  : `${(val.pufa * this.refs[`gramdetail${index}`].value)
                      .toFixed(5)
                      .replace(/[.]/g, ",")}`}
              </td>
              <td>
                {!val.material
                  ? null
                  : `${(val.carbohydrat * this.refs[`gramdetail${index}`].value)
                      .toFixed(5)
                      .replace(/[.]/g, ",")}`}
              </td>
              <td>
                {!val.material
                  ? null
                  : `${(val.fiber * this.refs[`gramdetail${index}`].value)
                      .toFixed(5)
                      .replace(/[.]/g, ",")}`}
              </td>
              <td>
                {!val.material
                  ? null
                  : `Rp. ${numeral(
                      parseFloat(
                        val.price * this.refs[`gramdetail${index}`].value
                      )
                    ).format("0,0.[00]")}`}
              </td>
              <td>
                <a
                  href={val.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Link Source
                </a>
              </td>
              <td>
                <Button
                  className="btn btn-danger"
                  onClick={() => this.setState({ editRecipeDetail: null })}
                >
                  Cancel
                </Button>
              </td>
              <td>
                <Button
                  className="btn btn-primary"
                  onClick={() =>
                    this.updateGramRecipeDetail(
                      this.state.editRecipeDetail,
                      index
                    )
                  }
                >
                  Save
                </Button>
              </td>
            </tr>
          );
        }

        return (
          <tr key={index}>
            <td>{val.material}</td>
            <td>
              <input
                type="number"
                value={val.gram}
                maxLength={4}
                className="form-control"
                placeholder="Masukkan berat buah"
                ref={`gramdetail${index}`}
                onChange={() => this.setState({ renderulang1: true })}
                min="1"
                max="999"
                disabled
              />
            </td>
            <td>{`${(val.calorie * val.gram)
              .toFixed(5)
              .replace(/[.]/g, ",")}`}</td>
            <td>{`${(val.protein * val.gram)
              .toFixed(5)
              .replace(/[.]/g, ",")}`}</td>
            <td>{`${(val.totalFat * val.gram)
              .toFixed(5)
              .replace(/[.]/g, ",")}`}</td>
            <td>{`${(val.saturated * val.gram)
              .toFixed(5)
              .replace(/[.]/g, ",")}`}</td>
            <td>{`${(val.mufa * val.gram)
              .toFixed(5)
              .replace(/[.]/g, ",")}`}</td>
            <td>{`${(val.pufa * val.gram)
              .toFixed(5)
              .replace(/[.]/g, ",")}`}</td>
            <td>{`${(val.carbohydrat * val.gram)
              .toFixed(5)
              .replace(/[.]/g, ",")}`}</td>
            <td>{`${(val.fiber * val.gram)
              .toFixed(5)
              .replace(/[.]/g, ",")}`}</td>
            <td>{`Rp ${numeral(parseFloat(val.price * val.gram)).format(
              "0,0.[00]"
            )}`}</td>
            <td>
              <a
                href={val.source_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Link Source
              </a>
            </td>
            <td>
              <Button
                className="btn btn-success"
                onClick={() =>
                  this.setState({
                    editRecipeDetail: val.id,
                    renderulang: true,
                    updatedvalue: [null, null],
                  })
                }
              >
                Edit Bahan
              </Button>
            </td>
            <td>
              <Button
                className="btn btn-danger"
                onClick={() => this.deleteRecipeItem(val.id, val.material)}
              >
                Delete
              </Button>
            </td>
          </tr>
        );
      });

      if (!this.state.loaddetails) {
        console.log("asd");
        this.setState({
          loaddetails: true,
        });
      }

      return jsx;
    }
  };

  updateGramRecipeDetail = (id, index) => {
    Axios.post(URL_API + "/recipe/editRecipeDetailItem/" + id, {
      data: this.refs[`gramdetail${index}`].value,
    })
      .then((res) => {
        // this.setState({
        //   openModalRecipe : false
        // })

        this.setState({
          editRecipeDetail: null,
          updatedvalue: [index, this.refs[`gramdetail${index}`].value],
        });
        this.getDetailRecipeItem(
          this.state.idRecipeSelected,
          this.state.titleRecipeSelected
        );
        this.renderTotalResDetail();

        // this.setState({
        //   idRecipeSelected: null,
        //   titleRecipeSelected: null,
        //   detailRecipeItem: [],
        //   editRecipeDetail: null
        // })
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // renderDataRecipe = (id) => {
  //     if(id) {

  //     }
  // }

  // <td>{`${parseFloat(data.calorie).toFixed(5)}`}</td>
  // <td>{`${parseFloat(data.protein).toFixed(5)}`}</td>
  // <td>{`${parseFloat(data.totalFat).toFixed(5)}`}</td>
  // <td>{`${parseFloat(data.saturated).toFixed(5)}`}</td>
  // <td>{`${parseFloat(data.mufa).toFixed(5)}`}</td>
  // <td>{`${parseFloat(data.pufa).toFixed(5)}`}</td>
  // <td>{`${parseFloat(data.carbohydrat).toFixed(5)}`}</td>
  // <td>{`${parseFloat(data.fiber).toFixed(5)}`}</td>
  // <td>{`${parseFloat(data.price).toFixed(5)}`}</td>

  renderTotalResDetail = () => {
    console.log(
      "***************************************************************8"
    );
    var totalweight = 0;
    var totalcalorie = 0;
    var totalprotein = 0;
    var totalFat = 0;
    var totalsaturated = 0;
    var totalmufa = 0;
    var totalpufa = 0;
    var totalcarbohydrat = 0;
    var totalfiber = 0;
    var totalprice = 0;

    for (var i = 0; i < this.state.detailRecipeItem.length; i++) {
      console.log(i);
      console.log(this.state.detailRecipeItem[i].gram);
      var value;
      if (i === this.state.updatedvalue[0]) {
        value = this.state.updatedvalue[1];
      } else {
        value = this.refs[`gramdetail${i}`]
          ? this.refs[`gramdetail${i}`].value
          : this.state.detailRecipeItem[i].gram;
      }
      totalweight = parseFloat(totalweight) + parseFloat(value);
      totalcalorie =
        parseFloat(totalcalorie) +
        parseFloat(this.state.detailRecipeItem[i].calorie * parseFloat(value));
      totalprotein =
        parseFloat(totalprotein) +
        parseFloat(this.state.detailRecipeItem[i].protein * parseFloat(value));
      totalFat =
        parseFloat(totalFat) +
        parseFloat(this.state.detailRecipeItem[i].totalFat * parseFloat(value));
      totalsaturated =
        parseFloat(totalsaturated) +
        parseFloat(
          this.state.detailRecipeItem[i].saturated * parseFloat(value)
        );

      totalmufa =
        parseFloat(totalmufa) +
        parseFloat(this.state.detailRecipeItem[i].mufa * parseFloat(value));
      totalpufa =
        parseFloat(totalpufa) +
        parseFloat(this.state.detailRecipeItem[i].pufa * parseFloat(value));
      totalcarbohydrat =
        parseFloat(totalcarbohydrat) +
        parseFloat(
          this.state.detailRecipeItem[i].carbohydrat * parseFloat(value)
        );
      totalfiber =
        parseFloat(totalfiber) +
        parseFloat(this.state.detailRecipeItem[i].fiber * parseFloat(value));
      totalprice =
        parseFloat(totalprice) +
        parseFloat(this.state.detailRecipeItem[i].price * parseFloat(value));
    }
    return (
      <tr>
        <td className="font-weight-bold">Total : </td>
        <td className="font-weight-bold text-gray">
          {" "}
          {totalweight.toFixed(2)}
        </td>
        <td className="font-weight-bold text-gray">
          {totalcalorie.toFixed(5).replace(/[.]/g, ",")}
        </td>
        <td className="font-weight-bold text-gray">
          {totalprotein.toFixed(5).replace(/[.]/g, ",")}
        </td>
        <td className="font-weight-bold text-gray">
          {totalFat.toFixed(5).replace(/[.]/g, ",")}
        </td>
        <td className="font-weight-bold text-gray">
          {totalsaturated.toFixed(5).replace(/[.]/g, ",")}
        </td>
        <td className="font-weight-bold text-gray">
          {totalmufa.toFixed(5).replace(/[.]/g, ",")}
        </td>
        <td className="font-weight-bold text-gray">
          {totalpufa.toFixed(5).replace(/[.]/g, ",")}
        </td>
        <td className="font-weight-bold text-gray">
          {totalcarbohydrat.toFixed(5).replace(/[.]/g, ",")}
        </td>
        <td className="font-weight-bold text-gray">
          {totalfiber.toFixed(5).replace(/[.]/g, ",")}
        </td>
        <td className="font-weight-bold text-gray">
          {`Rp. ` + numeral(parseFloat(totalprice)).format("0,0.[00]")}
        </td>
      </tr>
    );
  };

  renderTotal = () => {
    if (this.state.jumlahBuah > 0) {
      var totalweight = 0;
      var totalcalorie = 0;
      var totalprotein = 0;
      var totalFat = 0;
      var totalsaturated = 0;
      var totalmufa = 0;
      var totalpufa = 0;
      var totalcarbohydrat = 0;
      var totalfiber = 0;
      var totalprice = 0;

      for (var i = 0; i < this.state.jumlahBuah; i++) {
        if (!this.refs[`namaBuah${i}`] || !this.refs[`gram${i}`].value) {
        } else {
          totalweight =
            parseFloat(totalweight) + parseFloat(this.refs[`gram${i}`].value);
          totalcalorie =
            parseFloat(totalcalorie) +
            parseFloat(
              this.state.dataAwal[this.refs[`namaBuah${i}`].value].calorie *
                parseFloat(this.refs[`gram${i}`].value)
            );
          totalprotein =
            parseFloat(totalprotein) +
            parseFloat(
              this.state.dataAwal[this.refs[`namaBuah${i}`].value].protein *
                parseFloat(this.refs[`gram${i}`].value)
            );
          totalFat =
            parseFloat(totalFat) +
            parseFloat(
              this.state.dataAwal[this.refs[`namaBuah${i}`].value].totalFat *
                parseFloat(this.refs[`gram${i}`].value)
            );
          totalsaturated =
            parseFloat(totalsaturated) +
            parseFloat(
              this.state.dataAwal[this.refs[`namaBuah${i}`].value].saturated *
                parseFloat(this.refs[`gram${i}`].value)
            );

          totalmufa =
            parseFloat(totalmufa) +
            parseFloat(
              this.state.dataAwal[this.refs[`namaBuah${i}`].value].mufa *
                parseFloat(this.refs[`gram${i}`].value)
            );
          totalpufa =
            parseFloat(totalpufa) +
            parseFloat(
              this.state.dataAwal[this.refs[`namaBuah${i}`].value].pufa *
                parseFloat(this.refs[`gram${i}`].value)
            );
          totalcarbohydrat =
            parseFloat(totalcarbohydrat) +
            parseFloat(
              this.state.dataAwal[this.refs[`namaBuah${i}`].value].carbohydrat *
                parseFloat(this.refs[`gram${i}`].value)
            );
          totalfiber =
            parseFloat(totalfiber) +
            parseFloat(
              this.state.dataAwal[this.refs[`namaBuah${i}`].value].fiber *
                parseFloat(this.refs[`gram${i}`].value)
            );
          totalprice =
            parseFloat(totalprice) +
            parseFloat(
              this.state.dataAwal[this.refs[`namaBuah${i}`].value].price *
                parseFloat(this.refs[`gram${i}`].value)
            );
        }
      }
      return (
        <tr>
          <td></td>
          <td className="font-weight-bold">Total : </td>
          <td className="font-weight-bold text-gray">
            {" "}
            {totalweight.toFixed(2)}
          </td>
          <td className="font-weight-bold text-gray">
            {totalcalorie.toFixed(5).replace(/[.]/g, ",")}
          </td>
          <td className="font-weight-bold text-gray">
            {totalprotein.toFixed(5).replace(/[.]/g, ",")}
          </td>
          <td className="font-weight-bold text-gray">
            {totalFat.toFixed(5).replace(/[.]/g, ",")}
          </td>
          <td className="font-weight-bold text-gray">
            {totalsaturated.toFixed(5).replace(/[.]/g, ",")}
          </td>
          <td className="font-weight-bold text-gray">
            {totalmufa.toFixed(5).replace(/[.]/g, ",")}
          </td>
          <td className="font-weight-bold text-gray">
            {totalpufa.toFixed(5).replace(/[.]/g, ",")}
          </td>
          <td className="font-weight-bold text-gray">
            {totalcarbohydrat.toFixed(5).replace(/[.]/g, ",")}
          </td>
          <td className="font-weight-bold text-gray">
            {totalfiber.toFixed(5).replace(/[.]/g, ",")}
          </td>
          <td className="font-weight-bold text-gray">
            {`Rp. ` + numeral(parseFloat(totalprice)).format("0,0.[00]")}
          </td>
        </tr>
      );
    }
  };

  saveRecipe = () => {
    let Arr = [];
    let Arr2 = [];
    Arr.push(this.NamaRecipe.value);

    for (let i = 0; i < this.state.jumlahBuah; i++) {
      var data = {
        itemId: parseInt(this.refs[`namaBuah${i}`].value) + 1,
        gram: this.refs[`gram${i}`].value,
      };

      Arr2.push(data);
    }

    Arr.push(Arr2);
    console.log(Arr);

    Axios.post(URL_API + "/recipe/postrecipe", Arr)
      .then((res) => {
        Axios.get(URL_API + "/recipe/getrecipe")
          .then((res) => {
            this.setState({
              data: res.data,
              openModal: false,
              jumlahBuah: 0,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        this.setState({
          openModal: false,
          jumlahBuah: 0,
        });
      });
  };

  allowPositivesOnly(event) {
    return (
      event.keyCode
        ? parseInt(event.keyCode) === 69
          ? false
          : event.keyCode >= 48 && event.keyCode <= 57
        : event.charCode >= 48 && event.charCode <= 57
    )
      ? true
      : event.preventDefault();
  }

  renderJumlahBuah = () => {
    if (this.state.jumlahBuah !== 0) {
      var Arrjsx = [];

      for (let x = 0; x < this.state.jumlahBuah; x++) {
        // Dikomen karna ga dipake.
        // var data = this.state.dataAwal[x]

        // var {calorie, protein, totalFat, saturated, mufa, pufa, carbohydrat, fiber, price} = data

        Arrjsx.push(
          <tr>
            <td>{x + 1}</td>
            <td>
              <select
                ref={`namaBuah${x}`}
                className="form-control"
                onChange={() => this.setState({ renderulang: true })}
              >
                {this.state.dataAwal.map((val, index) => {
                  return (
                    <option key={index} value={val.id - 1}>
                      {val.material}
                    </option>
                  );
                })}
              </select>
            </td>
            <td>
              <input
                type="number"
                maxLength={4}
                className="form-control"
                placeholder="Masukkan berat buah"
                ref={`gram${x}`}
                onChange={() => this.setState({ renderulang: true })}
                min="1"
                max="999"
              />
            </td>
            {/* {this.renderNutrisiBuah(this.refs[`namabuah${x}`].value)} */}

            <td>
              {!this.refs[`namaBuah${x}`]
                ? null
                : `${(
                    this.state.dataAwal[this.refs[`namaBuah${x}`].value]
                      .calorie * this.refs[`gram${x}`].value
                  )
                    .toFixed(5)
                    .replace(/[.]/g, ",")}`}
            </td>
            <td>
              {!this.refs[`namaBuah${x}`]
                ? null
                : `${(
                    this.state.dataAwal[this.refs[`namaBuah${x}`].value]
                      .protein * this.refs[`gram${x}`].value
                  )
                    .toFixed(5)
                    .replace(/[.]/g, ",")}`}
            </td>
            <td>
              {!this.refs[`namaBuah${x}`]
                ? null
                : `${(
                    this.state.dataAwal[this.refs[`namaBuah${x}`].value]
                      .totalFat * this.refs[`gram${x}`].value
                  )
                    .toFixed(5)
                    .replace(/[.]/g, ",")}`}
            </td>
            <td>
              {!this.refs[`namaBuah${x}`]
                ? null
                : `${(
                    this.state.dataAwal[this.refs[`namaBuah${x}`].value]
                      .saturated * this.refs[`gram${x}`].value
                  )
                    .toFixed(5)
                    .replace(/[.]/g, ",")}`}
            </td>
            <td>
              {!this.refs[`namaBuah${x}`]
                ? null
                : `${(
                    this.state.dataAwal[this.refs[`namaBuah${x}`].value].mufa *
                    this.refs[`gram${x}`].value
                  )
                    .toFixed(5)
                    .replace(/[.]/g, ",")}`}
            </td>
            <td>
              {!this.refs[`namaBuah${x}`]
                ? null
                : `${(
                    this.state.dataAwal[this.refs[`namaBuah${x}`].value].pufa *
                    this.refs[`gram${x}`].value
                  )
                    .toFixed(5)
                    .replace(/[.]/g, ",")}`}
            </td>
            <td>
              {!this.refs[`namaBuah${x}`]
                ? null
                : `${(
                    this.state.dataAwal[this.refs[`namaBuah${x}`].value]
                      .carbohydrat * this.refs[`gram${x}`].value
                  )
                    .toFixed(5)
                    .replace(/[.]/g, ",")}`}
            </td>
            <td>
              {!this.refs[`namaBuah${x}`]
                ? null
                : `${(
                    this.state.dataAwal[this.refs[`namaBuah${x}`].value].fiber *
                    this.refs[`gram${x}`].value
                  )
                    .toFixed(5)
                    .replace(/[.]/g, ",")}`}
            </td>
            <td>
              {!this.refs[`namaBuah${x}`]
                ? null
                : `Rp. ${numeral(
                    parseFloat(
                      this.state.dataAwal[this.refs[`namaBuah${x}`].value]
                        .price * this.refs[`gram${x}`].value
                    )
                  ).format("0,0.[00]")}`}
            </td>
          </tr>
        );
      }

      // if(!this.state.finishrender){

      //   this.setState({
      //     finishrender : true
      //   })
      // }

      return Arrjsx;
    }

    return (
      <tr col="4">
        <td>Belum ada data buah</td>
      </tr>
    );
  };

  searchRecipe = () => {
    alert(this.refs.searchName.value);
    Axios.get(URL_API + "/recipe/searchrecipe/" + this.refs.searchName.value)
      .then((res) => {
        this.setState({
          data: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  renderRecipe = () => {
    if (this.state.data.length !== 0) {
      let jsx = this.state.data.map((val, index) => {
        return (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{val.recipeName}</td>
            <td>
              <input
                type="button"
                className="btn btn-primary"
                value="Detail Recipe"
                onClick={() => this.getDetailRecipeItem(val.id, val.recipeName)}
              />
            </td>
            <td>
              <input
                type="button"
                className="btn btn-danger"
                value="Delete Recipe"
                onClick={() => this.deleteRecipe(val.id)}
              />
            </td>
          </tr>
        );
      });

      return jsx;
    }
  };

  deleteRecipe = (id) => {
    let bool = window.confirm(`Apakah anda yakin ingin menghapus data ini?`);
    if (bool) {
      Axios.get(URL_API + "/recipe/deleterecipe/" + id)
        .then((res) => {
          Axios.get(URL_API + "/recipe/getrecipe")
            .then((res) => {
              this.setState({
                data: res.data,
              });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  getDetailRecipeItem = (id, title) => {
    Axios.get(URL_API + "/recipe/getrecipedetail/" + id)
      .then((res) => {
        this.setState({
          detailRecipeItem: res.data,
          titleRecipeSelected: title,
          openModalRecipe: true,
          finishloaddetail: true,
          idRecipeSelected: id,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  toggle = () => {
    if (this.state.openModal) {
      this.setState({
        openModal: !this.state.openModal,
        jumlahBuah: 0,
      });
    }
    if (this.state.openModalRecipe) {
      this.setState({
        openModalRecipe: !this.state.openModalRecipe,
        // idRecipeSelected: null,
        editRecipeDetail: null,
        // titleRecipeSelected: null,
        // detailRecipeItem: []
      });
    }
  };

  render() {
    console.log(this.state.idRecipeSelected);
    return (
      <div>
        <div className="bg-light">
          <div className="container">
            <div className="row m-0">
              <div className="col-12 py-5">
                <h4>Nutrition Calculation</h4>
              </div>
            </div>
          </div>
        </div>

        {this.renderAddRecipe(this.state.openModal)}
        {this.renderDetailRecipe(this.state.openModalRecipe)}
        <div className="container">
          <div className="col-12">
            <input
              type="button"
              className="btn btn-secondary form-control mb-3"
              value="Add New Recipe"
              onClick={() => this.setState({ openModal: true })}
            />

            <input
              ref="searchName"
              type="text"
              className="form-control"
              placeholder="Search Recipe"
            />
            <Button className="btn btn-success" onClick={this.searchRecipe}>
              Search
            </Button>
          </div>
        </div>

        {this.state.data.length !== 0 ? (
          <div className="container">
            <div className="row">
              <div className="col-12">
                <table class="table mt-5">
                  <thead class="thead-dark">
                    <tr>
                      <th scope="col">No</th>
                      <th scope="col">Nama Recipe</th>
                      <th scope="col" colSpan={2}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>{this.renderRecipe()}</tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default App;
