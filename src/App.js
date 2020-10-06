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
        style={{ maxWidth: "100%" }}
      >
        <ModalHeader toggle={this.toggle}>Add Recipe</ModalHeader>
        <ModalBody style={{ overflowX: "scroll" }}>
          <div>
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

          <table className="table mt-5" style={{ width: "5000px" }}>
            <thead className="thead-dark">
              <tr>
                <th scope="col">No</th>
                <th scope="col" style={{ width: "200px" }}>
                  Material
                </th>
                <th scope="col" style={{ width: "200px" }}>
                  Weight (gram)
                </th>
                <th scope="col">Calorie</th>
                <th scope="col">Protein</th>
                <th scope="col">TotalFat</th>
                <th scope="col">Asam a-linoleat (18:2) (g)</th>
                <th scope="col">Carbohydrate (g)</th>
                <th scope="col">Fiber (g)</th>
                <th scope="col">Iron (mg)</th>
                <th scope="col">Calcium (mg)</th>
                <th scope="col">Zinc (mg)</th>

                <th scope="col">Fosfor (mg)</th>
                <th scope="col">Natrium/Sodium (mg)</th>
                <th scope="col">Kalium/ Potassium (mg))</th>
                <th scope="col">Magnesium (Mg)</th>
                <th scope="col">Tiamin/B1 (mg)</th>
                <th scope="col">Vit B12 (mikro)</th>

                <th scope="col">Vit C (mg)</th>
                <th scope="col">Vit D</th>
                <th scope="col">Folat (mikro)</th>
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
          style={{ maxWidth: "100%" }}
        >
          <ModalHeader toggle={this.toggle}>Detail Recipe</ModalHeader>
          <ModalBody style={{ overflowX: "auto" }}>
            <div>
              <div className="row">
                <div className="col-12">
                  <h4>Nama Recipe: {this.state.titleRecipeSelected}</h4>
                </div>
              </div>
            </div>

            <table className="table mt-5" style={{ width: "5000px" }}>
              <thead className="thead-dark">
                <tr>
                  <th scope="col">No</th>
                  <th scope="col">Material</th>
                  <th scope="col">Weight (gram)</th>
                  <th scope="col">Calorie</th>
                  <th scope="col">Protein</th>
                  <th scope="col">TotalFat</th>
                  <th scope="col">Asam a-linoleat (18:2) (g)</th>
                  <th scope="col">Carbohydrate (g)</th>
                  <th scope="col">Fiber (g)</th>
                  <th scope="col">Iron (mg)</th>
                  <th scope="col">Calcium (mg)</th>
                  <th scope="col">Zinc (mg)</th>

                  <th scope="col">Fosfor (mg)</th>
                  <th scope="col">Natrium/Sodium (mg)</th>
                  <th scope="col">Kalium/ Potassium (mg))</th>
                  <th scope="col">Magnesium (Mg)</th>
                  <th scope="col">Tiamin/B1 (mg)</th>
                  <th scope="col">Vit B12 (mikro)</th>

                  <th scope="col">Vit C (mg)</th>
                  <th scope="col">Vit D</th>
                  <th scope="col">Folat (mikro)</th>
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
              <td>{index + 1}</td>
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
                  : `${(val.asam * this.refs[`gramdetail${index}`].value)
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
                  : `${(val.iron * this.refs[`gramdetail${index}`].value)
                      .toFixed(5)
                      .replace(/[.]/g, ",")}`}
              </td>
              <td>
                {!val.material
                  ? null
                  : `${(val.calcium * this.refs[`gramdetail${index}`].value)
                      .toFixed(5)
                      .replace(/[.]/g, ",")}`}
              </td>

              <td>
                {!val.material
                  ? null
                  : `${(val.zinc * this.refs[`gramdetail${index}`].value)
                      .toFixed(5)
                      .replace(/[.]/g, ",")}`}
              </td>

              <td>
                {!val.material
                  ? null
                  : `${(val.fosfor * this.refs[`gramdetail${index}`].value)
                      .toFixed(5)
                      .replace(/[.]/g, ",")}`}
              </td>
              <td>
                {!val.material
                  ? null
                  : `${(val.natrium * this.refs[`gramdetail${index}`].value)
                      .toFixed(5)
                      .replace(/[.]/g, ",")}`}
              </td>
              <td>
                {!val.material
                  ? null
                  : `${(val.kalium * this.refs[`gramdetail${index}`].value)
                      .toFixed(5)
                      .replace(/[.]/g, ",")}`}
              </td>
              <td>
                {!val.material
                  ? null
                  : `${(val.magnesium * this.refs[`gramdetail${index}`].value)
                      .toFixed(5)
                      .replace(/[.]/g, ",")}`}
              </td>

              <td>
                {!val.material
                  ? null
                  : `${(val.tiamin * this.refs[`gramdetail${index}`].value)
                      .toFixed(5)
                      .replace(/[.]/g, ",")}`}
              </td>
              <td>
                {!val.material
                  ? null
                  : `${(val.vitb12 * this.refs[`gramdetail${index}`].value)
                      .toFixed(5)
                      .replace(/[.]/g, ",")}`}
              </td>
              <td>
                {!val.material
                  ? null
                  : `${(val.vit_c * this.refs[`gramdetail${index}`].value)
                      .toFixed(5)
                      .replace(/[.]/g, ",")}`}
              </td>
              <td>
                {!val.material
                  ? null
                  : `${(val.vit_d * this.refs[`gramdetail${index}`].value)
                      .toFixed(5)
                      .replace(/[.]/g, ",")}`}
              </td>
              <td>
                {!val.material
                  ? null
                  : `${(val.folat * this.refs[`gramdetail${index}`].value)
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
            <td>{index + 1}</td>
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
            <td>{`${(val.asam * val.gram)
              .toFixed(5)
              .replace(/[.]/g, ",")}`}</td>
            <td>{`${(val.carbohydrat * val.gram)
              .toFixed(5)
              .replace(/[.]/g, ",")}`}</td>
            <td>{`${(val.fiber * val.gram)
              .toFixed(5)
              .replace(/[.]/g, ",")}`}</td>
            <td>{`${(val.iron * val.gram)
              .toFixed(5)
              .replace(/[.]/g, ",")}`}</td>
            <td>{`${(val.calcium * val.gram)
              .toFixed(5)
              .replace(/[.]/g, ",")}`}</td>

            <td>{`${(val.zinc * val.gram)
              .toFixed(5)
              .replace(/[.]/g, ",")}`}</td>
            <td>{`${(val.fosfor * val.gram)
              .toFixed(5)
              .replace(/[.]/g, ",")}`}</td>
            <td>{`${(val.natrium * val.gram)
              .toFixed(5)
              .replace(/[.]/g, ",")}`}</td>
            <td>{`${(val.kalium * val.gram)
              .toFixed(5)
              .replace(/[.]/g, ",")}`}</td>
            <td>{`${(val.magnesium * val.gram)
              .toFixed(5)
              .replace(/[.]/g, ",")}`}</td>
            <td>{`${(val.tiamin * val.gram)
              .toFixed(5)
              .replace(/[.]/g, ",")}`}</td>
            <td>{`${(val.vitb12 * val.gram)
              .toFixed(5)
              .replace(/[.]/g, ",")}`}</td>
            <td>{`${(val.vit_c * val.gram)
              .toFixed(5)
              .replace(/[.]/g, ",")}`}</td>

            <td>{`${(val.vit_d * val.gram)
              .toFixed(5)
              .replace(/[.]/g, ",")}`}</td>
            <td>{`${(val.folat * val.gram)
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

  renderTotalResDetail = () => {
    let totalweight = 0;
    let totalcalorie = 0;
    let totalprotein = 0;
    let totalFat = 0;
    let asam = 0;
    let carbohydrat = 0;
    let totalfiber = 0;
    let totaliron = 0;
    let totalcalcium = 0;
    let zinc = 0;
    let fosfor = 0;
    let natrium = 0;
    let kalium = 0;
    let magnesium = 0;
    let tiamin = 0;
    let vitb12 = 0;
    let vit_c = 0;
    let vit_d = 0;
    let folat = 0;
    let totalprice = 0;

    for (var i = 0; i < this.state.detailRecipeItem.length; i++) {
      console.log(i);
      console.log(this.state.detailRecipeItem[i]);
      console.log(this.state.detailRecipeItem[i].calorie);
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
        parseFloat(this.state.detailRecipeItem[i].calorie + parseFloat(value));
      totalprotein =
        parseFloat(totalprotein) +
        parseFloat(this.state.detailRecipeItem[i].protein + parseFloat(value));
      totalFat =
        parseFloat(totalFat) +
        parseFloat(this.state.detailRecipeItem[i].totalFat + parseFloat(value));
      asam =
        parseFloat(asam) +
        parseFloat(this.state.detailRecipeItem[i].asam + parseFloat(value));
      carbohydrat =
        parseFloat(carbohydrat) +
        parseFloat(
          this.state.detailRecipeItem[i].carbohydrat + parseFloat(value)
        );
      totalfiber =
        parseFloat(totalfiber) +
        parseFloat(this.state.detailRecipeItem[i].fiber + parseFloat(value));

      totaliron =
        parseFloat(totaliron) +
        parseFloat(this.state.detailRecipeItem[i].iron + parseFloat(value));
      totalcalcium =
        parseFloat(totalcalcium) +
        parseFloat(this.state.detailRecipeItem[i].calcium + parseFloat(value));
      zinc =
        parseFloat(zinc) +
        parseFloat(this.state.detailRecipeItem[i].zinc + parseFloat(value));
      fosfor =
        parseFloat(fosfor) +
        parseFloat(this.state.detailRecipeItem[i].fosfor + parseFloat(value));

      natrium =
        parseFloat(natrium) +
        parseFloat(this.state.detailRecipeItem[i].natrium + parseFloat(value));
      kalium =
        parseFloat(kalium) +
        parseFloat(this.state.detailRecipeItem[i].kalium + parseFloat(value));
      magnesium =
        parseFloat(magnesium) +
        parseFloat(
          this.state.detailRecipeItem[i].magnesium + parseFloat(value)
        );
      tiamin =
        parseFloat(tiamin) +
        parseFloat(this.state.detailRecipeItem[i].tiamin + parseFloat(value));

      vitb12 =
        parseFloat(vitb12) +
        parseFloat(this.state.detailRecipeItem[i].vitb12 + parseFloat(value));
      vit_c =
        parseFloat(vit_c) +
        parseFloat(this.state.detailRecipeItem[i].vit_c + parseFloat(value));
      vit_d =
        parseFloat(vit_d) +
        parseFloat(this.state.detailRecipeItem[i].vit_d + parseFloat(value));
      folat =
        parseFloat(folat) +
        parseFloat(this.state.detailRecipeItem[i].folat + parseFloat(value));

      totalprice =
        parseFloat(totalprice) +
        parseFloat(this.state.detailRecipeItem[i].price + parseFloat(value));
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
          {asam.toFixed(5).replace(/[.]/g, ",")}
        </td>
        <td className="font-weight-bold text-gray">
          {carbohydrat.toFixed(5).replace(/[.]/g, ",")}
        </td>
        <td className="font-weight-bold text-gray">
          {totalfiber.toFixed(5).replace(/[.]/g, ",")}
        </td>
        <td className="font-weight-bold text-gray">
          {totaliron.toFixed(5).replace(/[.]/g, ",")}
        </td>
        <td className="font-weight-bold text-gray">
          {totalcalcium.toFixed(5).replace(/[.]/g, ",")}
        </td>
        <td className="font-weight-bold text-gray">
          {zinc.toFixed(5).replace(/[.]/g, ",")}
        </td>
        <td className="font-weight-bold text-gray">
          {fosfor.toFixed(5).replace(/[.]/g, ",")}
        </td>

        <td className="font-weight-bold text-gray">
          {natrium.toFixed(5).replace(/[.]/g, ",")}
        </td>
        <td className="font-weight-bold text-gray">
          {kalium.toFixed(5).replace(/[.]/g, ",")}
        </td>
        <td className="font-weight-bold text-gray">
          {magnesium.toFixed(5).replace(/[.]/g, ",")}
        </td>
        <td className="font-weight-bold text-gray">
          {tiamin.toFixed(5).replace(/[.]/g, ",")}
        </td>
        <td className="font-weight-bold text-gray">
          {vitb12.toFixed(5).replace(/[.]/g, ",")}
        </td>
        <td className="font-weight-bold text-gray">
          {vit_c.toFixed(5).replace(/[.]/g, ",")}
        </td>
        <td className="font-weight-bold text-gray">
          {vit_d.toFixed(5).replace(/[.]/g, ",")}
        </td>
        <td className="font-weight-bold text-gray">
          {folat.toFixed(5).replace(/[.]/g, ",")}
        </td>
        <td className="font-weight-bold text-gray">
          {`Rp. ` + numeral(parseFloat(totalprice)).format("0,0.[00]")}
        </td>
      </tr>
    );
  };

  renderTotal = () => {
    if (this.state.jumlahBuah > 0) {
      let totalweight = 0;
      let totalcalorie = 0;
      let totalprotein = 0;
      let totalFat = 0;
      let asam = 0;
      let carbohydrat = 0;
      let fiber = 0;
      let iron = 0;
      let calcium = 0;
      let zinc = 0;
      let fosfor = 0;
      let natrium = 0;
      let kalium = 0;
      let magnesium = 0;
      let tiamin = 0;
      let vitb12 = 0;
      let vit_c = 0;
      let vit_d = 0;
      let folat = 0;
      let totalprice = 0;

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

          asam =
            parseFloat(asam) +
            parseFloat(
              this.state.dataAwal[this.refs[`namaBuah${i}`].value].asam *
                parseFloat(this.refs[`gram${i}`].value)
            );
          carbohydrat =
            parseFloat(carbohydrat) +
            parseFloat(
              this.state.dataAwal[this.refs[`namaBuah${i}`].value].carbohydrat *
                parseFloat(this.refs[`gram${i}`].value)
            );

          fiber =
            parseFloat(fiber) +
            parseFloat(
              this.state.dataAwal[this.refs[`namaBuah${i}`].value].fiber *
                parseFloat(this.refs[`gram${i}`].value)
            );

          iron =
            parseFloat(iron) +
            parseFloat(
              this.state.dataAwal[this.refs[`namaBuah${i}`].value].iron *
                parseFloat(this.refs[`gram${i}`].value)
            );
          calcium =
            parseFloat(calcium) +
            parseFloat(
              this.state.dataAwal[this.refs[`namaBuah${i}`].value].calcium *
                parseFloat(this.refs[`gram${i}`].value)
            );
          zinc =
            parseFloat(zinc) +
            parseFloat(
              this.state.dataAwal[this.refs[`namaBuah${i}`].value].zinc *
                parseFloat(this.refs[`gram${i}`].value)
            );
          fosfor =
            parseFloat(fosfor) +
            parseFloat(
              this.state.dataAwal[this.refs[`namaBuah${i}`].value].fosfor *
                parseFloat(this.refs[`gram${i}`].value)
            );

          natrium =
            parseFloat(natrium) +
            parseFloat(
              this.state.dataAwal[this.refs[`namaBuah${i}`].value].natrium *
                parseFloat(this.refs[`gram${i}`].value)
            );
          kalium =
            parseFloat(kalium) +
            parseFloat(
              this.state.dataAwal[this.refs[`namaBuah${i}`].value].kalium *
                parseFloat(this.refs[`gram${i}`].value)
            );
          magnesium =
            parseFloat(magnesium) +
            parseFloat(
              this.state.dataAwal[this.refs[`namaBuah${i}`].value].magnesium *
                parseFloat(this.refs[`gram${i}`].value)
            );
          tiamin =
            parseFloat(tiamin) +
            parseFloat(
              this.state.dataAwal[this.refs[`namaBuah${i}`].value].tiamin *
                parseFloat(this.refs[`gram${i}`].value)
            );
          vitb12 =
            parseFloat(vitb12) +
            parseFloat(
              this.state.dataAwal[this.refs[`namaBuah${i}`].value].vitb12 *
                parseFloat(this.refs[`gram${i}`].value)
            );
          vit_c =
            parseFloat(vit_c) +
            parseFloat(
              this.state.dataAwal[this.refs[`namaBuah${i}`].value].vit_c *
                parseFloat(this.refs[`gram${i}`].value)
            );
          vit_d =
            parseFloat(vit_d) +
            parseFloat(
              this.state.dataAwal[this.refs[`namaBuah${i}`].value].vit_d *
                parseFloat(this.refs[`gram${i}`].value)
            );
          folat =
            parseFloat(folat) +
            parseFloat(
              this.state.dataAwal[this.refs[`namaBuah${i}`].value].folat *
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
            {asam.toFixed(5).replace(/[.]/g, ",")}
          </td>
          <td className="font-weight-bold text-gray">
            {carbohydrat.toFixed(5).replace(/[.]/g, ",")}
          </td>
          <td className="font-weight-bold text-gray">
            {fiber.toFixed(5).replace(/[.]/g, ",")}
          </td>
          <td className="font-weight-bold text-gray">
            {iron.toFixed(5).replace(/[.]/g, ",")}
          </td>
          <td className="font-weight-bold text-gray">
            {calcium.toFixed(5).replace(/[.]/g, ",")}
          </td>
          <td className="font-weight-bold text-gray">
            {zinc.toFixed(5).replace(/[.]/g, ",")}
          </td>
          <td className="font-weight-bold text-gray">
            {fosfor.toFixed(5).replace(/[.]/g, ",")}
          </td>

          <td className="font-weight-bold text-gray">
            {natrium.toFixed(5).replace(/[.]/g, ",")}
          </td>
          <td className="font-weight-bold text-gray">
            {kalium.toFixed(5).replace(/[.]/g, ",")}
          </td>
          <td className="font-weight-bold text-gray">
            {magnesium.toFixed(5).replace(/[.]/g, ",")}
          </td>
          <td className="font-weight-bold text-gray">
            {tiamin.toFixed(5).replace(/[.]/g, ",")}
          </td>
          <td className="font-weight-bold text-gray">
            {vitb12.toFixed(5).replace(/[.]/g, ",")}
          </td>
          <td className="font-weight-bold text-gray">
            {vit_c.toFixed(5).replace(/[.]/g, ",")}
          </td>
          <td className="font-weight-bold text-gray">
            {vit_d.toFixed(5).replace(/[.]/g, ",")}
          </td>
          <td className="font-weight-bold text-gray">
            {folat.toFixed(5).replace(/[.]/g, ",")}
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
                    this.state.dataAwal[this.refs[`namaBuah${x}`].value].asam *
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
                : `${(
                    this.state.dataAwal[this.refs[`namaBuah${x}`].value].iron *
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
                      .calcium * this.refs[`gram${x}`].value
                  )
                    .toFixed(5)
                    .replace(/[.]/g, ",")}`}
            </td>

            <td>
              {!this.refs[`namaBuah${x}`]
                ? null
                : `${(
                    this.state.dataAwal[this.refs[`namaBuah${x}`].value].zinc *
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
                      .fosfor * this.refs[`gram${x}`].value
                  )
                    .toFixed(5)
                    .replace(/[.]/g, ",")}`}
            </td>
            <td>
              {!this.refs[`namaBuah${x}`]
                ? null
                : `${(
                    this.state.dataAwal[this.refs[`namaBuah${x}`].value]
                      .natrium * this.refs[`gram${x}`].value
                  )
                    .toFixed(5)
                    .replace(/[.]/g, ",")}`}
            </td>
            <td>
              {!this.refs[`namaBuah${x}`]
                ? null
                : `${(
                    this.state.dataAwal[this.refs[`namaBuah${x}`].value]
                      .kalium * this.refs[`gram${x}`].value
                  )
                    .toFixed(5)
                    .replace(/[.]/g, ",")}`}
            </td>
            <td>
              {!this.refs[`namaBuah${x}`]
                ? null
                : `${(
                    this.state.dataAwal[this.refs[`namaBuah${x}`].value]
                      .magnesium * this.refs[`gram${x}`].value
                  )
                    .toFixed(5)
                    .replace(/[.]/g, ",")}`}
            </td>
            <td>
              {!this.refs[`namaBuah${x}`]
                ? null
                : `${(
                    this.state.dataAwal[this.refs[`namaBuah${x}`].value]
                      .tiamin * this.refs[`gram${x}`].value
                  )
                    .toFixed(5)
                    .replace(/[.]/g, ",")}`}
            </td>
            <td>
              {!this.refs[`namaBuah${x}`]
                ? null
                : `${(
                    this.state.dataAwal[this.refs[`namaBuah${x}`].value]
                      .vitb12 * this.refs[`gram${x}`].value
                  )
                    .toFixed(5)
                    .replace(/[.]/g, ",")}`}
            </td>
            <td>
              {!this.refs[`namaBuah${x}`]
                ? null
                : `${(
                    this.state.dataAwal[this.refs[`namaBuah${x}`].value].vit_c *
                    this.refs[`gram${x}`].value
                  )
                    .toFixed(5)
                    .replace(/[.]/g, ",")}`}
            </td>
            <td>
              {!this.refs[`namaBuah${x}`]
                ? null
                : `${(
                    this.state.dataAwal[this.refs[`namaBuah${x}`].value].vit_d *
                    this.refs[`gram${x}`].value
                  )
                    .toFixed(5)
                    .replace(/[.]/g, ",")}`}
            </td>
            <td>
              {!this.refs[`namaBuah${x}`]
                ? null
                : `${(
                    this.state.dataAwal[this.refs[`namaBuah${x}`].value].folat *
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
